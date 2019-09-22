
export default class Notify {

  constructor(){

    this.workerLoaded = false;
    this.permissionGranted = false;

  }

  async init(){

    if (!('serviceWorker' in navigator)) {

      return console.error('service worker not supported');

    }

    if (!('PushManager' in window)) {

      return console.error('Push manager not supported');

    }

    const permissionResult = await Notification.requestPermission();

    if(permissionResult === 'granted'){

      this.permissionGranted = true;

      await this.registerServiceWorker();

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



}

