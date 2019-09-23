
export default class Notify {

  constructor(){

    this.permissionGranted = false;
    this.workerLoaded = false;
    this.notifyContainer = document.getElementById('notify-container');
    this.notifyBtn = document.getElementById('notify');

  }

  async init(){

    if (!window.PushManager || !navigator.serviceWorker || !Notification) {

      this.notifyContainer.style.display = 'block';
      this.notifyBtn.classList.add('disabled');
      return console.error('Notification not supported');

    }

    await this.registerServiceWorker();

    if (Notification.permission === 'denied') {

      this.notifyContainer.style.display = 'block';
      this.notifyBtn.classList.add('disabled');
      return console.error('Notification blocked');

    } else if(Notification.permission === 'default'){

      this.notifyContainer.style.display = 'block';
      this.listenEnable();

    } else if(Notification.permission === 'allow'){

      this.permissionGranted = true;

    }

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
        this.notifyContainer.style.display = 'none';

      } else {

        this.notifyBtn.classList.add('disabled');

      }

    }, false);
  }

}

