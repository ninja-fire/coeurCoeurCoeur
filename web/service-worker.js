/* eslint-env serviceworker */
import 'babel-polyfill';
importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');

self.workbox.setConfig({
  debug: true
});

self.workbox.loadModule('workbox-strategies');

const { strategies } = self.workbox;

const fileTypes = [ 'html', 'js', 'css', 'jpg', 'png', 'gif', 'svg', 'eot', 'ttf', 'woff', 'woff2'];

self.addEventListener('fetch', (event) => {

  if(fileTypes.find(fileType => event.request.url.endsWith(fileType) ) ){

    const cacheFirst = new strategies.CacheFirst();
    event.respondWith(cacheFirst.makeRequest({request: event.request}));

  }

});

self.addEventListener('push', async (event) => {

  const data = await event.data.json();
  const body = data.isOwner ? 'You got the love' : 'You lost the love';
  await registration.showNotification('Coeur coeur coeur', { body });

});
