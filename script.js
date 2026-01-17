const gameBoard = document.getElementById('gameBoard');
const timerDisplay = document.getElementById('timer');
const attemptsDisplay = document.getElementById('attempts');

const restartBtn = document.getElementById('restartBtn');
const rulesBtn = document.getElementById('rulesBtn');
const rulesModal = document.getElementById('rulesModal');
const closeModal = document.getElementById('closeModal');

const symbols = ['🍎','🍌','🍒','🍇','🍉','🍋','🥝','🍓'];
let cards = [...symbols, ...symbols];

let firstCard = null;
let secondCard = null;
let lockBoard = false;
let attempts = 0;
let matchedPairs = 0;

let timer = 0;
let timerInterval = null;
let timerStarted = false;

function startGame() {
    gameBoard.innerHTML = "";
    cards.sort(() => Math.random() - 0.5);

    firstCard = null;
    secondCard = null;
    lockBoard = false;
    attempts = 0;
    matchedPairs = 0;
    attemptsDisplay.innerText = attempts;

    timer = 0;
    timerDisplay.innerText = 0;
    timerStarted = false;
    clearInterval(timerInterval);

    cards.forEach(symbol => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.symbol = symbol;
        card.innerText = '';
        card.addEventListener('click', flipCard);
        gameBoard.appendChild(card);
    });
}

function startTimer() {
    if (!timerStarted) {
        timerStarted = true;
        timerInterval = setInterval(() => {
            timer++;
            timerDisplay.innerText = timer;
        }, 1000);
    }  
}

function flipCard() {
    startTimer();

    if (lockBoard || this === firstCard) return;

    this.classList.add('flipped');
    this.innerText = this.dataset.symbol;

    if (!firstCard) {
        firstCard = this;
    } else {
    secondCard = this;
    attempts++;
    attemptsDisplay.innerText = attempts;
    checkMatch();
   }
}

function checkMatch() {
    if (firstCard.dataset.symbol === secondCard.dataset.symbol) {
        firstCard.removeEventListener('click', flipCard);
        secondCard.removeEventListener('click', flipCard);
        matchedPairs++;

    if (matchedPairs === symbols.length) {
        clearInterval(timerInterval);
        setTimeout(() => {
            alert(`Hotovo!  
            Čas: ${timer} s  
            Pokusy: ${attempts}`);
        }, 300);
    }

    resetBoard();
    } else {
        lockBoard = true;
        setTimeout(() => {
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
            firstCard.innerText = '';
            secondCard.innerText = '';
            resetBoard();
        }, 1000);
    }
}

function resetBoard() {
    [firstCard, secondCard, lockBoard] = [null, null, false];
}

restartBtn.addEventListener('click', startGame);

rulesBtn.addEventListener('click', () => {
    rulesModal.style.display = "flex";
});

closeModal.addEventListener('click', () => {
    rulesModal.style.display = "none";
});

window.addEventListener('click', (e) => {
    if (e.target === rulesModal) {
        rulesModal.style.display = "none";
    }
});

startGame();

function createFloatingObject() {
    const container = document.getElementById('background-objects');
    const obj = document.createElement('div');
    obj.classList.add('object');

    const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
    obj.innerText = randomSymbol;

    const x = Math.random() * (window.innerWidth - 50);
    const y = Math.random() * (window.innerHeight - 50);

    obj.style.left = `${x}px`;
    obj.style.top = `${y}px`;

    container.appendChild(obj);

    setTimeout(() => {
        obj.remove();
    }, 5000);
}

setInterval(createFloatingObject, 500);