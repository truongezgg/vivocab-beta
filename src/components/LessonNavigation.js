class LessonNavigation {
  constructor() {
    this.currentView = "categories"; // 'categories', 'subLessons', 'lessonDetail'
    this.currentCategory = null;
    this.currentSubLesson = null;
    this.init();
  }

  init() {
    this.render();
    this.attachEventListeners();
  }

  render() {
    const container = document.querySelector("#lesson-container");

    switch (this.currentView) {
      case "categories":
        container.innerHTML = this.renderCategories();
        break;
      case "subLessons":
        container.innerHTML = this.renderSubLessons();
        break;
      case "lessonDetail":
        container.innerHTML = this.renderLessonDetail();
        break;
    }
  }

  renderCategories() {
    const categories = LessonStore.getLessonCategories();
    return `
      <h1>Choose a Category</h1>
      ${categories
        .map(
          (category) => `
        <div class="lesson-category" data-category-id="${category.id}">
          <div class="lesson-category-header">
            <h2>${category.name}</h2>
            <span>${category.subLessons.length} lessons</span>
          </div>
          <p>${category.description}</p>
        </div>
      `
        )
        .join("")}
    `;
  }

  renderSubLessons() {
    const category = this.currentCategory;
    return `
      <div class="lesson-header">
        <h1>${category.name} Lessons</h1>
        <button class="back-button" data-action="back-to-categories">
          ⬅️ Back to Categories
        </button>
      </div>
      <div class="lesson-category-content">
        ${category.subLessons
          .map(
            (lesson) => `
          <div class="sub-lesson-card" data-lesson-id="${lesson.id}">
            <h3>${lesson.name}</h3>
            <p>${lesson.description}</p>
            <div class="lesson-stats">
              <span>${lesson.vocabularies.length} words</span>
              <span>Estimated time: ${Math.ceil(
                lesson.vocabularies.length / 2
              )}min</span>
            </div>
          </div>
        `
          )
          .join("")}
      </div>
    `;
  }

  renderLessonDetail() {
    const lesson = this.currentSubLesson;
    return `
      <div class="lesson-header">
        <button class="back-button" data-action="back-to-sublessons">
          ⬅️ Back to ${this.currentCategory.name}
        </button>
        <h1>${lesson.name}</h1>
      </div>
      <p>${lesson.description}</p>
      <div class="vocab-list">
        ${lesson.vocabularies
          .map(
            (vocab) => `
          <div class="vocab-item">
            <div class="vocab-header">
              <span class="vocab-text">${vocab.text}</span>
              <span class="vocab-translation">${vocab.translations.join(
                ", "
              )}</span>
            </div>
            <div class="vocab-description">${vocab.description}</div>
          </div>
        `
          )
          .join("")}
      </div>
      <button class="start-learning-btn" data-lesson-id="${lesson.id}">
        Start Learning
      </button>
    `;
  }

  attachEventListeners() {
    document
      .querySelector("#lesson-container")
      .addEventListener("click", (e) => {
        const categoryEl = e.target.closest(".lesson-category");
        const subLessonEl = e.target.closest(".sub-lesson-card");
        const backButton = e.target.closest(".back-button");
        const startButton = e.target.closest(".start-learning-btn");

        if (categoryEl) {
          this.currentCategory = LessonStore.getLessonCategory(
            categoryEl.dataset.categoryId
          );
          this.currentView = "subLessons";
          this.render();
        } else if (subLessonEl) {
          this.currentSubLesson = this.currentCategory.subLessons.find(
            (lesson) => lesson.id === subLessonEl.dataset.lessonId
          );
          this.currentView = "lessonDetail";
          this.render();
        } else if (backButton) {
          if (backButton.dataset.action === "back-to-categories") {
            this.currentView = "categories";
            this.currentCategory = null;
          } else if (backButton.dataset.action === "back-to-sublessons") {
            this.currentView = "subLessons";
            this.currentSubLesson = null;
          }
          this.render();
        } else if (startButton) {
          // Open learning modal and start learning with current lesson's vocabularies
          const modal = document.getElementById("learning-modal");
          modal.style.display = "flex";

          // Prepare words with necessary properties
          const wordsToLearn = this.currentSubLesson.vocabularies.map(
            (word) => ({
              ...word,
              level: Level.ZERO,
              lastReviewAt: Date.now(),
              shouldReviewAfter: Date.now(),
              createdAt: Date.now(),
            })
          );

          // Call handleLearning with the prepared words
          handleLearning(wordsToLearn);
        }
      });
  }
}

// Initialize the navigation
new LessonNavigation();
