class Card {
    constructor(symbol, flipCallback) {
        this.symbol = symbol; 
        this.flipCallback = flipCallback; 
        this.isFlipped = false; 
        this.element = document.createElement('div'); 
        this.setupCard(); 
    }

    //nastaveni pro kartu 
    setupCard() {
        const s = this.element.style;
        s.width = "100px";
        s.height = "100px";
        s.backgroundColor = "#2e3d49";
        s.borderRadius = "10px";
        s.display = "flex";
        s.alignItems = "center";
        s.justifyContent = "center";
        s.fontSize = "2em";
        s.color = "white";
        s.cursor = "pointer"; // Zmeni kurzor na ruku pri najeti mysi
        s.transition = "transform 0.3s, background-color 0.3s";
        s.userSelect = "none"; // Zabrani nechtenemu oznaceni emoji modrou barvou

        //vyvola funkci v Game.js a preda ji samu sebe (this)
        this.element.addEventListener('click', () => this.flipCallback(this));
    }

    //metoda pro vizuální otočení karty 
    flip() {
        this.isFlipped = true;
        this.element.style.transform = "rotateY(180deg)";
        this.element.style.backgroundColor = "#4caf50";
        this.element.innerText = this.symbol;
    }

    //metoda pro otočení karty zpet
    unflip() {
        this.isFlipped = false;
        this.element.style.transform = "rotateY(0deg)";
        this.element.style.backgroundColor = "#2e3d49";
        this.element.innerText = "";
    }
}