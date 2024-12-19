// Variables to track modal state
let modal, closeModal, reviewContent, nextVocabBtn;
let vocabListToReview = [];
let currentReviewIndex = 0;

// Initialize Learn Modal
function initLearnModal(modalId, closeModalId, reviewContentId, nextBtnId) {
  modal = document.getElementById(modalId);
  closeModal = document.getElementById(closeModalId);
  reviewContent = document.getElementById(reviewContentId);
  nextVocabBtn = document.getElementById(nextBtnId);

  // Add event listeners for modal actions
  closeModal.addEventListener("click", hideLearnModal);
  window.addEventListener("click", (e) => {
    if (e.target === modal) hideLearnModal();
  });
  nextVocabBtn.addEventListener("click", nextVocab);
}

// Show Learn Modal
function showLearnModal(vocabList) {
  if (vocabList.length === 0) {
    alert("No vocab to review right now!");
    return;
  }

  vocabListToReview = vocabList;
  currentReviewIndex = 0;
  displayVocabToReview(vocabListToReview[currentReviewIndex]);
  modal.style.display = "flex";
}

// Hide Learn Modal
function hideLearnModal() {
  modal.style.display = "none";
}

// Display Next Vocabulary
function nextVocab() {
  currentReviewIndex += 1;
  if (currentReviewIndex < vocabListToReview.length) {
    displayVocabToReview(vocabListToReview[currentReviewIndex]);
  } else {
    alert("Review completed!");
    hideLearnModal();
  }
}

// Display a Single Vocabulary in the Modal
function displayVocabToReview(vocabItem) {
  reviewContent.innerHTML = `
    <p>
      <strong>Word:</strong> 
      <span class="speak-icon" onclick="speak(event)" data-word="${
        vocabItem.text
      }">
        ${vocabItem.text}🔊
      </span>
    </p>
    ${
      vocabItem.pronunciation
        ? `<strong>Pronunciation:</strong> ${vocabItem.pronunciation}</p>`
        : ""
    }<p>
    <p><strong>Translation:</strong> ${vocabItem.translations.join(", ")}</p>
    <strong>Description:</strong>
    <p style="text-align: left; white-space: pre-line; overflow-wrap: break-word;">
    <ul>
    ${vocabItem.description
      .split("\n")
      .map(
        (item) =>
          `<li><span class="speak-icon" data-word="${item}" onclick="speak(event)">${item}🔊</span></li>`
      )
      .join("\n")}</p>
    ${
      vocabItem.imageUrl
        ? `<img src="${vocabItem.imageUrl}" alt="Image" style="max-width: 100px; max-height: 100px; height: auto; width: auto; margin-top: 10px;" />`
        : ""
    }
    
    </ul>
  `;

  // Enable text-to-speech functionality for displayed word
  if (typeof makeWordsSpeakable === "function") {
    makeWordsSpeakable();
  }
}

// Expose functions globally
window.initLearnModal = initLearnModal;
window.showLearnModal = showLearnModal;
