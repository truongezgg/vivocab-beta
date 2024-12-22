document.addEventListener("DOMContentLoaded", () => {
  const lessonModal = document.querySelector(".modal-lession");
  const closeModalButton = document.getElementById("close-modal");
  const lessonWords = document.getElementById("lesson-words");
  const lessonTitle = document.getElementById("lesson-title");
  const lessonDescription = document.getElementById("lesson-description");
  const importWordsBtn = document.getElementById("import-words-btn");

  let selectedLesson = null;

  // Open Modal for Specific Lesson
  function openLessonModal(lesson) {
    lessonTitle.textContent = lesson.name;
    lessonDescription.textContent = lesson.description;
    // >${vocabText}🔊
    // Populate the word list
    lessonWords.innerHTML = lesson.vocabularies
      .map((word) => {
        const speak = ` class="speak-icon" onclick="speak(event)" data-word="${word.text}"`;
        return `<li><strong ${speak}>${word.text}</strong>
            <span ${speak}>🔊</span>(${
          word.pronunciation
        }): (${word.translations.join(", ")}) - ${word.description
          .split("\n")
          .map((item) => {
            return `<span class="speak-icon" onclick="speak(event)" data-word="${item}">${item}🔊</span>`;
          })
          .join("<br>")}</li>`;
      })
      .join("");

    selectedLesson = lesson;
    lessonModal.classList.add("show");
  }

  // Close Modal
  closeModalButton.addEventListener("click", () => {
    lessonModal.classList.remove("show");
  });

  // Import Words into Database
  importWordsBtn.addEventListener("click", () => {
    if (!selectedLesson) return;

    const vocab = new Vocab();
    selectedLesson.vocabularies.forEach((word) => {
      word.createdAt = Date.now();
      word.level = Level.ZERO;
      word.lastReviewAt = Date.now();
      word.shouldReviewAfter = Date.now();
      return vocab.add(word);
    });

    alert("Words imported successfully!");
    lessonModal.classList.remove("show");
  });

  // Add Event Listener to Lesson Buttons
  function attachLessonClickListeners() {
    const viewButtons = document.querySelectorAll(".view-lesson-btn");
    viewButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        const lessonId = e.target.getAttribute("data-id");
        const lesson = LessionStore.lessons.find((l) => l.id === lessonId);

        if (lesson) openLessonModal(lesson);
      });
    });
  }

  // Load Lessons into the List
  async function renderLessons() {
    try {
      await LessionStore.loadFromFile();
      const lessons = LessionStore.getLessions();

      const lessonsContainer = document.getElementById("lessons-container");
      lessonsContainer.innerHTML = lessons
        .map(
          (lesson) => `
            <div class="lesson-item">
              <h3>${lesson.name}</h3>
              <p>${lesson.description}</p>
              <p>${lesson.vocabularies.map((item) => item.text).join(", ")}</p>

              <button class="view-lesson-btn" data-id="${
                lesson.id
              }">View</button>
            </div>
          `
        )
        .join("");

      attachLessonClickListeners();
    } catch (error) {
      console.error("Error loading lessons:", error);
    }
  }

  // Render lessons on tab activation
  document
    .querySelector("[data-tab='lessions']")
    .addEventListener("click", renderLessons);
});

class LessionStore {
  static async loadFromFile() {
    // const response = await fetch(url);
    // if (!response.ok) {
    //   throw new Error("Failed to load lessons.");
    // }
    // this.lessons = await response.json();
    this.lessons = this.getLessions();
  }

  static getLessions() {
    return [
      {
        id: "1",
        name: "Basic Vocabulary 1",
        description: "Learn essential basic words for communication.",
        vocabularies: [
          {
            id: "101",
            type: "verb",
            pronunciation: "/rʌn/",
            text: "run",
            translations: ["chạy"],
            description:
              "To move quickly on foot.\nHe runs fast.\nI run every day.\nI don't want to run.",
            createdAt: 1691234567890,
            level: 1,
            lastReviewAt: 1691234567890,
            shouldReviewAfter: 1691240000000,
            isSendNotification: true,
          },
          {
            id: "102",
            type: "verb",
            pronunciation: "/iːt/",
            text: "eat",
            translations: ["ăn"],
            description:
              "To consume food.\nI eat breakfast.\nShe eats apples.\nWe eat together.",
            createdAt: 1691234567891,
            level: 1,
            lastReviewAt: 1691234567891,
            shouldReviewAfter: 1691240000001,
            isSendNotification: true,
          },
          {
            id: "103",
            type: "verb",
            pronunciation: "/sliːp/",
            text: "sleep",
            translations: ["ngủ"],
            description:
              "To rest with eyes closed.\nHe sleeps late.\nI sleep early.\nWe sleep at 10 PM.",
            createdAt: 1691234567892,
            level: 1,
            lastReviewAt: 1691234567892,
            shouldReviewAfter: 1691240000002,
            isSendNotification: true,
          },
          {
            id: "104",
            type: "verb",
            pronunciation: "/riːd/",
            text: "read",
            translations: ["đọc"],
            description:
              "To look at and comprehend written words.\nI read books.\nShe reads the newspaper.\nWe read together.",
            createdAt: 1691234567893,
            level: 1,
            lastReviewAt: 1691234567893,
            shouldReviewAfter: 1691240000003,
            isSendNotification: true,
          },
          {
            id: "105",
            type: "verb",
            pronunciation: "/rɪt/",
            text: "write",
            translations: ["viết"],
            description:
              "To create text.\nI write letters.\nShe writes stories.\nWe write essays.",
            createdAt: 1691234567894,
            level: 1,
            lastReviewAt: 1691234567894,
            shouldReviewAfter: 1691240000004,
            isSendNotification: true,
          },
          {
            id: "106",
            type: "verb",
            pronunciation: "/drɪŋk/",
            text: "drink",
            translations: ["uống"],
            description:
              "To consume liquid.\nI drink water.\nShe drinks coffee.\nWe drink tea together.",
            createdAt: 1691234567895,
            level: 1,
            lastReviewAt: 1691234567895,
            shouldReviewAfter: 1691240000005,
            isSendNotification: true,
          },
          {
            id: "107",
            type: "verb",
            pronunciation: "/tɔːk/",
            text: "talk",
            translations: ["nói chuyện"],
            description:
              "To speak with someone.\nWe talk a lot.\nI talk to my mom.\nThey talk every day.",
            createdAt: 1691234567896,
            level: 1,
            lastReviewAt: 1691234567896,
            shouldReviewAfter: 1691240000006,
            isSendNotification: true,
          },
          {
            id: "108",
            type: "verb",
            pronunciation: "/lɪsən/",
            text: "listen",
            translations: ["nghe"],
            description:
              "To give attention to sound.\nI listen to music.\nHe listens carefully.\nWe listen in class.",
            createdAt: 1691234567897,
            level: 1,
            lastReviewAt: 1691234567897,
            shouldReviewAfter: 1691240000007,
            isSendNotification: true,
          },
          {
            id: "109",
            type: "verb",
            pronunciation: "/lʊk/",
            text: "look",
            translations: ["nhìn"],
            description:
              "To direct your eyes at something.\nI look at the sky.\nShe looks happy.\nWe look around.",
            createdAt: 1691234567898,
            level: 1,
            lastReviewAt: 1691234567898,
            shouldReviewAfter: 1691240000008,
            isSendNotification: true,
          },
          {
            id: "110",
            type: "verb",
            pronunciation: "/sɪt/",
            text: "sit",
            translations: ["ngồi"],
            description:
              "To rest with your body supported by your buttocks.\nI sit on the chair.\nShe sits next to me.\nWe sit in the park.",
            createdAt: 1691234567899,
            level: 1,
            lastReviewAt: 1691234567899,
            shouldReviewAfter: 1691240000009,
            isSendNotification: true,
          },
        ],
      },
      {
        id: "2",
        name: "Basic Vocabulary 2",
        description: "Learn essential words for everyday actions.",
        vocabularies: [
          {
            id: "201",
            type: "verb",
            pronunciation: "/wɔːk/",
            text: "walk",
            translations: ["đi bộ"],
            description:
              "To move on foot.\nI walk to school.\nShe walks every morning.\nWe walk together.",
            createdAt: 1691234577890,
            level: 1,
            lastReviewAt: 1691234577890,
            shouldReviewAfter: 1691240000000,
            isSendNotification: true,
          },
          {
            id: "202",
            type: "verb",
            pronunciation: "/smail/",
            text: "smile",
            translations: ["cười"],
            description:
              "To show happiness with your mouth.\nI smile at her.\nHe smiles often.\nWe smile together.",
            createdAt: 1691234577891,
            level: 1,
            lastReviewAt: 1691234577891,
            shouldReviewAfter: 1691240000001,
            isSendNotification: true,
          },
          {
            id: "203",
            type: "verb",
            pronunciation: "/pleɪ/",
            text: "play",
            translations: ["chơi"],
            description:
              "To engage in a game or activity.\nI play soccer.\nShe plays the piano.\nWe play every day.",
            createdAt: 1691234577892,
            level: 1,
            lastReviewAt: 1691234577892,
            shouldReviewAfter: 1691240000002,
            isSendNotification: true,
          },
          {
            id: "204",
            type: "verb",
            pronunciation: "/ʃaʊt/",
            text: "shout",
            translations: ["la hét"],
            description:
              "To speak loudly.\nI shout for help.\nHe shouts at the game.\nThey shout together.",
            createdAt: 1691234577893,
            level: 1,
            lastReviewAt: 1691234577893,
            shouldReviewAfter: 1691240000003,
            isSendNotification: true,
          },
          {
            id: "205",
            type: "verb",
            pronunciation: "/læf/",
            text: "laugh",
            translations: ["cười lớn"],
            description:
              "To express joy with sound.\nI laugh at jokes.\nShe laughs loudly.\nWe laugh together.",
            createdAt: 1691234577894,
            level: 1,
            lastReviewAt: 1691234577894,
            shouldReviewAfter: 1691240000004,
            isSendNotification: true,
          },
          {
            id: "206",
            type: "verb",
            pronunciation: "/kraɪ/",
            text: "cry",
            translations: ["khóc"],
            description:
              "To shed tears.\nI cry when I’m sad.\nShe cries silently.\nThey cry together.",
            createdAt: 1691234577895,
            level: 1,
            lastReviewAt: 1691234577895,
            shouldReviewAfter: 1691240000005,
            isSendNotification: true,
          },
          {
            id: "207",
            type: "verb",
            pronunciation: "/hɪt/",
            text: "hit",
            translations: ["đánh"],
            description:
              "To strike something.\nI hit the ball.\nHe hits the wall.\nThey hit each other.",
            createdAt: 1691234577896,
            level: 1,
            lastReviewAt: 1691234577896,
            shouldReviewAfter: 1691240000006,
            isSendNotification: true,
          },
          {
            id: "208",
            type: "verb",
            pronunciation: "/læɪ/",
            text: "lay",
            translations: ["đặt nằm"],
            description:
              "To put something down.\nI lay the book down.\nHe lays the baby to sleep.\nThey lay the table.",
            createdAt: 1691234577897,
            level: 1,
            lastReviewAt: 1691234577897,
            shouldReviewAfter: 1691240000007,
            isSendNotification: true,
          },
          {
            id: "209",
            type: "verb",
            pronunciation: "/peɪ/",
            text: "pay",
            translations: ["trả tiền"],
            description:
              "To give money for something.\nI pay the bill.\nHe pays for the meal.\nThey pay attention.",
            createdAt: 1691234577898,
            level: 1,
            lastReviewAt: 1691234577898,
            shouldReviewAfter: 1691240000008,
            isSendNotification: true,
          },
          {
            id: "210",
            type: "verb",
            pronunciation: "/ɡɪv/",
            text: "give",
            translations: ["đưa"],
            description:
              "To provide something to someone.\nI give a gift.\nHe gives advice.\nThey give generously.",
            createdAt: 1691234577899,
            level: 1,
            lastReviewAt: 1691234577899,
            shouldReviewAfter: 1691240000009,
            isSendNotification: true,
          },
        ],
      },
      {
        id: "3",
        name: "Basic Vocabulary 3",
        description: "Expand your vocabulary with more essential verbs.",
        vocabularies: [
          {
            id: "301",
            type: "verb",
            pronunciation: "/əˈsk/",
            text: "ask",
            translations: ["hỏi"],
            description:
              "To request information.\nI ask questions.\nHe asks for help.\nThey ask frequently.",
            createdAt: 1691234587890,
            level: 1,
            lastReviewAt: 1691234587890,
            shouldReviewAfter: 1691240000000,
            isSendNotification: true,
          },
          {
            id: "302",
            type: "verb",
            pronunciation: "/ənˈswɜːr/",
            text: "answer",
            translations: ["trả lời"],
            description:
              "To reply to a question.\nI answer the phone.\nHe answers quickly.\nThey answer correctly.",
            createdAt: 1691234587891,
            level: 1,
            lastReviewAt: 1691234587891,
            shouldReviewAfter: 1691240000001,
            isSendNotification: true,
          },
          {
            id: "303",
            type: "verb",
            pronunciation: "/ˈtel/",
            text: "tell",
            translations: ["nói"],
            description:
              "To give information.\nI tell stories.\nShe tells the truth.\nThey tell jokes.",
            createdAt: 1691234587892,
            level: 1,
            lastReviewAt: 1691234587892,
            shouldReviewAfter: 1691240000002,
            isSendNotification: true,
          },
          {
            id: "304",
            type: "verb",
            pronunciation: "/bɪˈliːv/",
            text: "believe",
            translations: ["tin tưởng"],
            description:
              "To accept as true.\nI believe in you.\nShe believes in hard work.\nWe believe together.",
            createdAt: 1691234587893,
            level: 1,
            lastReviewAt: 1691234587893,
            shouldReviewAfter: 1691240000003,
            isSendNotification: true,
          },
          {
            id: "305",
            type: "verb",
            pronunciation: "/sɪŋ/",
            text: "sing",
            translations: ["hát"],
            description:
              "To produce musical sounds with your voice.\nI sing songs.\nShe sings beautifully.\nWe sing every day.",
            createdAt: 1691234587894,
            level: 1,
            lastReviewAt: 1691234587894,
            shouldReviewAfter: 1691240000004,
            isSendNotification: true,
          },
          {
            id: "306",
            type: "verb",
            pronunciation: "/θɪŋk/",
            text: "think",
            translations: ["nghĩ"],
            description:
              "To use your mind to consider something.\nI think about it.\nHe thinks too much.\nThey think it's easy.",
            createdAt: 1691234587895,
            level: 1,
            lastReviewAt: 1691234587895,
            shouldReviewAfter: 1691240000005,
            isSendNotification: true,
          },
          {
            id: "307",
            type: "verb",
            pronunciation: "/meɪk/",
            text: "make",
            translations: ["làm"],
            description:
              "To create or produce something.\nI make dinner.\nShe makes mistakes.\nThey make noise.",
            createdAt: 1691234587896,
            level: 1,
            lastReviewAt: 1691234587896,
            shouldReviewAfter: 1691240000006,
            isSendNotification: true,
          },
          {
            id: "308",
            type: "verb",
            pronunciation: "/ɡet/",
            text: "get",
            translations: ["nhận"],
            description:
              "To obtain or receive something.\nI get presents.\nShe gets good grades.\nWe get along well.",
            createdAt: 1691234587897,
            level: 1,
            lastReviewAt: 1691234587897,
            shouldReviewAfter: 1691240000007,
            isSendNotification: true,
          },
          {
            id: "309",
            type: "verb",
            pronunciation: "/briːŋ/",
            text: "bring",
            translations: ["mang"],
            description:
              "To carry or move something to a place.\nI bring food.\nHe brings gifts.\nThey bring joy.",
            createdAt: 1691234587898,
            level: 1,
            lastReviewAt: 1691234587898,
            shouldReviewAfter: 1691240000008,
            isSendNotification: true,
          },
          {
            id: "310",
            type: "verb",
            pronunciation: "/hæv/",
            text: "have",
            translations: ["có"],
            description:
              "To own or hold something.\nI have a car.\nHe has a dog.\nWe have fun together.",
            createdAt: 1691234587899,
            level: 1,
            lastReviewAt: 1691234587899,
            shouldReviewAfter: 1691240000009,
            isSendNotification: true,
          },
        ],
      },
      {
        id: "4",
        name: "Basic Vocabulary 4",
        description: "Learn actions related to daily tasks.",
        vocabularies: [
          {
            id: "401",
            type: "verb",
            pronunciation: "/oʊpən/",
            text: "open",
            translations: ["mở"],
            description:
              "To move to make something accessible.\nI open the door.\nShe opens the box.\nThey open their hearts.",
            createdAt: 1691234597890,
            level: 1,
            lastReviewAt: 1691234597890,
            shouldReviewAfter: 1691240000000,
            isSendNotification: true,
          },
          {
            id: "402",
            type: "verb",
            pronunciation: "/kləʊz/",
            text: "close",
            translations: ["đóng"],
            description:
              "To shut or make inaccessible.\nI close the window.\nShe closes the door.\nThey close the meeting.",
            createdAt: 1691234597891,
            level: 1,
            lastReviewAt: 1691234597891,
            shouldReviewAfter: 1691240000001,
            isSendNotification: true,
          },
          {
            id: "403",
            type: "verb",
            pronunciation: "/pʊt/",
            text: "put",
            translations: ["đặt"],
            description:
              "To place something somewhere.\nI put the book on the table.\nShe puts her bag down.\nThey put it away.",
            createdAt: 1691234597892,
            level: 1,
            lastReviewAt: 1691234597892,
            shouldReviewAfter: 1691240000002,
            isSendNotification: true,
          },
          {
            id: "404",
            type: "verb",
            pronunciation: "/steɪ/",
            text: "stay",
            translations: ["ở lại"],
            description:
              "To remain in one place.\nI stay at home.\nHe stays calm.\nThey stay together.",
            createdAt: 1691234597893,
            level: 1,
            lastReviewAt: 1691234597893,
            shouldReviewAfter: 1691240000003,
            isSendNotification: true,
          },
          {
            id: "405",
            type: "verb",
            pronunciation: "/liːv/",
            text: "leave",
            translations: ["rời khỏi"],
            description:
              "To go away from a place.\nI leave work at 5 PM.\nShe leaves early.\nThey leave together.",
            createdAt: 1691234597894,
            level: 1,
            lastReviewAt: 1691234597894,
            shouldReviewAfter: 1691240000004,
            isSendNotification: true,
          },
          {
            id: "406",
            type: "verb",
            pronunciation: "/hɪər/",
            text: "hear",
            translations: ["nghe thấy"],
            description:
              "To perceive sound.\nI hear music.\nShe hears voices.\nThey hear the news.",
            createdAt: 1691234597895,
            level: 1,
            lastReviewAt: 1691234597895,
            shouldReviewAfter: 1691240000005,
            isSendNotification: true,
          },
          {
            id: "407",
            type: "verb",
            pronunciation: "/ʃəʊ/",
            text: "show",
            translations: ["chỉ"],
            description:
              "To present something.\nI show my ID.\nHe shows his work.\nThey show their emotions.",
            createdAt: 1691234597896,
            level: 1,
            lastReviewAt: 1691234597896,
            shouldReviewAfter: 1691240000006,
            isSendNotification: true,
          },
          {
            id: "408",
            type: "verb",
            pronunciation: "/ruːn/",
            text: "run",
            translations: ["chạy"],
            description:
              "To move quickly on foot.\nI run daily.\nShe runs fast.\nWe run in the park.",
            createdAt: 1691234597897,
            level: 1,
            lastReviewAt: 1691234597897,
            shouldReviewAfter: 1691240000007,
            isSendNotification: true,
          },
          {
            id: "409",
            type: "verb",
            pronunciation: "/swɪm/",
            text: "swim",
            translations: ["bơi"],
            description:
              "To move through water.\nI swim in the pool.\nShe swims well.\nWe swim together.",
            createdAt: 1691234597898,
            level: 1,
            lastReviewAt: 1691234597898,
            shouldReviewAfter: 1691240000008,
            isSendNotification: true,
          },
          {
            id: "410",
            type: "verb",
            pronunciation: "/pænt/",
            text: "pant",
            translations: ["thở hổn hển"],
            description:
              "To breathe heavily.\nI pant after running.\nHe pants in the heat.\nThey pant from exercise.",
            createdAt: 1691234597899,
            level: 1,
            lastReviewAt: 1691234597899,
            shouldReviewAfter: 1691240000009,
            isSendNotification: true,
          },
        ],
      },
      {
        id: "5",
        name: "Basic Vocabulary 5",
        description: "Learn common verbs for actions and emotions.",
        vocabularies: [
          {
            id: "501",
            type: "verb",
            pronunciation: "/ˈkʊk/",
            text: "cook",
            translations: ["nấu ăn"],
            description:
              "To prepare food by heating it.\nI cook dinner.\nShe cooks well.\nThey cook every evening.",
            createdAt: 1691234607890,
            level: 1,
            lastReviewAt: 1691234607890,
            shouldReviewAfter: 1691240000000,
            isSendNotification: true,
          },
          {
            id: "502",
            type: "verb",
            pronunciation: "/ˈdʳɪŋk/",
            text: "drink",
            translations: ["uống"],
            description:
              "To consume liquid.\nI drink coffee.\nHe drinks water.\nWe drink juice every day.",
            createdAt: 1691234607891,
            level: 1,
            lastReviewAt: 1691234607891,
            shouldReviewAfter: 1691240000001,
            isSendNotification: true,
          },
          {
            id: "503",
            type: "verb",
            pronunciation: "/rɪˈmɛmbər/",
            text: "remember",
            translations: ["nhớ"],
            description:
              "To recall something.\nI remember his name.\nShe remembers her childhood.\nThey remember the story.",
            createdAt: 1691234607892,
            level: 1,
            lastReviewAt: 1691234607892,
            shouldReviewAfter: 1691240000002,
            isSendNotification: true,
          },
          {
            id: "504",
            type: "verb",
            pronunciation: "/ˈfoʊrɡɛt/",
            text: "forget",
            translations: ["quên"],
            description:
              "To not recall something.\nI forget birthdays.\nShe forgets her keys.\nWe forget important dates.",
            createdAt: 1691234607893,
            level: 1,
            lastReviewAt: 1691234607893,
            shouldReviewAfter: 1691240000003,
            isSendNotification: true,
          },
          {
            id: "505",
            type: "verb",
            pronunciation: "/ˈstænd/",
            text: "stand",
            translations: ["đứng"],
            description:
              "To be upright on your feet.\nI stand in line.\nHe stands at the corner.\nThey stand together.",
            createdAt: 1691234607894,
            level: 1,
            lastReviewAt: 1691234607894,
            shouldReviewAfter: 1691240000004,
            isSendNotification: true,
          },
          {
            id: "506",
            type: "verb",
            pronunciation: "/ˈsɪt/",
            text: "sit",
            translations: ["ngồi"],
            description:
              "To rest on a chair or surface.\nI sit on the couch.\nShe sits next to me.\nWe sit in the park.",
            createdAt: 1691234607895,
            level: 1,
            lastReviewAt: 1691234607895,
            shouldReviewAfter: 1691240000005,
            isSendNotification: true,
          },
          {
            id: "507",
            type: "verb",
            pronunciation: "/ˈlæɪ/",
            text: "lie",
            translations: ["nằm"],
            description:
              "To rest in a horizontal position.\nI lie on the bed.\nShe lies on the couch.\nThey lie in the grass.",
            createdAt: 1691234607896,
            level: 1,
            lastReviewAt: 1691234607896,
            shouldReviewAfter: 1691240000006,
            isSendNotification: true,
          },
          {
            id: "508",
            type: "verb",
            pronunciation: "/ˈsliːp/",
            text: "sleep",
            translations: ["ngủ"],
            description:
              "To rest with your eyes closed.\nI sleep at night.\nShe sleeps well.\nThey sleep peacefully.",
            createdAt: 1691234607897,
            level: 1,
            lastReviewAt: 1691234607897,
            shouldReviewAfter: 1691240000007,
            isSendNotification: true,
          },
          {
            id: "509",
            type: "verb",
            pronunciation: "/ˈtiːtʃ/",
            text: "teach",
            translations: ["dạy"],
            description:
              "To help someone learn.\nI teach students.\nHe teaches math.\nThey teach together.",
            createdAt: 1691234607898,
            level: 1,
            lastReviewAt: 1691234607898,
            shouldReviewAfter: 1691240000008,
            isSendNotification: true,
          },
          {
            id: "510",
            type: "verb",
            pronunciation: "/ˈlɜːn/",
            text: "learn",
            translations: ["học"],
            description:
              "To gain knowledge or skill.\nI learn English.\nShe learns quickly.\nThey learn new things.",
            createdAt: 1691234607899,
            level: 1,
            lastReviewAt: 1691234607899,
            shouldReviewAfter: 1691240000009,
            isSendNotification: true,
          },
        ],
      },
      {
        id: "6",
        name: "Basic Vocabulary 6",
        description: "Explore more everyday actions and activities.",
        vocabularies: [
          {
            id: "601",
            type: "verb",
            pronunciation: "/ˈbaɪ/",
            text: "buy",
            translations: ["mua"],
            description:
              "To get something by paying money.\nI buy groceries.\nShe buys clothes.\nThey buy books.",
            createdAt: 1691234617890,
            level: 1,
            lastReviewAt: 1691234617890,
            shouldReviewAfter: 1691240000000,
            isSendNotification: true,
          },
          {
            id: "602",
            type: "verb",
            pronunciation: "/ˈsel/",
            text: "sell",
            translations: ["bán"],
            description:
              "To give something for money.\nI sell products.\nShe sells her car.\nThey sell houses.",
            createdAt: 1691234617891,
            level: 1,
            lastReviewAt: 1691234617891,
            shouldReviewAfter: 1691240000001,
            isSendNotification: true,
          },
          {
            id: "603",
            type: "verb",
            pronunciation: "/ˈkærɪ/",
            text: "carry",
            translations: ["mang"],
            description:
              "To move something with your hands.\nI carry the bag.\nHe carries boxes.\nThey carry heavy loads.",
            createdAt: 1691234617892,
            level: 1,
            lastReviewAt: 1691234617892,
            shouldReviewAfter: 1691240000002,
            isSendNotification: true,
          },
          {
            id: "604",
            type: "verb",
            pronunciation: "/ˈpʊl/",
            text: "pull",
            translations: ["kéo"],
            description:
              "To draw something closer.\nI pull the rope.\nShe pulls the drawer.\nThey pull the cart.",
            createdAt: 1691234617893,
            level: 1,
            lastReviewAt: 1691234617893,
            shouldReviewAfter: 1691240000003,
            isSendNotification: true,
          },
          {
            id: "605",
            type: "verb",
            pronunciation: "/ˈpuʃ/",
            text: "push",
            translations: ["đẩy"],
            description:
              "To move something away with force.\nI push the door.\nHe pushes the cart.\nThey push together.",
            createdAt: 1691234617894,
            level: 1,
            lastReviewAt: 1691234617894,
            shouldReviewAfter: 1691240000004,
            isSendNotification: true,
          },
          {
            id: "606",
            type: "verb",
            pronunciation: "/ˈklaɪm/",
            text: "climb",
            translations: ["leo"],
            description:
              "To go up something.\nI climb the stairs.\nShe climbs mountains.\nThey climb the tree.",
            createdAt: 1691234617895,
            level: 1,
            lastReviewAt: 1691234617895,
            shouldReviewAfter: 1691240000005,
            isSendNotification: true,
          },
          {
            id: "607",
            type: "verb",
            pronunciation: "/ˈfɔːl/",
            text: "fall",
            translations: ["ngã"],
            description:
              "To move downward suddenly.\nI fall often.\nShe falls on ice.\nThey fall together.",
            createdAt: 1691234617896,
            level: 1,
            lastReviewAt: 1691234617896,
            shouldReviewAfter: 1691240000006,
            isSendNotification: true,
          },
          {
            id: "608",
            type: "verb",
            pronunciation: "/ˈrɛst/",
            text: "rest",
            translations: ["nghỉ ngơi"],
            description:
              "To take a break.\nI rest at noon.\nHe rests after work.\nThey rest together.",
            createdAt: 1691234617897,
            level: 1,
            lastReviewAt: 1691234617897,
            shouldReviewAfter: 1691240000007,
            isSendNotification: true,
          },
          {
            id: "609",
            type: "verb",
            pronunciation: "/ˈluːk/",
            text: "look",
            translations: ["nhìn"],
            description:
              "To direct your eyes at something.\nI look at the stars.\nShe looks at the picture.\nThey look around.",
            createdAt: 1691234617898,
            level: 1,
            lastReviewAt: 1691234617898,
            shouldReviewAfter: 1691240000008,
            isSendNotification: true,
          },
          {
            id: "610",
            type: "verb",
            pronunciation: "/ˈsɪŋ/",
            text: "sing",
            translations: ["hát"],
            description:
              "To produce musical sounds with your voice.\nI sing every morning.\nShe sings well.\nWe sing together.",
            createdAt: 1691234617899,
            level: 1,
            lastReviewAt: 1691234617899,
            shouldReviewAfter: 1691240000009,
            isSendNotification: true,
          },
        ],
      },
      {
        id: "7",
        name: "Basic Vocabulary 7",
        description: "Learn more action verbs for daily use.",
        vocabularies: [
          {
            id: "701",
            type: "verb",
            pronunciation: "/ˈwɜːrk/",
            text: "work",
            translations: ["làm việc"],
            description:
              "To do a job or task.\nI work from home.\nShe works as a teacher.\nThey work on a project.",
            createdAt: 1691234627890,
            level: 1,
            lastReviewAt: 1691234627890,
            shouldReviewAfter: 1691240000000,
            isSendNotification: true,
          },
          {
            id: "702",
            type: "verb",
            pronunciation: "/ˈplæn/",
            text: "plan",
            translations: ["lên kế hoạch"],
            description:
              "To decide or arrange something.\nI plan my trip.\nShe plans her schedule.\nThey plan carefully.",
            createdAt: 1691234627891,
            level: 1,
            lastReviewAt: 1691234627891,
            shouldReviewAfter: 1691240000001,
            isSendNotification: true,
          },
          {
            id: "703",
            type: "verb",
            pronunciation: "/ˈstɑːrt/",
            text: "start",
            translations: ["bắt đầu"],
            description:
              "To begin something.\nI start my homework.\nShe starts the car.\nWe start the project.",
            createdAt: 1691234627892,
            level: 1,
            lastReviewAt: 1691234627892,
            shouldReviewAfter: 1691240000002,
            isSendNotification: true,
          },
          {
            id: "704",
            type: "verb",
            pronunciation: "/ˈɛnd/",
            text: "end",
            translations: ["kết thúc"],
            description:
              "To finish something.\nI end my day with reading.\nShe ends her talk.\nWe end the meeting.",
            createdAt: 1691234627893,
            level: 1,
            lastReviewAt: 1691234627893,
            shouldReviewAfter: 1691240000003,
            isSendNotification: true,
          },
          {
            id: "705",
            type: "verb",
            pronunciation: "/ˈkʌt/",
            text: "cut",
            translations: ["cắt"],
            description:
              "To divide something using a sharp tool.\nI cut the paper.\nShe cuts vegetables.\nThey cut their hair.",
            createdAt: 1691234627894,
            level: 1,
            lastReviewAt: 1691234627894,
            shouldReviewAfter: 1691240000004,
            isSendNotification: true,
          },
          {
            id: "706",
            type: "verb",
            pronunciation: "/ˈklɪn/",
            text: "clean",
            translations: ["dọn dẹp"],
            description:
              "To make something free from dirt.\nI clean the room.\nShe cleans the dishes.\nThey clean the house.",
            createdAt: 1691234627895,
            level: 1,
            lastReviewAt: 1691234627895,
            shouldReviewAfter: 1691240000005,
            isSendNotification: true,
          },
          {
            id: "707",
            type: "verb",
            pronunciation: "/ˈbɪld/",
            text: "build",
            translations: ["xây dựng"],
            description:
              "To construct something.\nI build a house.\nShe builds a model.\nThey build together.",
            createdAt: 1691234627896,
            level: 1,
            lastReviewAt: 1691234627896,
            shouldReviewAfter: 1691240000006,
            isSendNotification: true,
          },
          {
            id: "708",
            type: "verb",
            pronunciation: "/ˈhɛlp/",
            text: "help",
            translations: ["giúp đỡ"],
            description:
              "To assist someone.\nI help my friend.\nShe helps her mother.\nThey help each other.",
            createdAt: 1691234627897,
            level: 1,
            lastReviewAt: 1691234627897,
            shouldReviewAfter: 1691240000007,
            isSendNotification: true,
          },
          {
            id: "709",
            type: "verb",
            pronunciation: "/ˈseɪv/",
            text: "save",
            translations: ["tiết kiệm"],
            description:
              "To keep something for future use.\nI save money.\nShe saves documents.\nThey save energy.",
            createdAt: 1691234627898,
            level: 1,
            lastReviewAt: 1691234627898,
            shouldReviewAfter: 1691240000008,
            isSendNotification: true,
          },
          {
            id: "710",
            type: "verb",
            pronunciation: "/ˈwɪn/",
            text: "win",
            translations: ["chiến thắng"],
            description:
              "To achieve victory.\nI win the game.\nShe wins the race.\nThey win together.",
            createdAt: 1691234627899,
            level: 1,
            lastReviewAt: 1691234627899,
            shouldReviewAfter: 1691240000009,
            isSendNotification: true,
          },
        ],
      },
      {
        id: "8",
        name: "Basic Vocabulary 8",
        description: "Learn verbs for personal and professional life.",
        vocabularies: [
          {
            id: "801",
            type: "verb",
            pronunciation: "/ˈrɛd/",
            text: "read",
            translations: ["đọc"],
            description:
              "To look at and understand written text.\nI read books.\nShe reads magazines.\nThey read newspapers.",
            createdAt: 1691234637890,
            level: 1,
            lastReviewAt: 1691234637890,
            shouldReviewAfter: 1691240000000,
            isSendNotification: true,
          },
          {
            id: "802",
            type: "verb",
            pronunciation: "/ˈraɪt/",
            text: "write",
            translations: ["viết"],
            description:
              "To create text.\nI write letters.\nShe writes emails.\nThey write stories.",
            createdAt: 1691234637891,
            level: 1,
            lastReviewAt: 1691234637891,
            shouldReviewAfter: 1691240000001,
            isSendNotification: true,
          },
          {
            id: "803",
            type: "verb",
            pronunciation: "/ˈsteɪ/",
            text: "stay",
            translations: ["ở lại"],
            description:
              "To remain in a place.\nI stay at home.\nShe stays late.\nThey stay together.",
            createdAt: 1691234637892,
            level: 1,
            lastReviewAt: 1691234637892,
            shouldReviewAfter: 1691240000002,
            isSendNotification: true,
          },
          {
            id: "804",
            type: "verb",
            pronunciation: "/ˈmuːv/",
            text: "move",
            translations: ["di chuyển"],
            description:
              "To change position or location.\nI move to a new house.\nShe moves quickly.\nThey move together.",
            createdAt: 1691234637893,
            level: 1,
            lastReviewAt: 1691234637893,
            shouldReviewAfter: 1691240000003,
            isSendNotification: true,
          },
          {
            id: "805",
            type: "verb",
            pronunciation: "/ˈklɪk/",
            text: "click",
            translations: ["nhấp chuột"],
            description:
              "To press a button on a mouse or device.\nI click the link.\nShe clicks the icon.\nThey click to start.",
            createdAt: 1691234637894,
            level: 1,
            lastReviewAt: 1691234637894,
            shouldReviewAfter: 1691240000004,
            isSendNotification: true,
          },
          {
            id: "806",
            type: "verb",
            pronunciation: "/ˈoʊpən/",
            text: "open",
            translations: ["mở"],
            description:
              "To make something accessible.\nI open the door.\nShe opens her book.\nThey open the window.",
            createdAt: 1691234637895,
            level: 1,
            lastReviewAt: 1691234637895,
            shouldReviewAfter: 1691240000005,
            isSendNotification: true,
          },
          {
            id: "807",
            type: "verb",
            pronunciation: "/ˈkloʊz/",
            text: "close",
            translations: ["đóng"],
            description:
              "To shut or block access.\nI close the window.\nShe closes her laptop.\nThey close the store.",
            createdAt: 1691234637896,
            level: 1,
            lastReviewAt: 1691234637896,
            shouldReviewAfter: 1691240000006,
            isSendNotification: true,
          },
          {
            id: "808",
            type: "verb",
            pronunciation: "/ˈfiːl/",
            text: "feel",
            translations: ["cảm nhận"],
            description:
              "To experience an emotion or sensation.\nI feel happy.\nShe feels tired.\nThey feel excited.",
            createdAt: 1691234637897,
            level: 1,
            lastReviewAt: 1691234637897,
            shouldReviewAfter: 1691240000007,
            isSendNotification: true,
          },
          {
            id: "809",
            type: "verb",
            pronunciation: "/ˈwɒʃ/",
            text: "wash",
            translations: ["rửa"],
            description:
              "To clean something using water.\nI wash the dishes.\nShe washes her hands.\nThey wash the car.",
            createdAt: 1691234637898,
            level: 1,
            lastReviewAt: 1691234637898,
            shouldReviewAfter: 1691240000008,
            isSendNotification: true,
          },
          {
            id: "810",
            type: "verb",
            pronunciation: "/ˈpleɪ/",
            text: "play",
            translations: ["chơi"],
            description:
              "To engage in a game or activity.\nI play football.\nShe plays the piano.\nThey play together.",
            createdAt: 1691234637899,
            level: 1,
            lastReviewAt: 1691234637899,
            shouldReviewAfter: 1691240000009,
            isSendNotification: true,
          },
        ],
      },
      {
        id: "9",
        name: "Basic Vocabulary 9",
        description: "Learn more common verbs for daily life.",
        vocabularies: [
          {
            id: "901",
            type: "verb",
            pronunciation: "/ˈgəʊ/",
            text: "go",
            translations: ["đi"],
            description:
              "To move to a place.\nI go to school.\nShe goes to work.\nThey go on vacation.",
          },
          {
            id: "902",
            type: "verb",
            pronunciation: "/ˈkʌm/",
            text: "come",
            translations: ["đến"],
            description:
              "To move towards a place.\nI come home at 6 PM.\nShe comes to the party.\nThey come early.",
          },
          {
            id: "903",
            type: "verb",
            pronunciation: "/ˈʤʌmp/",
            text: "jump",
            translations: ["nhảy"],
            description:
              "To push yourself off the ground.\nI jump over the fence.\nShe jumps for joy.\nThey jump together.",
          },
          {
            id: "904",
            type: "verb",
            pronunciation: "/ˈspiːk/",
            text: "speak",
            translations: ["nói"],
            description:
              "To say words.\nI speak English.\nShe speaks softly.\nThey speak loudly.",
          },
          {
            id: "905",
            type: "verb",
            pronunciation: "/ˈkraɪ/",
            text: "cry",
            translations: ["khóc"],
            description:
              "To shed tears.\nI cry when I’m sad.\nShe cries during movies.\nThey cry together.",
          },
          {
            id: "906",
            type: "verb",
            pronunciation: "/ˈlæf/",
            text: "laugh",
            translations: ["cười lớn"],
            description:
              "To express happiness with sound.\nI laugh at jokes.\nShe laughs a lot.\nThey laugh together.",
          },
          {
            id: "907",
            type: "verb",
            pronunciation: "/ˈeɪt/",
            text: "eat",
            translations: ["ăn"],
            description:
              "To consume food.\nI eat breakfast.\nShe eats apples.\nWe eat lunch together.",
          },
          {
            id: "908",
            type: "verb",
            pronunciation: "/ˈslaɪd/",
            text: "slide",
            translations: ["trượt"],
            description:
              "To move smoothly along a surface.\nI slide down the hill.\nShe slides on the ice.\nThey slide together.",
          },
          {
            id: "909",
            type: "verb",
            pronunciation: "/ˈdaɪv/",
            text: "dive",
            translations: ["lặn"],
            description:
              "To jump into water headfirst.\nI dive into the pool.\nShe dives gracefully.\nThey dive together.",
          },
          {
            id: "910",
            type: "verb",
            pronunciation: "/ˈfeɪl/",
            text: "fail",
            translations: ["thất bại"],
            description:
              "To not succeed.\nI fail my test.\nShe fails to complete the task.\nThey fail together.",
          },
        ],
      },
      {
        id: "10",
        name: "Basic Vocabulary 10",
        description: "Learn essential action verbs for advanced use.",
        vocabularies: [
          {
            id: "1001",
            type: "verb",
            pronunciation: "/ˈteɪk/",
            text: "take",
            translations: ["lấy"],
            description:
              "To get something into your possession.\nI take a break.\nShe takes the bus.\nThey take a walk.",
          },
          {
            id: "1002",
            type: "verb",
            pronunciation: "/ˈgiv/",
            text: "give",
            translations: ["đưa"],
            description:
              "To hand something to someone.\nI give gifts.\nShe gives advice.\nThey give their time.",
          },
          {
            id: "1003",
            type: "verb",
            pronunciation: "/ˈlo͝ok/",
            text: "look",
            translations: ["nhìn"],
            description:
              "To direct your eyes at something.\nI look at the sky.\nShe looks around.\nThey look together.",
          },
          {
            id: "1004",
            type: "verb",
            pronunciation: "/ˈheɪt/",
            text: "hate",
            translations: ["ghét"],
            description:
              "To strongly dislike.\nI hate being late.\nShe hates loud noise.\nThey hate losing.",
          },
          {
            id: "1005",
            type: "verb",
            pronunciation: "/ˈlʌv/",
            text: "love",
            translations: ["yêu"],
            description:
              "To feel deep affection.\nI love my family.\nShe loves chocolate.\nThey love traveling.",
          },
          {
            id: "1006",
            type: "verb",
            pronunciation: "/ˈspiːd/",
            text: "speed",
            translations: ["tăng tốc"],
            description:
              "To move quickly.\nI speed up.\nShe speeds to the finish line.\nThey speed through tasks.",
          },
          {
            id: "1007",
            type: "verb",
            pronunciation: "/ˈswɪm/",
            text: "swim",
            translations: ["bơi"],
            description:
              "To move through water.\nI swim in the pool.\nShe swims like a fish.\nThey swim together.",
          },
          {
            id: "1008",
            type: "verb",
            pronunciation: "/ˈstɒp/",
            text: "stop",
            translations: ["dừng"],
            description:
              "To cease moving or doing something.\nI stop the car.\nShe stops talking.\nThey stop working.",
          },
          {
            id: "1009",
            type: "verb",
            pronunciation: "/ˈgɪv ʌp/",
            text: "give up",
            translations: ["từ bỏ"],
            description:
              "To quit doing something.\nI give up smoking.\nShe gives up too easily.\nThey give up together.",
          },
          {
            id: "1010",
            type: "verb",
            pronunciation: "/ˈwɒtʃ/",
            text: "watch",
            translations: ["xem"],
            description:
              "To observe something attentively.\nI watch TV.\nShe watches the birds.\nThey watch the game.",
          },
        ],
      },
      {
        id: "11",
        name: "Basic Vocabulary 11",
        description: "Learn verbs related to emotions and expressions.",
        vocabularies: [
          {
            id: "1101",
            type: "verb",
            pronunciation: "/ˈwɒndər/",
            text: "wonder",
            translations: ["tự hỏi"],
            description:
              "To feel curiosity or doubt.\nI wonder about the future.\nShe wonders why it's late.\nThey wonder every day.",
          },
          {
            id: "1102",
            type: "verb",
            pronunciation: "/ˈhəʊp/",
            text: "hope",
            translations: ["hy vọng"],
            description:
              "To want something to happen.\nI hope to see you soon.\nShe hopes for success.\nThey hope for peace.",
          },
          {
            id: "1103",
            type: "verb",
            pronunciation: "/ˈdriːm/",
            text: "dream",
            translations: ["mơ"],
            description:
              "To have visions in sleep or aspirations.\nI dream of traveling.\nShe dreams of a new home.\nThey dream every night.",
          },
          {
            id: "1104",
            type: "verb",
            pronunciation: "/ˈtrʌst/",
            text: "trust",
            translations: ["tin tưởng"],
            description:
              "To have confidence in someone or something.\nI trust my friends.\nShe trusts her instincts.\nThey trust each other.",
          },
          {
            id: "1105",
            type: "verb",
            pronunciation: "/ˈkɪs/",
            text: "kiss",
            translations: ["hôn"],
            description:
              "To touch with lips as a sign of affection.\nI kiss my partner.\nShe kisses her child.\nThey kiss goodbye.",
          },
          {
            id: "1106",
            type: "verb",
            pronunciation: "/ˈhæɡ/",
            text: "hug",
            translations: ["ôm"],
            description:
              "To hold someone tightly with affection.\nI hug my mom.\nHe hugs his friend.\nThey hug each other.",
          },
          {
            id: "1107",
            type: "verb",
            pronunciation: "/ˈblʌʃ/",
            text: "blush",
            translations: ["đỏ mặt"],
            description:
              "To become red in the face from embarrassment.\nI blush when I'm shy.\nShe blushes easily.\nThey blush together.",
          },
          {
            id: "1108",
            type: "verb",
            pronunciation: "/ˈgraɪn/",
            text: "grin",
            translations: ["cười toe toét"],
            description:
              "To smile broadly.\nI grin when I'm happy.\nShe grins at the joke.\nThey grin all day.",
          },
          {
            id: "1109",
            type: "verb",
            pronunciation: "/ˈfɪər/",
            text: "fear",
            translations: ["sợ"],
            description:
              "To feel afraid.\nI fear the dark.\nShe fears failure.\nThey fear the unknown.",
          },
          {
            id: "1110",
            type: "verb",
            pronunciation: "/ˈpreɪ/",
            text: "pray",
            translations: ["cầu nguyện"],
            description:
              "To speak to a deity or higher power.\nI pray for strength.\nShe prays at night.\nThey pray together.",
          },
        ],
      },
      {
        id: "12",
        name: "Basic Vocabulary 12",
        description: "Learn action verbs related to movement and sports.",
        vocabularies: [
          {
            id: "1201",
            type: "verb",
            pronunciation: "/ˈlɪft/",
            text: "lift",
            translations: ["nâng lên"],
            description:
              "To raise something.\nI lift weights.\nShe lifts her bag.\nThey lift the box together.",
          },
          {
            id: "1202",
            type: "verb",
            pronunciation: "/ˈdrɪbəl/",
            text: "dribble",
            translations: ["dẫn bóng"],
            description:
              "To move a ball by bouncing or kicking.\nI dribble the basketball.\nShe dribbles skillfully.\nThey dribble together.",
          },
          {
            id: "1203",
            type: "verb",
            pronunciation: "/ˈpæs/",
            text: "pass",
            translations: ["chuyền bóng"],
            description:
              "To move something to another person.\nI pass the ball.\nShe passes it quickly.\nThey pass effectively.",
          },
          {
            id: "1204",
            type: "verb",
            pronunciation: "/ˈkɪk/",
            text: "kick",
            translations: ["đá"],
            description:
              "To strike with your foot.\nI kick the ball.\nShe kicks it hard.\nThey kick the goal.",
          },
          {
            id: "1205",
            type: "verb",
            pronunciation: "/ˈtʃeɪs/",
            text: "chase",
            translations: ["đuổi theo"],
            description:
              "To run after someone or something.\nI chase my dog.\nShe chases her dream.\nThey chase the ball.",
          },
          {
            id: "1206",
            type: "verb",
            pronunciation: "/ˈtʃruː/",
            text: "throw",
            translations: ["ném"],
            description:
              "To propel something through the air.\nI throw the ball.\nShe throws it far.\nThey throw it together.",
          },
          {
            id: "1207",
            type: "verb",
            pronunciation: "/ˈkætʃ/",
            text: "catch",
            translations: ["bắt lấy"],
            description:
              "To capture something moving.\nI catch the ball.\nShe catches it with ease.\nThey catch the frisbee.",
          },
          {
            id: "1208",
            type: "verb",
            pronunciation: "/ˈslaɪd/",
            text: "slide",
            translations: ["trượt"],
            description:
              "To move smoothly on a surface.\nI slide on the ice.\nShe slides down the slide.\nThey slide together.",
          },
          {
            id: "1209",
            type: "verb",
            pronunciation: "/ˈtʃʌmp/",
            text: "jump",
            translations: ["nhảy"],
            description:
              "To push yourself off the ground.\nI jump high.\nShe jumps over the hurdle.\nThey jump with joy.",
          },
          {
            id: "1210",
            type: "verb",
            pronunciation: "/ˈswɪm/",
            text: "swim",
            translations: ["bơi"],
            description:
              "To move in water.\nI swim in the pool.\nShe swims gracefully.\nThey swim together.",
          },
        ],
      },
      {
        id: "13",
        name: "Basic Vocabulary 13",
        description:
          "Expand your vocabulary with verbs for learning and discovery.",
        vocabularies: [
          {
            id: "1301",
            type: "verb",
            pronunciation: "/ˈlɜːn/",
            text: "learn",
            translations: ["học"],
            description:
              "To gain knowledge.\nI learn new words.\nShe learns math.\nThey learn from mistakes.",
          },
          {
            id: "1302",
            type: "verb",
            pronunciation: "/ˈrɪˈsiːv/",
            text: "receive",
            translations: ["nhận"],
            description:
              "To get something.\nI receive gifts.\nShe receives praise.\nThey receive awards.",
          },
          {
            id: "1303",
            type: "verb",
            pronunciation: "/ˈækˌsɛs/",
            text: "access",
            translations: ["truy cập"],
            description:
              "To get to something.\nI access the website.\nShe accesses her account.\nThey access the data.",
          },
          {
            id: "1304",
            type: "verb",
            pronunciation: "/ˈpɜːtʃəs/",
            text: "purchase",
            translations: ["mua"],
            description:
              "To buy something.\nI purchase books.\nShe purchases supplies.\nThey purchase online.",
          },
          {
            id: "1305",
            type: "verb",
            pronunciation: "/ˈfiːl/",
            text: "feel",
            translations: ["cảm thấy"],
            description:
              "To sense or perceive.\nI feel tired.\nShe feels happy.\nThey feel the breeze.",
          },
          {
            id: "1306",
            type: "verb",
            pronunciation: "/ˈɡeɪðər/",
            text: "gather",
            translations: ["thu thập"],
            description:
              "To collect things.\nI gather information.\nShe gathers flowers.\nThey gather in the park.",
          },
          {
            id: "1307",
            type: "verb",
            pronunciation: "/ˈprɪˈpɛr/",
            text: "prepare",
            translations: ["chuẩn bị"],
            description:
              "To get ready.\nI prepare for my trip.\nShe prepares a meal.\nThey prepare a report.",
          },
          {
            id: "1308",
            type: "verb",
            pronunciation: "/ˈteɪst/",
            text: "taste",
            translations: ["nếm"],
            description:
              "To sense flavor.\nI taste the soup.\nShe tastes the cake.\nThey taste the fruit.",
          },
          {
            id: "1309",
            type: "verb",
            pronunciation: "/ˈsmɛl/",
            text: "smell",
            translations: ["ngửi"],
            description:
              "To sense odors.\nI smell flowers.\nShe smells perfume.\nThey smell the food.",
          },
          {
            id: "1310",
            type: "verb",
            pronunciation: "/ˈwɒʧ/",
            text: "watch",
            translations: ["xem"],
            description:
              "To observe attentively.\nI watch TV.\nShe watches birds.\nThey watch the sunset.",
          },
        ],
      },
      {
        id: "14",
        name: "Basic Vocabulary 14",
        description: "Learn verbs related to technology and tools.",
        vocabularies: [
          {
            id: "1401",
            type: "verb",
            pronunciation: "/ˈklɪk/",
            text: "click",
            translations: ["nhấp chuột"],
            description:
              "To press a button on a mouse or device.\nI click on the link.\nShe clicks the button.\nThey click to continue.",
          },
          {
            id: "1402",
            type: "verb",
            pronunciation: "/ˈtaɪp/",
            text: "type",
            translations: ["gõ"],
            description:
              "To write using a keyboard.\nI type an email.\nShe types quickly.\nThey type their names.",
          },
          {
            id: "1403",
            type: "verb",
            pronunciation: "/ˈpleɪ/",
            text: "play",
            translations: ["chơi"],
            description:
              "To operate a device for entertainment.\nI play a video.\nShe plays music.\nThey play the game.",
          },
          {
            id: "1404",
            type: "verb",
            pronunciation: "/ˈstɒp/",
            text: "stop",
            translations: ["dừng"],
            description:
              "To cease an operation or activity.\nI stop the program.\nShe stops the download.\nThey stop the machine.",
          },
          {
            id: "1405",
            type: "verb",
            pronunciation: "/ˈprɪnt/",
            text: "print",
            translations: ["in"],
            description:
              "To produce text or images on paper.\nI print a document.\nShe prints photos.\nThey print reports.",
          },
          {
            id: "1406",
            type: "verb",
            pronunciation: "/ˈseɪv/",
            text: "save",
            translations: ["lưu"],
            description:
              "To store data or information.\nI save my work.\nShe saves the file.\nThey save their progress.",
          },
          {
            id: "1407",
            type: "verb",
            pronunciation: "/ˈəʊpən/",
            text: "open",
            translations: ["mở"],
            description:
              "To access a file or program.\nI open the folder.\nShe opens the application.\nThey open the email.",
          },
          {
            id: "1408",
            type: "verb",
            pronunciation: "/ˈkloʊz/",
            text: "close",
            translations: ["đóng"],
            description:
              "To shut a file or program.\nI close the tab.\nShe closes the browser.\nThey close the application.",
          },
          {
            id: "1409",
            type: "verb",
            pronunciation: "/ˈdɪˌliːt/",
            text: "delete",
            translations: ["xóa"],
            description:
              "To remove something permanently.\nI delete the file.\nShe deletes emails.\nThey delete the folder.",
          },
          {
            id: "1410",
            type: "verb",
            pronunciation: "/ˈʃɛər/",
            text: "share",
            translations: ["chia sẻ"],
            description:
              "To give others access to something.\nI share the link.\nShe shares her screen.\nThey share the document.",
          },
        ],
      },
      {
        id: "15",
        name: "Basic Vocabulary 15",
        description: "Learn verbs for social interactions and communication.",
        vocabularies: [
          {
            id: "1501",
            type: "verb",
            pronunciation: "/ˈsiː/",
            text: "see",
            translations: ["nhìn thấy"],
            description:
              "To notice or observe with the eyes.\nI see the sunrise.\nShe sees her friends.\nThey see a movie.",
          },
          {
            id: "1502",
            type: "verb",
            pronunciation: "/ˈmeɪt/",
            text: "meet",
            translations: ["gặp gỡ"],
            description:
              "To come together with someone.\nI meet my teacher.\nShe meets her boss.\nThey meet at the café.",
          },
          {
            id: "1503",
            type: "verb",
            pronunciation: "/ˈɡrəʊ/",
            text: "grow",
            translations: ["phát triển"],
            description:
              "To develop or increase in size.\nI grow plants.\nShe grows in knowledge.\nThey grow quickly.",
          },
          {
            id: "1504",
            type: "verb",
            pronunciation: "/ˈfæləʊ/",
            text: "follow",
            translations: ["theo dõi"],
            description:
              "To come or go after someone or something.\nI follow instructions.\nShe follows her dreams.\nThey follow the leader.",
          },
          {
            id: "1505",
            type: "verb",
            pronunciation: "/ˈfɪnɪʃ/",
            text: "finish",
            translations: ["hoàn thành"],
            description:
              "To complete something.\nI finish my homework.\nShe finishes her project.\nThey finish the race.",
          },
          {
            id: "1506",
            type: "verb",
            pronunciation: "/ˈʧæt/",
            text: "chat",
            translations: ["trò chuyện"],
            description:
              "To talk in a friendly way.\nI chat with my friends.\nShe chats online.\nThey chat after class.",
          },
          {
            id: "1507",
            type: "verb",
            pronunciation: "/ˈrɪpliː/",
            text: "reply",
            translations: ["trả lời"],
            description:
              "To respond to a question or message.\nI reply to emails.\nShe replies quickly.\nThey reply politely.",
          },
          {
            id: "1508",
            type: "verb",
            pronunciation: "/ˈlɪsən/",
            text: "listen",
            translations: ["lắng nghe"],
            description:
              "To give attention to sound.\nI listen to music.\nShe listens carefully.\nThey listen attentively.",
          },
          {
            id: "1509",
            type: "verb",
            pronunciation: "/ˈsteɪt/",
            text: "state",
            translations: ["phát biểu"],
            description:
              "To express something clearly.\nI state my opinion.\nShe states the facts.\nThey state their intentions.",
          },
          {
            id: "1510",
            type: "verb",
            pronunciation: "/ˈɑːsk/",
            text: "ask",
            translations: ["hỏi"],
            description:
              "To request information or help.\nI ask questions.\nShe asks for advice.\nThey ask politely.",
          },
        ],
      },
      {
        id: "16",
        name: "Basic Vocabulary 16",
        description: "Learn unique verbs for various actions.",
        vocabularies: [
          {
            id: "1601",
            type: "verb",
            pronunciation: "/ˈpæk/",
            text: "pack",
            translations: ["đóng gói"],
            description:
              "To put things into a bag or box.\nI pack my luggage.\nShe packs her books.\nThey pack everything neatly.",
          },
          {
            id: "1602",
            type: "verb",
            pronunciation: "/ˈɪɡˌnɔːr/",
            text: "ignore",
            translations: ["phớt lờ"],
            description:
              "To pay no attention to something.\nI ignore distractions.\nShe ignores the noise.\nThey ignore the instructions.",
          },
          {
            id: "1603",
            type: "verb",
            pronunciation: "/ˈfɪks/",
            text: "fix",
            translations: ["sửa chữa"],
            description:
              "To repair or make something right.\nI fix the car.\nShe fixes her hair.\nThey fix the problem.",
          },
          {
            id: "1604",
            type: "verb",
            pronunciation: "/ˈhaɪd/",
            text: "hide",
            translations: ["trốn"],
            description:
              "To conceal something or oneself.\nI hide under the bed.\nShe hides her secrets.\nThey hide in the forest.",
          },
          {
            id: "1605",
            type: "verb",
            pronunciation: "/ˈfɪnd/",
            text: "find",
            translations: ["tìm thấy"],
            description:
              "To discover or locate something.\nI find my keys.\nShe finds a solution.\nThey find the treasure.",
          },
          {
            id: "1606",
            type: "verb",
            pronunciation: "/ˈmiːt/",
            text: "match",
            translations: ["phù hợp"],
            description:
              "To pair things together.\nI match my socks.\nShe matches colors.\nThey match the patterns.",
          },
          {
            id: "1607",
            type: "verb",
            pronunciation: "/ˈfiːd/",
            text: "feed",
            translations: ["cho ăn"],
            description:
              "To give food to someone or something.\nI feed my cat.\nShe feeds the birds.\nThey feed the children.",
          },
          {
            id: "1608",
            type: "verb",
            pronunciation: "/ˈjuːz/",
            text: "use",
            translations: ["sử dụng"],
            description:
              "To apply or operate something.\nI use my phone.\nShe uses her tools.\nThey use the system.",
          },
          {
            id: "1609",
            type: "verb",
            pronunciation: "/ˈkæptʃər/",
            text: "capture",
            translations: ["bắt giữ"],
            description:
              "To catch or take something.\nI capture the moment.\nShe captures the flag.\nThey capture the criminal.",
          },
          {
            id: "1610",
            type: "verb",
            pronunciation: "/ˈfleɪ/",
            text: "flee",
            translations: ["chạy trốn"],
            description:
              "To run away from danger.\nI flee the scene.\nShe flees from the fire.\nThey flee to safety.",
          },
        ],
      },
      {
        id: "17",
        name: "Basic Vocabulary 17",
        description: "Learn verbs for creative and expressive activities.",
        vocabularies: [
          {
            id: "1701",
            type: "verb",
            pronunciation: "/ˈdreɪ/",
            text: "draw",
            translations: ["vẽ"],
            description:
              "To create a picture with a pen or pencil.\nI draw a flower.\nShe draws portraits.\nThey draw on paper.",
          },
          {
            id: "1702",
            type: "verb",
            pronunciation: "/ˈpeɪnt/",
            text: "paint",
            translations: ["sơn"],
            description:
              "To cover a surface with paint or create art.\nI paint my house.\nShe paints landscapes.\nThey paint together.",
          },
          {
            id: "1703",
            type: "verb",
            pronunciation: "/ˈrɪˌkɔːd/",
            text: "record",
            translations: ["ghi âm"],
            description:
              "To save sound or video.\nI record a song.\nShe records the lecture.\nThey record the meeting.",
          },
          {
            id: "1704",
            type: "verb",
            pronunciation: "/ˈkraɪeɪt/",
            text: "create",
            translations: ["tạo ra"],
            description:
              "To make something new.\nI create a website.\nShe creates art.\nThey create opportunities.",
          },
          {
            id: "1705",
            type: "verb",
            pronunciation: "/ˈbaɪld/",
            text: "build",
            translations: ["xây dựng"],
            description:
              "To construct something.\nI build a bridge.\nShe builds a team.\nThey build a future.",
          },
          {
            id: "1706",
            type: "verb",
            pronunciation: "/ˈplaɪ/",
            text: "apply",
            translations: ["áp dụng"],
            description:
              "To use something practically.\nI apply for a job.\nShe applies the rules.\nThey apply for funding.",
          },
          {
            id: "1707",
            type: "verb",
            pronunciation: "/ˈklɪə/",
            text: "clear",
            translations: ["làm sạch"],
            description:
              "To remove clutter or confusion.\nI clear the desk.\nShe clears her doubts.\nThey clear the space.",
          },
          {
            id: "1708",
            type: "verb",
            pronunciation: "/ˈplæn/",
            text: "organize",
            translations: ["sắp xếp"],
            description:
              "To arrange things systematically.\nI organize my files.\nShe organizes events.\nThey organize the party.",
          },
          {
            id: "1709",
            type: "verb",
            pronunciation: "/ˈprəˌvaɪd/",
            text: "provide",
            translations: ["cung cấp"],
            description:
              "To give or supply something.\nI provide information.\nShe provides support.\nThey provide resources.",
          },
          {
            id: "1710",
            type: "verb",
            pronunciation: "/ˈʃeɪp/",
            text: "shape",
            translations: ["định hình"],
            description:
              "To form something into a shape.\nI shape the clay.\nShe shapes her ideas.\nThey shape the future.",
          },
        ],
      },
      {
        id: "18",
        name: "Basic Vocabulary 18",
        description: "Learn verbs related to observation and discovery.",
        vocabularies: [
          {
            id: "1801",
            type: "verb",
            pronunciation: "/ˈɒbˌzɜːv/",
            text: "observe",
            translations: ["quan sát"],
            description:
              "To watch something carefully.\nI observe the stars.\nShe observes her surroundings.\nThey observe quietly.",
          },
          {
            id: "1802",
            type: "verb",
            pronunciation: "/ˈɪnspekt/",
            text: "inspect",
            translations: ["kiểm tra"],
            description:
              "To examine something closely.\nI inspect my work.\nShe inspects the equipment.\nThey inspect the house.",
          },
          {
            id: "1803",
            type: "verb",
            pronunciation: "/ˈdiːˌsaɪd/",
            text: "decide",
            translations: ["quyết định"],
            description:
              "To make a choice.\nI decide to go.\nShe decides on the menu.\nThey decide as a group.",
          },
          {
            id: "1804",
            type: "verb",
            pronunciation: "/ˈkaʊnt/",
            text: "count",
            translations: ["đếm"],
            description:
              "To determine the number of something.\nI count the money.\nShe counts the votes.\nThey count the items.",
          },
          {
            id: "1805",
            type: "verb",
            pronunciation: "/ˈmɛʒər/",
            text: "measure",
            translations: ["đo lường"],
            description:
              "To determine the size or quantity of something.\nI measure the length.\nShe measures the ingredients.\nThey measure the distance.",
          },
          {
            id: "1806",
            type: "verb",
            pronunciation: "/ˈkælˌkjuleɪt/",
            text: "calculate",
            translations: ["tính toán"],
            description:
              "To determine something mathematically.\nI calculate the cost.\nShe calculates the numbers.\nThey calculate quickly.",
          },
          {
            id: "1807",
            type: "verb",
            pronunciation: "/ˈæˌnaɪz/",
            text: "analyze",
            translations: ["phân tích"],
            description:
              "To examine something in detail.\nI analyze the data.\nShe analyzes the results.\nThey analyze the problem.",
          },
          {
            id: "1808",
            type: "verb",
            pronunciation: "/ˈtɛst/",
            text: "test",
            translations: ["kiểm tra"],
            description:
              "To try something to see how it works.\nI test the app.\nShe tests the water.\nThey test the idea.",
          },
          {
            id: "1809",
            type: "verb",
            pronunciation: "/ˈprɛdɪkt/",
            text: "predict",
            translations: ["dự đoán"],
            description:
              "To say what will happen in the future.\nI predict the weather.\nShe predicts success.\nThey predict the outcome.",
          },
          {
            id: "1810",
            type: "verb",
            pronunciation: "/ˈrɪsərʧ/",
            text: "research",
            translations: ["nghiên cứu"],
            description:
              "To study something carefully.\nI research the topic.\nShe researches the market.\nThey research thoroughly.",
          },
        ],
      },
      {
        id: "19",
        name: "Basic Vocabulary 19",
        description: "Learn verbs related to travel and transportation.",
        vocabularies: [
          {
            id: "1901",
            type: "verb",
            pronunciation: "/ˈtraːvəl/",
            text: "travel",
            translations: ["du lịch"],
            description:
              "To go from one place to another.\nI travel by plane.\nShe travels to Europe.\nThey travel every summer.",
          },
          {
            id: "1902",
            type: "verb",
            pronunciation: "/ˈdɹɪv/",
            text: "drive",
            translations: ["lái xe"],
            description:
              "To operate a vehicle.\nI drive a car.\nShe drives to work.\nThey drive carefully.",
          },
          {
            id: "1903",
            type: "verb",
            pronunciation: "/ˈflɑɪ/",
            text: "fly",
            translations: ["bay"],
            description:
              "To travel in an aircraft.\nI fly to New York.\nShe flies for business.\nThey fly together.",
          },
          {
            id: "1904",
            type: "verb",
            pronunciation: "/ˈseɪl/",
            text: "sail",
            translations: ["chèo thuyền"],
            description:
              "To travel in a boat with sails.\nI sail across the sea.\nShe sails every weekend.\nThey sail in the evening.",
          },
          {
            id: "1905",
            type: "verb",
            pronunciation: "/ˈkætʃ/",
            text: "board",
            translations: ["lên tàu"],
            description:
              "To get on a vehicle.\nI board the train.\nShe boards the bus.\nThey board the airplane.",
          },
          {
            id: "1906",
            type: "verb",
            pronunciation: "/ˈvækɪˌeɪt/",
            text: "vacate",
            translations: ["rời đi"],
            description:
              "To leave a place.\nI vacate my seat.\nShe vacates the room.\nThey vacate the building.",
          },
          {
            id: "1907",
            type: "verb",
            pronunciation: "/ˈrɪdə/",
            text: "ride",
            translations: ["cưỡi"],
            description:
              "To sit on and control a vehicle or animal.\nI ride a bike.\nShe rides a horse.\nThey ride together.",
          },
          {
            id: "1908",
            type: "verb",
            pronunciation: "/ˈwɛɪt/",
            text: "wait",
            translations: ["chờ đợi"],
            description:
              "To stay until something happens.\nI wait for the bus.\nShe waits patiently.\nThey wait in line.",
          },
          {
            id: "1909",
            type: "verb",
            pronunciation: "/ˈɛntər/",
            text: "enter",
            translations: ["vào"],
            description:
              "To go into a place.\nI enter the room.\nShe enters the competition.\nThey enter the building.",
          },
          {
            id: "1910",
            type: "verb",
            pronunciation: "/ˈɛɡzɪt/",
            text: "exit",
            translations: ["thoát ra"],
            description:
              "To leave a place.\nI exit the car.\nShe exits the meeting.\nThey exit the building.",
          },
        ],
      },
      {
        id: "20",
        name: "Basic Vocabulary 20",
        description: "Learn verbs for daily habits and routines.",
        vocabularies: [
          {
            id: "2001",
            type: "verb",
            pronunciation: "/ˈweɪk/",
            text: "wake",
            translations: ["thức dậy"],
            description:
              "To stop sleeping.\nI wake early.\nShe wakes at sunrise.\nThey wake feeling refreshed.",
          },
          {
            id: "2002",
            type: "verb",
            pronunciation: "/ˈrɛst/",
            text: "rest",
            translations: ["nghỉ ngơi"],
            description:
              "To relax or take a break.\nI rest at noon.\nShe rests on the sofa.\nThey rest after work.",
          },
          {
            id: "2003",
            type: "verb",
            pronunciation: "/ˈtiːk/",
            text: "tidy",
            translations: ["dọn dẹp"],
            description:
              "To make a place neat and clean.\nI tidy my room.\nShe tidies her desk.\nThey tidy the garden.",
          },
          {
            id: "2004",
            type: "verb",
            pronunciation: "/ˈsɪp/",
            text: "sip",
            translations: ["nhấp"],
            description:
              "To drink something slowly.\nI sip my tea.\nShe sips her coffee.\nThey sip juice together.",
          },
          {
            id: "2005",
            type: "verb",
            pronunciation: "/ˈʃɒp/",
            text: "shop",
            translations: ["mua sắm"],
            description:
              "To buy goods from stores.\nI shop for groceries.\nShe shops for clothes.\nThey shop at the market.",
          },
          {
            id: "2006",
            type: "verb",
            pronunciation: "/ˈplænt/",
            text: "plant",
            translations: ["trồng cây"],
            description:
              "To place seeds or plants in soil.\nI plant flowers.\nShe plants vegetables.\nThey plant trees.",
          },
          {
            id: "2007",
            type: "verb",
            pronunciation: "/ˈbaθ/",
            text: "bathe",
            translations: ["tắm"],
            description:
              "To wash oneself in a tub or water.\nI bathe every evening.\nShe bathes her dog.\nThey bathe in the river.",
          },
          {
            id: "2008",
            type: "verb",
            pronunciation: "/ˈflɒss/",
            text: "floss",
            translations: ["xỉa răng"],
            description:
              "To clean between teeth with dental floss.\nI floss after meals.\nShe flosses every night.\nThey floss regularly.",
          },
          {
            id: "2009",
            type: "verb",
            pronunciation: "/ˈwɑʃ/",
            text: "wash",
            translations: ["giặt"],
            description:
              "To clean something with water.\nI wash my clothes.\nShe washes the dishes.\nThey wash their car.",
          },
          {
            id: "2010",
            type: "verb",
            pronunciation: "/ˈrɪˌlæks/",
            text: "relax",
            translations: ["thư giãn"],
            description:
              "To rest and enjoy leisure time.\nI relax on weekends.\nShe relaxes with music.\nThey relax together.",
          },
        ],
      },
    ];
  }
}
