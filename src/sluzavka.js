const CSVmanager = require("./CSVmanager");

const lokacije_csv = "../data/lokacije_postaj.csv";
const locReader = new CSVmanager(lokacije_csv);
const povezave_SZ_csv = "../data/povezave_SZ.csv";
const SZReader = new CSVmanager(povezave_SZ_csv);
const povezave_physarum_csv = "../data/povezave_physarum.csv";
const physarumReader = new CSVmanager(povezave_physarum_csv);
const povezave_computer_csv = "../data/povezave_computer.csv";
const computerReader = new CSVmanager(povezave_computer_csv);



console.log(locReader.readCSV());
console.log(SZReader.readCSV());
console.log(physarumReader.readCSV());
console.log(computerReader.readCSV());