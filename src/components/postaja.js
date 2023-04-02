class Postaja {
    constructor (ime, x, y) {
        this.ime = ime;
        this.x = x;
        this.y = y;
    }

    razdalja(destination) {
        return Math.sqrt(Math.pow((this.x - destination.x), 2) + Math.pow((this.y - destination.y), 2));
    }
}

module.exports = Postaja