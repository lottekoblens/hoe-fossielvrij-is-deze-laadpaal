# :seedling: How fossil-free is this charging station?


## :heavy_plus_sign: Table of contents
- [:seedling: How fossil-free is this charging station?](#seedling-how-fossil-free-is-this-charging-station)
  - [:heavy_plus_sign: Table of contents](#heavy_plus_sign-table-of-contents)
  - [:memo: Description](#memo-description)
  - [:construction_worker: Client](#construction_worker-client)
  - [:rocket: Design challenge](#rocket-design-challenge)
  - [:package: Data](#package-data)
  - [🔍 Getting started](#-getting-started)
    - [🔨 Installation](#-installation)
  - [:bookmark: Licentie](#bookmark-licentie)

## :memo: Description
The Netherlands is rapidly switching to electric driving. But electricity is not yet fossil-free. And when you charge your electric car, you emit CO2. How much CO2 is released depends on
from where, when and of course how much energy (kWh) you charge. So how do you know how much CO2 is released when you plug your electric car into a specific charging station?

The Green Caravan has developed a data model that combines energy generation and trade across Europe with energy mixes from energy providers. For example, you can accurately request how much CO2, solar, wind, hydro, nuclear, coal, gas and more is in a charging session right down to the charging station. Green Caravan not only has historical data, but also forecasts for the near future.

## :construction_worker: Client
Green Caravan  
Product Owners: Tom Visser & Victor Zumpolle

## :rocket: Design challenge
Design and develop a web application that provides insight into the use of fossil fuels for charging sessions of electric cars

## :package: Data
Green Caravan has several data models:
* Exact energy mix of electricity in the Netherlands, and associated CO2 emissions, accurate to the hour. Both historical data and forecast up to 48 hours in the future.
* Contractual energy mix per energy provider in the Netherlands accurate to the hour.

This time series data (and the user's loading sessions) is kept in an InfluxDB database. This has its own API and (JS) SDK and will be made available to you during the master thesis. By combining the information from the associated energy provider with the data about the energy mix for each charging station, you can calculate the exact CO2 footprint of a charging session at that charging station at that moment. We challenge you to realize this and to make it transparent for the user.

## 🔍 Getting started
Before you can start you need to follow the installation

### 🔨 Installation
Open the terminal, or use the terminal in your IDE

1. Clone the repository

   ``` git clone https://github.com/lottekoblens/hoe-fossielvrij-is-deze-laadpaal.git ```

2. Install all packages

   npm install || npm i

3. Start the application for development

   npm run dev

4. Open de server and go to the browser: localhost 

   If this doesn't work change your port to another one

## :bookmark: Licentie

![GNU GPL V3](https://www.gnu.org/graphics/gplv3-127x51.png)

This work is licensed under [GNU GPLv3](./LICENSE).
