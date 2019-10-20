import Config from './config';
import Connector from './connectors';

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export default class Notify {

  constructor(){

    this.permissionGranted = false;
    this.workerLoaded = false;
    this.registration = null;
    this.notifyContainer = document.getElementById('notify-container');
    this.notifyBtn = document.getElementById('notify-button');

  }

  async init(){

    if(navigator.serviceWorker){

      this.registration = await this.registerServiceWorker();

    }

    if(!Notification){

      this.notifyContainer.style.display = 'flex';
      this.notifyBtn.classList.add('disabled');
      return console.error('Notification not supported');

    }

    if (Notification.permission === 'denied') {

      this.notifyContainer.style.display = 'flex';
      this.notifyBtn.classList.add('disabled');
      return console.error('Notification blocked');

    } else if(Notification.permission === 'default'){

      this.notifyContainer.style.display = 'flex';
      this.listenEnable();

    } else if(Notification.permission === 'granted'){

      this.permissionGranted = true;
      await this.subscribe();

    }

  }

  registerServiceWorker() {

    return navigator.serviceWorker.register('service-worker.js')
      .then( (registration) => {
        console.log('Service worker successfully registered.');
        this.workerLoaded = true;
        return registration;
      })
      .catch( (error) => {
        console.error('Unable to register service worker.', error);
      });

  }

  listenEnable(){

    this.notifyBtn.addEventListener('click', async () => {

      const permissionResult = await Notification.requestPermission();

      if(permissionResult === 'granted'){

        this.permissionGranted = true;
        this.notifyContainer.style.display = 'none';
        await this.send({ body: 'Notification enable :)' });
        await this.subscribe();

      } else {

        this.notifyBtn.classList.add('disabled');

      }

    }, false);

  }

  async send({ title = 'Coeur coeur coeur', body = '' }){

    if(this.workerLoaded && this.permissionGranted){

      await this.registration.showNotification(title, { body });

      return true;

    }

    return false;

  }

  async subscribe(){

    if(!this.workerLoaded){

      return false;

    }

    const existingSubscription = await this.registration.pushManager.getSubscription();

    if(existingSubscription){
      await existingSubscription.unsubscribe();
    }

    const subscription = await this.registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(Config.appServerKey)
    });
    const res = await fetch(`${Config.apiUrl}/subscribe`, {
      method: 'post',
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      },
      mode: 'cors',
      body: JSON.stringify({
        id: Connector.getId(),
        subscription
      })
    });
    const resContent = await res.json();

    console.info('subscribe send to server', resContent);

  }

}

