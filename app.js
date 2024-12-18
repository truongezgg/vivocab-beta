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
    nextReviewTimeEl.innerText =
      reviewData.vocabularies.length > 0
        ? new Date(
            reviewData.vocabularies[0].shouldReviewAfter
          ).toLocaleString()
        : "N/A";
  }

  /* ------------------ Learn Now: Modal ------------------ */
  initLearnModal(
    "learn-modal",
    "close-modal",
    "review-content",
    "next-vocab-btn"
  );

  learnBtn.addEventListener("click", () => {
    // const vocabListToReview = vocab.getVocabToReview().vocabularies;
    // showLearnModal(vocabListToReview);

    window.location.href = "learn.html";
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
      type: "manual",
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
      isSendNotification: false,
    };

    vocab.add(newVocab);
    addForm.reset();
    alert("Vocabulary added successfully!");
    updateOverview();
  });

  /* ------------------ List Vocab: Filter & Sort ------------------ */
  function renderVocabList() {
    const selectedLevel = filterLevel.value;
    let vocabList = [...Store.database.vocabularies];

    // Filter by level
    if (selectedLevel) {
      vocabList = vocabList.filter(
        (item) => item.level === parseInt(selectedLevel)
      );
    }

    // Sort by createdAt (newest first)
    vocabList.sort((a, b) => b.createdAt - a.createdAt);

    // Render
    vocabListContainer.innerHTML = vocabList
      .map((vocab) => {
        const dataWord = `data-word="${vocab.text}"`;
        return `
          <div class="vocab-item">
            <p>
              <span onclick="speak(event)">
                <b class="speak-icon" ${dataWord}>${vocab.text}</b>
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
          </div>
          <hr />
        `;
      })
      .join("");

    if (vocabList.length === 0) {
      vocabListContainer.innerHTML = "<p>No vocabularies found.</p>";
    }

    makeWordsSpeakable(); // Activate speakable words
  }

  filterLevel.addEventListener("change", renderVocabList);

  /* -------------------------------------------------------------------------- */
  /*                                   Import                                   */
  /* -------------------------------------------------------------------------- */
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

        // Validate format
        if (
          typeof data.version !== "string" ||
          !Array.isArray(data.vocabularies)
        ) {
          alert(
            "Invalid file format. Please ensure the file contains 'version' and 'vocabularies'."
          );
          return;
        }

        // Merge with existing data
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
  updateOverview();
});
