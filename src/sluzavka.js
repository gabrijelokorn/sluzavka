const CSVmanager = require("./csvManager");
const Postaja = require("./components/postaja");
const Povezava = require("./components/povezava");

// TODO: Sestavi računalniško generirano omrežje z uporabo postaj in zapiši v povezave_computer.csv

// Pripravi branje vsake cdv datoteke
const data_directory        = "../data/";
const lokacije_csv          = data_directory + "lokacije_postaj.csv";
const locReader             = new CSVmanager(lokacije_csv);
const povezave_SZ_csv       = data_directory + "povezave_SZ.csv";
const SZReader              = new CSVmanager(povezave_SZ_csv);
const povezave_physarum_csv = data_directory + "povezave_physarum.csv";
const physarumReader        = new CSVmanager(povezave_physarum_csv);
const povezave_computer_csv = data_directory + "povezave_computer.csv";
const computerReader        = new CSVmanager(povezave_computer_csv);


// v data_ime si shrani objekte prebranih csv datatek z uporabo funkcije v razredu CSVmanager
const data_lokacije         = locReader.readCSV();
const data_SZ               = SZReader.readCSV();
const data_physarum         = physarumReader.readCSV();
const data_computer         = computerReader.readCSV();

// z uporabo razredov Postaja in Povezava sestavi seznam postaj in povezav za vsa tri omrežja
function zgradi_omrezje (seznam_povezav) {
    let omrezje = [];
    seznam_povezav.forEach(element => {
        omrezje.push(new Povezava(element.Ime_postaje_1, element.Ime_postaje_2));
    });

    return omrezje;
}
function zgradi_postaje (seznam_postaj) {
    let postaje = [];
    seznam_postaj.forEach(element => {
        postaje.push(new Postaja(element.Ime_postaje, element.x, element.y));
    });
    return postaje;
}
const omrezje_SZ = zgradi_omrezje(data_SZ);
const omrezje_physarum = zgradi_omrezje(data_physarum);
const omrezje_computer = zgradi_omrezje(data_computer);
const postaje = zgradi_postaje(data_lokacije);

// TODO: kliči floyd-warshall za vsa tri omrežja in dobi ven seznam vseh najkrajših poti in postaj na teh poteh

// TODO: analiza podatkov
// TODO: funkcije za izris v html datoteki