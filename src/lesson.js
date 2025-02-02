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
    const oxford3000A1 = await this._fetchOxford3000A1();
    this.lessons = oxford3000A1;
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
}
