// Масив з питаннями
const questions = [
    {
        id: 1,
        text: "Чи вважаєш ти мене милим? 🥺",
        emoji: "🥰",
        type: "yesno",
    },
    {
        id: 2,
        text: "Наскільки я красивий від 0 до 100? 🥰",
        emoji: "🥰",
        type: "slider",
    },
    {
        id: 4,
        text: "Що ти обереш: обійми чи поцілунок? 🤗🥰",
        emoji: "🥰",
        type: "choice",
    },
    {
        id: 3,
        text: "Завдання: Поцілуй Ваню в щічку і додай фотодоказ! 😘📸",
        emoji: "💋",
        type: "photo",
    },
    {
        id: 5,
        text: "Коли в мене день народження? 🎂",
        emoji: "🎉",
        type: "birthday",
        image: "./images/5/look.jpeg",
        correctAnswer: "19.05.2005",
    },
    {
        id: 6,
        text: "Допоможи Вані наїстися",
        emoji: "🎮",
        type: "game",
    },
    {
        id: 7,
        text: "Яка тварина найбільше асоціюється зі мною? 🐾",
        emoji: "🐾",
        type: "animal",
        options: [
            {
                id: "lev",
                image: "./images/7/lev.jpg",
                name: "Лев",
                emoji: "🦁",
            },
            {
                id: "linivets",
                image: "./images/7/linivets.jpg",
                name: "Лінивець",
                emoji: "🦥",
            },
            {
                id: "minyon",
                image: "./images/7/minyon.jpg",
                name: "Міньйон",
                emoji: "👽",
            },
            {
                id: "vovk",
                image: "./images/7/vovk.jpg",
                name: "Вовк",
                emoji: "🐺",
            },
        ],
    },
    {
        id: 8,
        text: "Ти мене любиш? 💕",
        emoji: "💖",
        type: "love",
        options: [
            {
                id: "da",
                text: "Да",
                emoji: "💕",
            },
            {
                id: "yo",
                text: "Йо",
                emoji: "😍",
            },
            {
                id: "ayno",
                text: "Айно",
                emoji: "🥰",
            },
            {
                id: "malo",
                text: "Мало",
                emoji: "💔",
            },
        ],
    },
    {
        id: 9,
        text: "Чи будеш скучати за мною? 🥺",
        emoji: "🥺",
        type: "yesno",
    },
    {
        id: 10,
        text: "Будеш моєю дівчиною? 💍",
        emoji: "💍",
        type: "girlfriend",
    },
];

let currentQuestionIndex = 0;
let userAnswers = []; // Для збереження відповідей

// Відновлюємо прогрес при завантаженні
function loadProgress() {
    const savedAnswers = localStorage.getItem("loveQuizAnswers");
    const savedIndex = localStorage.getItem("currentQuestionIndex");

    if (savedAnswers) {
        userAnswers = JSON.parse(savedAnswers);
        // Знаходимо останнє відповіджене питання
        const lastAnsweredIndex = Math.max(
            -1,
            ...Object.keys(userAnswers).map(Number)
        );
        currentQuestionIndex = Math.min(
            lastAnsweredIndex + 1,
            questions.length - 1
        );
    }

    if (savedIndex && !savedAnswers) {
        currentQuestionIndex = parseInt(savedIndex) || 0;
    }
}

// Зберігаємо поточний прогрес
function saveProgress() {
    localStorage.setItem(
        "currentQuestionIndex",
        currentQuestionIndex.toString()
    );
}

// Очищаємо весь прогрес (для тестування)
function clearProgress() {
    localStorage.removeItem("loveQuizAnswers");
    localStorage.removeItem("currentQuestionIndex");
    currentQuestionIndex = 0;
    userAnswers = [];
    updateQuestion();
}

// Функція для кнопки скидання прогресу
function resetProgress() {
    if (
        confirm("Ви впевнені, що хочете скинути прогрес на перше питання? 🤔")
    ) {
        clearProgress();

        // Приховуємо результати і показуємо питання
        const resultContainer = document.getElementById("result");
        const questionContainer = document.querySelector(".question-container");

        if (resultContainer) resultContainer.style.display = "none";
        if (questionContainer) questionContainer.style.display = "flex";

        // Повертаємо звичайний фон
        document.body.style.background = "";
        document.body.style.animation = "";

        // Показуємо повідомлення
        showNotification("🔄 Прогрес скинуто! Починаємо спочатку 💕");
    }
}

// Функція для показу сповіщень
function showNotification(message) {
    const notification = document.createElement("div");
    notification.className = "notification";
    notification.textContent = message;
    document.body.appendChild(notification);

    // Показуємо з анімацією
    setTimeout(() => notification.classList.add("show"), 100);

    // Приховуємо через 3 секунди
    setTimeout(() => {
        notification.classList.remove("show");
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Функція обробки відповідей
function handleAnswer(answer, value = null) {
    const resultContainer = document.getElementById("result");
    const resultContent = document.getElementById("result-content");
    const questionContainer = document.querySelector(".question-container");

    // Зберігаємо відповідь та прогрес
    saveAnswer(answer, value);
    saveProgress();

    // Приховуємо питання
    questionContainer.style.display = "none";

    if (answer === "slider") {
        showSliderResult(resultContent, value);
    } else if (answer === "photo") {
        showPhotoResult(resultContent, value);
    } else if (answer === "choice") {
        showChoiceResult(resultContent, value);
    } else if (answer === "birthday") {
        showBirthdayResult(resultContent, value);
    } else if (answer === "game") {
        showGameResult(resultContent, value);
    } else if (answer === "animal") {
        showAnimalResult(resultContent, value);
    } else if (answer === "love") {
        showLoveResult(resultContent, value);
    } else if (answer === "yes") {
        showPositiveResult(resultContent);
    } else {
        showNegativeResult(resultContent);
    }

    // Показуємо результат
    resultContainer.style.display = "flex";

    // Додаємо конфеті ефект
    createConfetti();
}

function saveAnswer(answer, value = null) {
    const question = questions[currentQuestionIndex];
    const answerData = {
        questionId: question.id,
        questionText: question.text,
        answer: answer,
        value: value,
        timestamp: new Date().toISOString(),
    };

    userAnswers[currentQuestionIndex] = answerData;

    // Зберігаємо в localStorage
    localStorage.setItem("loveQuizAnswers", JSON.stringify(userAnswers));
}

function showPositiveResult(container) {
    container.innerHTML = `
        <div class="result-text">Юхууу💕</div>
        <div class="result-emoji">😍🥰😘</div>
        <div class="social-credit-container">
            <img src="./images/1/plus-social-credit.jpeg" alt="Plus Social Credit" class="social-credit-img">
        </div>
        <div class="love-declaration">
            <p style="font-size: 1.3rem; color: #d63384; margin: 20px 0; font-weight: bold;">
                Цьом! 💖💖💖
            </p>
            <div class="heart-rain">💖 💕 💘 💝 💗 💖 💕 💘</div>
        </div>
        ${getNavigationButtons()}
    `;

    // Додаємо спеціальні ефекти для позитивної відповіді
    setTimeout(() => {
        createHeartExplosion();
    }, 500);
}

function showNegativeResult(container) {
    const sadMemes = [
        {
            text: "Та ну ладно... 🥺",
            emoji: "😭",
        },
        {
            text: "Серйозно?! 😱",
            emoji: "🙀",
        },
        {
            text: "Ну як так?! 💔",
            emoji: "😿",
        },
    ];

    const randomMeme = sadMemes[Math.floor(Math.random() * sadMemes.length)];

    container.innerHTML = `
        <div class="result-text">${randomMeme.text}</div>
        <div class="result-emoji">${randomMeme.emoji}</div>
        <div class="social-credit-container">
            <img src="./images/1/minus-social-credit.png" alt="Minus Social Credit" class="social-credit-img">
        </div>
        ${getNavigationButtons()}
    `;
}

function showSliderResult(container, value) {
    let resultText, resultEmoji, imageInfo;

    if (value <= 30) {
        resultText = "Пхаха, ору, фоса шутка 😅";
        resultEmoji = "😬😅";
        imageInfo = "Ну таке собі... 😬";
    } else if (value <= 70) {
        resultText = "Непогано! 😊";
        resultEmoji = "😊👌";
        imageInfo = "Непогано! 😊";
    } else {
        resultText = "Вау! Пасіба! 😍";
        resultEmoji = "😍🔥✨";
        imageInfo = "Вау! Пасіба! 😍";
    }

    const imagePath =
        value <= 30
            ? "./images/2/bad.webp"
            : value <= 70
            ? "./images/2/midl.jpg"
            : "./images/2/good.jpeg";

    container.innerHTML = `
        <div class="result-text">${resultText}</div>
        <div class="result-emoji">${resultEmoji}</div>
        <div class="slider-result-container">
            <div class="beauty-score">Твоя оцінка: ${value}/100</div>
            <img src="${imagePath}" alt="${imageInfo}" class="result-beauty-image">
        </div>
        ${getNavigationButtons()}
    `;

    // Додаємо ефекти в залежності від оцінки
    if (value > 70) {
        setTimeout(() => {
            createHeartExplosion();
        }, 500);
    }
}

function showPhotoResult(container, photoData) {
    container.innerHTML = `
        <div class="result-text">Aaaaaа! Прекрасно! 😍</div>
        <div class="result-emoji">📸💕✨</div>
        <div class="photo-result-container">
            <div class="task-completed">✅ Завдання виконано!</div>
            <div class="cute-message">Ти найкраща! 💖</div>
        </div>
        ${getNavigationButtons()}
    `;

    // Додаємо ефекти
    setTimeout(() => {
        createHeartExplosion();
    }, 500);
}

function showChoiceResult(container, choice) {
    let resultText, resultEmoji, choiceImage, choiceText, choiceDescription;

    if (choice === "hugs") {
        resultText = "Ааа, обійми! Так тепло і мило! 🤗";
        resultEmoji = "🤗💕✨";
        choiceImage = "./images/4/hugs.jpeg";
        choiceText = "Обійми 🤗";
        choiceDescription = "Ти обрала теплоту і ніжність!";
    } else {
        resultText = "Оооо, поцілунок! Як романтично! 💋";
        resultEmoji = "💋🔥💕";
        choiceImage = "./images/4/kiss.jpeg";
        choiceText = "Поцілунок 💋";
        choiceDescription = "Ти обрала пристрасть і кохання!";
    }

    container.innerHTML = `
        <div class="result-text">${resultText}</div>
        <div class="result-emoji">${resultEmoji}</div>
        <div class="choice-result-container">
            <div class="chosen-option">
                <img src="${choiceImage}" alt="${choiceText}" class="chosen-image">
                <div class="chosen-label">Твій вибір: ${choiceText}</div>
                
            </div>
            <div class="love-message">
                <p>Но давай) 💖</p>
            </div>
        </div>
        ${getNavigationButtons()}
    `;

    // Додаємо ефекти
    setTimeout(() => {
        createHeartExplosion();
    }, 500);
}

function showBirthdayResult(container, data) {
    const { userAnswer, isCorrect } = data;

    if (isCorrect) {
        container.innerHTML = `
            <div class="result-text">Ааааа! Ти запам'ятала! 🥰</div>
            <div class="result-emoji">🎂🎉✨</div>
            <div class="birthday-result-container">
                <img src="./images/5/good.jpg" alt="Правильна відповідь" class="birthday-result-image">
                <div class="correct-answer">✅ Правильно!</div>
                <div class="birthday-message">19 травня 2005 року - моя особлива дата! 💖</div>
                <div class="love-points">+100 балів до кохання! 💕</div>
            </div>
            ${getNavigationButtons()}
        `;

        // Додаємо святковий ефект
        setTimeout(() => {
            createBirthdayFirework();
        }, 500);
    } else {
        container.innerHTML = `
            <div class="result-text">Ой-ой, як обично... 😅</div>
            <div class="result-emoji">😬🤔</div>
            <div class="birthday-result-container">
                <img src="./images/5/bad.webp" alt="Неправильна відповідь" class="birthday-result-image">
                <div class="wrong-answer">❌ Твоя відповідь: ${userAnswer}</div>
                <div class="correct-info">Правильна відповідь: 19.05.2005</div>
            </div>
            ${getNavigationButtons()}
        `;
    }
}

function showGameResult(container, data) {
    const { score, won } = data;

    if (won) {
        container.innerHTML = `
            <div class="result-text">Вау! Ти перемогла! 🎮✨</div>
            <div class="result-emoji">🏆🎉🥳</div>
            <div class="game-result-container">
                <img src="./images/6/vanya.webp" alt="Щасливий Ваня" class="game-result-image">
                <div class="game-score-display">
                    <div class="final-score">Фінальний рахунок: ${score}/20</div>
                    <div class="victory-message">🎊 ПЕРЕМОЖА! 🎊</div>
                    <div class="game-praise">Ти найкраща геймерка! 💖</div>
                </div>
                <div class="game-stats">
                    <div>🍝 Їжа зловлена!</div>
                    <div>🍆 Баклажани уникнуті!</div>
                    <div>🍄 Гриби обійдені!</div>
                </div>
            </div>
            ${getNavigationButtons()}
        `;

        // Додаємо святковий ефект
        setTimeout(() => {
            createGameVictoryEffect();
        }, 500);
    } else {
        container.innerHTML = `
            <div class="result-text">Майже вдалося! 😅🎮</div>
            <div class="result-emoji">😔💪</div>
            <div class="game-result-container">
                <img src="./images/6/vanya.webp" alt="Ваня намагався" class="game-result-image">
                <div class="game-score-display">
                    <div class="final-score">Твій рахунок: ${score}/20</div>
                    <div class="try-again-message">Майже перемогла! 🤏</div>
                    <div class="encouragement">Наступного разу точно вийде! 😊</div>
                </div>
                <div class="game-tips">
                    <div>💡 Підказка: Уникай 🍆 та 🍄</div>
                    <div>💡 Данька дає 3 очки! 🥰</div>
                </div>
            </div>
            ${getNavigationButtons()}
        `;
    }
}

function showAnimalResult(container, animalId) {
    // Знаходимо інформацію про обрану тварину
    const question = questions[currentQuestionIndex];
    const selectedAnimal = question.options.find(
        (option) => option.id === animalId
    );

    // Шлях до картинки результату
    const resultImagePath = `./images/7/ans/${animalId}.${
        animalId === "minyon" ? "gif" : "jpg"
    }`;

    // Різні варіанти відповідей залежно від тварини
    let resultText, resultEmoji, animalMessage;

    switch (animalId) {
        case "lev":
            resultText = "Лев! Король! 👑";
            resultEmoji = "🦁👑✨";
            animalMessage = "Ноо та йсе я, добитчик";
            break;
        case "linivets":
            resultText = "Лінивець! Спокій та детокс! 😌";
            resultEmoji = "🦥💤🌿";
            animalMessage = "Я штооо лінивий?";
            break;
        case "minyon":
            resultText = "Міньйон?!";
            resultEmoji = "👽🎉💛";
            animalMessage = "Я люблю банан. Ба-на-нааааа";
            break;
        case "vovk":
            resultText = "Вовк! Незалежний і сильний! 🌙";
            resultEmoji = "🐺🌟🔥";
            animalMessage = "Ауф, викативаєт са дваров🖤";
            break;
        default:
            resultText = "Цікавий вибір! 🤔";
            resultEmoji = "🐾💖";
            animalMessage = "Кожна тварина унікальна, як і наші стосунки! 💕";
    }

    container.innerHTML = `
        <div class="result-text">${resultText}</div>
        <div class="result-emoji">${resultEmoji}</div>
        <div class="animal-result-container">
            <img src="${resultImagePath}" alt="${
        selectedAnimal.name
    } результат" class="animal-result-image">
            <div class="animal-result-info">
                <div class="selected-animal">
                    <span class="animal-result-emoji">${
                        selectedAnimal.emoji
                    }</span>
                    <span class="animal-result-name">${animalMessage}</span>
                </div>
            </div>
        </div>
        ${getNavigationButtons()}
    `;

    // Додаємо святковий ефект
    setTimeout(() => {
        createAnimalEffect(selectedAnimal.emoji);
    }, 500);
}

function createAnimalEffect(animalEmoji) {
    const emojis = [animalEmoji, "💖", "✨", "🌟", "💕"];

    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            const effect = document.createElement("div");
            effect.innerHTML =
                emojis[Math.floor(Math.random() * emojis.length)];
            effect.style.position = "fixed";
            effect.style.left = Math.random() * 100 + "vw";
            effect.style.top = Math.random() * 50 + "vh";
            effect.style.fontSize = Math.random() * 1.5 + 1 + "rem";
            effect.style.zIndex = "1001";
            effect.style.pointerEvents = "none";

            document.body.appendChild(effect);

            // Анімація ефекту
            const angle = Math.random() * 2 * Math.PI;
            const distance = Math.random() * 200 + 100;
            const endX = Math.cos(angle) * distance;
            const endY = Math.sin(angle) * distance;

            effect.animate(
                [
                    { transform: "scale(0) rotate(0deg)", opacity: 1 },
                    { transform: "scale(1.2) rotate(180deg)", opacity: 1 },
                    {
                        transform: `translate(${endX}px, ${endY}px) scale(0) rotate(360deg)`,
                        opacity: 0,
                    },
                ],
                {
                    duration: Math.random() * 1500 + 1000,
                    easing: "ease-out",
                }
            ).onfinish = () => {
                effect.remove();
            };
        }, i * 100);
    }
}

function showLoveResult(container, loveId) {
    // Знаходимо інформацію про обрану відповідь
    const question = questions[currentQuestionIndex];
    const selectedOption = question.options.find(
        (option) => option.id === loveId
    );

    // Різні варіанти відповідей залежно від вибору
    let resultText, resultEmoji, loveMessage;

    switch (loveId) {
        case "da":
            resultText = "Да!";
            resultEmoji = "💕❤️✨";
            loveMessage = "Цьом цьом";
            break;
        case "yo":
            resultText = "Йо!";
            resultEmoji = "😍🔥💖";
            loveMessage = "Но, по хустськи вже говориш";
            break;
        case "ayno":
            resultText = "Айно!";
            resultEmoji = "🥰💗🌸";
            loveMessage = "Айно, файно";
            break;
        case "malo":
            resultText = "Мало?!";
            resultEmoji = "💔😢➡️💖";
            loveMessage = "Пхх, ти як усе 💖";
            break;
        default:
            resultText = "Цікава відповідь! 🤔";
            resultEmoji = "💖💫";
            loveMessage = "Головне, що ми разом! 💕";
    }

    container.innerHTML = `
        <div class="result-text">${resultText}</div>
        <div class="result-emoji">${resultEmoji}</div>
        <div class="love-result-container">
            <div class="love-result-info">
                <div class="selected-love">
                    <span class="love-result-emoji">${
                        selectedOption.emoji
                    }</span>
                    <span class="love-result-text">${selectedOption.text}</span>
                </div>
                <div class="love-message">${loveMessage}</div>
             
            </div>
        </div>
        ${getNavigationButtons()}
    `;

    // Додаємо ефект сердечок
    setTimeout(() => {
        createLoveEffect(selectedOption.emoji);
    }, 500);
}

function createLoveEffect(loveEmoji) {
    const emojis = [loveEmoji, "💖", "💕", "❤️", "💗", "💘", "✨"];

    for (let i = 0; i < 25; i++) {
        setTimeout(() => {
            const effect = document.createElement("div");
            effect.innerHTML =
                emojis[Math.floor(Math.random() * emojis.length)];
            effect.style.position = "fixed";
            effect.style.left = Math.random() * 100 + "vw";
            effect.style.top = Math.random() * 50 + "vh";
            effect.style.fontSize = Math.random() * 1.5 + 1.5 + "rem";
            effect.style.zIndex = "1001";
            effect.style.pointerEvents = "none";

            document.body.appendChild(effect);

            // Анімація у формі сердечка
            const angle = Math.random() * 2 * Math.PI;
            const distance = Math.random() * 150 + 100;
            const endX = Math.cos(angle) * distance;
            const endY = Math.sin(angle) * distance - 50; // Трохи вгору

            effect.animate(
                [
                    { transform: "scale(0) rotate(0deg)", opacity: 1 },
                    { transform: "scale(1.5) rotate(180deg)", opacity: 1 },
                    {
                        transform: `translate(${endX}px, ${endY}px) scale(0) rotate(360deg)`,
                        opacity: 0,
                    },
                ],
                {
                    duration: Math.random() * 2000 + 1500,
                    easing: "ease-out",
                }
            ).onfinish = () => {
                effect.remove();
            };
        }, i * 80);
    }
}

function createGameVictoryEffect() {
    const gameEmojis = ["�", "�", "�", "✨", "🌟", "💖", "🥳"];

    for (let i = 0; i < 25; i++) {
        setTimeout(() => {
            const firework = document.createElement("div");
            firework.innerHTML =
                gameEmojis[Math.floor(Math.random() * gameEmojis.length)];
            firework.style.position = "fixed";
            firework.style.left = Math.random() * 100 + "vw";
            firework.style.top = Math.random() * 50 + "vh";
            firework.style.fontSize = Math.random() * 1.5 + 1 + "rem";
            firework.style.zIndex = "1001";
            firework.style.pointerEvents = "none";

            document.body.appendChild(firework);

            // Анімація вибуху
            const angle = Math.random() * 2 * Math.PI;
            const distance = Math.random() * 200 + 100;
            const endX = Math.cos(angle) * distance;
            const endY = Math.sin(angle) * distance;

            firework.animate(
                [
                    { transform: "scale(0) rotate(0deg)", opacity: 1 },
                    { transform: "scale(1.2) rotate(180deg)", opacity: 1 },
                    {
                        transform: `translate(${endX}px, ${endY}px) scale(0) rotate(360deg)`,
                        opacity: 0,
                    },
                ],
                {
                    duration: Math.random() * 1500 + 1000,
                    easing: "ease-out",
                }
            ).onfinish = () => {
                firework.remove();
            };
        }, i * 100);
    }
}

function getNavigationButtons() {
    return `
        <div class="navigation-buttons" style="margin-top: 25px;">
            <button onclick="tryAgain()" class="nav-btn retry-btn">
                Відповісти ще раз 💕
            </button>
            ${
                currentQuestionIndex < questions.length - 1
                    ? `<button onclick="nextQuestion()" class="nav-btn next-btn">
                    Наступне питання ➡️
                </button>`
                    : `<button onclick="finishQuiz()" class="nav-btn finish-btn">
                    Завершити опитування 🎉
                </button>`
            }
        </div>
    `;
}

function tryAgain() {
    const resultContainer = document.getElementById("result");
    const questionContainer = document.querySelector(".question-container");
    const question = questions[currentQuestionIndex];

    // Якщо це гра, скидаємо стан гри
    if (question.type === "game") {
        resetGameState();
    }

    // Приховуємо результат і показуємо питання знову
    resultContainer.style.display = "none";
    questionContainer.style.display = "flex";

    // Перегенеруємо інтерфейс питання
    updateQuestion();

    // Додаємо милу анімацію з сердечками
    createHeartRain();
}

function resetGameState() {
    // Зупиняємо всі ігрові процеси якщо вони активні
    if (gameActive) {
        gameActive = false;
        if (gameTimer) {
            clearInterval(gameTimer);
            gameTimer = null;
        }
        if (gameAnimationFrame) {
            cancelAnimationFrame(gameAnimationFrame);
            gameAnimationFrame = null;
        }

        // Видаляємо обробники подій
        document.removeEventListener("keydown", handleGameKeys);
        document.removeEventListener("touchmove", preventScroll);

        // Зупиняємо рух
        stopMoving();

        // Виходимо з повноекранного режиму
        exitFullscreen();
    }

    // Скидаємо ігрові змінні
    gameActive = false;
    gameScore = 0;
    gameTimeLeft = 60;
    vanyaPosition = 50;
    fallingItems = [];
    moveDirection = null;

    const existingItems = document.querySelectorAll(".falling-item");
    existingItems.forEach((item) => item.remove());

    // Переконуємося, що body прибрав класи гри
    document.body.classList.remove("game-active");
    const gameContainer = document.querySelector(".game-container");
    if (gameContainer) {
        gameContainer.classList.remove("fullscreen-game");
    }
}

function nextQuestion() {
    currentQuestionIndex++;
    saveProgress(); // Зберігаємо прогрес при переході до наступного питання
    if (currentQuestionIndex < questions.length) {
        updateQuestion();
        const resultContainer = document.getElementById("result");
        const questionContainer = document.querySelector(".question-container");

        resultContainer.style.display = "none";
        questionContainer.style.display = "flex";

        // Додаємо ефект переходу
        questionContainer.style.animation = "slideInDown 1s ease-out";
    } else {
        finishQuiz();
    }
}

function updateQuestion() {
    const questionElement = document.querySelector(".question");
    const catEmojiElement = document.querySelector(".cat-emoji");
    const answersContainer = document.querySelector(".answers");
    const question = questions[currentQuestionIndex];

    questionElement.textContent = question.text;
    catEmojiElement.textContent = question.emoji;

    // Очищуємо контейнер з відповідями
    answersContainer.innerHTML = "";

    // Створюємо інтерфейс в залежності від типу питання
    if (question.type === "slider") {
        createSliderInterface(answersContainer);
    } else if (question.type === "photo") {
        createPhotoInterface(answersContainer);
    } else if (question.type === "choice") {
        createChoiceInterface(answersContainer);
    } else if (question.type === "birthday") {
        createBirthdayInterface(answersContainer);
    } else if (question.type === "game") {
        createGameInterface(answersContainer);
    } else if (question.type === "animal") {
        createAnimalInterface(answersContainer);
    } else if (question.type === "love") {
        createLoveInterface(answersContainer);
    } else if (question.type === "girlfriend") {
        createGirlfriendInterface(answersContainer);
    } else {
        createYesNoInterface(answersContainer);
    }

    // Додаємо номер питання
    const questionCard = document.querySelector(".question-card");
    let questionNumber = questionCard.querySelector(".question-number");
    if (!questionNumber) {
        questionNumber = document.createElement("div");
        questionNumber.className = "question-number";
        questionCard.insertBefore(questionNumber, questionCard.firstChild);
    }
    questionNumber.textContent = `Питання ${currentQuestionIndex + 1} з ${
        questions.length
    }`;
}

function createYesNoInterface(container) {
    container.innerHTML = `
        <button class="answer-btn yes-btn" onclick="handleAnswer('yes')">
            <span class="btn-text">Так 💕</span>
            <div class="sparkles">✨</div>
        </button>
        
        <button class="answer-btn no-btn" onclick="handleAnswer('no')">
            <span class="btn-text">Ні 💔</span>
        </button>
    `;
}

function createSliderInterface(container) {
    container.innerHTML = `
        <div class="slider-container">
            <div class="beauty-image-container">
                <img id="beautyImage" src="./images/2/bad.webp" alt="Beauty level" class="beauty-image">
            </div>
            <div class="slider-wrapper">
                <label for="beautySlider" class="slider-label">Рівень красоти: <span id="sliderValue">0</span></label>
                <input type="range" id="beautySlider" class="beauty-slider" min="0" max="100" value="0" onInput="updateBeautyImage(this.value)">
            </div>
            <button class="answer-btn slider-submit-btn" onclick="handleSliderAnswer()">
                Підтвердити вибір ✨
            </button>
        </div>
    `;
}

function createPhotoInterface(container) {
    container.innerHTML = `
        <div class="photo-container">
            <div class="task-description">
                <div class="task-icon">📋</div>
                <p>Поцілуй себе в щічку і зроби селфі як доказ! 😘</p>
            </div>
            <div class="photo-upload-area">
                <input type="file" id="photoInput" accept="image/*" onchange="handlePhotoUpload(this)" style="display: none;">
                <div class="upload-placeholder" onclick="document.getElementById('photoInput').click()">
                    <div class="upload-icon">📷</div>
                    <div class="upload-text">Натисни щоб додати фото</div>
                </div>
                <div id="photoPreview" class="photo-preview" style="display: none;">
                    <img id="previewImage" class="preview-image" alt="Попередній перегляд">
                    <button class="change-photo-btn" onclick="document.getElementById('photoInput').click()">
                        Змінити фото 🔄
                    </button>
                </div>
            </div>
            <button class="answer-btn photo-submit-btn" onclick="handlePhotoAnswer()">
                Продовжити ✨
            </button>
        </div>
    `;
}

function createChoiceInterface(container) {
    container.innerHTML = `
        <div class="choice-container">
            <div class="choice-options">
                <div class="choice-option" id="choice-hugs">
                    <img src="./images/4/hugs.jpeg" alt="Обійми" class="choice-image">
                    <div class="choice-label">Обійми 🤗</div>
                    <div class="choice-description">Теплі та ніжні обійми</div>
                </div>
                
                <div class="choice-option" id="choice-kiss">
                    <img src="./images/4/kiss.jpeg" alt="Поцілунок" class="choice-image">
                    <div class="choice-label">Поцілунок 💋</div>
                    <div class="choice-description">Солодкий і пристрасний</div>
                </div>
            </div>
        </div>
    `;

    // Додаємо обробники подій для мобільних пристроїв
    const hugsOption = document.getElementById("choice-hugs");
    const kissOption = document.getElementById("choice-kiss");

    // Для hugs
    hugsOption.addEventListener("click", (e) => {
        e.preventDefault();
        handleChoiceAnswer("hugs");
    });
    hugsOption.addEventListener("touchstart", (e) => {
        e.preventDefault();
        handleChoiceAnswer("hugs");
    });

    // Для kiss
    kissOption.addEventListener("click", (e) => {
        e.preventDefault();
        handleChoiceAnswer("kiss");
    });
    kissOption.addEventListener("touchstart", (e) => {
        e.preventDefault();
        handleChoiceAnswer("kiss");
    });
}

function createBirthdayInterface(container) {
    const question = questions[currentQuestionIndex];
    container.innerHTML = `
        <div class="birthday-container">
            <div class="birthday-image-container">
                <img src="${question.image}" alt="Birthday question" class="birthday-image">
            </div>
            <div class="birthday-input-container">
                <label for="birthdayInput" class="birthday-label">Введи дату у форматі ДД.ММ.РРРР:</label>
                <input type="text" id="birthdayInput" class="birthday-input" maxlength="10">
            </div>
            <button class="answer-btn birthday-submit-btn" onclick="handleBirthdayAnswer()">
                Перевірити відповідь 🎂
            </button>
        </div>
    `;

    // Додаємо автоформатування для поля вводу
    const input = document.getElementById("birthdayInput");
    input.addEventListener("input", formatBirthdayInput);
}

function formatBirthdayInput(e) {
    let value = e.target.value.replace(/\D/g, ""); // Залишаємо тільки цифри
    if (value.length >= 2)
        value = value.substring(0, 2) + "." + value.substring(2);
    if (value.length >= 5)
        value = value.substring(0, 5) + "." + value.substring(5);
    if (value.length > 10) value = value.substring(0, 10);
    e.target.value = value;
}

function createGameInterface(container) {
    container.innerHTML = `
        <div class="game-container">
            <div class="game-intro">
                <h2>🎮 Міні-гра 🎮</h2>
                <div class="game-rules">
                    <div class="rule-item">🎯 <strong>Мета:</strong> Набрати 20 балів за 60 секунд</div>
                    <div class="rule-item">📱 <strong>Управління:</strong> Натискай кнопки ◀️ ▶️</div>
                    <div class="rule-item">✅ <strong>Лови:</strong></div>
                    <div class="food-examples">
                        <span class="good-food">Дануля = 3 бали</span>
                        <span class="good-food">🍝 🥟 🍟 🥚 = 1 бал</span>
                    </div>
                    <div class="rule-item">❌ <strong>Уникай:</strong></div>
                    <div class="food-examples">
                        <span class="bad-food">🍆 Баклажан = -2 бали</span>
                        <span class="bad-food">🍄 Гриб = -2 бали</span>
                    </div>
                </div>
            </div>
            <button class="answer-btn game-start-btn" id="gameStartBtn" onclick="startGame()">
                Почати гру! 🎮
            </button>
        </div>
    `;
}

function createAnimalInterface(container) {
    const question = questions[currentQuestionIndex];
    const optionsHTML = question.options
        .map(
            (option) => `
        <div class="animal-option" onclick="handleAnimalAnswer('${option.id}')">
            <img src="${option.image}" alt="${option.name}" class="animal-image">
            <div class="animal-info">
                <span class="animal-emoji">${option.emoji}</span>
                <span class="animal-name">${option.name}</span>
            </div>
        </div>
    `
        )
        .join("");

    container.innerHTML = `
        <div class="animal-container">
            <div class="animal-options">
                ${optionsHTML}
            </div>
        </div>
    `;
}

function createLoveInterface(container) {
    const question = questions[currentQuestionIndex];
    const optionsHTML = question.options
        .map(
            (option) => `
        <button class="love-option" onclick="handleLoveAnswer('${option.id}')">
            <span class="love-emoji">${option.emoji}</span>
            <span class="love-text">${option.text}</span>
        </button>
    `
        )
        .join("");

    container.innerHTML = `
        <div class="love-container">
            <div class="love-options">
                ${optionsHTML}
            </div>
        </div>
    `;
}

function createGirlfriendInterface(container) {
    container.innerHTML = `
        <div class="girlfriend-container">
            <div class="girlfriend-message">
                💖 Це найважливіше питання... 💖
            </div>
            <div class="girlfriend-buttons">
                <button class="girlfriend-yes-btn" onclick="handleGirlfriendAnswer('yes')">
                    <span class="btn-text">Так! 💕</span>
                    <div class="sparkles">✨</div>
                </button>
                
                <button class="girlfriend-no-btn" id="girlfriendNoBtn" onclick="moveNoButton()">
                    <span class="btn-text">Ні 💔</span>
                </button>
            </div>
           
        </div>
    `;
}

function moveNoButton() {
    const noBtn = document.getElementById("girlfriendNoBtn");
    const hintDiv = document.getElementById("girlfriendHint");

    if (!noBtn) return;

    // Показуємо підказку
    if (hintDiv) {
        hintDiv.style.display = "block";
    }

    // Генеруємо нові випадкові координати
    const maxX = window.innerWidth - 120; // Віднімаємо ширину кнопки
    const maxY = window.innerHeight - 60; // Віднімаємо висоту кнопки

    const newX = Math.random() * maxX;
    const newY = Math.random() * maxY;

    // Встановлюємо абсолютне позиціонування
    noBtn.style.position = "fixed";
    noBtn.style.left = newX + "px";
    noBtn.style.top = newY + "px";
    noBtn.style.zIndex = "1000";

    // Додаємо анімацію переміщення
    noBtn.style.transition = "all 0.3s ease";
}

function handleGirlfriendAnswer(answer) {
    if (answer === "yes") {
        // Зберігаємо відповідь
        localStorage.setItem(`answer_${currentQuestionIndex}`, "Так! 💕");

        // Запускаємо потужні ефекти одразу
        createFireworks();
        createHeartRain();
        createFloatingHearts();
        showCelebrationGifPopup(); // Замінюємо на popup версію
        playVictoryAnimation();

        // Показуємо прекрасний результат з гіфкою
        const resultContainer = document.getElementById("resultContainer");
        resultContainer.innerHTML = `
            <div class="girlfriend-success">
                <div class="celebration-gif">
                    <img src="./images/10/giphy.gif" alt="Celebration!" class="celebration-image">
                </div>
                <div class="hearts-celebration">💖💕💗💝💘💖💕💗💝💘</div>
                <h2 class="success-title">ТАК! ТАК! ТАК!</h2>
                <p class="success-message">😍 Ти сказала ТАК! Це найщасливіший момент мого життя! 😍</p>
                <p class="success-message">💕 Я кохаю тебе найбільше на світі! 💕</p>
                <p class="success-message">🌟 Тепер ми разом назавжди! 🌟</p>
                <div class="hearts-celebration">💖💕💗💝💘💖💕💗💝💘</div>
                <div class="sparkle-container">
                    <div class="sparkle">✨</div>
                    <div class="sparkle">🌟</div>
                    <div class="sparkle">⭐</div>
                    <div class="sparkle">💫</div>
                    <div class="sparkle">✨</div>
                </div>
                <button class="continue-btn" onclick="showFinalResults()">
                    ✨ Побачити всі результати ✨
                </button>
            </div>
        `;

        // Додаємо спеціальні ефекти
        document.body.style.background =
            "linear-gradient(135deg, #ff69b4, #ff1493, #dc143c, #ff69b4)";
        document.body.style.backgroundSize = "400% 400%";
        document.body.style.animation = "gradientShift 3s ease infinite";

        showHeartExplosion();

        resultContainer.style.display = "block";
        document.getElementById("questionContainer").style.display = "none";
    }
}

// Функції для святкових ефектів
function createFireworks() {
    const fireworksContainer = document.createElement("div");
    fireworksContainer.className = "fireworks-container";
    document.body.appendChild(fireworksContainer);

    for (let i = 0; i < 15; i++) {
        setTimeout(() => {
            const firework = document.createElement("div");
            firework.className = "firework";
            firework.style.left = Math.random() * 100 + "%";
            firework.style.top = Math.random() * 100 + "%";
            firework.innerHTML = "🎆";
            fireworksContainer.appendChild(firework);

            setTimeout(() => firework.remove(), 3000);
        }, i * 200);
    }

    setTimeout(() => fireworksContainer.remove(), 5000);
}

function createHeartRain() {
    const heartRainContainer = document.createElement("div");
    heartRainContainer.className = "heart-rain-container";
    document.body.appendChild(heartRainContainer);

    const hearts = ["💖", "💕", "💗", "💝", "💘", "❤️", "💙", "💜", "💚", "🧡"];

    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const heart = document.createElement("div");
            heart.className = "falling-heart";
            heart.style.left = Math.random() * 100 + "%";
            heart.style.animationDuration = Math.random() * 3 + 2 + "s";
            heart.style.fontSize = Math.random() * 20 + 15 + "px";
            heart.innerHTML = hearts[Math.floor(Math.random() * hearts.length)];
            heartRainContainer.appendChild(heart);

            setTimeout(() => heart.remove(), 5000);
        }, i * 100);
    }

    setTimeout(() => heartRainContainer.remove(), 8000);
}

function createFloatingHearts() {
    const floatingContainer = document.createElement("div");
    floatingContainer.className = "floating-hearts-container";
    document.body.appendChild(floatingContainer);

    for (let i = 0; i < 20; i++) {
        const heart = document.createElement("div");
        heart.className = "floating-heart";
        heart.style.left = Math.random() * 100 + "%";
        heart.style.top = Math.random() * 100 + "%";
        heart.style.animationDelay = Math.random() * 2 + "s";
        heart.innerHTML = "💖";
        floatingContainer.appendChild(heart);
    }

    setTimeout(() => floatingContainer.remove(), 10000);
}

function showCelebrationGifPopup() {
    // Створюємо popup контейнер для гіфки
    const popupContainer = document.createElement("div");
    popupContainer.className = "gif-popup-container";

    const gifPopup = document.createElement("div");
    gifPopup.className = "gif-popup";

    const gifImg = document.createElement("img");
    gifImg.src = "./images/10/giphy.gif";
    gifImg.alt = "Celebration!";
    gifImg.className = "popup-celebration-image";

    const closeBtn = document.createElement("button");
    closeBtn.innerHTML = "✨ Люблю тя ✨";
    closeBtn.className = "gif-popup-close";
    closeBtn.onclick = () => {
        popupContainer.style.animation =
            "popupFadeOut 0.5s ease-in-out forwards";
        setTimeout(() => popupContainer.remove(), 500);
    };

    gifPopup.appendChild(gifImg);
    gifPopup.appendChild(closeBtn);
    popupContainer.appendChild(gifPopup);
    document.body.appendChild(popupContainer);

    // Анімація появи
    setTimeout(() => {
        popupContainer.style.opacity = "1";
        gifPopup.style.transform = "scale(1)";
    }, 100);
}

function playVictoryAnimation() {
    // Тремтіння екрану
    document.body.style.animation = "victoryShake 0.5s ease-in-out 3";

    // Зміна кольору тла
    setTimeout(() => {
        document.body.style.background =
            "linear-gradient(45deg, #ff69b4, #ff1493, #dc143c, #ff69b4, #ffd700, #ff69b4)";
    }, 1000);
}

// Глобальні змінні для гри
let gameActive = false;
let gameScore = 0;
let gameTimeLeft = 60;
let gameTimer = null;
let vanyaPosition = 50; // відсоток від лівого краю
let fallingItems = [];
let gameAnimationFrame = null;
let moveDirection = null; // 'left', 'right', або null
let moveInterval = null;

// Налаштування гри
const gameSettings = {
    vanyaSpeed: 4,
    itemFallSpeed: 0.6, // Ще більше уповільнили для мобільних (було 1)
    itemSpawnRate: 0.045, // Трохи зменшили частоту появи
    gameWidth: window.innerWidth,
    gameHeight: window.innerHeight, // Повна висота екрану (було 0.7)
};

// Типи їжі з їх властивостями
const foodTypes = {
    danochka: { image: "./images/6/danochka.png", points: 3, isGood: true },
    pasta: { image: "./images/6/pasta.png", points: 1, isGood: true },
    pelmen: { image: "./images/6/pelmen.png", points: 1, isGood: true },
    pure: { image: "./images/6/pure.png", points: 1, isGood: true },
    yayce: { image: "./images/6/yayce.png", points: 1, isGood: true },
    baklazhan: { image: "./images/6/baklazhan.png", points: -2, isGood: false },
    grib: { image: "./images/6/grib.png", points: -2, isGood: false },
};

function startGame() {
    gameActive = true;
    gameScore = 0;
    gameTimeLeft = 60;
    fallingItems = [];
    vanyaPosition = 50;

    // Змінюємо інтерфейс на ігровий
    const container = document.querySelector(".game-container");
    container.innerHTML = `
        <div class="game-score">
            <span>Рахунок: <span id="gameScore">0</span> / 20</span>
            <span id="gameTimer">Час: 60s</span>
        </div>
        <div class="game-area" id="gameArea">
            <div class="vanya-character" id="vanyaCharacter">
                <img src="./images/6/vanya.webp" alt="Vanya" class="vanya-image">
            </div>
        </div>
        <div class="game-mobile-controls">
            <button class="mobile-control-btn" id="moveLeft">◀️</button>
            <button class="mobile-control-btn" id="moveRight">▶️</button>
        </div>
    `;

    // Робимо гру на весь екран
    enterFullscreen();

    // Оновлюємо UI
    updateGameScore();
    updateGameTimer();

    // Позиціонуємо Ваню
    updateVanyaPosition();

    // Запускаємо таймер
    gameTimer = setInterval(() => {
        gameTimeLeft--;
        updateGameTimer();

        if (gameTimeLeft <= 0) {
            endGame();
        }
    }, 1000);

    // Запускаємо основний цикл гри
    gameLoop();

    // Додаємо обробники клавіш
    document.addEventListener("keydown", handleGameKeys);

    // Додаємо обробники для мобільних кнопок
    setupMobileControls();
}

function setupMobileControls() {
    const leftBtn = document.getElementById("moveLeft");
    const rightBtn = document.getElementById("moveRight");

    if (leftBtn && rightBtn) {
        // Обробники для кнопки "ліворуч"
        leftBtn.addEventListener("touchstart", (e) => {
            e.preventDefault();
            startMoving("left");
        });
        leftBtn.addEventListener("touchend", (e) => {
            e.preventDefault();
            stopMoving();
        });
        leftBtn.addEventListener("mousedown", (e) => {
            e.preventDefault();
            startMoving("left");
        });
        leftBtn.addEventListener("mouseup", (e) => {
            e.preventDefault();
            stopMoving();
        });

        // Обробники для кнопки "праворуч"
        rightBtn.addEventListener("touchstart", (e) => {
            e.preventDefault();
            startMoving("right");
        });
        rightBtn.addEventListener("touchend", (e) => {
            e.preventDefault();
            stopMoving();
        });
        rightBtn.addEventListener("mousedown", (e) => {
            e.preventDefault();
            startMoving("right");
        });
        rightBtn.addEventListener("mouseup", (e) => {
            e.preventDefault();
            stopMoving();
        });
    }

    // Забороняємо прокрутку під час гри
    document.addEventListener("touchmove", preventScroll, { passive: false });
}

function preventScroll(e) {
    if (gameActive) {
        e.preventDefault();
    }
}

// Функції для мобільного управління
function startMoving(direction) {
    if (!gameActive) return;

    moveDirection = direction;
    if (moveInterval) clearInterval(moveInterval);

    moveInterval = setInterval(() => {
        if (moveDirection === "left" && vanyaPosition > 5) {
            vanyaPosition -= gameSettings.vanyaSpeed;
            updateVanyaPosition();
        } else if (moveDirection === "right" && vanyaPosition < 95) {
            vanyaPosition += gameSettings.vanyaSpeed;
            updateVanyaPosition();
        }
    }, 50); // Плавне переміщення кожні 50мс
}

function stopMoving() {
    moveDirection = null;
    if (moveInterval) {
        clearInterval(moveInterval);
        moveInterval = null;
    }
}

function enterFullscreen() {
    const gameContainer = document.querySelector(".game-container");
    const gameArea = document.getElementById("gameArea");

    // Додаємо класи для повноекранного режиму
    gameContainer.classList.add("fullscreen-game");

    // Оновлюємо розміри ігрової області
    gameArea.style.width = "100vw";
    gameArea.style.height = "70vh";

    // Приховуємо інші елементи
    document.body.classList.add("game-active");
}

function endGame() {
    gameActive = false;
    clearInterval(gameTimer);
    cancelAnimationFrame(gameAnimationFrame);
    document.removeEventListener("keydown", handleGameKeys);
    document.removeEventListener("touchmove", preventScroll);

    // Зупиняємо рух
    stopMoving();

    // Виходимо з повноекранного режиму
    exitFullscreen();

    // Показуємо результат
    const won = gameScore >= 20;
    const resultMessage = won
        ? `🎉 Перемога! Набрано ${gameScore} очок!`
        : `😢 Не вистачило очок: ${gameScore}/20`;

    handleAnswer("game", { score: gameScore, won: won });
}

function exitFullscreen() {
    const gameContainer = document.querySelector(".game-container");

    // Прибираємо класи повноекранного режиму
    if (gameContainer) {
        gameContainer.classList.remove("fullscreen-game");
    }
    document.body.classList.remove("game-active");

    // Прибираємо обробник прокрутки
    document.removeEventListener("touchmove", preventScroll);
}

function handleGameKeys(e) {
    if (!gameActive) return;

    if (e.key === "ArrowLeft" && vanyaPosition > 5) {
        vanyaPosition -= gameSettings.vanyaSpeed;
        updateVanyaPosition();
    } else if (e.key === "ArrowRight" && vanyaPosition < 95) {
        vanyaPosition += gameSettings.vanyaSpeed;
        updateVanyaPosition();
    }
}

function updateVanyaPosition() {
    const vanya = document.getElementById("vanyaCharacter");
    if (vanya) {
        vanya.style.left = vanyaPosition + "%";
    }
}

function updateGameScore() {
    const scoreElement = document.getElementById("gameScore");
    if (scoreElement) {
        scoreElement.textContent = gameScore;
    }
}

function updateGameTimer() {
    const timerElement = document.getElementById("gameTimer");
    if (timerElement) {
        timerElement.textContent = `Час: ${gameTimeLeft}s`;
    }
}

function gameLoop() {
    if (!gameActive) return;

    // Генеруємо нові предмети
    if (Math.random() < gameSettings.itemSpawnRate) {
        spawnFoodItem();
    }

    // Оновлюємо позиції предметів
    updateFallingItems();

    // Перевіряємо зіткнення
    checkCollisions();

    // Плануємо наступний кадр
    gameAnimationFrame = requestAnimationFrame(gameLoop);
}

function spawnFoodItem() {
    const foodNames = Object.keys(foodTypes);
    const foodName = foodNames[Math.floor(Math.random() * foodNames.length)];
    const food = foodTypes[foodName];

    const item = {
        id: Date.now() + Math.random(),
        type: foodName,
        x: Math.random() * 90 + 5, // 5-95% від ширини
        y: -10,
        element: null,
    };

    // Створюємо DOM елемент
    const gameArea = document.getElementById("gameArea");
    const itemElement = document.createElement("div");
    itemElement.className = "falling-item";
    itemElement.style.position = "absolute";
    itemElement.style.left = item.x + "%";
    itemElement.style.top = item.y + "%";
    itemElement.style.width = "40px";
    itemElement.style.height = "40px";
    itemElement.style.zIndex = "10";

    const img = document.createElement("img");
    img.src = food.image;
    img.style.width = "100%";
    img.style.height = "100%";
    img.style.objectFit = "contain";
    itemElement.appendChild(img);

    gameArea.appendChild(itemElement);
    item.element = itemElement;

    fallingItems.push(item);
}

function updateFallingItems() {
    fallingItems.forEach((item, index) => {
        item.y += gameSettings.itemFallSpeed;

        if (item.element) {
            item.element.style.top = item.y + "%";
        }

        // Видаляємо предмети, що впали
        if (item.y > 110) {
            if (item.element) {
                item.element.remove();
            }
            fallingItems.splice(index, 1);
        }
    });
}

function checkCollisions() {
    const vanyaElement = document.getElementById("vanyaCharacter");
    if (!vanyaElement) return;

    const vanyaRect = vanyaElement.getBoundingClientRect();

    fallingItems.forEach((item, index) => {
        if (!item.element) return;

        const itemRect = item.element.getBoundingClientRect();

        // Перевіряємо зіткнення
        if (
            vanyaRect.left < itemRect.right &&
            vanyaRect.right > itemRect.left &&
            vanyaRect.top < itemRect.bottom &&
            vanyaRect.bottom > itemRect.top
        ) {
            // Зіткнення!
            const food = foodTypes[item.type];
            gameScore += food.points;

            // Обмежуємо мінімальний рахунок нулем
            if (gameScore < 0) gameScore = 0;

            updateGameScore();

            // Додаємо візуальний ефект
            showScoreEffect(food.points, itemRect);

            // Видаляємо предмет
            item.element.remove();
            fallingItems.splice(index, 1);

            // Перевіряємо перемогу
            if (gameScore >= 20) {
                endGame();
            }
        }
    });
}

function showScoreEffect(points, rect) {
    const effect = document.createElement("div");
    effect.className = "score-effect";
    effect.textContent = points > 0 ? `+${points}` : `${points}`;
    effect.style.position = "fixed";
    effect.style.left = rect.left + "px";
    effect.style.top = rect.top + "px";
    effect.style.color = points > 0 ? "#4CAF50" : "#f44336";
    effect.style.fontSize = "20px";
    effect.style.fontWeight = "bold";
    effect.style.zIndex = "1000";
    effect.style.pointerEvents = "none";

    document.body.appendChild(effect);

    // Анімація
    effect.animate(
        [
            { transform: "translateY(0px)", opacity: 1 },
            { transform: "translateY(-50px)", opacity: 0 },
        ],
        {
            duration: 1000,
            easing: "ease-out",
        }
    ).onfinish = () => {
        effect.remove();
    };
}

function updateBeautyImage(value) {
    const image = document.getElementById("beautyImage");
    const valueDisplay = document.getElementById("sliderValue");

    valueDisplay.textContent = value;

    if (value <= 30) {
        image.src = "./images/2/bad.webp";
        image.alt = "Ну таке собі... 😬";
    } else if (value <= 70) {
        image.src = "./images/2/midl.jpg";
        image.alt = "Непогано! 😊";
    } else {
        image.src = "./images/2/good.jpeg";
        image.alt = "Вау! Красень! 😍";
    }
}

function handleSliderAnswer() {
    const slider = document.getElementById("beautySlider");
    const value = parseInt(slider.value);

    // Викликаємо обробку відповіді з значенням слайдера
    handleAnswer("slider", value);
}

let currentPhotoData = null;

function handlePhotoUpload(input) {
    const file = input.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            currentPhotoData = e.target.result;

            // Показуємо попередній перегляд
            const preview = document.getElementById("photoPreview");
            const previewImage = document.getElementById("previewImage");
            const uploadPlaceholder = document.querySelector(
                ".upload-placeholder"
            );

            previewImage.src = currentPhotoData;
            preview.style.display = "block";
            uploadPlaceholder.style.display = "none";
        };
        reader.readAsDataURL(file);
    }
}

function handlePhotoAnswer() {
    // Просто переходимо далі, незалежно від того чи є фото
    handleAnswer("photo", currentPhotoData || null);
}

function handleChoiceAnswer(choice) {
    handleAnswer("choice", choice);
}

function handleBirthdayAnswer() {
    const input = document.getElementById("birthdayInput");
    const userAnswer = input.value.trim();
    const question = questions[currentQuestionIndex];
    const isCorrect = userAnswer === question.correctAnswer;

    handleAnswer("birthday", { userAnswer, isCorrect });
}

function handleAnimalAnswer(animalId) {
    handleAnswer("animal", animalId);
}

function handleLoveAnswer(loveId) {
    handleAnswer("love", loveId);
}

function finishQuiz() {
    const resultContainer = document.getElementById("result");
    const resultContent = document.getElementById("result-content");

    // Показуємо підсумок всіх відповідей
    const savedAnswers = JSON.parse(
        localStorage.getItem("loveQuizAnswers") || "[]"
    );
    let summaryHTML =
        '<div class="answers-summary"><h3>📋 Твої відповіді:</h3>';

    savedAnswers.forEach((answer, index) => {
        if (answer) {
            summaryHTML += `<div class="answer-item">
                <strong>Питання ${index + 1}:</strong> ${
                answer.questionText
            }<br>
                <em>Відповідь: ${formatAnswer(answer)}</em>
            </div>`;
        }
    });

    summaryHTML += "</div>";

    resultContent.innerHTML = `
        <div class="final-message">
            <h2>🎉 Опитування завершено! 🎉</h2>
            <div class="final-emoji" style="font-size: 4rem; margin: 20px 0;">🥰💕✨</div>
            <p style="font-size: 1.5rem; color: #d63384; margin: 20px 0;">
                Дякую за твої відповіді! 💖
            </p>
            ${summaryHTML}
            <div class="final-cat">
                <div style="font-size: 5rem; margin: 20px 0;">😽</div>
                <div style="font-size: 1.2rem; color: #d63384;">
                    *відправляє повітряний поцілунок*
                </div>
            </div>
            <button onclick="restartQuiz()" class="nav-btn restart-btn">
                Почати знову 🔄
            </button>
        </div>
    `;

    resultContainer.style.display = "flex";

    // Великий феєрверк в кінці
    setTimeout(() => {
        createMegaFirework();
    }, 500);
}

function formatAnswer(answer) {
    if (answer.answer === "yes") return "Так 💕";
    if (answer.answer === "no") return "Ні 💔";
    if (answer.answer === "slider") return `${answer.value}/100 балів`;
    if (answer.answer === "photo") return "Фото завантажено! 📸";
    if (answer.answer === "choice") {
        return answer.value === "hugs" ? "Обійми 🤗" : "Поцілунок 💋";
    }
    if (answer.answer === "birthday") {
        const { userAnswer, isCorrect } = answer.value;
        return isCorrect
            ? `${userAnswer} ✅`
            : `${userAnswer} ❌ (правильно: 19.05.2005)`;
    }
    return answer.answer;
}

function restartQuiz() {
    currentQuestionIndex = 0;
    userAnswers = [];
    currentPhotoData = null;
    localStorage.removeItem("loveQuizAnswers");

    updateQuestion();

    const resultContainer = document.getElementById("result");
    const questionContainer = document.querySelector(".question-container");

    resultContainer.style.display = "none";
    questionContainer.style.display = "flex";

    createHeartRain();
}

function createMegaFirework() {
    const colors = [
        "#ff6b9d",
        "#ffd93d",
        "#6bcf7f",
        "#4d96ff",
        "#9c88ff",
        "#ff69b4",
        "#ff1493",
    ];

    for (let i = 0; i < 100; i++) {
        setTimeout(() => {
            const firework = document.createElement("div");
            firework.innerHTML = ["💖", "✨", "🎉", "💕", "🌟"][
                Math.floor(Math.random() * 5)
            ];
            firework.style.position = "fixed";
            firework.style.left = Math.random() * 100 + "vw";
            firework.style.top = Math.random() * 50 + "vh";
            firework.style.fontSize = Math.random() * 2 + 1 + "rem";
            firework.style.zIndex = "1001";
            firework.style.pointerEvents = "none";

            document.body.appendChild(firework);

            // Вибуховий ефект в всі сторони
            const angle = Math.random() * 2 * Math.PI;
            const distance = Math.random() * 300 + 100;
            const endX = Math.cos(angle) * distance;
            const endY = Math.sin(angle) * distance;

            firework.animate(
                [
                    {
                        transform: "scale(0) rotate(0deg)",
                        opacity: 1,
                    },
                    {
                        transform: "scale(1.5) rotate(180deg)",
                        opacity: 1,
                    },
                    {
                        transform: `translate(${endX}px, ${endY}px) scale(0) rotate(360deg)`,
                        opacity: 0,
                    },
                ],
                {
                    duration: Math.random() * 2000 + 1500,
                    easing: "ease-out",
                }
            ).onfinish = () => {
                firework.remove();
            };
        }, i * 50);
    }
}

// Ефекти
function createConfetti() {
    const colors = ["#ff6b9d", "#ffd93d", "#6bcf7f", "#4d96ff", "#9c88ff"];

    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const confetti = document.createElement("div");
            confetti.style.position = "fixed";
            confetti.style.left = Math.random() * 100 + "vw";
            confetti.style.top = "-10px";
            confetti.style.width = "10px";
            confetti.style.height = "10px";
            confetti.style.backgroundColor =
                colors[Math.floor(Math.random() * colors.length)];
            confetti.style.zIndex = "1000";
            confetti.style.borderRadius = "50%";
            confetti.style.pointerEvents = "none";

            document.body.appendChild(confetti);

            // Анімація падіння
            confetti.animate(
                [
                    { transform: "translateY(-10px) rotate(0deg)", opacity: 1 },
                    {
                        transform: `translateY(100vh) rotate(360deg)`,
                        opacity: 0,
                    },
                ],
                {
                    duration: Math.random() * 2000 + 1000,
                    easing: "ease-out",
                }
            ).onfinish = () => {
                confetti.remove();
            };
        }, i * 100);
    }
}

function createHeartExplosion() {
    const hearts = ["💖", "💕", "💘", "💝", "💗"];

    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            const heart = document.createElement("div");
            heart.innerHTML = hearts[Math.floor(Math.random() * hearts.length)];
            heart.style.position = "fixed";
            heart.style.left = "50%";
            heart.style.top = "50%";
            heart.style.fontSize = "2rem";
            heart.style.zIndex = "1000";
            heart.style.pointerEvents = "none";
            heart.style.transform = "translate(-50%, -50%)";

            document.body.appendChild(heart);

            // Вибуховий ефект
            const angle = (i / 20) * 2 * Math.PI;
            const distance = 200;
            const endX = Math.cos(angle) * distance;
            const endY = Math.sin(angle) * distance;

            heart.animate(
                [
                    {
                        transform: "translate(-50%, -50%) scale(0)",
                        opacity: 1,
                    },
                    {
                        transform: `translate(calc(-50% + ${endX}px), calc(-50% + ${endY}px)) scale(1)`,
                        opacity: 1,
                    },
                    {
                        transform: `translate(calc(-50% + ${
                            endX * 1.5
                        }px), calc(-50% + ${endY * 1.5}px)) scale(0)`,
                        opacity: 0,
                    },
                ],
                {
                    duration: 2000,
                    easing: "ease-out",
                }
            ).onfinish = () => {
                heart.remove();
            };
        }, i * 50);
    }
}

function createHeartRain() {
    const hearts = ["💖", "💕", "💘", "💝", "💗"];

    for (let i = 0; i < 15; i++) {
        setTimeout(() => {
            const heart = document.createElement("div");
            heart.innerHTML = hearts[Math.floor(Math.random() * hearts.length)];
            heart.style.position = "fixed";
            heart.style.left = Math.random() * 100 + "vw";
            heart.style.top = "-50px";
            heart.style.fontSize = "2rem";
            heart.style.zIndex = "1000";
            heart.style.pointerEvents = "none";

            document.body.appendChild(heart);

            heart.animate(
                [
                    { transform: "translateY(-50px) rotate(0deg)", opacity: 0 },
                    {
                        transform: "translateY(20px) rotate(180deg)",
                        opacity: 1,
                    },
                    {
                        transform: "translateY(100vh) rotate(360deg)",
                        opacity: 0,
                    },
                ],
                {
                    duration: 3000,
                    easing: "ease-in-out",
                }
            ).onfinish = () => {
                heart.remove();
            };
        }, i * 200);
    }
}

// Додаємо інтерактивність до сердечок і котиків
document.addEventListener("DOMContentLoaded", function () {
    // Додаємо клік-ефекти до фонових елементів
    const floatingHearts = document.querySelectorAll(".floating-hearts .heart");
    const cats = document.querySelectorAll(".cats-container .cat");

    floatingHearts.forEach((heart) => {
        heart.addEventListener("click", () => {
            heart.style.animation = "bounce 0.5s ease-in-out";
            setTimeout(() => {
                heart.style.animation = "float 6s ease-in-out infinite";
            }, 500);
        });
    });

    cats.forEach((cat) => {
        cat.addEventListener("click", () => {
            cat.style.transform = "scale(1.5) rotate(360deg)";
            setTimeout(() => {
                cat.style.transform = "";
            }, 500);
        });
    });

    // Відновлюємо збережений прогрес
    loadProgress();

    // Ініціалізуємо поточне питання
    updateQuestion();

    // Завантажуємо збережені відповіді
    const savedAnswers = JSON.parse(
        localStorage.getItem("loveQuizAnswers") || "[]"
    );
    if (savedAnswers.length > 0) {
        userAnswers = savedAnswers;
    }
});

// Додаємо звукові ефекти (використовуючи Web Audio API)
function playClickSound() {
    try {
        const audioContext = new (window.AudioContext ||
            window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(
            200,
            audioContext.currentTime + 0.1
        );

        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(
            0.01,
            audioContext.currentTime + 0.1
        );

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    } catch (e) {
        // Ігноруємо помилки з аудіо
    }
}
