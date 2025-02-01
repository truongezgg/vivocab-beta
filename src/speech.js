const synth = window.speechSynthesis; // Speech synthesis API

let voices = [];
let speechRate = 1.0;

/* ------------------ Load Available Voices ------------------ */
// Loads voices into memory and ensures compatibility across browsers
function loadVoices() {
  voices = synth.getVoices();
}

// Ensure voices load properly, especially for Chrome
if ("onvoiceschanged" in synth) {
  synth.onvoiceschanged = loadVoices;
} else {
  loadVoices();
}

/* ------------------ Speak Text Function ------------------ */
// Speaks the provided text using the selected voice
function speakText(text) {
  if (!text) return;

  // Stop any ongoing speech
  if (synth.speaking || synth.pending) {
    synth.cancel();
  }

  const utterance = new SpeechSynthesisUtterance(text);

  // Get the selected voice index from local storage
  const savedVoiceIndex = localStorage.getItem("selectedVoiceIndex");
  const selectedVoiceIndex = savedVoiceIndex
    ? parseInt(savedVoiceIndex, 10)
    : parseInt(document.getElementById("voice-selector").value, 10);

  if (voices.length > 0) {
    utterance.voice = voices[selectedVoiceIndex || 0]; // Use the selected voice
  }

  utterance.rate = speechRate;

  synth.speak(utterance);
}

function speak(event) {
  const text = event.target.getAttribute("data-word");
  if (!text) return;

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.voice = voices[localStorage.getItem("selectedVoiceIndex") || 0];
  utterance.rate = speechRate;
  synth.speak(utterance);
}

/* ------------------ Make Words Speakable ------------------ */
// Adds click-to-speak functionality to elements with the class "speak-icon"
function makeWordsSpeakable() {
  const speakIcons = document.querySelectorAll(".speak-icon");

  speakIcons.forEach((icon) => {
    // icon.style.cursor = "pointer";
    // icon.addEventListener(
    //   "click",
    //   (e) => {
    //     const word =
    //       e.target.dataset.word || e.target.parentElement.dataset.word;
    //     if (word) {
    //       speakText(word);
    //     }
    //   },
    //   { once: true }
    // );
  });
}

function loadVoices() {
  voices = synth.getVoices();

  const voiceSelector = document.getElementById("voice-selector");
  voiceSelector.innerHTML = voices
    .map(
      (voice, index) =>
        `<option value="${index}">${voice.name} (${voice.lang})</option>`
    )
    .join("");

  // Retrieve the saved voice index from local storage
  const savedVoiceIndex = localStorage.getItem("selectedVoiceIndex");
  if (savedVoiceIndex && voices[savedVoiceIndex]) {
    voiceSelector.value = savedVoiceIndex;
  } else {
    const samantha = voices.findIndex((item) => {
      return item.name.toLowerCase().includes("samantha");
    });
    const google = voices.findIndex((item) => {
      return item.name.toLowerCase().includes("google us");
    });
    const enUs = voices.findIndex((item) => {
      return item.lang.toLowerCase().includes("en-us");
    });
    const enUk = voices.findIndex((item) => {
      return item.lang.toLowerCase().includes("en-uk");
    });
    const index = (() => {
      if (google >= 0) return google;
      if (samantha >= 0) return samantha;
      if (enUs >= 0) return enUs;
      if (enUk >= 0) return enUk;
      return 0;
    })();
    voiceSelector.value = index || 0; // Default to the first voice
  }
}

document.getElementById("voice-selector").addEventListener("change", (e) => {
  const selectedVoiceIndex = e.target.value;
  localStorage.setItem("selectedVoiceIndex", selectedVoiceIndex);
});

if ("onvoiceschanged" in synth) {
  synth.onvoiceschanged = loadVoices;
} else {
  loadVoices();
}

/* ------------------ Attach Global Function ------------------ */
// Expose functions globally for integration
window.makeWordsSpeakable = makeWordsSpeakable;
window.speakText = speakText;
window.speak = speak;

// Load voices on script initialization
loadVoices();

function updateSpeechRate(rate) {
  speechRate = rate;
  localStorage.setItem("speechRate", rate);
}

document.addEventListener("DOMContentLoaded", () => {
  const speechRateInput = document.getElementById("speech-rate");
  const speechRateValue = document.getElementById("speech-rate-value");

  // Load saved speech rate
  const savedRate = localStorage.getItem("speechRate");
  if (savedRate) {
    speechRate = parseFloat(savedRate);
    speechRateInput.value = speechRate;
    speechRateValue.textContent = `${speechRate.toFixed(1)}x`;
  }

  speechRateInput.addEventListener("input", (e) => {
    const rate = parseFloat(e.target.value);
    speechRateValue.textContent = `${rate.toFixed(1)}x`;
    updateSpeechRate(rate);
  });
});
