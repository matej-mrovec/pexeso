const symbols = ['🍎','🍌','🍒','🍇','🍉','🍋','🥝','🍓'];
let attempts = 0;
let time = 0;
let matchedPairs = 0;
let timerInterval = null;
let gameStarted = false;
let firstCard = null;
let secondCard = null;
let lockBoard = false;

const board = document.getElementById('gameBoard');
const statsContainer = document.createElement('div');
const winModal = document.createElement('div');
const rulesModal = document.createElement('div');

//nastavi prostredi hry
function setupUI() {
    //staty
    statsContainer.style.fontSize = "1.2em";
    statsContainer.style.margin = "10px";
    statsContainer.innerHTML = `Čas: <span id="t">0</span>s | Pokusy: <span id="a">0</span>`;
    document.body.insertBefore(statsContainer, board);

    //mriz na karty
    board.style.display = "grid";
    board.style.gridTemplateColumns = "repeat(4, 110px)";
    board.style.gap = "15px";
    board.style.padding = "20px";

    createButtons();
    createWinModal();
    createRulesModal();

    //animace pozadi
    setInterval(() => {
        const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
        new BackgroundObject(randomSymbol);
    }, 700);
}

//cudliky
function createButtons() {
    const btnStyle = (b) => {
        Object.assign(b.style, {
            position: "fixed", bottom: "20px", padding: "10px 20px",
            backgroundColor: "#333", color: "white", border: "none",
            borderRadius: "5px", cursor: "pointer", fontSize: "1em", zIndex: "1500"
        });
    };

    const restartBtn = document.createElement('button');
    restartBtn.innerText = "RESTART";
    btnStyle(restartBtn);
    restartBtn.style.left = "20px";
    restartBtn.onclick = startGame; 

    const rulesBtn = document.createElement('button');
    rulesBtn.innerText = "PRAVIDLA";
    btnStyle(rulesBtn);
    rulesBtn.style.right = "20px";
    rulesBtn.onclick = () => rulesModal.style.display = "flex";

    document.body.append(restartBtn, rulesBtn);
}

//start/restart
function startGame() {
    winModal.style.display = "none";
    board.innerHTML = "";
    attempts = 0;
    time = 0;
    matchedPairs = 0;
    gameStarted = false;
    firstCard = null;
    secondCard = null;
    lockBoard = false;
    
    document.getElementById('a').innerText = "0";
    document.getElementById('t').innerText = "0";
    clearInterval(timerInterval);

    //vytvor a zamichani karet
    const deck = [...symbols, ...symbols].sort(() => Math.random() - 0.5);
    deck.forEach(symbol => {
        //vytvoreni karty a pridani na hraci plochu
        const card = new Card(symbol, handleFlip);
        board.appendChild(card.element);
    });
}

//zapnuti timeru
function startTimer() {
    if (!gameStarted) {
        gameStarted = true;
        timerInterval = setInterval(() => {
            time++;
            document.getElementById('t').innerText = time;
        }, 1000);
    }
}

//otaceni karet
function handleFlip(card) {
    if (lockBoard || card.isFlipped || card === firstCard) return;

    startTimer();
    card.flip();

    if (!firstCard) {
        firstCard = card;
    } else {
        secondCard = card;
        attempts++;
        document.getElementById('a').innerText = attempts;
        checkMatch();
    }
}

//kontrola (stejne nebo jine dvojice)
function checkMatch() {
    lockBoard = true;
    const isMatch = firstCard.symbol === secondCard.symbol;

    if (isMatch) {
        matchedPairs++;
        resetTurn();
        if (matchedPairs === symbols.length) showWinScreen();
    } else {
        setTimeout(() => {
            firstCard.unflip();
            secondCard.unflip();
            resetTurn();
        }, 1000);
    }
}

//vynulovani tahu
function resetTurn() {
    firstCard = null;
    secondCard = null;
    lockBoard = false;
}

//win ani
function showWinScreen() {
    clearInterval(timerInterval);
    winModal.style.display = "flex";
    winModal.innerHTML = `
        <div style="text-align: center;">
            <h1 style="font-size: 3em; color: #4caf50;">Vyhrál jsi!</h1>
            <p>Čas: ${time}s | Pokusy: ${attempts}</p>
            <button onclick="startGame()" style="padding: 10px 20px; cursor: pointer;">HRÁT ZNOVU</button>
        </div>`;
}

//win okno
function createWinModal() {
    Object.assign(winModal.style, {
        position: "fixed", top: "0", left: "0", width: "100%", height: "100%",
        backgroundColor: "rgba(0,0,0,0.9)", display: "none",
        flexDirection: "column", alignItems: "center", justifyContent: "center",
        color: "white", zIndex: "2000"
    });
    document.body.appendChild(winModal);
}

//pravidla okno
function createRulesModal() {
    Object.assign(rulesModal.style, {
        position: "fixed", top: "0", left: "0", width: "100%", height: "100%",
        backgroundColor: "rgba(0,0,0,0.8)", display: "none",
        alignItems: "center", justifyContent: "center", zIndex: "2000"
    });
    rulesModal.innerHTML = `<div style="background:white;color:black;padding:20px;border-radius:10px;text-align:center;">
        <h3>Pravidla</h3>
        <p>Najdi dvojce za co nejlepší čas a s co nejméně pokusy! Gl :).</p>
        <button onclick="rulesModal.style.display='none'">Zavřít</button>
    </div>`;
    document.body.appendChild(rulesModal);
}

setupUI();
startGame();
