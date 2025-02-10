document.addEventListener("DOMContentLoaded", () => {
  const tabs = document.querySelectorAll(".tab-button");
  const contents = document.querySelectorAll(".tab-content");

  // Overview Elements
  const learnBtn = document.getElementById("learn-btn");
  const totalVocabEl = document.getElementById("total-vocab");
  // const totalReviewEl = document.getElementById("total-review");
  const nextReviewTimeEl = document.getElementById("next-review-time");

  // Add Vocab Elements
  const fixedAddButton = document.getElementById("fixed-add-button");
  const addForm = document.getElementById("add-form");
  const vocabText = document.getElementById("vocab-text");
  const vocabPronunciation = document.getElementById("vocab-pronunciation");
  const type = document.getElementById("vocab-type");
  const vocabTranslation = document.getElementById("vocab-translation");
  const vocabImage = document.getElementById("vocab-image");
  const vocabDescription = document.getElementById("vocab-description");

  const levelCount1 = document.getElementById("level-1-count");
  const levelCount2 = document.getElementById("level-2-count");
  const levelCount3 = document.getElementById("level-3-count");
  const levelCount4 = document.getElementById("level-4-count");
  const levelCount5 = document.getElementById("level-5-count");

  // List Vocab Elements
  const vocabListContainer = document.getElementById("vocab-list");
  const filterLevel = document.getElementById("filter-level");

  const vocab = new Vocab();
  Store.load();
  updateOverview();

  // Add these at the top with other constants
  const ITEMS_PER_PAGE = 10;
  let currentPage = 1;
  let searchTerm = "";

  // Add the search input constant
  const searchInput = document.getElementById("vocab-search");

  function goToTab(tabId, _tab = null) {
    tabs.forEach((t) => t.classList.remove("active"));
    contents.forEach((c) => c.classList.remove("active"));

    const tab = _tab || document.getElementById(tabId);
    if (!tab) {
      console.error("Tab not found, tabId:", tabId);
      return;
    }

    tab.classList.add("active");
    document.getElementById(tabId).classList.add("active");

    if (tabId === "add") {
      fixedAddButton.style.display = "none";
    } else {
      fixedAddButton.style.display = "block";
    }

    if (tabId === "overview") updateOverview();
    if (tabId === "list") {
      renderVocabList();
      loadVoices(); // Ensure voices are loaded
    }

    // Update storage info when settings tab is opened
    if (tabId === "settings") {
      updateStorageInfo();
    }

    // Initialize lesson navigation when lessons tab is clicked
    if (tabId === "lessons-tab") {
      // The LessonNavigation class will handle its own initialization
      // when the script loads
    }
  }

  /* ------------------ Tab Navigation ------------------ */
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const tabId = tab.getAttribute("data-tab");
      goToTab(tabId, tab);
    });
  });

  /* ------------------ Overview: Update Stats ------------------ */
  function updateOverview() {
    const total = Store.database.vocabularies.length;

    // const reviewData = vocab.getVocabToReview();

    totalVocabEl.innerText = total;
    // totalReviewEl.innerText = reviewData.totalVocabularies || 0;

    // Calculate time left in minutes
    const dataReview = vocab.getNextReviewTime();

    if (dataReview) {
      nextReviewTimeEl.innerText = `${dataReview.total} words`;
      const timeLeft = getTimeLeft(dataReview.time);
      if (timeLeft === "Ready to learn!") {
        learnBtn.textContent = "Learn now!";
      } else {
        learnBtn.textContent = timeLeft;
      }
    } else {
      nextReviewTimeEl.innerText =
        "You don't have any vocabulary, add more now!";
    }

    const vocabularyByLevel = Store.database.vocabularies.reduce((acc, cur) => {
      const level = Math.max(Number(cur.level) || 1, 1);
      const key = Math.min(level, 5);
      acc[key] = Number(acc[key]) || 0;
      acc[key] += 1;
      return acc;
    }, {});
    levelCount1.innerText = vocabularyByLevel[1] || 0;
    levelCount2.innerText = vocabularyByLevel[2] || 0;
    levelCount3.innerText = vocabularyByLevel[3] || 0;
    levelCount4.innerText = vocabularyByLevel[4] || 0;
    levelCount5.innerText = vocabularyByLevel[5] || 0;
  }

  /* ------------------ Practice: Random Words ------------------ */
  const practiceBtn = document.getElementById("practice-btn");
  practiceBtn.addEventListener("click", () => {
    // Get all vocabularies
    const allVocabs = Store.database.vocabularies;
    if (!allVocabs?.length) {
      alert("You don't have any vocabulary to practice!");
      return;
    }

    // Helper function to get random words from vocabulary list
    const getRandomWords = (
      _vocabArray,
      numOfWords,
      _lastReviewAt = Date.now()
    ) => {
      const vocabArray = _vocabArray.filter(
        (v) => v.lastReviewAt < _lastReviewAt
      );
      const selectedVocabs = [];
      const availableIndices = [...Array(vocabArray.length).keys()];
      const numWords = Math.min(numOfWords, vocabArray.length);

      for (let i = 0; i < numWords; i++) {
        const randomIndex = Math.floor(Math.random() * availableIndices.length);
        const selectedIndex = availableIndices[randomIndex];
        selectedVocabs.push(vocabArray[selectedIndex]);
        availableIndices.splice(randomIndex, 1);
      }
      return selectedVocabs;
    };

    // Get 5 words with level < 6 and 5 words with level >= 6
    const lowLevelVocabs = allVocabs.filter((v) => (v.level || 0) < 6);
    const highLevelVocabs = allVocabs.filter((v) => (v.level || 0) >= 6);
    const maxWords = 10;
    const lowLevelSelected = getRandomWords(
      lowLevelVocabs,
      3,
      Date.now() - 10 * 60 * 1000
    );
    const remainingCount = maxWords - lowLevelSelected.length;
    const highLevelSelected = getRandomWords(highLevelVocabs, remainingCount);
    const selectedVocabs = [...lowLevelSelected, ...highLevelSelected].filter(
      Boolean
    );

    // Open learning modal and start practice
    const modal = document.getElementById("learning-modal");
    modal.style.display = "flex";
    handleLearning({ vocabularies: selectedVocabs, isAllowSkip: true });
  });

  /* ------------------ Learn Now: Open Modal ------------------ */
  learnBtn.addEventListener("click", (e) => {
    // if (learnBtn.textContent === "Add your first vocabulary") {
    //   return;
    // }
    if (!Store.database.vocabularies?.length) {
      goToTab("lessons");
      return;
    }

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

    // Apply level filter
    if (selectedLevel) {
      vocabList = vocabList.filter(
        (item) => item.level === parseInt(selectedLevel)
      );
    }

    // Apply search filter
    if (searchTerm) {
      vocabList = vocabList.filter((item) =>
        item.text.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort by creation date
    vocabList.sort((a, b) => b.createdAt - a.createdAt);

    // Calculate pagination
    const totalItems = vocabList.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

    // Update pagination controls
    document.getElementById("current-page").textContent = currentPage;
    document.getElementById("total-pages").textContent = totalPages;
    document.getElementById("prev-page").disabled = currentPage === 1;
    document.getElementById("next-page").disabled = currentPage === totalPages;

    // Get items for current page
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedList = vocabList.slice(
      startIndex,
      startIndex + ITEMS_PER_PAGE
    );

    // Render the items
    const vocabHTML = paginatedList
      .map((vocab) => {
        const dataWord = `data-word="${vocab.text}"`;
        const description = vocab.description.split("\n")[0] || "";
        return `
            <div class="vocab-item">
              <div class="vocab-actions">
                <button class="edit-vocab-btn" data-id="${vocab.id}">✏️</button>
                <button class="remove-vocab-btn" data-id="${
                  vocab.id
                }">❌</button>
              </div>
              <div class="vocab-content">
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
              </div>
            </div>
          `;
      })
      .join("");

    vocabListContainer.innerHTML = vocabHTML;

    // Add the edit handler function
    function handleEditVocab(e) {
      const vocabId = e.target.dataset.id;
      const vocab = Store.database.vocabularies.find((v) => v.id === vocabId);

      if (!vocab) return;

      // Create and show edit modal
      const editModal = document.createElement("div");
      editModal.className = "modal edit-vocab-modal";
      editModal.innerHTML = `
    <div class="modal-content">
      <h2>Edit Vocabulary</h2>
      <form id="edit-vocab-form">
        <input type="text" id="edit-text" value="${
          vocab.text
        }" placeholder="Text" required>
        <input type="text" id="edit-pronunciation" value="${
          vocab.pronunciation || ""
        }" placeholder="Pronunciation">
        <input type="text" id="edit-type" value="${
          vocab.type || ""
        }" placeholder="Type">
        <input type="text" id="edit-translations" value="${vocab.translations.join(
          ", "
        )}" placeholder="Translations" required>
        <textarea id="edit-description" placeholder="Description">${
          vocab.description || ""
        }</textarea>
        <div class="modal-buttons">
          <button type="submit" class="save-btn">Save</button>
          <button type="button" class="cancel-btn">Cancel</button>
        </div>
      </form>
    </div>
  `;

      document.body.appendChild(editModal);

      // Handle form submission
      const editForm = document.getElementById("edit-vocab-form");
      editForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const updatedVocab = {
          text: document.getElementById("edit-text").value,
          pronunciation: document.getElementById("edit-pronunciation").value,
          type: document.getElementById("edit-type").value,
          translations: document
            .getElementById("edit-translations")
            .value.split(",")
            .map((t) => t.trim()),
          description: document.getElementById("edit-description").value,
        };

        // Update the vocabulary
        vocab.text = updatedVocab.text;
        vocab.pronunciation = updatedVocab.pronunciation;
        vocab.type = updatedVocab.type;
        vocab.translations = updatedVocab.translations;
        vocab.description = updatedVocab.description;

        Store.sync();

        // Add closing animation
        editModal.classList.add("closing");

        editModal.remove();
        // Reset to first page and clear search when updating
        currentPage = 1;
        searchTerm = "";
        document.getElementById("vocab-search").value = "";
        document.getElementById("filter-level").value = "";

        // Update both the list and overview
        renderVocabList();
        updateOverview();
      });

      // Handle cancel button
      editModal.querySelector(".cancel-btn").addEventListener("click", () => {
        editModal.classList.add("closing");
        editModal.remove();
      });
    }

    // Add event listeners for both edit and delete buttons
    document.querySelectorAll(".edit-vocab-btn").forEach((button) => {
      button.addEventListener("click", handleEditVocab);
    });

    if (vocabList.length === 0) {
      vocabListContainer.innerHTML = "<p>No vocabularies found.</p>";
    }

    makeWordsSpeakable();
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

  filterLevel.addEventListener("change", () => {
    currentPage = 1; // Reset to first page when filtering
    renderVocabList();
  });

  // Add event listeners for search and pagination
  searchInput.addEventListener("input", (e) => {
    searchTerm = e.target.value;
    currentPage = 1; // Reset to first page when searching
    renderVocabList();
  });

  document.getElementById("prev-page").addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      renderVocabList();
    }
  });

  document.getElementById("next-page").addEventListener("click", () => {
    const totalPages = Math.ceil(
      Store.database.vocabularies.length / ITEMS_PER_PAGE
    );
    if (currentPage < totalPages) {
      currentPage++;
      renderVocabList();
    }
  });

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

  document.getElementById("copy-button").addEventListener(
    "click",
    () => {
      const textToCopy = document.getElementById("chatgpt-prompt").value;

      navigator.clipboard
        .writeText(textToCopy)
        .then(() => {
          alert("Text copied to clipboard!");
        })
        .catch((err) => {
          console.error("Failed to copy text: ", err);
        });
    },
    { once: true }
  );

  /* ------------------ Initial Load ------------------ */
  setInterval(() => updateOverview(), 1_000);

  // Add this function to calculate storage usage
  function updateStorageInfo() {
    let total = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        total += localStorage[key].length * 2; // Multiply by 2 for UTF-16 encoding
      }
    }

    // Convert to MB
    const usedMB = (total / (1024 * 1024)).toFixed(2);
    const limitMB = 5; // Browser typically limits at 5-10MB
    const percentage = Math.min((usedMB / limitMB) * 100, 100);

    // Update the UI
    document.getElementById("storage-used").textContent = usedMB;
    document.getElementById("storage-limit").textContent = limitMB;
    document.getElementById("storage-progress").style.width = `${percentage}%`;

    // Add warning if storage is getting full
    if (percentage > 80) {
      document.getElementById("storage-text").style.color = "#d32f2f";
    }
  }

  // Initial update
  updateStorageInfo();
});

function getTimeLeft(timeMs) {
  const now = Date.now(); // Current time in milliseconds
  let timeDifference = Math.floor((timeMs - now) / 1000); // Time difference in seconds

  if (timeDifference <= 0) {
    return "Ready to learn!";
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
  setInterval(updateReviewCount, 500); // Check every minute
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

      data.description = descriptionPart.split("\n").filter(Boolean).join("\n");
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

document.addEventListener("DOMContentLoaded", () => {
  const infoIcon = document.querySelector(".level-info__icon");
  const modal = document.getElementById("level-info__modal");
  const closeButton = document.getElementById("level-info__close-button");
  const backdrop = document.querySelector(".level-info__modal-backdrop");

  // Show modal and backdrop on info-icon click
  infoIcon.addEventListener("click", () => {
    modal.style.display = "block";
    backdrop.style.display = "block"; // Ensure the backdrop is shown
  });

  // Close modal on button click
  closeButton.addEventListener("click", () => {
    modal.style.display = "none";
    backdrop.style.display = "none"; // Hide the backdrop
  });

  // Close modal if clicking outside of it
  window.addEventListener("click", (event) => {
    if (event.target === backdrop) {
      modal.classList.remove("active");
      backdrop.style.display = "none";
      document.body.style.overflow = "auto";
    }
  });
});
