/* eslint-env serviceworker */
import 'babel-polyfill';

self.addEventListener('push', async (event) => {

  const data = await event.data.json();
  const body = data.isOwner ? 'You got the love' : 'You lost the love';
  await registration.showNotification('Coeur coeur coeur', { body });

});
