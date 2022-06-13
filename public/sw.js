const CACHE_VERSION = 'v3'
const HTML_CACHE = 'v1_html'
const CACHE_FILES = [
    '/',
    '/styles/style.css',
    '/scripts/script.js',
    '/offline'
]

self.addEventListener('install', event => {
    console.log('Installing service worker')

    event.waitUntil(
        caches.open(CACHE_VERSION).then((cache) => {
            return cache.addAll(CACHE_FILES).then(() => self.skipWaiting());
            // with self.skipWaiting we make sure that with an update of the serviceWorker the newest version is used
        })
    );
});

self.addEventListener('activate', event => {
    console.log('Activating service worker')
});

self.addEventListener('fetch', (event) => {
    if (isHtmlGetRequest(event.request)) {

        event.respondWith(
            fetch(event.request)
            .catch(e => {
                return caches.open(CACHE_VERSION)
                    .then(cache => cache.match('/offline'))
                // if the request is the Barcode page -> the offline page will be rendered
            })
        )

    } else if (isCoreGetRequest(event.request)) {
        event.respondWith(
            caches.open(CACHE_VERSION)
            .then(cache => cache.match(event.request.url))
            // return the files that match the request.url
        )
    }
});

const fetchAndCache = (request) => {
    return fetch(request)
        .then(response => {
            const clone = response.clone() // the response needs to be cloned, so that the cloned response can be put in the cache
            // if you don't clone the response, it won't work
            caches.open(HTML_CACHE).then((cache) => {
                if (response.type === 'basic') {
                    // response.type === basic makes sure that only the pages of products that exist in the database will be cached
                    cache.put(request, clone)
                }
            })
            return response
            // with this function a page will be added to the HTML_CACHE if the response.type is 'basic'
        })
}


// HELPERS

const isHtmlGetRequest = (request) => {
    return request.method === 'GET' && (request.headers.get('accept') !== null && request.headers.get('accept').includes('text/html'));
    // check if the request is for a HTML page, otherwise the fetch will go to the else if and check if it's a core request
}


const isCoreGetRequest = (request) => {
    return request.method === 'GET' && CACHE_FILES.includes(getPathName(request.url));
    // check if the request matches the files that are in the CACHE_FILES (style.css, main.js, /offline)
}

const getPathName = (requestUrl) => {
    const url = new URL(requestUrl);
    return url.pathname;
    // return only the pathname, such as '/scan'
}