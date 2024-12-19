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

const handleLearning = function () {
  const vocabInstance = new Vocab();
  const vocabToReview = [
    // ...Store.database.vocabularies.filter(
    //   (vocab) => vocab.shouldReviewAfter < Date.now()
    // ),
    // ...Store.database.vocabularies.filter((vocab) => vocab),
    ...vocabInstance.getVocabToReview().vocabularies,
  ];
  const sessionData = {
    startTime: Date.now(),
    endTime: null,
    wordsReviewed: [],
  };
  let totalReviewed = 0;
  const totalToReview = vocabToReview.length;
  let currentIndex = 0;

  const modal = document.getElementById("learning-modal");
  const progressBar = document.getElementById("progress-bar");
  const progressText = document.getElementById("progress-text");
  const vocabTextEl = document.getElementById("vocab-textt");
  const vocabDescriptionEl = document.getElementById("vocab-descriptionn");
  const vocabImageEl = document.getElementById("vocab-image");
  const answerOptionsEl = document.getElementById("answer-options");
  const submitAnswerBtn = document.getElementById("submit-answer-btn");
  const overviewModal = document.getElementById("overview-modal");

  // Update progress bar
  function updateProgress() {
    const progressPercent = (totalReviewed / totalToReview) * 100;
    progressBar.style.width = `${progressPercent}%`;
    progressText.textContent = `${totalReviewed}/${totalToReview}`;
  }

  // Display vocabulary
  async function displayVocab() {
    if (vocabToReview.length === 0) {
      vocabTextEl.innerHTML = `<p>No vocabulary to review!</p>`;
      answerOptionsEl.innerHTML = `<button id="back-to-home-btn">Back to Home</button>`;
      submitAnswerBtn.style.display = "none";

      document.getElementById("back-to-home-btn").onclick = () => {
        modal.style.display = "none";
      };

      return;
    }

    const vocab = vocabToReview[currentIndex];
    if (!vocab) return;

    const vocabText = vocab.pronunciation
      ? `${vocab.text} (${vocab.pronunciation})`
      : vocab.text;

    vocabTextEl.innerHTML = `<span class="speak-icon" onclick="speak(event)" data-word="${vocab.text}">${vocabText}🔊</span>`;

    vocabDescriptionEl.innerHTML = vocab.description
      .split("\n")
      .map(
        (line) =>
          `<span class="speak-icon" onclick="speak(event)" data-word="${line}">${line}🔊</span>`
      )
      .join("<br>");

    if (vocab.imageUrl) {
      vocabImageEl.src = vocab.imageUrl;
      vocabImageEl.style.display = "block";
    } else {
      vocabImageEl.style.display = "none";
    }

    generateAnswerOptions(vocab);
    if (vocab.text) speakText(vocab.text);
  }

  async function generateAnswerOptions(vocab) {
    if (!vocab || !vocabToReview.length) return;
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

    answerOptionsEl.innerHTML = shuffledOptions
      .map(
        (option, index) =>
          `<button class="answer-btn" data-answer="${option}">${String.fromCharCode(
            65 + index
          )}. ${option}</button>`
      )
      .join("");

    document.querySelectorAll(".answer-btn").forEach((btn) => {
      btn.onclick = (e) => {
        document
          .querySelectorAll(".answer-btn")
          .forEach((b) => b.classList.remove("selected"));
        e.target.classList.add("selected");
      };
    });
  }

  // Handle submit answer
  function handleSubmitAnswer() {
    const selectedOption = document.querySelector(".answer-btn.selected");
    if (!selectedOption) {
      displayVocab();
      alert("Please select an answer!");
      return;
    }

    const userAnswer = selectedOption.dataset.answer;
    const correctAnswer = vocabToReview[currentIndex].translations.join(",");

    const isCorrect = userAnswer === correctAnswer;
    sessionData.wordsReviewed.push({
      word: vocabToReview[currentIndex].text,
      isCorrect,
      level: isCorrect ? vocabToReview[currentIndex].level + 1 : 1,
    });

    const vocab = new Vocab();
    vocab.learn(vocabToReview[currentIndex], isCorrect);

    if (isCorrect) {
      totalReviewed++;
      currentIndex++;

      if (currentIndex < totalToReview) {
        displayVocab();
        updateProgress();
      } else {
        updateProgress();
        showOverview();
      }
    } else {
      alert("Incorrect! Try again.");
    }
  }

  // Show the overview modal
  function showOverview() {
    sessionData.endTime = Date.now();

    document.getElementById("total-reviewed").textContent =
      sessionData.wordsReviewed.length;
    document.getElementById("correct-answers").textContent =
      sessionData.wordsReviewed.filter((w) => w.isCorrect).length;
    document.getElementById("incorrect-attempts").textContent =
      sessionData.wordsReviewed.filter((w) => !w.isCorrect).length;
    document.getElementById("time-spent").textContent = Math.floor(
      (sessionData.endTime - sessionData.startTime) / 1000
    );

    const breakdownList = document.getElementById("performance-breakdown");
    breakdownList.innerHTML = "";
    sessionData.wordsReviewed.forEach((wordData) => {
      const listItem = document.createElement("li");
      listItem.textContent = `${wordData.word} - ${
        wordData.isCorrect ? "Correct" : "Incorrect"
      } (Level: ${wordData.level})`;
      breakdownList.appendChild(listItem);
    });

    overviewModal.style.display = "flex";
  }

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
