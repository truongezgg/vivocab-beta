class LessonNavigation {
  constructor() {
    this.currentView = "categories"; // 'categories', 'subLessons', 'lessonDetail'
    this.currentCategory = null;
    this.currentSubLesson = null;
    this.showLearned = false;
    this.init();
  }

  init() {
    this.render();
    this.attachEventListeners();
  }

  async render() {
    const container = document.querySelector("#lesson-container");

    switch (this.currentView) {
      case "categories":
        container.innerHTML = await this.renderCategories();
        break;
      case "subLessons":
        container.innerHTML = await this.renderSubLessons();
        break;
      case "lessonDetail":
        container.innerHTML = await this.renderLessonDetail();
        break;
    }
  }

  async renderCategories() {
    const categories = await LessonStore.getLessonCategories();
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
    const totalLearned = category.subLessons.filter((lesson) =>
      LessonStore.isLessonLearned(lesson.id)
    ).length;

    const filterLeaned = totalLearned
      ? `<label class="show-learned-toggle">
          <input type="checkbox" 
            ${this.showLearned ? "checked" : ""} 
            id="show-learned-checkbox">
          <span>Show completed (${totalLearned})</span>
        </label>`
      : "";

    return `
      <div class="lesson-header">
        <button class="back-button" data-action="back-to-categories">
          ⬅️ Back to Categories
        </button>
        <h1>${category.name} Lessons</h1>
      </div>
      <div class="lesson-controls">
        ${filterLeaned}
      </div>
      <div class="lesson-category-content">
        ${category.subLessons
          .filter((lesson) => {
            const isLearned = LessonStore.isLessonLearned(lesson.id);
            if (!this.showLearned && isLearned) return false;

            return true;
          })
          .map((lesson) => {
            const isLearned = LessonStore.isLessonLearned(lesson.id);
            const wordCount = lesson.vocabularies.length;
            const estimatedMinutes = Math.ceil(wordCount / 2);

            return `
          <div class="sub-lesson-card ${isLearned ? "learned" : ""}" 
               data-lesson-id="${lesson.id}">
            <label class="lesson-checkbox">
              <input type="checkbox"
                class="mark-learned-checkbox"
                data-lesson-id="${lesson.id}"
                ${isLearned ? "checked" : ""}>
            </label>
            <div class="lesson-card-header">
              <h3>${lesson.name}</h3>
            </div>
            <p>${lesson.description}</p>
            <div class="lesson-stats">
              <span>${wordCount} words</span>
              <span>Estimated time: ${estimatedMinutes}min</span>
            </div>
          </div>
        `;
          })
          .join("")}
      </div>
    `;
  }

  renderLessonDetail() {
    const lesson = this.currentSubLesson;
    const isLearned = LessonStore.isLessonLearned(lesson.id);
    const vocabInstance = new Vocab();

    return `
      <div class="lesson-header">
        <button class="back-button" data-action="back-to-sublessons">
          ⬅️ Back to ${this.currentCategory.name}
        </button>
        <h1>${lesson.name}</h1>
      </div>
      <div class="lesson-detail-header">
        <p>${lesson.description}</p>
      </div>
      
      <button class="start-learning-btn" data-lesson-id="${lesson.id}">
        Start Learning
      </button>

      <div class="detail-completion-status">
        <label>
          <div>
            <input type="checkbox"
              class="mark-learned-checkbox"
              data-lesson-id="${lesson.id}"
              ${isLearned ? "checked" : ""}>
            <span>${isLearned ? "Completed" : "Mark as completed"}</span>
          </div>
          <small class="completion-hint">This lesson will be hidden from the list (for better focus on unfinished lessons)</small>
        </label>
      </div>

      <div class="vocab-list">
        ${lesson.vocabularies
          .map((vocab) => {
            const isAdded = vocabInstance.isExist(vocab);
            return `
                <div class="vocab-item">
                  <div class="vocab-header">
                    <div class="vocab-header-left">
                      <span class="vocab-text speak-icon" onclick="speak(event)" data-word="${
                        vocab.text
                      }">${vocab.text} 🔊</span>
                      <span class="vocab-translation">${vocab.translations.join(
                        ", "
                      )}</span>
                    </div>
                    <button class="add-vocab-btn ${isAdded ? "added" : ""}" 
                      data-vocab-id="${vocab.id}"
                      ${isAdded ? "disabled" : ""}>
                      ${
                        isAdded
                          ? "✓ Added"
                          : '<span class="plus-icon">+</span>Add'
                      }
                    </button>
                  </div>
                  <div class="vocab-description">${vocab.description}</div>
                </div>
              `;
          })
          .join("")}
      </div>
    `;
  }

  attachEventListeners() {
    document
      .querySelector("#lesson-container")
      .addEventListener("click", async (e) => {
        const categoryEl = e.target.closest(".lesson-category");
        const subLessonEl = e.target.closest(".sub-lesson-card");
        const backButton = e.target.closest(".back-button");
        const startButton = e.target.closest(".start-learning-btn");

        // Add new handlers for checkboxes
        const learnedCheckbox = e.target.closest(".mark-learned-checkbox");
        const showLearnedCheckbox = e.target.closest("#show-learned-checkbox");

        if (learnedCheckbox) {
          e.stopPropagation(); // Prevent card click
          const lessonId = learnedCheckbox.dataset.lessonId;
          LessonStore.toggleLessonLearned(lessonId);
          setTimeout(() => this.render(), 100);
          return;
        }

        if (showLearnedCheckbox) {
          this.showLearned = showLearnedCheckbox.checked;
          return this.render();
        }

        const addVocabBtn = e.target.closest(".add-vocab-btn");
        if (addVocabBtn) {
          e.stopPropagation();
          try {
            const vocabId = addVocabBtn.dataset.vocabId;
            const vocabData = this.currentSubLesson.vocabularies.find(
              (v) => v.id === vocabId
            );

            const vocab = new Vocab();
            const newVocab = {
              ...vocabData,
              createdAt: Date.now(),
              level: Level.ZERO,
              lastReviewAt: Date.now(),
              shouldReviewAfter: Date.now(),
            };

            vocab.add(newVocab);

            // Show feedback
            addVocabBtn.classList.add("added");
            addVocabBtn.innerHTML = "✓ Added";
            addVocabBtn.disabled = true;
          } catch (error) {
            console.error("Error adding vocabulary:", error);
          }
        }

        if (categoryEl) {
          LessonStore.getLessonCategory(categoryEl.dataset.categoryId).then(
            (result) => {
              this.currentCategory = result;
              this.currentView = "subLessons";
              this.render();
            }
          );
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
          handleLearning({
            vocabularies: wordsToLearn,
            isShowTranslation: true,
            isAllowSkip: true,
          });
        }
      });
  }
}

// Initialize the navigation
new LessonNavigation();
LessonStore.loadLessons();
