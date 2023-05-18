import _ from 'lodash';
import postaja from './components/postaja';
import povezava from './components/povezava';

import data_lokacije from '../data/lokacije_postaj.csv';
import data_SZ from '../data/povezave_SZ.csv'
import data_physarum from '../data/povezave_physarum.csv'
import data_computer from '../data/povezave_computer.csv'

console.log(typeof(data_SZ[2]));

import 'bootstrap';
import './scss/styles.scss'

// z uporabo razredov Postaja in Povezava sestavi seznam postaj in povezav za vsa tri omrežja
function zgradi_postaje (seznam_postaj) {
    let postaje = [];
    seznam_postaj.forEach(element => {
        postaje.push(new postaja(element.Ime_postaje, element.x, element.y));
    });
    return postaje;
}
const postaje = zgradi_postaje(data_lokacije);

function zgradi_omrezje (seznam_povezav) {
    let omrezje = [];

    seznam_povezav.forEach(element => {
        omrezje.push(new povezava(postaje.find(p => p.ime == element.Ime_postaje_1), postaje.find(p => p.ime == element.Ime_postaje_2)));
    });
    
    return omrezje;
}

const omrezje_SZ = zgradi_omrezje(data_SZ);
const omrezje_physarum = zgradi_omrezje(data_physarum);
const omrezje_computer_sz = zgradi_omrezje(data_computer);
const omrezje_computer_physarum = zgradi_omrezje(data_computer);
const omrezje_custom = zgradi_omrezje([]);

function poisci_postajo_po_imenu (ime_postaje) {
    return postaje.find(p => p.ime == ime_postaje);
}

function dolzina_omrezja(omrezje){
    let dolzina = 0;
    omrezje.forEach(element => {
        dolzina += element.razdalja();
    }); 
    return dolzina;
}

/* funkcija sosednje_postaje vzame
    @param postaja kot postajo v omrezju
    @param omrezje kot omrezje povezav (sz, rač, physarum)ž
    in vrne seznam postaj od postaje
*/
function sosednje_postaje(postaja, omrezje) {
    let seznam_sosed = [];
    omrezje.forEach(element => {
        if (element.A == postaja) {
            seznam_sosed.push(element.B);
        } else if(element.B == postaja) {
            seznam_sosed.push(element.A);
        }
    });
    return seznam_sosed;
}

function najkrajsa_razdalja(trenutna_postaja, koncna_postaja, prepotovane_postaje, omrezje) {

    if (prepotovane_postaje.find(obiskana => obiskana == trenutna_postaja)) {
        return false;
    }
    prepotovane_postaje.push(trenutna_postaja);
    
    if (trenutna_postaja == koncna_postaja) {
        return {
            razdalja: 0,
            postaje_na_najkrajsi_poti: [trenutna_postaja]
        };
    }
    
    let sosede = sosednje_postaje(trenutna_postaja, omrezje);
    let primerjava_sosed = [];
    for (let soseda of sosede) {
        let soseda_pot = najkrajsa_razdalja(soseda, koncna_postaja, [...prepotovane_postaje], omrezje);
        
        if (soseda_pot) {
            soseda_pot.razdalja += trenutna_postaja.razdalja(soseda);
            soseda_pot.postaje_na_najkrajsi_poti.push(trenutna_postaja);
            primerjava_sosed.push(soseda_pot);
        }
    }

    let najboljsa_soseda = Number.MAX_VALUE;
    let kandidat = undefined;
    for (let soseda of primerjava_sosed) {
        if (soseda.razdalja < najboljsa_soseda) {
            najboljsa_soseda = soseda.razdalja;
            kandidat = soseda;
        }
    }
    return kandidat;
}


// HTML izpisovanje postaj
function inicializacija_tabele_postaj () {

    var seznam_postaj_head = document.getElementById("seznam_postaj_head");
    var seznam_postaj_haederRow = document.createElement("tr");

    var seznam_postaj_h1 = document.createElement("th");
    seznam_postaj_h1.textContent = "#";
    var seznam_postaj_h2 = document.createElement("th");
    seznam_postaj_h2.textContent = "Ime postaje";

    seznam_postaj_haederRow.appendChild(seznam_postaj_h1);
    seznam_postaj_haederRow.appendChild(seznam_postaj_h2);

    seznam_postaj_head.appendChild(seznam_postaj_haederRow);
    
    var seznam_postaj_body = document.getElementById("seznam_postaj_body");
    for (let i = 0; i < postaje.length; i++) {
        var row = document.createElement("tr");

        var zap_st = document.createElement("td");
        zap_st.textContent = i + 1;

        var ime = document.createElement("td");
        ime.textContent = postaje[i].ime;

        row.appendChild(zap_st);
        row.appendChild(ime);

        seznam_postaj_body.appendChild(row);
    }
}
inicializacija_tabele_postaj();


// HTML izpisovanje postaj
function posodobitev_tabele_povezav () {
    var omrezje;
    switch (document.getElementById("izbrano_omrezje").value) {
        case "Slovenske Železnice":
            omrezje = omrezje_SZ;
            break;
        case "Physarum":
            omrezje = omrezje_physarum;
            break;
        case "CG (SZ)":
            omrezje = omrezje_computer_sz;
            break;
        case "CG (Physarum)":
            omrezje = omrezje_computer_physarum;
            break;
        case "Custom":
            omrezje = omrezje_custom;
            break;
        default:
            omrezje = omrezje_SZ;
            break;
    }

    var seznam_povezav_head_sz = document.getElementById("seznam_povezav_head");
    seznam_povezav_head_sz.innerHTML = "";
    var seznam_povezav_head_sz_haederRow = document.createElement("tr");

    var seznam_povezav_h1 = document.createElement("th");
    seznam_povezav_h1.textContent = "Začetna postaja";
    var seznam_povezav_h2 = document.createElement("th");
    seznam_povezav_h2.textContent = "Končna postaja";
    var seznam_povezav_h3 = document.createElement("th");
    seznam_povezav_h3.textContent = "Dolžina";

    seznam_povezav_head_sz_haederRow.appendChild(seznam_povezav_h1);
    seznam_povezav_head_sz_haederRow.appendChild(seznam_povezav_h2);
    seznam_povezav_head_sz_haederRow.appendChild(seznam_povezav_h3);

    seznam_povezav_head_sz.appendChild(seznam_povezav_head_sz_haederRow);
    
    var seznam_postaj_body = document.getElementById("seznam_povezav_body");
    seznam_postaj_body.innerHTML = "";
    for (let i = 0; i < omrezje.length; i++) {
        var row = document.createElement("tr");

        var postajaA = document.createElement("td");
        postajaA.textContent = omrezje[i].A.ime;
        var postajaB = document.createElement("td");
        postajaB.textContent = omrezje[i].B.ime;

        var razdalja = document.createElement("td");
        razdalja.textContent = omrezje[i].razdalja().toFixed(2);

        row.appendChild(postajaA);
        row.appendChild(postajaB);
        row.appendChild(razdalja);

        seznam_postaj_body.appendChild(row);
    }
}
const select_omrezje = document.getElementById("izbrano_omrezje");
select_omrezje.addEventListener("change", posodobitev_tabele_povezav);
posodobitev_tabele_povezav();


function draw_circle (x, y) {
    // var slika = document.getElementById("sredinska");
    // var ctx = slika.getContext("2d");

    // ctx.fillStyle = "#FF0000";
    var canvas = document.getElementById("sredinska");
var ctx = canvas.getContext("2d");
const myImg = new Image(200,200);
myImg.src = "../images/zemljevid_elektroenergetika_splet.jpg"
ctx.beginPath();
ctx.arc(95,50,40,0,2*Math.PI);
}

draw_circle(1, 1);