// Game data
const gameData = {
    easy: [
        {
            images: ["🔥", "🔍", "🕯️", "💡"],
            answer: "FLAME",
            hint: "Hot and flickering"
        },
        {
            images: ["🐕", "🐈", "🐠", "🐦"],
            answer: "PETS",
            hint: "Beloved animal companions"
        },
        {
            images: ["👟", "🧦", "🧤", "🧢"],
            answer: "WEAR",
            hint: "You put these on your body"
        }
    ],
    hard: [
        {
            images: ["📚", "📱", "📰", "🖥️"],
            answer: "READ",
            hint: "Activity for your eyes and brain"
        },
        {
            images: ["🚢", "✈️", "🚗", "🚂"],
            answer: "TRAVEL",
            hint: "Moving from place to place"
        },
        {
            images: ["😊", "😂", "🎉", "🥳"],
            answer: "HAPPY",
            hint: "Positive emotional state"
        }
    ]
};

// DOM Elements
const landingPage = document.getElementById('landing-page');
const usernameContainer = document.getElementById('username-container');
const gameContainer = document.getElementById('game-container');
const resultsContainer = document.getElementById('results-container');
const playBtn = document.getElementById('play-btn');
const usernameForm = document.getElementById('username-form');
const usernameInput = document.getElementById('username-input');
const welcomeMessage = document.getElementById('welcome-message');
const picsContainer = document.getElementById('pics-container');
const letterBoxes = document.getElementById('letter-boxes');
const answerInput = document.getElementById('answer-input');
const submitAnswerBtn = document.getElementById('submit-answer');
const hintBtn = document.getElementById('hint-btn');
const currentLevelEl = document.getElementById('current-level');
const currentScoreEl = document.getElementById('current-score');
const progressBar = document.getElementById('progress-bar');
const resultScore = document.getElementById('result-score');
const resultStars = document.getElementById('result-stars');
const playAgainBtn = document.getElementById('play-again-btn');
const timerEl = document.getElementById('timer');

// Game state
let currentLevel = 1;
let currentRound = {};
let score = 0;
let username = '';
let timerInterval = null;
let timeLeft = 30;

// Check if username exists in localStorage
window.onload = function() {
    const storedUsername = localStorage.getItem('fourPicOneWordUsername');
    if (storedUsername) {
        username = storedUsername;
        checkStartPage();
    }
};

// Event Listeners
playBtn.addEventListener('click', () => {
    landingPage.style.display = 'none';
    usernameContainer.style.display = 'block';
});

usernameForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const inputValue = usernameInput.value.trim();
    
    // Validate username (letters and numbers only)
    if (/^[a-zA-Z0-9]+$/.test(inputValue)) {
        username = inputValue;
        localStorage.setItem('fourPicOneWordUsername', username);
        startGame();
    } else {
        alert('Username should contain only letters and numbers.');
    }
});

submitAnswerBtn.addEventListener('click', checkAnswer);

answerInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        checkAnswer();
    }
});

playAgainBtn.addEventListener('click', () => {
    resultsContainer.style.display = 'none';
    startGame();
});

hintBtn.addEventListener('click', showHint);

// Functions
function checkStartPage() {
    // If username exists, show landing page with play button
    landingPage.style.display = 'block';
    usernameContainer.style.display = 'none';
    gameContainer.style.display = 'none';
    resultsContainer.style.display = 'none';
}

function showHint() {
    alert(`Hint: ${currentRound.hint}`);
}

function startTimer() {
    clearInterval(timerInterval);
    timeLeft = 30;
    updateTimerDisplay();
    
    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            // Time's up logic
            alert(`Time's up! The answer was: ${currentRound.answer}`);
            
            // Move to next level
            currentLevel++;
            
            if (currentLevel <= 6) {
                loadRound();
            } else {
                endGame();
            }
        }
    }, 1000);
}

function updateTimerDisplay() {
    timerEl.textContent = `0:${timeLeft < 10 ? '0' + timeLeft : timeLeft}`;
    
    // Change color when time is running low
    if (timeLeft <= 10) {
        timerEl.style.color = '#e94e97';
    } else {
        timerEl.style.color = '#a387c8';
    }
}

function createLetterBoxes(word) {
    letterBoxes.innerHTML = '';
    
    for (let i = 0; i < word.length; i++) {
        const letterBox = document.createElement('div');
        letterBox.className = 'letter-box';
        letterBoxes.appendChild(letterBox);
    }
}

function startGame() {
    // Reset game state
    currentLevel = 1;
    score = 0;
    
    // Update UI
    usernameContainer.style.display = 'none';
    gameContainer.style.display = 'block';
    welcomeMessage.textContent = `Welcome, ${username}!`;
    currentLevelEl.textContent = currentLevel;
    currentScoreEl.textContent = score;
    progressBar.style.width = '0%';
    
    // Load first round
    loadRound();
}

function loadRound() {
    // Determine if it's an easy or hard round
    const isEasyRound = currentLevel <= 3;
    const roundIndex = isEasyRound ? currentLevel - 1 : currentLevel - 4;
    const roundData = isEasyRound ? gameData.easy[roundIndex] : gameData.hard[roundIndex];
    
    currentRound = roundData;
    
    // Update the pictures
    const picBoxes = picsContainer.querySelectorAll('.pic-box');
    picBoxes.forEach((box, index) => {
        const iconEl = box.querySelector('.pic-icon');
        iconEl.textContent = roundData.images[index];
    });
    
    // Create letter boxes for the answer
    createLetterBoxes(roundData.answer);
    
    // Clear answer input
    answerInput.value = '';
    answerInput.setAttribute('maxlength', roundData.answer.length);
    
    // Update progress
    currentLevelEl.textContent = currentLevel;
    currentScoreEl.textContent = score;
    progressBar.style.width = `${((currentLevel - 1) / 6) * 100}%`;
    
    // Start timer
    startTimer();
}

function checkAnswer() {
    const userAnswer = answerInput.value.trim().toUpperCase();
    
    if (userAnswer === currentRound.answer) {
        score++;
        clearInterval(timerInterval);
        alert('Correct! 🎉');
        currentScoreEl.textContent = score;
    } else {
        alert(`Incorrect! The answer was: ${currentRound.answer}`);
    }
    
    // Move to next level or end game
    currentLevel++;
    
    if (currentLevel <= 6) {
        loadRound();
    } else {
        endGame();
    }
}

function endGame() {
    clearInterval(timerInterval);
    gameContainer.style.display = 'none';
    resultsContainer.style.display = 'block';
    resultScore.textContent = `${score}/6`;
    
    // Set stars based on score
    let stars = '';
    if (score >= 5) {
        stars = '★★★★★';
    } else if (score >= 3) {
        stars = '★★★★';
    } else if (score >= 1) {
        stars = '★★★';
    } else {
        stars = '★★';
    }
    
    resultStars.textContent = stars;
}
