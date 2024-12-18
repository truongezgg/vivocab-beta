document.addEventListener("DOMContentLoaded", () => {
  const vocabToReview = [
    // ...Store.database.vocabularies.filter((vocab) => vocab.needsReview),
    ...Store.database.vocabularies.filter(
      (vocab) => vocab.shouldReviewAfter < Date.now()
    ),
  ];
  const sessionData = {
    startTime: Date.now(),
    endTime: null,
    wordsReviewed: [],
  };
  let totalReviewed = 0;
  const totalToReview = vocabToReview.length;
  let currentIndex = 0;

  // Update progress bar
  function updateProgress() {
    const progressPercent = (totalReviewed / totalToReview) * 100;
    document.getElementById("progress-bar").style.width = `${progressPercent}%`;
    document.getElementById(
      "progress-text"
    ).textContent = `${totalReviewed}/${totalToReview}`;
  }

  // Display vocabulary
  function displayVocab() {
    if (vocabToReview.length === 0) {
      document.getElementById(
        "vocab-display"
      ).innerHTML = `<p>No vocabulary to review!</p>`;
      document.getElementById(
        "answer-options"
      ).innerHTML = `<button id="back-to-home-btn">Back to Home</button>`;
      document.getElementById("submit-answer-btn").style.display = "none";

      document
        .getElementById("back-to-home-btn")
        .addEventListener("click", () => {
          window.location.href = "index.html";
        });
      return;
    }

    const vocab = vocabToReview[currentIndex];
    const vocabText = vocab.pronunciation
      ? `${vocab.text} (${vocab.pronunciation})`
      : vocab.text;

    document.getElementById(
      "vocab-text"
    ).innerHTML = `<span class="speak-icon" onclick="speak(event)" data-word="${vocabText}">${vocabText}🔊</span>`;
    document.getElementById("vocab-description").innerHTML = vocab.description
      .split("\n")
      .map(
        (line) =>
          `<span class="speak-icon" onclick="speak(event)" data-word="${line}">${line}🔊</span>`
      )
      .join("<br>");

    if (vocab.imageUrl) {
      const image = document.getElementById("vocab-image");
      image.src = vocab.imageUrl;
      image.style.display = "block";
    } else {
      document.getElementById("vocab-image").style.display = "none";
    }

    generateAnswerOptions(vocab);

    if (vocab.text) {
      speakText(vocab.text);
    }
  }

  // Generate answer options
  function generateAnswerOptions(vocab) {
    if (!vocab || !vocabToReview.length) return;
    // const correctAnswer = vocab.text;
    const options = new Set([vocab.translations.join(",")]);

    while (options.size < 4) {
      const index = Math.floor(Math.random() * vocabToReview.length);
      const randomVocab = vocabToReview[index];
      if (!randomVocab) break;

      options.add(randomVocab.translations.join(","));
    }

    const shuffledOptions = Array.from(options).sort(() => Math.random() - 0.5);

    document.getElementById("answer-options").innerHTML = shuffledOptions
      .map(
        (option, index) =>
          `<button class="answer-btn" data-answer="${option}">${String.fromCharCode(
            65 + index
          )}. ${option}</button>`
      )
      .join("");

    document.querySelectorAll(".answer-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        document
          .querySelectorAll(".answer-btn")
          .forEach((b) => b.classList.remove("selected"));
        e.target.classList.add("selected");
      });
    });
  }

  // Handle submit answer
  function handleSubmitAnswer() {
    const selectedOption = document.querySelector(".answer-btn.selected");
    if (!selectedOption) {
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

    if (isCorrect) {
      totalReviewed++;
      // vocab.update(vocabToReview[currentIndex].id, {
      //   level: vocabToReview[currentIndex].level + 1,
      // });
      vocab.learn(vocabToReview[currentIndex], isCorrect);
      currentIndex++;

      if (currentIndex < totalToReview) {
        displayVocab();
        updateProgress();
      } else {
        showOverview();
      }
    } else {
      // vocab.update(vocabToReview[currentIndex].id, {
      //   level: 0,
      // });
      vocab.learn(vocabToReview[currentIndex], isCorrect);
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
    sessionData.wordsReviewed.forEach((wordData) => {
      const listItem = document.createElement("li");
      listItem.textContent = `${wordData.word} - ${
        wordData.isCorrect ? "Correct" : "Incorrect"
      } (Level: ${wordData.level})`;
      breakdownList.appendChild(listItem);
    });

    document.getElementById("overview-modal").style.display = "flex";
  }

  // Stop review button
  document.getElementById("stop-review-btn").addEventListener("click", () => {
    if (
      confirm(
        "Are you sure you want to stop reviewing? Your progress will be saved."
      )
    ) {
      window.location.href = "index.html";
    }
  });

  // Submit answer button
  document
    .getElementById("submit-answer-btn")
    .addEventListener("click", handleSubmitAnswer);

  // Back to home button
  document.getElementById("back-to-home").addEventListener("click", () => {
    window.location.href = "index.html";
  });

  // Restart learning button
  document.getElementById("restart-learning").addEventListener("click", () => {
    sessionData.wordsReviewed = [];
    sessionData.startTime = Date.now();
    document.getElementById("overview-modal").style.display = "none";
    displayVocab();
  });

  // Initialize learning
  updateProgress();
  displayVocab();
});
