class LessonStore {
  static lessons = [];
  // Add methods to handle lesson navigation and data
  static async getLessonCategory(categoryId) {
    await this.loadLessons();
    const categories = await this.getLessonCategories();
    return categories.find((cat) => cat.id === categoryId);
  }

  static async getSubLesson(categoryId, subLessonId) {
    await this.loadLessons();
    const category = await this.getLessonCategory(categoryId);
    return category?.subLessons.find((lesson) => lesson.id === subLessonId);
  }

  static async getLessonCategories() {
    await this.loadLessons();
    return this.lessons;
  }

  static async loadLessons() {
    if (this.lessons.length > 0) return;
    const [oxford3000A1, oxford3000A2, oxford3000B1, oxford3000B2] =
      await Promise.all([
        this._fetchOxford3000A1(),
        this._fetchOxford3000A2(),
        this._fetchOxford3000B1(),
        this._fetchOxford3000B2(),
      ]);
    this.lessons = [
      ...oxford3000A1,
      ...oxford3000A2,
      ...oxford3000B1,
      ...oxford3000B2,
    ];
  }

  static async _fetchOxford3000A1() {
    try {
      const response = await fetch("/data/oxford-3000-a1.json");
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  static async _fetchOxford3000B1() {
    const response = await fetch("/data/oxford-3000-b1.json");
    const data = await response.json();
    return data;
  }

  static async _fetchOxford3000B2() {
    const response = await fetch("/data/oxford-3000-b2.json");
    const data = await response.json();
    return data;
  }

  static async _fetchOxford3000A2() {
    const response = await fetch("/data/oxford-3000-a2.json");
    const data = await response.json();
    return data;
  }

  static isLessonLearned(lessonId) {
    return Store?.database?.learnedLessons?.includes(lessonId) || false;
  }

  static toggleLessonLearned(lessonId) {
    if (!Store.database.learnedLessons) {
      Store.database.learnedLessons = [];
    }

    const index = Store.database.learnedLessons.indexOf(lessonId);
    if (index === -1) {
      Store.database.learnedLessons.push(lessonId);
    } else {
      Store.database.learnedLessons.splice(index, 1);
    }
    Store.sync();
  }
}
