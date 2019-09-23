
export default class Notify {

  constructor(){

    this.permissionGranted = false;
    this.workerLoaded = false;
    this.registration = null;
    this.notifyContainer = document.getElementById('notify-container');
    this.notifyBtn = document.getElementById('notify');

  }

  async init(){

    if (!window.PushManager || !navigator.serviceWorker || !Notification) {

      this.notifyContainer.style.display = 'block';
      this.notifyBtn.classList.add('disabled');
      return console.error('Notification not supported');

    }

    this.registration = await this.registerServiceWorker();

    if (Notification.permission === 'denied') {

      this.notifyContainer.style.display = 'block';
      this.notifyBtn.classList.add('disabled');
      return console.error('Notification blocked');

    } else if(Notification.permission === 'default'){

      this.notifyContainer.style.display = 'block';
      this.listenEnable();

    } else if(Notification.permission === 'granted'){

      this.permissionGranted = true;

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

      } else {

        this.notifyBtn.classList.add('disabled');

      }

    }, false);

  }

  async send({ title = 'Coeur coeur coeur', body = '' }){

    if(this.workerLoaded && this.registration && this.permissionGranted){

      await this.registration.showNotification(title, { body });

      return true;

    }

    return false;

  }

}

