import {
    createMap
} from "./modules/createMap.js";
import {
    createSmallMap
} from "./modules/createSmallMap.js";
import {
    showSmallMapLittlesustainable,
    showSmallMapUnsustainable
} from "./modules/ui.js";

if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
        navigator.serviceWorker.register('../sw.js').then(function (registration) {
            return registration.update();
        });
    });
} // add service worker

if (window.location.pathname === '/map') {
    createMap();
}

if (window.location.pathname === '/nietduurzaam') {
    showSmallMapUnsustainable();
    createSmallMap();
}

if (window.location.pathname === '/redelijkduurzaam') {
    showSmallMapLittlesustainable();
    createSmallMap();
}