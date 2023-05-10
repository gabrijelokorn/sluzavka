import _ from 'lodash';
import postaja from './components/postaja';
import povezava from './components/povezava';

import data_lokacije from '../data/lokacije_postaj.csv';
import data_SZ from '../data/povezave_SZ.csv'
import data_physarum from '../data/povezave_physarum.csv'
import data_computer from '../data/povezave_computer.csv'

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
const omrezje_computer = zgradi_omrezje(data_computer);
/* izpiši množice postaj za omrežje */
// console.log(omrezje_SZ);
// console.log(omrezje_physarum);
// console.log(omrezje_computer);

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
/* izpiši dolžine omrežij */
// console.log(dolzina_omrezja(omrezje_SZ));
// console.log(dolzina_omrezja(omrezje_SZ));
// console.log(dolzina_omrezja(omrezje_SZ));

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
/* izpiši najkrajše razdalje med dvema povezavama */
console.log(najkrajsa_razdalja(poisci_postajo_po_imenu("Kranj"), poisci_postajo_po_imenu("Kočevje"), [], omrezje_SZ));
// console.log(dolzina_omrezja(omrezje_SZ));
// console.log(dolzina_omrezja(omrezje_SZ));


// // TODO: kliči floyd-warshall za vsa tri omrežja in dobi ven seznam vseh najkrajših poti in postaj na teh poteh

// // TODO: analiza podatkov
// // TODO: funkcije za izris v html datoteki
