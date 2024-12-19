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
    const shouldReviewAt = vocab.getNextReviewTime();
    nextReviewTimeEl.innerText = getTimeLeft(shouldReviewAt);
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
      level: Level.ONE,
      lastReviewAt: Date.now(),
      shouldReviewAfter: Date.now() + 1000 * 60 * 60, // 1 hour later
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
            <p><strong>Description:</strong> ${
              vocab.description.split("\n")[0]
            }</p>
            <p><strong>Next review:</strong> ${
              vocab.shouldReviewAfter
                ? getTimeLeft(vocab.shouldReviewAfter)
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
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "vocabulary_data.json";
    a.click();

    URL.revokeObjectURL(url);
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
