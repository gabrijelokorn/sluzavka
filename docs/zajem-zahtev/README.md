# Zajem zahtev


# Črna škatla
  **Vhod v program:**
  - imena postaj
  - n (10000) primerov parov dveh postaj - kar pomeni, da sta postaji med seboj povezani. Program bi lahko imel hardcode-ane lokacije med seboj (program izračuna razdaljo - povprečno dolžino poti (v dolžinski enoti (m/km)), ki jo je za teh n poti uporabil).
  - skupna dolžina vseh poti (?koliko kilometrov lahko največ porabi?)
  
  **Izhod iz programa:**
  - trije parametri: 
  **a) skupna dolžina vseh poti** / povezav (v kilometrih, s pravo skalo) - v omrežju (ne glede na teh n naključnih vhodov različnih poti): torej samo koliko kilometrov tirnic je v omrežju
  **b) povprečna najkrajša pot med dvema naključnima postajama** (program izbere dve naključni postaji in pove kolikšnja je najkrajša pot med njima. To nardi 10000x da najde neko povprečje.) - nujno mora biti to tudi najkrajša pot. Sicer nima pomena. 
  **c) povprečna najkrajša pot med dvema postajama s tem da se ena izmed povezav uniči.** (kot je ne bi bilo) in potem se gleda povprečna pot. Kolikšna je verjetnost da se ena pot uniči je odvino od njene dolžine.
  - optimalne povezave (omrežje) - ki ima čim boljše zgornje 3 parametre
  - grafični izris ta zadnje točke
  - grafični izris debeline povezav glede na število uporab povezave (za vsa 3 omrežja)
  
  Constraints:
  Pri računalniško ustvarjenemu omrežju se tirnice (poti) ne smejo križati - ena pot ne sme sekati druge poti (pri drugih omrežjih je to namreč že upoštevano).
