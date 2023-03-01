#SLUZAVKA
##1) ZAJEM ZAHTEV
### 1.1) Opis
    Primerjanje treh različnih omrežij med seboj:
        1) Sluzavka
        2) Dejansko (od slovenskih železnic)
        3) Optimalno (rezultat, ki ga računalnik izračuna) - lahko gre čez mejo


### 1.2) Črna škatla
    - pari dveh postaj, kar pomeni, da sta postaji med seboj povezani. program bi lahko imel med seboj hardcode-ane pvezave med seboj.
    - imena postaj
    - skupna dolžina vseh poti
    
    Izhod iz programa:
    - trije parametri: 
        a) skupna dolžina vseh poti / povezav (v kilometrih, s pravo skalo)
        b) povprečna najkrajša pot med dvema naključnima postajama (program izbere dve naključni postaji in pove kolikšnja je najkrajša pot med njima. To nardi 10000x da najde neko povprečje.) - nujno mora biti to tudi najkrajša pot. Sicer nima pomena. 
        c) povprečna najkrajša pot med dvema postajama s tem da se ena izmed povezav uniči. (kot je ne bi bilo) in potem se gleda povprečna pot. Kolikšna je verjetnost da se ena pot uniči je odvino od njene dolžine.
    - optimalne povezave (omrežje) - ki ima čim boljše zgornje 3 parametre
    - grafični izris ta zadnje točke


##2) Načrt programske opreme
    - javascript, html, css

##3) Implementacija