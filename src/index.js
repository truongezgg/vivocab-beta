"use strict";
var Level;
(function (Level) {
    Level[Level["ZERO"] = 0] = "ZERO";
    Level[Level["ONE"] = 1] = "ONE";
    Level[Level["TWO"] = 2] = "TWO";
    Level[Level["THREE"] = 3] = "THREE";
    Level[Level["FOUR"] = 4] = "FOUR";
    Level[Level["FIVE"] = 5] = "FIVE";
    Level[Level["SIX"] = 6] = "SIX";
    Level[Level["SEVEN"] = 7] = "SEVEN";
})(Level || (Level = {}));
var RememberLevel;
(function (RememberLevel) {
    RememberLevel[RememberLevel["BAD"] = 0] = "BAD";
    RememberLevel[RememberLevel["POOR"] = 1] = "POOR";
    RememberLevel[RememberLevel["OK"] = 2] = "OK";
    RememberLevel[RememberLevel["GOOD"] = 3] = "GOOD";
    RememberLevel[RememberLevel["PERFECT"] = 4] = "PERFECT";
})(RememberLevel || (RememberLevel = {}));
const MaxLevel = Level.SEVEN;
const DisplayVocabModes = [
    "multiple-choice",
    "write-translation",
    "word-completion",
];
class Store {
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
        if (!data)
            return this.defaultData;
        return JSON.parse(data);
    }
    static set(value) {
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
Store.key = "vivocab@database";
Store.version = "0.1";
Store.defaultData = {
    version: "0.1",
    vocabularies: [],
    learnedLessons: [],
    settings: {},
};
class Vocab {
    add(vocab) {
        if (!vocab.id || !vocab.text) {
            console.warn("Missing id or text");
            return;
        }
        const id = Store.database.vocabularies.find((item) => item.id === vocab.id);
        if (id)
            return;
        const isExist = this.isExist(vocab);
        if (isExist)
            return;
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
    isExist(vocab) {
        const isExist = Store.database.vocabularies.find((item) => {
            if ((item.text || "").toLowerCase() !== (vocab.text || "").toLowerCase()) {
                return false;
            }
            if ((item.type || "").toLowerCase() !== (vocab.type || "").toLowerCase()) {
                return false;
            }
            if (item.translations.join(",").toLowerCase() !==
                vocab.translations.join(",").toLowerCase()) {
                return false;
            }
            return true;
        });
        return isExist;
    }
    update(id, vocab) {
        const data = Store.database.vocabularies.find((item) => item.id === id);
        if (!data)
            return;
        if (vocab.shouldReviewAfter) {
            vocab.shouldReviewAfter = Vocab.roundTime(vocab.shouldReviewAfter);
        }
        if (vocab.type) {
            vocab.type = vocab.type.toLowerCase();
        }
        Object.assign(data, vocab);
    }
    remove(id) {
        const results = Store.database.vocabularies.filter((item) => item.id !== id);
        Store.database.vocabularies = results;
        Store.sync();
    }
    getVocabToReview(time) {
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
        const vocabularies = Store.database.vocabularies.sort((a, b) => a.shouldReviewAfter - b.shouldReviewAfter);
        if (vocabularies.length) {
            const time = Vocab.roundTime(vocabularies[0].shouldReviewAfter);
            const timeToCompare = Math.max(time, Date.now());
            const total = vocabularies.filter((item) => Vocab.roundTime(item.shouldReviewAfter) <= timeToCompare).length;
            return { time, total };
        }
        return null;
    }
    // -30m
    static roundTime(time, timeToRound = 30 * 60 * 1000) {
        if (!time)
            return 0;
        // return time - (time % timeToRound) - timeToRound;
        return time - (time % timeToRound);
    }
    learn(vocab, isCorrect, rememberLevel = RememberLevel.OK) {
        const data = Store.database.vocabularies.find((item) => item.id === vocab.id);
        const currentLevel = Math.max(vocab.level || 0, (data === null || data === void 0 ? void 0 : data.level) || 0);
        const currentTime = () => Date.now();
        // Reset to 1h after
        const level = (() => {
            if (!isCorrect)
                return Level.ONE;
            // If time to review is not passed, return current level.
            if ((data === null || data === void 0 ? void 0 : data.shouldReviewAfter) && currentTime() < data.shouldReviewAfter) {
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
        const shouldReviewAfter = Vocab.roundTime(time);
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
    getShouldReviewAt(level, _time) {
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
    import(database) {
        for (const vocab of database.vocabularies) {
            const id = Store.database.vocabularies.find((item) => item.id === vocab.id);
            if (id)
                continue;
            const text = Store.database.vocabularies.find((item) => item.text === vocab.text &&
                (item.type || "").toLowerCase() === (vocab.type || "").toLowerCase());
            if (text)
                continue;
            if (vocab.type) {
                vocab.type = vocab.type.toLowerCase();
            }
            const currentTime = Date.now();
            vocab.createdAt = vocab.createdAt || currentTime;
            vocab.lastReviewAt = vocab.lastReviewAt || Vocab.roundTime(currentTime);
            vocab.shouldReviewAfter = Vocab.roundTime(vocab.shouldReviewAfter || currentTime);
            Store.database.vocabularies.push(vocab);
            Store.sync();
        }
    }
    export() {
        return Store.database;
    }
}
class SettingStore {
    static getDisplayMode(isResetRandom) {
        var _a, _b;
        const [currentMode, currentRandom, displayVocabModes] = [
            ((_a = Store.database.settings) === null || _a === void 0 ? void 0 : _a.displayVocabMode) || "multiple-choice",
            ((_b = Store.database.settings) === null || _b === void 0 ? void 0 : _b.displayVocabModeRandom) || "multiple-choice",
            this.getDisplayModeModes(),
        ];
        const mode = (() => {
            if (currentMode !== "random")
                return currentMode;
            if (!isResetRandom)
                return currentRandom;
            const modes = (displayVocabModes === null || displayVocabModes === void 0 ? void 0 : displayVocabModes.length)
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
    static getDisplayModeModes() {
        var _a;
        const modes = (_a = Store.database.settings) === null || _a === void 0 ? void 0 : _a.displayVocabModes;
        if (modes === null || modes === void 0 ? void 0 : modes.length)
            return modes;
        return DisplayVocabModes;
    }
    static setDisplayMode(mode) {
        Store.database.settings = Store.database.settings || {};
        Store.database.settings.displayVocabMode = mode;
        return Store.sync();
    }
    static setDisplayModeRandom(mode) {
        Store.database.settings.displayVocabModeRandom = mode;
        return Store.sync();
    }
    static setDisplayModeModes(modes) {
        Store.database.settings.displayVocabModes = modes;
        return Store.sync();
    }
}
Store.load();
