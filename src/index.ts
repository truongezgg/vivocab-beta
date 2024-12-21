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
interface IDatabase {
  version: string;
  vocabularies: Array<IVocabulary>;
}

class Store {
  private static key = "vivocab@database";
  private static version = "0.1";

  static database: IDatabase;

  static defaultData: IDatabase = {
    version: "0.1",
    vocabularies: [],
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
    const backupKey = this.getBackupKey();
    localStorage.setItem(backupKey, JSON.stringify(this.get()));

    const key = this.getKey();
    localStorage.setItem(key, JSON.stringify(value));
  }

  static sync() {
    this.set(this.database);
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

    const text = Store.database.vocabularies.find(
      (item) => item.text === vocab.text && item.type === vocab.type
    );
    if (text) return;

    if (vocab.shouldReviewAfter) {
      vocab.shouldReviewAfter = Vocab.roundTime(vocab.shouldReviewAfter);
    }

    Store.database.vocabularies.push(vocab);
    Store.sync();
  }

  update(id: string, vocab: Partial<IVocabulary>) {
    const data = Store.database.vocabularies.find((item) => item.id === id);
    if (!data) return;

    if (vocab.shouldReviewAfter) {
      vocab.shouldReviewAfter = Vocab.roundTime(vocab.shouldReviewAfter);
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
      const total = vocabularies.filter(
        (item) => Vocab.roundTime(item.shouldReviewAfter) === time
      ).length;

      return { time, total };
    }
    return null;
  }

  // -30m
  static roundTime(time: number, timeToRound = 30 * 60 * 1000) {
    // return time - (time % timeToRound) - timeToRound;
    return time - (time % timeToRound);
  }

  learn(vocab: IVocabulary, isCorrect: boolean) {
    const data = Store.database.vocabularies.find(
      (item) => item.id === vocab.id
    );
    if (!data) return this.add(vocab);

    const currentTime = () => Date.now();

    // Reset to 1h after
    data.level = isCorrect ? Math.min(data.level + 1, MaxLevel) : Level.ZERO;
    data.lastReviewAt = currentTime();

    /* -------------------------------------------------------------------------- */
    /*                                Rounded time                                */
    /* -------------------------------------------------------------------------- */
    const time = this.getShouldReviewAt(data.level, currentTime());
    // const timeToRound = 1000 * 60 * 15; // 15m
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

    return time + 1000 * 60 * 60 * 24 * 30;
  }

  import(database: IDatabase) {
    for (const vocab of database.vocabularies) {
      const id = Store.database.vocabularies.find(
        (item) => item.id === vocab.id
      );
      if (id) continue;

      const text = Store.database.vocabularies.find(
        (item) => item.text === vocab.text && item.type === vocab.type
      );
      if (text) continue;

      if (vocab.level === Level.ONE) {
        vocab.level = Level.ZERO;
      }
      Store.database.vocabularies.push(vocab);
      Store.sync();
    }
  }

  export() {
    return Store.database;
  }
}

Store.load();
