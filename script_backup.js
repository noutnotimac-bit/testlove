// Масив з питанн        emoji: "💋",
        type: "photo"
    },
];

let currentQuestionIndex = 0;uestions = [
    {
        id: 1,
        text: "Чи вважаєш ти мене милим? 🥺",
        emoji: "�",
        type: "yesno",
    },
    {
        id: 2,
        text: "Наскільки я красивий від 0 до 100? 😏",
        emoji: "�",
        type: "slider",
    },
    {
        id: 3,
        text: "Завдання: Поцілуй себе в щічку і додай фотодоказ! 😘�",
        emoji: "�",
        type: "photo"
    },
        id: 3,
        text: "Чи любиш ти коли я готую для тебе? 👨‍🍳",
        emoji: "😋",
        type: "yesno",
    },
];

let currentQuestionIndex = 0;

// Функція обробки відповідей
function handleAnswer(answer, value = null) {
    const resultContainer = document.getElementById("result");
    const resultContent = document.getElementById("result-content");
    const questionContainer = document.querySelector(".question-container");

    // Приховуємо питання
    questionContainer.style.display = "none";

    if (answer === "slider") {
        showSliderResult(resultContent, value);
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

function showPositiveResult(container) {
    container.innerHTML = `
        <div class="result-text">Ааааа, я так знав! 💕</div>
        <div class="result-emoji">😍🥰😘</div>
        <div class="social-credit-container">
            <img src="./images/1/plus-social-credit.jpeg" alt="Plus Social Credit" class="social-credit-img">
            <div class="credit-text">+1000 Соціальних кредитів! 🎉</div>
        </div>
        <div class="love-declaration">
            <p style="font-size: 1.3rem; color: #d63384; margin: 20px 0; font-weight: bold;">
                Цьом 💖💖💖
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
        resultText = "Ой... ну добре 😅";
        resultEmoji = "😬😅";
        imageInfo = "Ну таке собі... 😬";
    } else if (value <= 70) {
        resultText = "Непогано! 😊";
        resultEmoji = "😊👌";
        imageInfo = "Непогано! 😊";
    } else {
        resultText = "Вау! Так і знала! 😍";
        resultEmoji = "😍🔥✨";
        imageInfo = "Вау! Красень! 😍";
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

    // Приховуємо результат і показуємо питання знову
    resultContainer.style.display = "none";
    questionContainer.style.display = "flex";

    // Додаємо милу анімацію з сердечками
    createHeartRain();
}

function nextQuestion() {
    currentQuestionIndex++;
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

function finishQuiz() {
    const resultContainer = document.getElementById("result");
    const resultContent = document.getElementById("result-content");

    resultContent.innerHTML = `
        <div class="final-message">
            <h2>🎉 Опитування завершено! 🎉</h2>
            <div class="final-emoji" style="font-size: 4rem; margin: 20px 0;">🥰💕✨</div>
            <p style="font-size: 1.5rem; color: #d63384; margin: 20px 0;">
                Дякую за твої відповіді! 💖
            </p>
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

function restartQuiz() {
    currentQuestionIndex = 0;
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

// Додаткові стилі для нових кнопок
const style = document.createElement("style");
style.textContent = `
    .try-again-btn, .restart-btn {
        padding: 12px 25px;
        border: none;
        border-radius: 25px;
        background: linear-gradient(45deg, #ff6b9d, #c44569);
        color: white;
        font-size: 1.1rem;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.3s ease;
        margin-top: 15px;
        font-family: inherit;
        box-shadow: 0 5px 15px rgba(255, 107, 157, 0.4);
    }
    
    .try-again-btn:hover, .restart-btn:hover {
        transform: translateY(-2px) scale(1.05);
        box-shadow: 0 8px 20px rgba(255, 107, 157, 0.6);
    }
    
    .heart-rain {
        font-size: 1.5rem;
        animation: pulse 1s infinite;
        margin: 15px 0;
    }
    
    .meme-container, .sad-container {
        background: rgba(255, 255, 255, 0.3);
        border-radius: 15px;
        padding: 20px;
        margin: 20px 0;
        border: 2px solid rgba(255, 182, 193, 0.5);
    }
    
    .cute-cat, .dramatic-cat {
        animation: bounce 2s ease-in-out infinite;
    }
    
    .love-declaration {
        background: linear-gradient(45deg, rgba(255, 107, 157, 0.1), rgba(196, 69, 105, 0.1));
        border-radius: 15px;
        padding: 20px;
        margin-top: 20px;
        border: 2px dashed #ff6b9d;
    }
`;
document.head.appendChild(style);

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

// Додаємо звук до кнопок
document.addEventListener("DOMContentLoaded", function () {
    const buttons = document.querySelectorAll(".answer-btn");
    buttons.forEach((button) => {
        button.addEventListener("click", playClickSound);
    });

    // Ініціалізуємо перше питання
    updateQuestion();
});
