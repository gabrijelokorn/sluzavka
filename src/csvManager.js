const {load} = require('csv-load-sync');

class CSVmanager {
    constructor(ime_datoteke) {
        this.ime_datoteke = ime_datoteke;
    }
    
    readCSV () {
        const csv = load(this.ime_datoteke);
        return csv;
    }
}

module.exports = CSVmanager;