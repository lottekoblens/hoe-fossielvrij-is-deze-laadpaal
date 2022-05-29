# ⚙ Hoe fossielvrij is deze laadpaal?

Insert picture/gif of full project UI

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

## Data
Green Caravan beschikt over meerdere datamodellen:  
* Exacte energie-mix van elektriciteit in Nederland, en bijbehorende CO2-emissies, tot op het uur nauwkeurig. Zowel historische data als voorspelling tot 48u in de toekomst.
* Contractuele energiemix per energie-provider in Nederland tot op het uur nauwkeurig. 

Deze time series data (en de laadsessies van de gebruikers) worden bijgehouden in een InfluxDB database. Deze heeft een eigen API en (JS) SDK en zal tijdens de meesterproef voor jullie beschikbaar gesteld worden. Door per laadpaal de informatie van de bijbehorende energie-provider te combineren met de data over de energie-mix kun je de exacte CO2-footprint van een laadsessie bij die laadpaal op
dat moment berekenen. We dagen je uit dit te realiseren en voor de gebruiker inzichtelijk te maken.

## 🔍 Getting started
Before you can start you need to follow the installation

### 🔨 Installation
Open the terminal, or use the terminal in your IDE

1. Clone the repository

``` git clone https://github.com/KoenHaagsma/TechTrack-Frontend-Applications.git ```

2. Go to the cloned repository

cd ../../Techtrack-Frontend-Applications

3. Install all packages

npm install || npm i

4. Start the application for development

npm run dev

5. Open de server and go to the browser: Localhost. 

If this doesn't work change your port to another port

## Licentie

![GNU GPL V3](https://www.gnu.org/graphics/gplv3-127x51.png)

This work is licensed under [GNU GPLv3](./LICENSE).
