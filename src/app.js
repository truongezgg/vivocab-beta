document.addEventListener("DOMContentLoaded", () => {
  const tabs = document.querySelectorAll(".tab-button");
  const contents = document.querySelectorAll(".tab-content");

  // Overview Elements
  const learnBtn = document.getElementById("learn-btn");
  const totalVocabEl = document.getElementById("total-vocab");
  const totalReviewEl = document.getElementById("total-review");
  const nextReviewTimeEl = document.getElementById("next-review-time");

  // Add Vocab Elements
  const addForm = document.getElementById("add-form");
  const vocabText = document.getElementById("vocab-text");
  const vocabPronunciation = document.getElementById("vocab-pronunciation");
  const type = document.getElementById("vocab-type");
  const vocabTranslation = document.getElementById("vocab-translation");
  const vocabImage = document.getElementById("vocab-image");
  const vocabDescription = document.getElementById("vocab-description");

  // List Vocab Elements
  const vocabListContainer = document.getElementById("vocab-list");
  const filterLevel = document.getElementById("filter-level");

  const vocab = new Vocab();
  Store.load();

  /* ------------------ Tab Navigation ------------------ */
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const target = tab.getAttribute("data-tab");

      tabs.forEach((t) => t.classList.remove("active"));
      contents.forEach((c) => c.classList.remove("active"));

      tab.classList.add("active");
      document.getElementById(target).classList.add("active");

      if (target === "overview") updateOverview();
      if (target === "list") {
        renderVocabList();
        loadVoices(); // Ensure voices are loaded
      }
    });
  });

  /* ------------------ Overview: Update Stats ------------------ */
  function updateOverview() {
    const total = Store.database.vocabularies.length;
    const reviewData = vocab.getVocabToReview();

    totalVocabEl.innerText = total;
    totalReviewEl.innerText = reviewData.totalVocabularies || 0;

    // Calculate time left in minutes
    const dataReview = vocab.getNextReviewTime();
    if (dataReview) {
      nextReviewTimeEl.innerText =
        `${dataReview.total} words | ` + getTimeLeft(dataReview.time);
    } else {
      nextReviewTimeEl.innerText =
        "You don't have any vocabulary, Add more now!";
    }
  }

  /* ------------------ Learn Now: Open Modal ------------------ */
  learnBtn.addEventListener("click", () => {
    const modal = document.getElementById("learning-modal");
    modal.style.display = "flex";
    handleLearning();
  });

  /* ------------------ Add New Vocabulary ------------------ */
  addForm.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!vocabText.value.trim()) {
      alert("Vocabulary text cannot be empty!");
      return;
    }

    const newVocab = {
      id: Date.now().toString(),
      type: type.value.trim() || "",
      pronunciation: vocabPronunciation.value.trim(),
      text: vocabText.value.trim(),
      translations: vocabTranslation.value
        ? vocabTranslation.value.split(",").map((t) => t.trim())
        : [],
      imageUrl: vocabImage.value.trim(),
      description: vocabDescription.value.trim(),
      createdAt: Date.now(),
      level: Level.ZERO,
      lastReviewAt: Date.now(),
      shouldReviewAfter: Vocab.roundTime(Date.now()),
    };

    vocab.add(newVocab);
    addForm.reset();
    alert("Vocabulary added successfully!");
    updateOverview();
  });

  /* ------------------ List Vocab: Filter & Render ------------------ */
  function renderVocabList() {
    const selectedLevel = filterLevel.value;
    let vocabList = [...Store.database.vocabularies];

    if (selectedLevel) {
      vocabList = vocabList.filter(
        (item) => item.level === parseInt(selectedLevel)
      );
    }

    vocabList.sort((a, b) => b.createdAt - a.createdAt);

    vocabListContainer.innerHTML = vocabList
      .map((vocab) => {
        const dataWord = `data-word="${vocab.text}"`;
        const description = vocab.description.split("\n")[0] || "";
        return `
          <div class="vocab-item">
            <p>
              <span onclick="speak(event)">
                <b class="speak-icon" ${dataWord}>${vocab.text}</b>
                     ${vocab.type ? `<span>(${vocab.type})</span>` : ``}
                <span class="speak-icon" ${dataWord}>🔊</span>
                ${
                  vocab.pronunciation
                    ? `<span>(${vocab.pronunciation})</span>`
                    : ``
                }
                <span>:</span>
                <span>${vocab.translations.join(", ")}</span>
              </span>
            </p>
            <p><strong>Level:</strong> ${vocab.level}</p>
            <p>
              <strong>Description:</strong>
              <span class="speak-icon" onclick="speak(event)" data-word="${description}">🔊</span>
              ${description}
            </p>
            <p><strong>Next review:</strong> ${
              vocab.shouldReviewAfter
                ? getTimeLeft(Vocab.roundTime(vocab.shouldReviewAfter))
                : "N/A"
            }</p>
            <button class="remove-vocab-btn" data-id="${vocab.id}">X</button>
          </div>
          <hr />
        `;
      })
      .join("");

    if (vocabList.length === 0) {
      vocabListContainer.innerHTML = "<p>No vocabularies found.</p>";
    }

    makeWordsSpeakable(); // Activate speakable words
    attachRemoveEventListeners();
  }

  /* -------------------------------------------------------------------------- */
  /*                                   Remove                                   */
  /* -------------------------------------------------------------------------- */
  /* ------------------ Remove Vocabulary ------------------ */
  function attachRemoveEventListeners() {
    const removeButtons = document.querySelectorAll(".remove-vocab-btn");

    removeButtons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const vocabId = e.target.getAttribute("data-id");
        removeVocab(vocabId);
      });
    });
  }

  function removeVocab(vocabId) {
    const vocab = new Vocab();
    if (confirm("Are you sure you want to remove this item?")) {
      vocab.remove(vocabId);
      renderVocabList();
    }
  }

  filterLevel.addEventListener("change", renderVocabList);

  /* ------------------ Import & Export ------------------ */
  document.getElementById("import-btn").addEventListener("click", () => {
    document.getElementById("import-file").click();
  });

  document.getElementById("import-file").addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);

        if (
          typeof data.version !== "string" ||
          !Array.isArray(data.vocabularies)
        ) {
          alert(
            "Invalid file format. Please ensure the file contains 'version' and 'vocabularies'."
          );
          return;
        }

        Store.database.vocabularies = [
          ...Store.database.vocabularies,
          ...data.vocabularies,
        ];
        Store.sync();
        renderVocabList();
        alert("Import successful!");
      } catch (err) {
        console.error(err);
        alert("Failed to import file. Ensure it is a valid JSON file.");
      }
    };

    reader.readAsText(file);
  });

  document.getElementById("export-btn").addEventListener("click", () => {
    const data = {
      version: Store.version,
      vocabularies: Store.database.vocabularies,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      // type: "application/json",
      type: "application/json;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "vocabulary_data.json";
    a.click();

    URL.revokeObjectURL(url);
  });

  document.getElementById("copy-button").addEventListener("click", () => {
    const textToCopy = document.getElementById("chatgpt-prompt").value;

    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        alert("Text copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
      });
  });

  /* ------------------ Initial Load ------------------ */
  setInterval(() => updateOverview(), 1_000);
});

function getTimeLeft(timeMs) {
  const now = Date.now(); // Current time in milliseconds
  let timeDifference = Math.floor((timeMs - now) / 1000); // Time difference in seconds

  if (timeDifference <= 0) {
    return "Time to review now!";
  }

  const days = Math.floor(timeDifference / (60 * 60 * 24));
  timeDifference %= 60 * 60 * 24; // Remaining seconds after calculating days

  const hours = Math.floor(timeDifference / (60 * 60));
  timeDifference %= 60 * 60; // Remaining seconds after calculating hours

  const minutes = Math.floor(timeDifference / 60);
  const seconds = timeDifference % 60; // Remaining seconds after calculating minutes

  // Construct the time string
  let timeString = "";
  if (days > 0) timeString += `${days}d`;
  if (hours > 0) timeString += `${hours}h`;
  if (minutes > 0 || days > 0 || hours > 0) timeString += `${minutes}m`;
  timeString += `${seconds}s`;

  return `${timeString} left`;
}

document.addEventListener("DOMContentLoaded", () => {
  const practiceBadge = document.getElementById("practice-badge");
  const reviewCountEl = document.getElementById("review-count");

  function updateReviewCount() {
    const reviewData = Store.database.vocabularies.filter(
      (vocab) => Vocab.roundTime(vocab.shouldReviewAfter) < Date.now()
    );
    const count = reviewData.length;

    // Update the badge count
    reviewCountEl.textContent = count;

    // Show or hide the badge based on the count
    if (count > 0) {
      practiceBadge.style.display = "flex";
    } else {
      practiceBadge.style.display = "none";
    }
  }

  // Navigate to the review section when the badge is clicked
  practiceBadge.addEventListener("click", () => {
    const modal = document.getElementById("learning-modal");
    modal.style.display = "flex";

    // Call a function to initialize the review session
    // initializeLearningLogic();
    handleLearning();
  });

  // Update the badge on page load
  updateReviewCount();

  // Periodically check for updates (optional)
  setInterval(updateReviewCount, 1000); // Check every minute
});

const processVocabText = (inputText) => {
  try {
    let data = {};

    // Check if input is JSON
    try {
      data = JSON.parse(inputText);
    } catch (e) {
      // If not JSON, assume it's plain text
      const [detailsPart, _descriptionPart] = inputText.includes("Description:")
        ? inputText.split("Description:")
        : [inputText, ""];
      const descriptionPart = _descriptionPart.trim();

      const lines = detailsPart
        .split("\r")
        .join("\n")
        .split("\n")
        .map((line) => line.trim());

      lines.forEach((line) => {
        if (line.startsWith("Word:")) {
          data.word = line.replace("Word:", "").trim();
        } else if (line.startsWith("Type:")) {
          data.type = line.replace("Type:", "").trim().toLowerCase();
        } else if (line.startsWith("Pronunciation:")) {
          data.pronunciation = line.replace("Pronunciation:", "").trim();
        } else if (line.startsWith("Translations:")) {
          data.translations = line.replace("Translations:", "").trim();
        }
      });

      data.description = descriptionPart;
    }

    // Populate fields
    if (data.word) {
      document.getElementById("vocab-text").value = data.word;
    }
    if (data.type) {
      document.getElementById("vocab-type").value = data.type;
    }
    if (data.pronunciation) {
      document.getElementById("vocab-pronunciation").value = data.pronunciation;
    }
    if (data.translations) {
      document.getElementById("vocab-translation").value = data.translations;
    }
    if (data.description) {
      document.getElementById("vocab-description").value =
        data.description.trim();
    }
  } catch (error) {
    console.error(error);
  }
};
