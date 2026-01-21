class Game {
    constructor(symbols) {
        this.symbols = symbols;
        this.attempts = 0;
        this.time = 0;
        this.matchedPairs = 0;
        this.timerInterval = null;
        this.gameStarted = false; 
        
        this.firstCard = null;
        this.secondCard = null;
        this.lockBoard = false; 

        this.board = document.getElementById('gameBoard');
        
        this.statsContainer = document.createElement('div');
        this.winModal = document.createElement('div');
        this.rulesModal = document.createElement('div');

        this.setupUI();
        this.start();
    }

    //vytvori a nastyluje prvky, ktere nejsou v html 
    setupUI() {
        this.statsContainer.style.fontSize = "1.2em";
        this.statsContainer.style.margin = "10px";
        this.statsContainer.innerHTML = `Čas: <span id="t">0</span>s | Pokusy: <span id="a">0</span>`;
        document.body.insertBefore(this.statsContainer, this.board);

        //statistiky
        this.board.style.display = "grid";
        this.board.style.gridTemplateColumns = "repeat(4, 110px)";
        this.board.style.gap = "15px";
        this.board.style.padding = "20px";

        //herni plocha (mrizka pomoci css grid)
        this.createButtons();
        this.createWinModal();
        this.createRulesModal();

        //interval pro spawn objektu na pozadi
        setInterval(() => {
            const randomSymbol = this.symbols[Math.floor(Math.random() * this.symbols.length)];
            new BackgroundObject(randomSymbol);
        }, 500);
    }

    //restart a pravidla
    createButtons() {
        const btnStyle = (b) => {
            Object.assign(b.style, {
                position: "fixed", bottom: "20px", padding: "10px 20px",
                backgroundColor: "#333", color: "white", border: "none",
                borderRadius: "5px", cursor: "pointer", fontSize: "1em", zIndex: "1500"
            });
        };

        //restart
        const restartBtn = document.createElement('button');
        restartBtn.innerText = "RESTART";
        btnStyle(restartBtn);
        restartBtn.style.left = "20px";
        restartBtn.onclick = () => this.start();

        //pravidla
        const rulesBtn = document.createElement('button');
        rulesBtn.innerText = "PRAVIDLA";
        btnStyle(rulesBtn);
        rulesBtn.style.right = "20px";
        rulesBtn.onclick = () => this.rulesModal.style.display = "flex";

        document.body.append(restartBtn, rulesBtn);
    }

    //modalni win okno
    createWinModal() {
        Object.assign(this.winModal.style, {
            position: "fixed", top: "0", left: "0", width: "100%", height: "100%",
            backgroundColor: "rgba(0,0,0,0.9)", display: "none",
            flexDirection: "column", alignItems: "center", justifyContent: "center",
            color: "white", zIndex: "2000"
        });
        document.body.appendChild(this.winModal);
    }

    //modalni pravidla
    createRulesModal() {
        Object.assign(this.rulesModal.style, {
            position: "fixed", top: "0", left: "0", width: "100%", height: "100%",
            backgroundColor: "rgba(0,0,0,0.8)", display: "none",
            alignItems: "center", justifyContent: "center", zIndex: "2000"
        });
        this.rulesModal.innerHTML = `
            <div style="background: white; color: black; padding: 25px; border-radius: 15px; text-align: center; max-width: 320px; box-shadow: 0 0 20px black;">
                <h3>Pravidla</h3>
                <p>Najdi dvojce karet za co nejkratší čas. Čas se spustí prvním kliknutím. Gl :).</p>
                <button id="closeR" style="padding: 10px 20px; cursor: pointer; border-radius: 5px; border: none;
                background: #2e3d49; color: white;">ZAVŘÍT</button></div>`;
        document.body.appendChild(this.rulesModal);
        this.rulesModal.querySelector('#closeR').onclick = () => this.rulesModal.style.display = "none";
    }

    //spusteni hry
    start() {
        this.winModal.style.display = "none";
        this.board.innerHTML = "";
        this.attempts = 0;
        this.time = 0;
        this.matchedPairs = 0;
        this.gameStarted = false; 
        this.resetTurn();
        
        document.getElementById('a').innerText = "0";
        document.getElementById('t').innerText = "0";

        clearInterval(this.timerInterval);

        const deck = [...this.symbols, ...this.symbols].sort(() => Math.random() - 0.5);
        deck.forEach(symbol => {
            const card = new Card(symbol, (c) => this.handleFlip(c));
            this.board.appendChild(card.element);
        });
    }

    //pomocna metoda pro timer
    startTimer() {
        if (!this.gameStarted) {
            this.gameStarted = true; 
            this.timerInterval = setInterval(() => {
                this.time++;
                document.getElementById('t').innerText = this.time;
            }, 1000);
        }
    }

    //otoceni karty
    handleFlip(card) {
        if (this.lockBoard || card.isFlipped || card === this.firstCard) return; //zabrani nechtenych akci

        this.startTimer();

        card.flip();
        if (!this.firstCard) {
            this.firstCard = card;
        } else {
            this.secondCard = card;
            this.attempts++;
            document.getElementById('a').innerText = this.attempts;
            this.checkMatch();
        }
    }

    //kontrola uhodnuti
    checkMatch() {
        this.lockBoard = true;
        const isMatch = this.firstCard.symbol === this.secondCard.symbol;

        if (isMatch) {
            this.matchedPairs++;
            this.resetTurn();
            if (this.matchedPairs === this.symbols.length) this.win();
        } else {
            setTimeout(() => {
                this.firstCard.unflip();
                this.secondCard.unflip();
                this.resetTurn();
            }, 1000);
        }
    }

    //vyhra
    win() {
        clearInterval(this.timerInterval); 
        this.winModal.style.display = "flex";
        this.winModal.innerHTML = `
            <div style="text-align: center; animation: fadeIn 0.5s;">
                <h1 style="font-size: 4em; margin: 0; color: #4caf50;">Vyhrál jsi!</h1>
                <p style="font-size: 1.8em;">Dokončeno za <strong>${this.time}</strong> sekund</p>
                <p style="font-size: 1.8em;">Celkový počet pokusů: <strong>${this.attempts}</strong></p>
                <button id="re" style="margin-top: 30px; padding: 15px 40px; font-size: 1.5em; cursor: pointer; border-radius: 10px; border: none; background: #4caf50; color: white;">HRÁT ZNOVU</button>
            </div>
        `;
        this.winModal.querySelector('#re').onclick = () => this.start();
    }

    //reset tahu
    resetTurn() {
        this.firstCard = null;
        this.secondCard = null;
        this.lockBoard = false;
    }
}