import './main.scss';
import Config from './config';
import Notify from './notify';
import Connector from './connectors';

const url = document.location.href;
const shareButton = document.getElementById('share-button');
const id = Connector.getId();
const hearts = document.getElementsByClassName('half-heart two');
const glows = document.getElementsByClassName('glow');
let isOwner = false;
let timeoutClickHeart = null;

async function onClickHeart(){

  Array.from(hearts).forEach(heart => {
    heart.classList.add('to-the-sky');
    heart.removeEventListener('click', onClickHeart);
  });
  Array.from(glows).forEach(glow => glow.classList.add('halo') );

  timeoutClickHeart = setTimeout(() => {

    Array.from(hearts).forEach(heart => heart.classList.remove('join', 'to-the-sky') );
    Array.from(glows).forEach(glow => glow.classList.remove('halo') );

  }, 1500);

  const res = await fetch(`${Config.apiUrl}/finish`, {
    method: 'post',
    headers: {
      'Content-type': 'application/json; charset=UTF-8'
    },
    mode: 'cors',
    body: JSON.stringify({ id })
  });

  const resContent = await res.json();
  isOwner = false;

  if(resContent.result === 'ok'){

    console.log('ownership finish');

  } else {

    console.error('Cannot finish ownership', resContent);

  }

}

function moveIt(){

  isOwner = true;
  Array.from(hearts).forEach(heart => {
    heart.removeEventListener('click', onClickHeart);
  });
  Array.from(hearts).forEach(heart => heart.classList.remove('join', 'to-the-sky') );
  Array.from(glows).forEach(glow => glow.classList.remove('halo') );

  if(timeoutClickHeart){

    clearTimeout(timeoutClickHeart);

  }

  Array.from(hearts).forEach(heart => {

    heart.addEventListener('click', onClickHeart, false);

    heart.classList.add('join');

  });

}

function checkStatus(){

  setInterval(async () => {

    const res = await fetch(`${Config.apiUrl}/giveMe`, {
      method: 'post',
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      },
      mode: 'cors',
      body: JSON.stringify({ id })
    });

    const resContent = await res.json();

    if(resContent.result && !isOwner){

      console.log('get it');
      moveIt();

    } else if(!resContent.result && isOwner){

      console.log('Time expired');
      isOwner = false;
      Array.from(hearts).forEach(heart => heart.classList.add('split') );
      Array.from(hearts).forEach(heart => {
        heart.removeEventListener('click', onClickHeart);
      });

    }

  }, Config.checkStatusInterval);

}

function debug(resContent){

  if(Config.env !== 'production') {

    const loversContainers = document.getElementById('debug');
    loversContainers.textContent = JSON.stringify(resContent);

  }

}

function copyLink(notify){

  const copyBtn = document.getElementById('copy-button');
  const copyBtnText = document.querySelector('#copy-button .button-text');

  let timeOutCopyLink = null;
  copyBtn.addEventListener('click', async () => {

    await navigator.clipboard.writeText(url);
    copyBtnText.innerText = 'Link copied';

    await notify.send({ body: 'text copied' });

    if(timeOutCopyLink){

      clearTimeout(timeOutCopyLink);

    }

    timeOutCopyLink = setTimeout(() => {

      copyBtnText.innerText = 'Copy link';

    }, 1000);

  }, false);

}

function displayShare(){
  if(navigator.share){
    document.getElementById('share-button').style.display = 'flex';
    shareButton.addEventListener('click', async () => {
      try {
        await navigator.share({
          title: 'Coeur coeur coeur',
          text: 'share love with',
          url: '',
        });
        console.log('Data was shared successfully');
      } catch (err) {
        console.error('Share failed:', err.message);
      }
    });
  }
}


async function start(){

  const res = await fetch(`${Config.apiUrl}/ready`, {
    method: 'post',
    headers: {
      'Content-type': 'application/json; charset=UTF-8'
    },
    mode: 'cors',
    body: JSON.stringify({ id })
  });
  const resContent = await res.json();

  debug(resContent);

  if (resContent.coeurOwner === id) {

    moveIt();

  }

  checkStatus();

  const notify = new Notify();
  await notify.init();
  copyLink(notify);
  displayShare();

}

export default () => {

  start().catch(error => console.error(error) );

};
