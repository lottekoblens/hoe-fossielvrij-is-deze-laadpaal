# :seedling: How fossil-free is this charging station?

In de Design Rationale schrijf je de debriefing, de probleem-definitie, toon je de oplossing en schrijf je een uitleg van de code. De Design Rationale is een verantwoording van je ontwerp. 

[<img src="/public/images/project.gif" width="350">](https://youtu.be/KsQJYSobGd8)

## :heavy_plus_sign: Table of contents
- [:seedling: How fossil-free is this charging station?](#seedling-how-fossil-free-is-this-charging-station)
  - [:heavy_plus_sign: Table of contents](#heavy_plus_sign-table-of-contents)
  - [Debrief](#debrief)
    - [:memo: Problem description / Cause](#memo-problem-description--cause)
    - [:construction_worker: Client](#construction_worker-client)
    - [:rocket: Design challenge](#rocket-design-challenge)
      - [User stories](#user-stories)
    - [Objective](#objective)
    - [Delivery](#delivery)
    - [Conditions](#conditions)
    - [Users of the application](#users-of-the-application)
  - [:package: Data](#package-data)
  - [Solution](#solution)
  - [🔍 Getting started](#-getting-started)
    - [🔨 Installation](#-installation)
  - [:bookmark: Licentie](#bookmark-licentie)

## Debrief

### :memo: Problem description / Cause
The Netherlands is rapidly switching to electric driving. But electricity is not yet fossil-free. And when you charge your electric car, you emit CO2. How much CO2 is released depends on
from where, when and of course how much energy (kWh) you charge. So how do you know how much CO2 is released when you plug your electric car into a specific charging station?

The Green Caravan has developed a data model that combines energy generation and trade across Europe with energy mixes from energy providers. For example, you can accurately request how much CO2, solar, wind, hydro, nuclear, coal, gas and more is in a charging session right down to the charging station. Green Caravan not only has historical data, but also forecasts for the near future.

So the problem I solved with my application is that the user doesn't know how fossil-free a charging station is.

### :construction_worker: Client
**De Voorhoede**

De Voorhoede is a digital agency that builds websites and apps. They make web apps, websites, prototypes and so on. Furthermore, they research, advise, build, test and do much more! They have made the website of Pathé at home and for many more customers.

**Green Caravan**

At Green Caravan it is the mission to make all electric vehicles CO2 neutral and to charge them fossil-free. They want to achieve this by offering smart-charging services and fossil-free charging solutions.

### :rocket: Design challenge
Design and develop a web application that provides insight into the use of fossil fuels for charging sessions of electric cars

#### User stories

1. Fossil electricity from a charging station?

As an electric driver, I want to know how much fossil electricity comes from the charging station I am standing next to, so that I know how (un)sustainable that is.

2. Find the best charging station

As an electric driver, I would like to know at which charging station I can charge most sustainably, so that I can charge my car as sustainably as possible.

3. Find the best charging moment at a charging station

As an electric driver, I would like to know when the least fossil electricity comes from my charging station, so that I can charge my car as sustainably as possible.

4. How do you make CO2 data from the charging network and individual charging sessions available in an attractive way?

What stories can you tell about the collective data over time, about numbers of charging sessions, about average charging time, about differences in CO2 emissions. What is possible here, what are the considerations that matter for an electric driver and user of CO2 Smart Charging.

### Objective
The Green Caravan wants to ensure that electric cars can charge their cars as fossil-free. This reduces the amount of CO2, which is released when the car is charged. They want to ensure this by offering a service that allows users to check how fossil-free it is in front of the charging stations.

### Delivery
The project must be delivered on Thursday 23 June.

* Project is on github
* Project can be viewed live
* Project is well documented (wiki & readme)

### Conditions
Four meetings with the client are planned to receive feedback. These meetings take place at the office of De Voorhoede.
Questions can be asked via Slack to both Tom (when it comes to electric charging, the users, etc.) and Victor (technical questions).

### Users of the application
Owners of electric cars who want to know how sustainable it is if they charge their car at a charging station.

## :package: Data
Green Caravan has several data models:
* Exact energy mix of electricity in the Netherlands, and associated CO2 emissions, accurate to the hour. Both historical data and forecast up to 48 hours in the future.
* Contractual energy mix per energy provider in the Netherlands accurate to the hour.

This time series data (and the user's loading sessions) is kept in an InfluxDB database. This has its own API and (JS) SDK and will be made available to you during the master thesis. By combining the information from the associated energy provider with the data about the energy mix for each charging station, you can calculate the exact CO2 footprint of a charging session at that charging station at that moment. We challenge you to realize this and to make it transparent for the user.

* To create a map with the charching stations, I uses the Mapbox Geocoding API.

## Solution

For a more detailed explanation of the application, I would like to refer you to my [wiki](https://github.com/lottekoblens/hoe-fossielvrij-is-deze-laadpaal/wiki/Explanation-application). There I also explain the code of the application. Below I give an explanation of the concept.

The application starts with a zero state to introduce the user to the app and to tell them what they can expect. 

<img src="/public/images/zerostate.png" width="300">

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
