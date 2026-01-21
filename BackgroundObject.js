class BackgroundObject {
    constructor(symbol) {
        this.element = document.createElement('div');
        this.element.innerText = symbol;
        this.init(); // inicializace a animace, proto init :)
    }

    init() {
        const s = this.element.style;
        s.position = "absolute";
        //nahodná pozice kdekoli na obrazovce
        s.left = Math.random() * window.innerWidth + "px";
        s.top = Math.random() * window.innerHeight + "px";
        s.zIndex = "-1";
        s.fontSize = "40px";

        document.getElementById('background-objects').appendChild(this.element);

        //animace zvetseni a zmizeni
        const animation = this.element.animate([
            { transform: 'scale(0)', opacity: 0 }, // Začátek: nic
            { transform: 'scale(1.2)', opacity: 0.8, offset: 0.5 }, // Střed: zvětšení
            { transform: 'scale(0)', opacity: 0 } // Konec: zmizení
        ], {
            duration: 3000, 
            easing: 'ease-in-out'
        });

        //hned jak animace skonci objekt se uplne smaze z html aby se neplnila pamet
        animation.onfinish = () => this.element.remove();
    }
}