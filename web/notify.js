
export default class Notify {

  constructor(){

    this.permissionGranted = false;
    this.notifyContainer = document.getElementById('notify-container');
    this.notifyBtn = document.getElementById('notify');

  }

  async init(){

    if (!('serviceWorker' in navigator)) {

      this.notifyBtn.classList.add('disable');
      return console.error('service worker not supported');

    }

    if (!('PushManager' in window)) {

      this.notifyBtn.classList.add('disable');
      return console.error('Push manager not supported');

    }

    if (!Notification) {

      this.notifyBtn.classList.add('disable');
      return console.error('Notification not supported');

    }

    await this.registerServiceWorker();


    if (Notification.permission === 'denied') {

      this.notifyBtn.classList.add('disable');
      return console.error('Notification blocked');

    }

    // if(){
    //
    //   this.listenEnable();
    //
    // }
    debugger;

  }

  registerServiceWorker() {

    navigator.serviceWorker.register('service-worker.js')
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

      }

    }, false);
  }

}

