# lehti
Ikuisuusprojektit maistuu

Testauslehti. Alustavasti julkaistaan HTML-tiedostoina. 
"build.js"-nodejs skripti tekee valmiin html:n paper-kansioissa olevista artikkeleista.

## Kuinka tehdään artikkeleita

1. Forkkaa github repo [https://github.com/Testausserveri/lehti](https://github.com/Testausserveri/lehti)
2. Tee oma kansio artikkelillesi lehden kansioon paper/
3. Kirjoita teksti markdown-dokumentteihin, yksi .md-tiedosto per sivu. Nimeä .md tiedostot numerojärjestyksessä, eli 1.md, 2.md, 3.md jne. Voit halutessasi käyttää jotakin markdown-editoria tekstinkäsittelyyn.
4. Laita mukaan artikkelin kansioon liitteet ja kirjoita meta.json tiedostoon metadata.
5. Katso lehden ulkoasu suorittamalla build.js (`npm run build`). Jos dependencyjä puuttuu niin asenna ne (`npm install`), ja jos nodejs puuttuu, [asenna se](https://nodejs.org/). Skripti rakentaa lehden built.html tiedostoon, jonka voit avata selaimellasi.
6. Kun artikkeli on valmis, tee pull request.

## Liitteet??? Metatiedostot???
Liitetiedostoihin tulee merkitä sivu, jolle tiedosto liitetään ensin, sitten alaviiva ja liitteen nimi, esimerkiksi 2_kuva.png tai 3_skripti.py. Liitteiksi käyvät .png, .jpg ja .webp -tiedostot sekä dokumentit, jotka esitetään raakatekstinä.
"meta.json"-tiedosto sisältää artikkelin tiedot, ja se on pakollinen joka artikkelin kansiossa. paper/ kansiossa on taas itse lehden metadata.

Artikkelin meta.json voi esimerkiksi näyttää tältä:
```json
{
    "title": "Artikkelin otsikko",
    "description": "Kuvaus artikkelista",
    "author": "Tekijä1, Tekijä2"
}
```

Etusivulle monimutkainen algoritmi valitsee parhaat artikkelit automaattisesti. Jos koet artikkelisi etusivun arvoiseksi, on hyvä laittaa thumbnail.png/jpg/webp tiedosto artikkelin liitteisiin.

## Tyyliohjeita

Kirjoita asiallista suomen kieltä. Kielioppi tarkistetaan ja korjataan ennen julkaisua.

Artikkeliin voit liittää kuvia ja tekstitiedostoja laittamalla ne artikkelin kansioon.
Pidä liitetyt kuvat mahdollisimman pieninä. Ne pakataan suoraan mukaan HTML-tiedostoon, ja jokainen kuva
lisää tämän tiedoston kokoa huomattavasti. 

Lehden maksimikoko on teknisistä syistä 8 Mt, ja
julkaisuvalmiista lehdestä voidaan karsia osia jos raja ylittyy. 

Jos kirjoittaessa tulee ongelmia, kysäise toki. Lehden kehitysalusta ei ole missään nimessä vielä valmis, ja lisäysehdotukset ovat tervetulleita.