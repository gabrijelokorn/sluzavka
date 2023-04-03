class Povezava {
    constructor(zacetek, konec) {
        this.A = zacetek;
        this.B = konec;
    }

    razdalja () {
        return 0.26591231 * Math.sqrt(Math.pow((this.A.x - this.B.x), 2) + Math.pow((this.A.y - this.B.y), 2));
    }
}

module.exports = Povezava;