import _ from 'lodash';
import postaja from './components/postaja';
import povezava from './components/povezava';
import delaunay from './algorithms/delaunay';

import data_lokacije from '../data/lokacije_postaj.csv';
import data_SZ from '../data/povezave_SZ.csv'
import data_physarum from '../data/povezave_physarum.csv'

import 'bootstrap';
import './scss/styles.scss'

const SLIKA_ZEMLJEVIDA_X = 950;
const SLIKA_ZEMLJEVIDA_Y = 658;

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
const omrezje_mst = tvori_MST();
const omrezje_delaunay = tvori_delaunay();

function poisci_postajo_po_imenu (ime_postaje) {
    return postaje.find(p => p.ime == ime_postaje);
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

/*
trenutna_postaja, koncna_postaja -> objekti tipa Postaja
prepotovane_postaje -> array postaj, ki smo jih na poti že obiskali
omrežje -> omrežje, na katerem iščemo najkrašjo razdlajo med dvema postajama
return value -> object: razdalja in pot, kjer je razdalja "number", ki predstavlja
najkrajšo "pot" med "trenutna_postaja" in "koncna_postaja"
*/

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

// funkcija za računanje MD za delaunay, ki upošteva kot med vektorjem, ki kaže proti cilju in vektorjem, ki ga opiše pot, ki jo želi vzeti

function najkrajsa_razdalja_delaunay(trenutna_postaja, koncna_postaja, prepotovane_postaje, omrezje) {

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
        // tukaj se zgodi preverjanje kota
        const vektor_do_cilja = {
            x: koncna_postaja.x - trenutna_postaja.x,
            y: koncna_postaja.y - trenutna_postaja.y
        }
       
        const vektor_do_naslednje_postaje = {
            x: soseda.x - trenutna_postaja.x,
            y: soseda.y - trenutna_postaja.y
        }

        //tukaj se preveri kot z vektorskim produktom
        if (!( -Math.PI/2.5 < racunanje_kota(vektor_do_cilja, vektor_do_naslednje_postaje) && racunanje_kota(vektor_do_cilja, vektor_do_naslednje_postaje) < Math.PI/2.5)) {
            continue
        }

        let soseda_pot = najkrajsa_razdalja_delaunay(soseda, koncna_postaja, [...prepotovane_postaje], omrezje);
        
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

// izračuna kot med vektorjema

function racunanje_kota(vektor_do_cilja, vektor_do_naslednje_postaje) {
   let kot_v_radianih = Math.acos( (vektor_do_cilja.x * vektor_do_naslednje_postaje.x + vektor_do_naslednje_postaje.y * vektor_do_cilja.y) / (racunanje_dolzine_vektorja(vektor_do_cilja) * racunanje_dolzine_vektorja(vektor_do_naslednje_postaje)) )

   return kot_v_radianih
}


// izracuna dolzino vektorja
function racunanje_dolzine_vektorja (vektor) {

    return Math.sqrt(Math.pow((vektor.x), 2) + Math.pow((vektor.y), 2))
}

// računanje parametra TL (total distance) oz. celokupna razdalja vseh prog
function dolzina_omrezja(omrezje){
    let dolzina = 0;
    omrezje.forEach(element => {
        dolzina += element.razdalja();
    }); 
    return dolzina;
}

let stevilo_iteracij = 200;

// računanje parametra MD (minimum distance) oz. povprečne najkrajše poti med dvema naključnima točkama
function racunanje_MD (omrezje) {
    var celotna_razdalja = 0;
    for (let i = 0; i < stevilo_iteracij; i++) {

        var postaja1 = postaje[Math.floor(Math.random()*data_lokacije.length)];
        var postaja2;
        
        do {
            postaja2 = postaje[Math.floor(Math.random()*data_lokacije.length)];
        } while (postaja1 == postaja2) 

        celotna_razdalja += najkrajsa_razdalja(postaja1, postaja2, [], omrezje).razdalja;
    }
    return celotna_razdalja/stevilo_iteracij;
}

// računanje parametra MD za DELAUNAY (minimum distance) oz. povprečne najkrajše poti med dvema naključnima točkama
function racunanje_MD_delaunay (omrezje) {
    var celotna_razdalja = 0;
    for (let i = 0; i < stevilo_iteracij; i++) {

        var postaja1 = postaje[Math.floor(Math.random()*data_lokacije.length)];
        var postaja2;
        do {
            postaja2 = postaje[Math.floor(Math.random()*data_lokacije.length)];
        } while (postaja1 == postaja2) 
        


        celotna_razdalja += najkrajsa_razdalja_delaunay(postaja1, postaja2, [], omrezje).razdalja;
    }
    return celotna_razdalja/stevilo_iteracij;
}

/* računanje parametra FT (fault tolerance) oz. odpornosti 
na prekinitve, ki je podan kot verjetnost, 
da naključna prekinitev NE razdeli grafa na dva dela
*/
function racunanje_FT (omrezje) {
    var verjetnost_prepolovitve = 0;
    let dolzina_omr = dolzina_omrezja(omrezje);
    for (let pov of omrezje) {
        let omrezje_za_zbrisat = [...omrezje];
        
        let postaja1 = pov.A;
        let postaja2 = pov.B;
        
        let omrezje_brez_povezave = omrezje_za_zbrisat.filter(item => item !== pov);
        
        if (najkrajsa_razdalja(postaja1, postaja2, [], omrezje_brez_povezave) == undefined) {
            verjetnost_prepolovitve += pov.razdalja() / dolzina_omr;
        }
    }
    return 1 - verjetnost_prepolovitve;
}

function is_MST(omrezje_MST) {
    let zacetna_postaja = postaje[0];

    for (let postaja of postaje) {
        if (najkrajsa_razdalja(zacetna_postaja, postaja, [], omrezje_MST) == undefined) {
            return false;
        }
    }
    return true;
}

/* Formiranje MST (minimum spanning tree) omrežja:
1. rangiraj vse možne povezave po njihovi dolžini
2. izberi najkrajšo
3. dodaj jo k omrežju, če ne tvori nobenih zank
*/

function tvori_MST() {
    
    let vse_mozne_povezave = []

    for (let i = 0; i < postaje.length; i++) {
        for (let j = i + 1; j < postaje.length; j++) {
            vse_mozne_povezave.push(new povezava(postaje[i], postaje[j]));
        }
    }

    vse_mozne_povezave.sort((a, b) => a.razdalja() - b.razdalja());
    
    /*
    1. iteriraj čez povezave od najkrajše do najdaljše
    2. dodaj povezavo, če ta ne bo v omrežju dopolnila zanke
    3. končaj, ko bodo vse postaje v omrežju
    */

    let omrezje_MST = [];
    for (let pov of vse_mozne_povezave) {

        let postaja1 = pov.A;
        let postaja2 = pov.B;

        if (najkrajsa_razdalja(postaja1, postaja2, [], omrezje_MST) == undefined) {
            omrezje_MST.push(pov);
        }
        if (is_MST(omrezje_MST)) break;
    }

    return omrezje_MST;
}

function tvori_delaunay () {
    let ogljisca = [];
    for (let postaja of postaje) {
        ogljisca.push(new delaunay.Vertex(postaja.x, postaja.y));
    }
    var trikotniki = delaunay.triangulate(ogljisca);

    let delaunay_povezave = [];
    for (let trikotnik of trikotniki) {
        let povezava1 = new povezava(postaje.find(p => p.x == trikotnik.v0.x && p.y == trikotnik.v0.y), postaje.find(p => p.x == trikotnik.v1.x && p.y == trikotnik.v1.y));
        let povezava2 = new povezava(postaje.find(p => p.x == trikotnik.v0.x && p.y == trikotnik.v0.y), postaje.find(p => p.x == trikotnik.v2.x && p.y == trikotnik.v2.y));
        let povezava3 = new povezava(postaje.find(p => p.x == trikotnik.v1.x && p.y == trikotnik.v1.y), postaje.find(p => p.x == trikotnik.v2.x && p.y == trikotnik.v2.y));

        delaunay_povezave.push(povezava1);
        delaunay_povezave.push(povezava2);
        delaunay_povezave.push(povezava3);
    }

    let new_arr = [];
    for (let delaunay_povezava1 of delaunay_povezave) {
        let delaunay_brez_povezave = delaunay_povezave.filter(povezava_delaunay => povezava_delaunay !== delaunay_povezava1);
        for (let delaunay_povezava2 of delaunay_brez_povezave) {
            if (delaunay_povezava1.A.ime == delaunay_povezava2.A.ime && delaunay_povezava1.B.ime == delaunay_povezava2.B.ime || delaunay_povezava1.A.ime == delaunay_povezava2.B.ime && delaunay_povezava1.B.ime == delaunay_povezava2.A.ime ) {
                delaunay_povezave = delaunay_povezave.filter(povezava_delaunay => povezava_delaunay !== delaunay_povezava1);
            }
        }
    }

    return delaunay_povezave;
}

function izrisi_omrezje (omrezje, canvasID, imgID){
    
    imgID.onload = function () {
        canvasID.width = imgID.width;
        canvasID.height = imgID.height;

        let img_ratio = imgID.width / SLIKA_ZEMLJEVIDA_X;
        
        var ctx = canvasID.getContext("2d");
        
        for (let postaja of postaje) {
            ctx.beginPath();
            ctx.arc(img_ratio * postaja.x, img_ratio * postaja.y, 5 * img_ratio, 0, Math.PI * 2, true);
            ctx.fill();
        }
        
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2 * img_ratio;
        for (let pov of omrezje) {
            ctx.beginPath();
            ctx.moveTo(img_ratio * pov.A.x, img_ratio * pov.A.y);
            ctx.lineTo(img_ratio * pov.B.x, img_ratio * pov.B.y);
            ctx.stroke();
        }

    }
}
let img_SZ = document.getElementById("img_Slovenske_Železnice");
let canvas_SZ = document.getElementById("canvas_Slovenske_Železnice");
izrisi_omrezje(omrezje_SZ, canvas_SZ, img_SZ);
let img_sluzavka = document.getElementById("img_Sluzavka");
let canvas_sluzavka = document.getElementById("canvas_Sluzavka");
izrisi_omrezje(omrezje_physarum, canvas_sluzavka, img_sluzavka);
let img_mst = document.getElementById("img_Minimalno_vpeto");
let canvas_mst = document.getElementById("canvas_Minimalno_vpeto");
izrisi_omrezje(omrezje_mst, canvas_mst, img_mst);
let img_delaunay = document.getElementById("img_Delaunayeva_triangulacija");
let canvas_delaunay = document.getElementById("canvas_Delaunayeva_triangulacija");
izrisi_omrezje(omrezje_delaunay, canvas_delaunay, img_delaunay);


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
    let omrezje;
    switch (document.getElementById("izbrano_omrezje").value) {
        case "Slovenske Železnice":
            omrezje = omrezje_SZ;
            break;
        case "Sluzavka":
            omrezje = omrezje_physarum;
            break;
        case "Minimalno vpeto drevo":
            omrezje = omrezje_mst;
            break;
        case "Delaunayeva triangulacija":
            omrezje = omrezje_delaunay;
            break;
        default:
            omrezje = omrezje_SZ;
            break;
    }

    var seznam_povezav_head_sz = document.getElementById("seznam_povezav_head");
    seznam_povezav_head_sz.innerHTML = "";
    var seznam_povezav_head_sz_haederRow = document.createElement("tr");

    var seznam_povezav_h0 = document.createElement("th");
    seznam_povezav_h0.textContent = "#";
    var seznam_povezav_h1 = document.createElement("th");
    seznam_povezav_h1.textContent = "Začetna postaja";
    var seznam_povezav_h2 = document.createElement("th");
    seznam_povezav_h2.textContent = "Končna postaja";
    var seznam_povezav_h3 = document.createElement("th");
    seznam_povezav_h3.textContent = "Dolžina";

    seznam_povezav_head_sz_haederRow.appendChild(seznam_povezav_h0);
    seznam_povezav_head_sz_haederRow.appendChild(seznam_povezav_h1);
    seznam_povezav_head_sz_haederRow.appendChild(seznam_povezav_h2);
    seznam_povezav_head_sz_haederRow.appendChild(seznam_povezav_h3);

    seznam_povezav_head_sz.appendChild(seznam_povezav_head_sz_haederRow);
    
    var seznam_postaj_body = document.getElementById("seznam_povezav_body");
    seznam_postaj_body.innerHTML = "";
    for (let i = 0; i < omrezje.length; i++) {
        var row = document.createElement("tr");

        var zap_st = document.createElement("td");
        zap_st.textContent = i + 1;
        var postajaA = document.createElement("td");
        postajaA.textContent = omrezje[i].A.ime ;
        var postajaB = document.createElement("td");
        postajaB.textContent = omrezje[i].B.ime;

        var razdalja = document.createElement("td");
        razdalja.textContent = omrezje[i].razdalja().toFixed(2);

        row.appendChild(zap_st);
        row.appendChild(postajaA);
        row.appendChild(postajaB);
        row.appendChild(razdalja);

        seznam_postaj_body.appendChild(row);
    }
}
const select_omrezje = document.getElementById("izbrano_omrezje");
select_omrezje.addEventListener("change", posodobitev_tabele_povezav);
posodobitev_tabele_povezav();

//function analiza_omrezja_compute (omrezje, html_element) {
//     let celokupna_dolzina = document.createElement("td");
//     celokupna_dolzina.innerHTML = (dolzina_omrezja(omrezje) / dolzina_omrezja(omrezje_mst)).toFixed(5);
    
//     let povprecna_pot = document.createElement("td");
//     povprecna_pot.innerHTML = (racunanje_MD(omrezje) / racunanje_MD(omrezje_mst)).toFixed(5);

//     let od_html = document.createElement("td");
//     od_html.innerHTML = racunanje_FT(omrezje).toFixed(5);

//     let OD_over_CD = document.createElement("td");
//     OD_over_CD.innerHTML = ((racunanje_FT(omrezje) / ((dolzina_omrezja(omrezje)) / dolzina_omrezja(omrezje_mst)))).toFixed(5);

//     html_element.appendChild(celokupna_dolzina);
//     html_element.appendChild(povprecna_pot);
//     html_element.appendChild(od_html);
//     html_element.appendChild(OD_over_CD);
// }

function analiza_omrezja (cd, md, od, od_over_cd, html_element) {
    let celokupna_dolzina = document.createElement("td");
    celokupna_dolzina.innerHTML = cd;
    
    let povprecna_pot = document.createElement("td");
    povprecna_pot.innerHTML = md;

    let od_html = document.createElement("td");
    od_html.innerHTML = od;

    let OD_over_CD = document.createElement("td");
    OD_over_CD.innerHTML = od_over_cd;

    html_element.appendChild(celokupna_dolzina);
    html_element.appendChild(povprecna_pot);
    html_element.appendChild(od_html);
    html_element.appendChild(OD_over_CD);
}

let cd_sz = 1.21430;
let md_sz = 0.81954;
let od_sz = 0.39934;
let od_over_cd_sz = 0.32887;

let cd_physarum = 1.55679;
let md_physarum = 0.83078;
let od_physarum = 0.88913;
let od_over_cd_physarum = 0.57113;

let cd_mst = 1;
let md_mst = 1;
let od_mst = 0;
let od_over_cd_mst = 0;

let cd_delaunay = 5.62659;
let md_delaunay = 0.7;
let od_delaunay = 1;
let od_over_cd_delaunay = 0.17772;

let analiza_SZ = document.getElementById("analiza_SZ");
analiza_omrezja(cd_sz, md_sz, od_sz, od_over_cd_sz, analiza_SZ);

let analiza_physarum = document.getElementById("analiza_physarum");
analiza_omrezja(cd_physarum, md_physarum, od_physarum, od_over_cd_physarum, analiza_physarum);

let analiza_MST = document.getElementById("analiza_MST");
analiza_omrezja(cd_mst, md_mst, od_mst, od_over_cd_mst, analiza_MST);

let analiza_delaunay = document.getElementById("analiza_delaunay");
analiza_omrezja(cd_delaunay, md_delaunay, od_delaunay, od_over_cd_delaunay, analiza_delaunay);
