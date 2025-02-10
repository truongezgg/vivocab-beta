const sessionData = {
  startTime: Date.now(),
  endTime: null,
  wordsReviewed: [],
  totalReviewed: 0,
  totalToReview: 0,
  currentIndex: 0,
  vocabToReview: [],
  isShowTranslation: false,
  isAllowSkip: false,
};

function shuffleArray(array) {
  // Create a copy of the array to avoid mutating the original
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    // Pick a random index from 0 to i
    const randomIndex = Math.floor(Math.random() * (i + 1));
    // Swap the elements at i and randomIndex
    [shuffled[i], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[i]];
  }
  return shuffled;
}

const handleLearning = (params) => {
  const _vocabularies = params?.vocabularies || [];

  const vocabInstance = new Vocab();
  const getVocabToReview = () => {
    return _vocabularies?.length
      ? [..._vocabularies]
      : [
          // ...Store.database.vocabularies.filter(
          //   (vocab) => vocab.shouldReviewAfter < Date.now()
          // ),
          // ...Store.database.vocabularies.filter((vocab) => vocab),
          ...vocabInstance.getVocabToReview().vocabularies,
        ];
  };
  sessionData.vocabToReview = getVocabToReview();
  sessionData.isShowTranslation = !!params?.isShowTranslation;
  sessionData.isAllowSkip = !!params?.isAllowSkip;
  sessionData.startTime = Date.now();
  sessionData.endTime = null;
  sessionData.wordsReviewed = [];
  sessionData.totalReviewed = 0;
  sessionData.totalToReview = sessionData.vocabToReview.length;
  sessionData.currentIndex = 0;

  const modal = document.getElementById("learning-modal");
  const progressBar = document.getElementById("progress-bar");
  const progressText = document.getElementById("progress-text");
  const vocabTextEl = document.getElementById("vocab-textt");
  const vocabDescriptionEl = document.getElementById("vocab-descriptionn");
  const vocabImageEl = document.getElementById("vocab-image");
  const answerOptionsEl = document.getElementById("answer-options");
  const submitAnswerBtn = document.getElementById("submit-answer-btn");
  const skipAnswerBtn = document.getElementById("skip-answer-btn");
  const overviewModal = document.getElementById("overview-modal");

  // Add settings button and container
  const settingsBtn = document.createElement("button");
  settingsBtn.id = "learning-settings-btn";
  settingsBtn.className = "top-button settings-btn";
  settingsBtn.innerHTML = "⚙️";
  settingsBtn.style.right = "40px"; // Position it next to the close button

  const settingsContainer = document.createElement("div");
  settingsContainer.id = "learning-settings-container";
  settingsContainer.className = "learning-settings-container";
  settingsContainer.style.display = "none";

  // Insert the elements into the modal
  const modalContent = modal.querySelector(".modal-content");
  modalContent.insertBefore(settingsBtn, modalContent.firstChild);
  modalContent.insertBefore(settingsContainer, modalContent.firstChild);

  // Add click handler for settings button
  settingsBtn.onclick = (e) => {
    e.stopPropagation();
    const isVisible = settingsContainer.style.display === "block";
    settingsContainer.style.display = isVisible ? "none" : "block";
  };

  // Close settings when clicking outside
  document.addEventListener("click", (e) => {
    if (
      !settingsBtn.contains(e.target) &&
      !settingsContainer.contains(e.target)
    ) {
      settingsContainer.style.display = "none";
    }
  });

  // Update progress bar
  const updateProgress = () => {
    const progressPercent =
      (sessionData.totalReviewed / sessionData.totalToReview) * 100;
    progressBar.style.width = `${progressPercent}%`;
    progressText.textContent = `${sessionData.totalReviewed}/${sessionData.totalToReview}`;
  };

  // Display vocabulary
  const displayVocab = () => {
    const vocabToReview = sessionData.vocabToReview;
    const currentIndex = sessionData.currentIndex;
    submitAnswerBtn.style.display = "block";
    if (vocabToReview.length === 0) {
      vocabTextEl.innerHTML = `<p>No vocabulary to review!</p>`;
      answerOptionsEl.innerHTML = `<button id="back-to-home-btn">Back to Home</button>`;
      answerOptionsEl.style.gridTemplateColumns = "1fr";

      const vocab = new Vocab();
      const reviewData = vocab.getNextReviewTime();
      if (reviewData) {
        vocabDescriptionEl.innerText =
          "Count down: " + getTimeLeft(reviewData.time);
      } else {
        vocabDescriptionEl.innerText =
          "You don't have any vocabulary! Add more now!";
      }

      // vocabDescriptionEl.innerHTML = "";
      submitAnswerBtn.style.display = "none";

      document.getElementById("back-to-home-btn").onclick = () => {
        modal.style.display = "none";
      };

      return;
    }

    const vocab = vocabToReview[currentIndex];
    if (!vocab) return;

    const { mode } = SettingStore.getDisplayMode(true);
    const isWordCompletion = mode === "word-completion";
    const maskedWord = generateMaskedWord(vocab.text);

    // Handle default display mode
    const vocabText = (() => {
      const text = isWordCompletion ? maskedWord : vocab.text;
      const pronunciation = vocab.pronunciation
        ? `(${vocab.pronunciation})`
        : "";
      const type = vocab.type ? `[${vocab.type}]` : "";
      return `${text}${pronunciation}${type}`;
    })();

    if (isWordCompletion) {
      const translation = vocab.translations.join(", ");

      vocabTextEl.innerHTML = `
        <div class="word-completion-display">
          <span class="speak-icon" onclick="speak(event)" data-word="${vocab.text}">
            ${vocabText}🔊
          </span>
          <div class="translation">${translation}</div>
        </div>`;

      // Mask the word in example sentences
      vocabDescriptionEl.innerHTML = vocab.description
        .split("\n")
        .map((line) => {
          const maskedLine = maskWordInSentence(line, vocab.text, maskedWord);
          return `<span class="speak-icon" onclick="speak(event)" data-word="${line}">${maskedLine}🔊</span>`;
        })
        .join("<br>");
    } else {
      // vocabTextEl.innerHTML = `<span class="speak-icon" onclick="speak(event)" data-word="${vocab.text}">${vocabText}🔊</span>`;
      const translation = vocab.translations.join(", ");
      vocabTextEl.innerHTML = `
      <div class="word-completion-display">
        <span class="speak-icon" onclick="speak(event)" data-word="${
          vocab.text
        }">
          ${vocabText}🔊
        </span>
        ${
          sessionData.isShowTranslation
            ? `<div class="translation">${translation}</div>`
            : ""
        }
      </div>`;

      vocabDescriptionEl.innerHTML = vocab.description
        .split("\n")
        .map(
          (line) =>
            `<span class="speak-icon" onclick="speak(event)" data-word="${line}">${line}🔊</span>`
        )
        .join("<br>");
    }

    // Handle image display (same for all modes)
    if (vocab.imageUrl) {
      vocabImageEl.src = vocab.imageUrl;
      vocabImageEl.style.display = "block";
    } else {
      vocabImageEl.style.display = "none";
    }

    generateAnswerOptions(vocab, { maskedWord: maskedWord });
    if (vocab.text) speakText(vocab.text);
  };

  const generateAnswerOptions = (vocab, params) => {
    if (!vocab || !sessionData.vocabToReview.length) return;

    // Move answer mode toggle to settings container
    const settingsContainer = document.getElementById(
      "learning-settings-container"
    );
    const { mode, current } = SettingStore.getDisplayMode();

    // Update the settings container HTML with better labels
    settingsContainer.innerHTML = `
      <div class="answer-mode-toggle">
        <button id="multiple-choice-mode" class="mode-btn ${
          current === "multiple-choice" ? "active" : ""
        }">
          🔘 Choose from Options
        </button>
        <button id="text-input-mode" class="mode-btn ${
          current === "write-translation" ? "active" : ""
        }">
          ✍️ Write Translation
        </button>
        <button id="word-completion-mode" class="mode-btn ${
          current === "word-completion" ? "active" : ""
        }">
          📝 Fill Missing Letters
        </button>
        <button id="random-mode" class="mode-btn ${
          current === "random" ? "active" : ""
        }">
          🎲 Mix All Modes
        </button>
      </div>
    `;

    // Add event listeners for mode toggle buttons with settings persistence
    document.getElementById("multiple-choice-mode").onclick = () => {
      // if (current === "multiple-choice") return; // Skip if already in this mode
      updateActiveMode("multiple-choice");
      SettingStore.setDisplayMode("multiple-choice");
      showMultipleChoice(vocab, answerOptionsEl);
      displayVocab();
    };

    document.getElementById("text-input-mode").onclick = () => {
      // if (current === "write-translation") return; // Skip if already in this mode
      updateActiveMode("write-translation");
      SettingStore.setDisplayMode("write-translation");
      showTextInput(vocab, answerOptionsEl);
      displayVocab();
    };

    document.getElementById("word-completion-mode").onclick = () => {
      // if (current === "word-completion") return; // Skip if already in this mode
      updateActiveMode("word-completion");
      SettingStore.setDisplayMode("word-completion");
      showWordCompletion(vocab, answerOptionsEl, params?.maskedWord);
      displayVocab();
    };

    document.getElementById("random-mode").onclick = () => {
      // if (current === "random") return;
      updateActiveMode("random");
      SettingStore.setDisplayMode("random");
      displayVocab();
    };

    // Helper function to update active mode visually
    function updateActiveMode(newMode) {
      document.querySelectorAll(".mode-btn").forEach((btn) => {
        btn.classList.remove("active");
      });
      const modeMap = {
        "multiple-choice": "multiple-choice-mode",
        "write-translation": "text-input-mode",
        "word-completion": "word-completion-mode",
        random: "random-mode",
      };
      const buttonId = modeMap[newMode];

      if (buttonId) {
        document.getElementById(buttonId).classList.add("active");
      }
    }

    // Display based on actual mode (which might be random)
    switch (mode) {
      case "word-completion":
        showWordCompletion(vocab, answerOptionsEl, params?.maskedWord);
        break;
      case "write-translation":
        showTextInput(vocab, answerOptionsEl);
        break;
      default:
        showMultipleChoice(vocab, answerOptionsEl);
    }

    // Add remember level section to remember-levels div only if level >= 4
    const rememberLevelsHtml = (() => {
      if (vocab.level < 4) return "";

      return `
        <div class="remember-level-container">
          <div class="remember-level-title">How well did you remember this word?</div>
          <div class="remember-level-options">
            <div class="level-btn-wrapper">
              <button class="remember-level-btn remember-level-1" data-level="0">Bad</button>
              <span class="level-info-icon">ℹ️</span>
              <span class="level-label">Had no idea</span>
            </div>
            <div class="level-btn-wrapper">
              <button class="remember-level-btn remember-level-2" data-level="1">Poor</button>
              <span class="level-info-icon">ℹ️</span>
              <span class="level-label">Barely remembered</span>
            </div>
            <div class="level-btn-wrapper">
              <button class="remember-level-btn remember-level-3" data-level="2" data-selected="true">OK</button>
              <span class="level-info-icon">ℹ️</span>
              <span class="level-label">Somewhat knew it</span>
            </div>
            <div class="level-btn-wrapper">
              <button class="remember-level-btn remember-level-4" data-level="3">Good</button>
              <span class="level-info-icon">ℹ️</span>
              <span class="level-label">Knew it well</span>
            </div>
            <div class="level-btn-wrapper">
              <button class="remember-level-btn remember-level-5" data-level="4">Great</button>
              <span class="level-info-icon">ℹ️</span>
              <span class="level-label">Knew it perfectly</span>
            </div>
          </div>
        </div>
      `;
    })();

    document.getElementById("remember-levels").innerHTML = rememberLevelsHtml;

    // Add click handlers for answer buttons
    document.querySelectorAll(".answer-btn").forEach((btn) => {
      btn.onclick = (e) => {
        document
          .querySelectorAll(".answer-btn")
          .forEach((b) => b.classList.remove("selected"));
        e.target.classList.add("selected");
      };
    });

    // Add click handlers for remember level buttons
    document.querySelectorAll(".remember-level-btn").forEach((btn) => {
      if (btn.dataset.selected) {
        btn.classList.add("selected");
      }
      btn.onclick = (e) => {
        document
          .querySelectorAll(".remember-level-btn")
          .forEach((b) => b.classList.remove("selected"));
        e.target.classList.add("selected");
      };
    });

    // Add after the existing click handlers
    document.querySelectorAll(".level-info-icon").forEach((icon) => {
      icon.addEventListener("click", (e) => {
        // Remove active class from all labels
        document.querySelectorAll(".level-label").forEach((label) => {
          label.classList.remove("active");
        });
        // Add active class to clicked button's label
        const label = e.target.nextElementSibling;
        label.classList.add("active");

        // Hide label after 2 seconds
        setTimeout(() => {
          label.classList.remove("active");
        }, 2000);
      });
    });
  };

  const showMultipleChoice = (vocab, container) => {
    // document
    //   .querySelectorAll(".mode-btn")
    //   .forEach((btn) => btn.classList.remove("active"));
    // document.getElementById("multiple-choice-mode").classList.add("active");

    // Add multiple-choice class to container
    container.classList.add("multiple-choice");
    container.classList.remove("text-input", "word-completion");

    const options = new Set([vocab.translations.join(",")]);
    const others = [...Store.database.vocabularies]
      .sort(() => Math.random() - 0.5)
      .slice(0, 10);

    for (const el of others) {
      if (!el) break;
      options.add(el.translations.join(","));
      if (options.size === 4) break;
    }

    const shuffledOptions = Array.from(options).sort(() => Math.random() - 0.5);

    container.innerHTML = `
      ${shuffledOptions
        .map(
          (option, index) =>
            `<button class="answer-btn" data-answer="${option}">${String.fromCharCode(
              65 + index
            )}. ${option}</button>`
        )
        .join("")}
    `;

    // Add click handlers for answer buttons
    document.querySelectorAll(".answer-btn").forEach((btn) => {
      btn.onclick = (e) => {
        document
          .querySelectorAll(".answer-btn")
          .forEach((b) => b.classList.remove("selected"));
        e.target.classList.add("selected");
      };
    });
  };

  const showTextInput = (vocab, container) => {
    container.classList.add("text-input");
    container.classList.remove("multiple-choice", "word-completion");

    // Create pattern hint from translations
    const letters = vocab.translations[0].split("");
    const patternHint = letters
      .map((char, index) => {
        // Keep only specific punctuation and spaces
        if (char.match(/[,.:;]|\s/)) {
          return char;
        }

        if (index === 0) {
          return char;
        }

        if (letters[index - 1] === " ") {
          return char;
        }

        // Mask everything else
        return "*";
      })
      .join("");

    container.innerHTML = `
      <div class="text-input-container">
        <div class="pattern-hint">${patternHint}</div>
        <input type="text" 
          id="text-answer-input" 
          placeholder="Type translation..." 
          class="answer-input"
          autocomplete="off"
          autofocus>
        <div class="hint-text">Enter translation</div>
      </div>
    `;

    const input = document.getElementById("text-answer-input");

    // Focus the input after rendering
    setTimeout(() => {
      input?.focus();
    }, 100);

    // Add enter key handler for text input
    input.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        handleSubmitAnswer();
      }
    });
  };

  const showWordCompletion = (vocab, container, _maskedWord) => {
    const maskedWord = _maskedWord || generateMaskedWord(vocab.text);

    container.classList.add("word-completion");
    container.classList.remove("multiple-choice", "text-input");

    // Initial state - all letters in gray
    container.innerHTML = `
      <div class="completion-container">
        <div class="text-input-container">
          <div class="comparison-box">
            ${maskedWord
              .split("")
              .map((char) => `<span class="char masked">${char}</span>`)
              .join("")}
          </div>
          <input type="text" 
            id="completion-answer-input" 
            placeholder="Type the full word..." 
            class="answer-input"
            autocomplete="off"
            autofocus>
          <div class="hint-text">Complete the missing letters</div>
        </div>
      </div>
    `;

    const input = document.getElementById("completion-answer-input");
    const comparisonBox = document.querySelector(".comparison-box");
    const correctWord = vocab.text.toLowerCase();

    // Add input event listener for realtime comparison
    input.addEventListener("input", (e) => {
      const userInput = e.target.value.toLowerCase();
      const chars = maskedWord.split("");

      // Update comparison box
      comparisonBox.innerHTML = chars
        .map((char, index) => {
          const userChar = userInput[index] || "";
          const correctChar = correctWord[index];
          let displayChar = char;
          let charClass = "masked"; // Default state is masked/gray

          if (userInput.length > index) {
            // User has typed this position
            if (userInput.length > correctWord.length) {
              // Show red for all characters if input is too long
              charClass = "wrong";
              displayChar = userChar || char;
            }
            // else if (char === "*") {
            //   // Keep masked style for asterisk positions
            //   charClass = "masked";
            //   displayChar = userChar || "*";
            // }
            else if (userChar === correctChar) {
              charClass = "correct"; // Green for correct
              displayChar = userChar;
            } else {
              charClass = "wrong"; // Red for wrong
              displayChar = userChar;
            }
          }

          return `<span class="char ${charClass}">${displayChar}</span>`;
        })
        .join("");

      // Add extra characters in red if input is too long
      if (userInput.length > correctWord.length) {
        const extraChars = userInput.slice(correctWord.length);
        comparisonBox.innerHTML += extraChars
          .split("")
          .map((char) => `<span class="char wrong">${char}</span>`)
          .join("");
      }
    });

    // Focus the input after rendering
    setTimeout(() => {
      input?.focus();
    }, 100);

    // Add enter key handler for text input
    input.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        handleSubmitAnswer();
      }
    });
  };

  function generateMaskedWord(word) {
    if (sessionData.isShowTranslation) return word;

    const letters = word.split("");
    const len = letters.length;

    if (len <= 2) return word;

    // Calculate max number of letters to mask (50% of word length)
    const maxMasks = Math.floor(len / 2);
    let maskedCount = 0;

    // Keep first and last letter
    for (let i = 1; i < len - 1; i++) {
      // Check if we've reached max masks
      if (maskedCount >= maxMasks) {
        break;
      }

      // Randomly decide to mask each middle letter
      if (Math.random() < 0.5) {
        // 50% chance to mask
        letters[i] = "*";
        maskedCount++;
      }
    }

    // Ensure at least one letter is masked between first and last
    let hasMask = false;
    for (let i = 1; i < len - 1; i++) {
      if (letters[i] === "*") {
        hasMask = true;
        break;
      }
    }

    if (!hasMask && len > 2) {
      // Force mask a random middle letter if none were masked
      const randomIndex = Math.floor(Math.random() * (len - 2)) + 1;
      letters[randomIndex] = "*";
    }

    return letters.join("");
  }

  function maskWordInSentence(sentence, targetWord, maskedWord) {
    // Case-insensitive replacement of the target word with its masked version
    return sentence.split(targetWord).join(maskedWord);
  }

  // Handle submit answer
  const handleSubmitAnswer = (params) => {
    const vocabToReview = sessionData.vocabToReview;
    const currentIndex = sessionData.currentIndex;
    const { mode } = SettingStore.getDisplayMode();
    const isSkip = sessionData.isAllowSkip && params?.isSkip;

    const selectedRememberLevel = document.querySelector(
      ".remember-level-btn.selected"
    );
    // Set default remember level based on vocab level
    const currentVocab = vocabToReview[currentIndex];
    const isExist = sessionData.wordsReviewed.find(
      (w) => w.id === currentVocab.id
    );
    const oldLevel = currentVocab.level; // Store the original level
    const rememberLevel = (() => {
      if (currentVocab.level < 4) return RememberLevel.OK;
      if (!selectedRememberLevel) return RememberLevel.OK;
      return parseInt(selectedRememberLevel.dataset.level);
    })();

    let userAnswer;
    let isCorrect;
    if (!isSkip) {
      if (mode === "multiple-choice") {
        const selectedOption = document.querySelector(".answer-btn.selected");
        if (!selectedOption) {
          alert("Please select an answer!");
          return;
        }
        userAnswer = selectedOption.dataset.answer;
        // Check against translations for multiple choice
        const correctAnswers = currentVocab.translations
          .join(",")
          .toLowerCase();
        isCorrect = correctAnswers.includes(userAnswer.toLowerCase());
      } else if (mode === "word-completion") {
        const textInput = document.getElementById("completion-answer-input");
        if (!textInput.value.trim()) {
          alert("Please enter your answer!");
          return;
        }
        userAnswer = textInput.value.trim().toLowerCase();
        // For word completion, compare with the original English word
        isCorrect = userAnswer === currentVocab.text.toLowerCase();
      } else {
        // Handle translation input mode
        const textInput = document.getElementById("text-answer-input");
        if (!textInput.value.trim()) {
          alert("Please enter your answer!");
          return;
        }
        userAnswer = textInput.value.trim().toLowerCase();
        // Check against translations for translation input
        const correctAnswers = currentVocab.translations.map((t) =>
          t.toLowerCase()
        );
        isCorrect = correctAnswers.includes(userAnswer);
      }

      if (!isCorrect) {
        const isExist = sessionData.wordsReviewed.find(
          (w) => w.id === currentVocab.id
        );
        if (!isExist) {
          sessionData.wordsReviewed.push({
            id: currentVocab.id,
            word: currentVocab.text,
            isCorrect,
            oldLevel, // Save the original level
            level: currentVocab.level, // This is the new level
            rememberLevel,
            translations: currentVocab.translations,
            pronunciation: currentVocab.pronunciation,
            isSkip,
          });
        }

        alert("Incorrect! Try again.");
        return;
      }

      const vocab = new Vocab();
      vocab.learn(currentVocab, isCorrect, rememberLevel);
    }

    if (!isExist) {
      sessionData.wordsReviewed.push({
        id: currentVocab.id,
        word: currentVocab.text,
        isCorrect,
        oldLevel, // Save the original level
        level: currentVocab.level, // This is the new level
        rememberLevel,
        translations: currentVocab.translations,
        pronunciation: currentVocab.pronunciation,
        isSkip,
      });
    }

    sessionData.totalReviewed++;
    sessionData.currentIndex++;

    if (sessionData.currentIndex < sessionData.totalToReview) {
      displayVocab();
      updateProgress();
    } else {
      updateProgress();
      showOverview();
    }
  };

  // Show the overview modal
  const showOverview = () => {
    sessionData.endTime = Date.now();
    const set = new Set(sessionData.wordsReviewed.map((item) => item.id));
    const totalReviewed = set.size;

    const correctAnswers = sessionData.wordsReviewed.filter(
      (w) => w.isCorrect
    ).length;
    const incorrectAttempts = sessionData.wordsReviewed.filter(
      (w) => !w.isCorrect && !w.isSkip
    ).length;
    const accuracyRate = totalReviewed
      ? Math.round((correctAnswers / totalReviewed) * 100)
      : 0;

    document.getElementById("total-reviewed").textContent = totalReviewed;
    document.getElementById("correct-answers").textContent = correctAnswers;
    document.getElementById("incorrect-attempts").textContent =
      incorrectAttempts;
    document.getElementById("accuracy-rate").textContent = accuracyRate;
    document.getElementById("time-spent").textContent = Math.floor(
      (sessionData.endTime - sessionData.startTime) / 1000
    );

    const breakdownList = document.getElementById("performance-breakdown");
    breakdownList.innerHTML = "";
    sessionData.wordsReviewed
      .sort((a, b) => {
        if (a.isSkip) return 1;
        if (b.isSkip) return -1;
        return 0;
      })
      .forEach((wordData) => {
        const listItem = document.createElement("li");

        // Add appropriate class based on status
        if (wordData.isSkip) {
          listItem.classList.add("skipped-word");
        } else if (!wordData.isCorrect) {
          listItem.classList.add("incorrect");
        }

        const pronunciation = wordData.pronunciation
          ? `(${wordData.pronunciation})`
          : "";
        const translations = wordData.translations
          ? `${wordData.translations.join(", ")}`
          : "";

        // Calculate actual level change
        const levelChange = wordData.level - wordData.oldLevel;
        const levelDisplay =
          levelChange > 0
            ? `Lv${wordData.level} (+${levelChange})`
            : `Lv${wordData.level}`;

        listItem.innerHTML = `
        <span class="speak-icon" onclick="speak(event)" data-word="${
          wordData.word
        }">
          ${wordData.word}🔊
        </span>
        ${pronunciation}:
        <br>
        <span class="word-translations">${translations}</span>
        <span class="word-level">
          ${levelDisplay}
          ${wordData.isSkip ? "(Skipped)" : ""}
        </span>
      `;
        breakdownList.appendChild(listItem);
      });

    overviewModal.style.display = "flex";
  };

  // Stop review button
  const stopReviewBtn = document.getElementById("stop-review-btn");
  stopReviewBtn.onclick = () => {
    if (
      confirm(
        "Are you sure you want to stop reviewing? Your progress will be saved."
      )
    ) {
      modal.style.display = "none";
    }
  };

  document.getElementById("back-to-home").onclick = () => {
    modal.style.display = "none";
    overviewModal.style.display = "none";
  };

  // Show skip button if allowed
  if (sessionData.isAllowSkip) {
    skipAnswerBtn.classList.add("show");
    skipAnswerBtn.onclick = () => handleSubmitAnswer({ isSkip: true });
  } else {
    skipAnswerBtn.classList.remove("show");
  }

  // Submit answer button
  submitAnswerBtn.onclick = () => handleSubmitAnswer();

  // Restart learning button
  // document.getElementById("restart-learning").addEventListener("click", () => {
  //   sessionData.wordsReviewed = [];
  //   sessionData.startTime = Date.now();
  //   overviewModal.style.display = "none";
  //   displayVocab();
  // });

  // Initialize learning
  updateProgress();
  displayVocab();
};
