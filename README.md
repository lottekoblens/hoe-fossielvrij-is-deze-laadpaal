# Hoe fossielvrij is deze laadpaal?

![Green Caravan](https://github.com/cmda-minor-web-cases/hoe-fossielvrij-is-deze-laadpaal/blob/main/assets/green-caravan.png?raw=true)

## Inhoudsopgave
  * [Beschrijving](#beschrijving)
  * [Opdrachtgever](#opdrachtgever)
  * [Design challenge](#design-challenge)
  * [Data](#data)
  * [Planning](#planning)
  * [Licentie](#licentie)

## Beschrijving
Nederland gaat in hoog tempo over op elektrisch rijden. Maar elektriciteit is nog niet fossielvrij. En met het laden van je elektrische auto stoot je dus CO2 uit. Hoeveel CO2 er vrijkomt hangt af
van waar, wanneer en natuurlijk hoeveel energie (kWh) je laadt. Dus hoe weet je hoeveel CO2 er vrijkomt als je je elektrische auto in een specifieke laadpaal plugt?

De Green Caravan heeft een datamodel ontwikkeld waarin energie-opwekking en -handel door heel Europa wordt gecombineerd met energie-mixen van energie-providers. Zo kun je tot op de laadpaal nauwkeurig opvragen hoeveel CO2, zon, wind, hydro, nucleair, kolen, gas en nog meer in een laadsessie zit. Green Caravan heeft niet alleen historische data, maar ook voorspellingen voor de nabije toekomst.

## Opdrachtgever
Green Caravan  
Product Owners: Tom Visser & Victor Zumpolle

## Design challenge
Ontwerp en ontwikkel een web applicatie die inzicht geeft in het gebruik van fossiele brandstoffen voor laadsessies van elektrische auto's

### User story
**1. Fossiele elektriciteit uit laadpaal?**

Als elektrisch rijder,
wil ik weten hoeveel fossiele elektriciteit er uit de laadpaal komt waar ik naast sta, zodat ik weet hoe (on)duurzaam dat is.

Kunnen we deze data inzichtelijk maken en bijvoorbeeld via een QR-code op de laadpaal tonen?

**2 Beste laadpaal vinden**

Als elektrisch rijder,
wil ik graag weten bij welke laadpaal ik het meest duurzaam kan laden, zodat ik mijn auto zo duurzaam mogelijk oplaadt.

**3 Beste laadmoment bij laadpaal vinden**

Als elektrisch rijder,
wil ik graag weten op welk moment er het minste fossiele elektriciteit uit mijn laadpaal komt, zodat ik mijn auto zo duurzaam mogelijk oplaadt.

## Data
Green Caravan beschikt over meerdere datamodellen:  
* Exacte energie-mix van elektriciteit in Nederland, en bijbehorende CO2-emissies, tot op het uur nauwkeurig. Zowel historische data als voorspelling tot 48u in de toekomst.
* Contractuele energiemix per energie-provider in Nederland tot op het uur nauwkeurig. 

Deze time series data (en de laadsessies van de gebruikers) worden bijgehouden in een InfluxDB database. Deze heeft een eigen API en (JS) SDK en zal tijdens de meesterproef voor jullie beschikbaar gesteld worden. Door per laadpaal de informatie van de bijbehorende energie-provider te combineren met de data over de energie-mix kun je de exacte CO2-footprint van een laadsessie bij die laadpaal op
dat moment berekenen. We dagen je uit dit te realiseren en voor de gebruiker inzichtelijk te maken.

## Licentie

![GNU GPL V3](https://www.gnu.org/graphics/gplv3-127x51.png)

This work is licensed under [GNU GPLv3](./LICENSE).
