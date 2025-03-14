enum Level {
  ZERO = 0,
  ONE = 1,
  TWO = 2,
  THREE = 3,
  FOUR = 4,
  FIVE = 5,
  SIX = 6,
  SEVEN = 7,
}
enum RememberLevel {
  BAD = 0,
  POOR = 1,
  OK = 2,
  GOOD = 3,
  PERFECT = 4,
}
const MaxLevel = Level.SEVEN;

interface IVocabulary {
  id: string;
  type: string;
  pronunciation: string;
  text: string;
  translations: string[];
  // synonymous: string[];
  imageUrl: string;
  description: string;
  createdAt: number;

  level: Level;
  lastReviewAt: number;
  shouldReviewAfter: number; // Next time should review
  isSendNotification: boolean;
  // payload: {};
}

const DisplayVocabModes = [
  "multiple-choice",
  "write-translation",
  "word-completion",
];

interface ISettings {
  displayVocabModes?: typeof DisplayVocabModes;
  displayVocabMode?:
    | "multiple-choice"
    | "write-translation"
    | "word-completion"
    | "random";
  displayVocabModeRandom?: string;
}

interface IDatabase {
  version: string;
  vocabularies: Array<IVocabulary>;
  learnedLessons: string[];
  settings: ISettings;
}

class Store {
  private static key = "vivocab@database";
  private static version = "0.1";

  static database: IDatabase;

  static defaultData: IDatabase = {
    version: "0.1",
    vocabularies: [],
    learnedLessons: [],
    settings: {},
  };

  static getKey() {
    return `${this.key}@${this.version}`;
  }
  static getBackupKey() {
    return `${this.key}@backup@${this.version}`;
  }

  static load() {
    this.database = this.get();
  }

  static get() {
    const key = this.getKey();
    const data = localStorage.getItem(key);
    if (!data) return this.defaultData;

    return JSON.parse(data);
  }

  static set(value: IDatabase) {
    const key = this.getKey();
    localStorage.setItem(key, JSON.stringify(value));
  }

  static sync() {
    this.database.learnedLessons = this.database.learnedLessons || [];
    this.database.settings = this.database.settings || {};
    this.set(this.database);

    const backupKey = this.getBackupKey();
    localStorage.removeItem(backupKey);
  }
}

class Vocab {
  add(vocab: IVocabulary) {
    if (!vocab.id || !vocab.text) {
      console.warn("Missing id or text");
      return;
    }

    const id = Store.database.vocabularies.find((item) => item.id === vocab.id);
    if (id) return;

    const isExist = this.isExist(vocab);
    if (isExist) return;

    if (vocab.shouldReviewAfter) {
      vocab.shouldReviewAfter = Vocab.roundTime(vocab.shouldReviewAfter);
    }

    if (vocab.type) {
      vocab.type = vocab.type.toLowerCase();
    }
    if (vocab.description) {
      vocab.description = vocab.description
        .split("\n")
        .filter(Boolean)
        .join("\n");
    }

    Store.database.vocabularies.push(vocab);
    Store.sync();
  }

  isExist(vocab: IVocabulary) {
    const isExist = Store.database.vocabularies.find((item) => {
      if (
        (item.text || "").toLowerCase() !== (vocab.text || "").toLowerCase()
      ) {
        return false;
      }

      if (
        (item.type || "").toLowerCase() !== (vocab.type || "").toLowerCase()
      ) {
        return false;
      }

      if (
        item.translations.join(",").toLowerCase() !==
        vocab.translations.join(",").toLowerCase()
      ) {
        return false;
      }

      return true;
    });

    return isExist;
  }

  update(id: string, vocab: Partial<IVocabulary>) {
    const data = Store.database.vocabularies.find((item) => item.id === id);
    if (!data) return;

    if (vocab.shouldReviewAfter) {
      vocab.shouldReviewAfter = Vocab.roundTime(vocab.shouldReviewAfter);
    }

    if (vocab.type) {
      vocab.type = vocab.type.toLowerCase();
    }

    Object.assign(data, vocab);
  }

  remove(id: string) {
    const results = Store.database.vocabularies.filter(
      (item) => item.id !== id
    );
    Store.database.vocabularies = results;
    Store.sync();
  }

  getVocabToReview(time?: number) {
    // return {
    //   vocabularies: Store.database.vocabularies,
    //   totalVocabularies: Store.database.vocabularies.length,
    // };
    const current = time || Date.now();
    const vocabularies = Store.database.vocabularies.filter((item) => {
      return Vocab.roundTime(item.shouldReviewAfter) <= current;
    });

    return {
      vocabularies,
      totalVocabularies: vocabularies.length,
    };
  }

  getNextReviewTime() {
    const vocabularies = Store.database.vocabularies.sort(
      (a, b) => a.shouldReviewAfter - b.shouldReviewAfter
    );
    if (vocabularies.length) {
      const time = Vocab.roundTime(vocabularies[0].shouldReviewAfter);
      const timeToCompare = Math.max(time, Date.now());
      const total = vocabularies.filter(
        (item) => Vocab.roundTime(item.shouldReviewAfter) <= timeToCompare
      ).length;

      return { time, total };
    }
    return null;
  }

  // -30m
  static roundTime(time: number, timeToRound = 30 * 60 * 1000) {
    if (!time) return 0;
    // return time - (time % timeToRound) - timeToRound;
    return time - (time % timeToRound);
  }

  learn(
    vocab: IVocabulary,
    isCorrect: boolean,
    rememberLevel: RememberLevel = RememberLevel.OK
  ) {
    const data = Store.database.vocabularies.find(
      (item) => item.id === vocab.id
    );
    const currentLevel = Math.max(vocab.level || 0, data?.level || 0);

    const currentTime = () => Date.now();

    // Reset to 1h after
    const level = (() => {
      if (!isCorrect) return Level.ONE;

      // If time to review is not passed, return current level.
      if (data?.shouldReviewAfter && currentTime() < data.shouldReviewAfter) {
        return currentLevel;
      }

      if (rememberLevel === RememberLevel.BAD) {
        return Math.max(currentLevel - 2, Level.ONE);
      }

      if (rememberLevel === RememberLevel.POOR) {
        return Math.max(currentLevel - 1, Level.ONE);
      }

      if (rememberLevel === RememberLevel.GOOD) {
        return Math.min(currentLevel + 2, MaxLevel);
      }

      if (rememberLevel === RememberLevel.PERFECT) {
        return Math.min(currentLevel + 3, MaxLevel);
      }

      return Math.min(currentLevel + 1, MaxLevel);
    })();

    const lastReviewAt = currentTime();

    /* -------------------------------------------------------------------------- */
    /*                                Rounded time                                */
    /* -------------------------------------------------------------------------- */
    const time = this.getShouldReviewAt(level, currentTime());

    // const timeToRound = 1000 * 60 * 15; // 15m
    const shouldReviewAfter = Math.max(
      Vocab.roundTime(time),
      data?.shouldReviewAfter || 0
    );

    if (!data) {
      vocab.level = level;
      vocab.lastReviewAt = lastReviewAt;
      vocab.shouldReviewAfter = shouldReviewAfter;
      return this.add(vocab);
    }

    data.level = level;
    data.lastReviewAt = lastReviewAt;
    data.shouldReviewAfter = shouldReviewAfter;

    Store.sync();
  }

  handleIncorrect(vocab: IVocabulary) {
    vocab.level = Level.ONE;
    const data = Store.database.vocabularies.find(
      (item) => item.id === vocab.id
    );
    if (!data) return;

    const currentTime = () => Date.now();
    // If time to review is not passed, return current level.
    if (data?.shouldReviewAfter && currentTime() < data.shouldReviewAfter) {
      return;
    }

    data.level = Level.ONE;

    const time = this.getShouldReviewAt(data.level, currentTime());
    data.lastReviewAt = currentTime();
    data.shouldReviewAfter = Vocab.roundTime(time);

    Store.sync();
  }

  getShouldReviewAt(level: number, _time: number) {
    const time = Vocab.roundTime(_time);

    if (level === Level.ZERO) {
      return time;
    }

    if (level === Level.ONE) {
      return time + 1000 * 60 * 60;
    }

    if (level === Level.TWO) {
      return time + 1000 * 60 * 60 * 6;
    }

    if (level === Level.THREE) {
      return time + 1000 * 60 * 60 * 24;
    }

    if (level === Level.FOUR) {
      return time + 1000 * 60 * 60 * 24 * 3;
    }

    if (level === Level.FIVE) {
      return time + 1000 * 60 * 60 * 24 * 7;
    }

    if (level === Level.SIX) {
      return time + 1000 * 60 * 60 * 24 * 15;
    }

    if (level === Level.SEVEN) {
      return time + 1000 * 60 * 60 * 24 * 30;
    }

    return time + 1000 * 60 * 60 * 24 * 60;
  }

  import(database: IDatabase) {
    for (const vocab of database.vocabularies) {
      const id = Store.database.vocabularies.find(
        (item) => item.id === vocab.id
      );
      if (id) continue;

      const text = Store.database.vocabularies.find(
        (item) =>
          item.text === vocab.text &&
          (item.type || "").toLowerCase() === (vocab.type || "").toLowerCase()
      );
      if (text) continue;

      if (vocab.type) {
        vocab.type = vocab.type.toLowerCase();
      }

      const currentTime = Date.now();
      vocab.createdAt = vocab.createdAt || currentTime;
      vocab.lastReviewAt = vocab.lastReviewAt || Vocab.roundTime(currentTime);
      vocab.shouldReviewAfter = Vocab.roundTime(
        vocab.shouldReviewAfter || currentTime
      );

      Store.database.vocabularies.push(vocab);
      Store.sync();
    }
  }

  export() {
    return Store.database;
  }
}

class SettingStore {
  static getDisplayMode(isResetRandom?: boolean): {
    mode: string;
    current: string;
  } {
    const [currentMode, currentRandom, displayVocabModes] = [
      Store.database.settings?.displayVocabMode || "random",
      Store.database.settings?.displayVocabModeRandom || "multiple-choice",
      this.getDisplayModeModes(),
    ];

    const mode = (() => {
      if (currentMode !== "random") return currentMode;
      if (!isResetRandom) return currentRandom;

      const modes = displayVocabModes?.length
        ? displayVocabModes
        : DisplayVocabModes;
      const randomMode = modes[Math.floor(Math.random() * modes.length)];

      this.setDisplayModeRandom(randomMode);

      return randomMode;
    })();

    return {
      mode,
      current: currentMode,
    };
  }

  static getDisplayModeModes(): string[] {
    const modes = Store.database.settings?.displayVocabModes;
    if (modes?.length) return modes;
    return DisplayVocabModes;
  }

  static setDisplayMode(
    mode: "multiple-choice" | "write-translation" | "word-completion" | "random"
  ): void {
    Store.database.settings = Store.database.settings || {};
    Store.database.settings.displayVocabMode = mode;
    return Store.sync();
  }

  static setDisplayModeRandom(mode: string): void {
    Store.database.settings = Store.database.settings || {};
    Store.database.settings.displayVocabModeRandom = mode;
    return Store.sync();
  }

  static setDisplayModeModes(modes: string[]): void {
    Store.database.settings = Store.database.settings || {};
    Store.database.settings.displayVocabModes = modes;
    return Store.sync();
  }
}

Store.load();
