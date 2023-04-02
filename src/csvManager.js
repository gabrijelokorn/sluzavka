const {load} = require('csv-load-sync');

class CSVmanager {
    constructor(ime_datoteke) {
        this.ime_datoteke = ime_datoteke;
    }
    
    readCSV () {
        return load(this.ime_datoteke);
    }
}

module.exports = CSVmanager;