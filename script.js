const gameData = {
    easy: [
        {
            images: [shhs/cute1.jpg, shhs/cute2.jpg, shhs/cute3.jpg, shhs/cute4.jpg],
            answer: "CUTE",
            hint: "adorable, me, celine"
        },
        {
            images: ["images/croc1.jpg", "images/croc2.jpg", "images/croc3.jpg", "images/croc4.jpg"],
            answer: "CROCS",
            hint: "marami sa senate"
        },
        {
            images: ["images/apple1.jpg", "images/apple2.jpg", "images/apple3.jpg", "images/apple4.jpg"],
            answer: "APPLE",
            hint: "crim student: ate pa print ate: a4? crim student: apple"
        }
    ],
    hard: [
        {
            images: ["images/jojo1.jpg", "images/jojo2.jpg", "images/jojo3.jpg", "images/jojo4.jpg"],
            answer: "JOJO",
            hint: "name nila lahat"
        },
        {
            images: ["images/corrupt1.jpg", "images/corrupt2.jpg", "images/corrupt3.jpg", "images/corrupt4.jpg"],
            answer: "CORRUPT",
            hint: "government"
        },
        {
            images: ["images/trapo1.jpg", "images/trapo2.jpg", "images/trapo3.jpg", "images/trapo4.jpg"],
            answer: "TRAPO",
            hint: "mar"
        }
    ]
};

document.addEventListener('DOMContentLoaded', function() {
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

    let currentLevel = 1;
    let currentRound = {};
    let score = 0;
    let username = '';
    let timerInterval = null;
    let timeLeft = 30;

    const storedUsername = localStorage.getItem('fourPicOneWordUsername');
    if (storedUsername) {
        username = storedUsername;
        checkStartPage();
    }

    playBtn.addEventListener('click', () => {
        landingPage.style.display = 'none';
        usernameContainer.style.display = 'block';
    });

    usernameForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const inputValue = usernameInput.value.trim();
        
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

    function checkStartPage() {
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
                alert(`Time's up! The answer was: ${currentRound.answer}`);
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
        timerEl.style.color = timeLeft <= 10 ? '#e94e97' : '#a387c8';
    }

    function createLetterBoxes(word) {
        letterBoxes.innerHTML = '';
        for (let i = 0; i < word.length; i++) {
            const letterBox = document.createElement('div');
            letterBox.className = 'letter-box';
            letterBox.textContent = '_';
            letterBoxes.appendChild(letterBox);
        }
    }

    function startGame() {
        currentLevel = 1;
        score = 0;
        usernameContainer.style.display = 'none';
        gameContainer.style.display = 'block';
        welcomeMessage.textContent = `Welcome, ${username}!`;
        currentLevelEl.textContent = currentLevel;
        currentScoreEl.textContent = score;
        progressBar.style.width = '0%';
        loadRound();
    }

    function loadRound() {
        const isEasyRound = currentLevel <= 3;
        const roundIndex = isEasyRound ? currentLevel - 1 : currentLevel - 4;
        const roundData = isEasyRound ? gameData.easy[roundIndex] : gameData.hard[roundIndex];
        
        currentRound = roundData;
        
        const picBoxes = picsContainer.querySelectorAll('.pic-box');
        picBoxes.forEach((box, index) => {
            box.innerHTML = `<img src="${roundData.images[index]}" alt="Game image" class="game-image">`;
        });
        
        createLetterBoxes(roundData.answer);
        answerInput.value = '';
        answerInput.focus();
        answerInput.setAttribute('maxlength', roundData.answer.length);
        currentLevelEl.textContent = currentLevel;
        currentScoreEl.textContent = score;
        progressBar.style.width = `${((currentLevel - 1) / 6) * 100}%`;
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
        
        let stars = '';
        if (score >= 5) stars = '★★★★★';
        else if (score >= 3) stars = '★★★★';
        else if (score >= 1) stars = '★★★';
        else stars = '★★';
        
        resultStars.textContent = stars;
    }
});
