import uuidv4 from 'uuid/v4';
import './main.scss';
import Config from './config';
import 'materialize-css/dist/css/materialize.min.css';
import 'materialize-css/dist/js/materialize.min';
import Notify from "./notify";

function getId(){

  if (localStorage.getItem('id') === null) {

    localStorage.setItem('id', uuidv4());

  }

  return localStorage.getItem('id');

}

const url = document.location.href;
const id = getId();
const hearts = document.getElementsByClassName('half-heart two');
const glows = document.getElementsByClassName('glow');
let isOwner = false;

async function onClickHeart(){

  const res = await fetch(`${Config.apiUrl}/finish`, {
    method: 'post',
    headers: {
      'Content-type': 'application/json; charset=UTF-8'
    },
    mode: 'cors',
    body: JSON.stringify({ id })
  });

  const resContent = await res.json();

  if(resContent.result === 'ok'){

    console.log('ownership finish');
    Array.from(hearts).forEach(heart => heart.classList.add('to-the-sky') );
    Array.from(glows).forEach(glow => glow.classList.add('halo') );

    setTimeout(() => {

      Array.from(hearts).forEach(heart => heart.classList.remove('join', 'to-the-sky') );
      Array.from(glows).forEach(glow => glow.classList.remove('halo') );
      Array.from(hearts).forEach(heart => {
        heart.removeEventListener('click', onClickHeart);
      });
      isOwner = false;

    }, 1500);

  }

}

function moveIt(){

  isOwner = true;
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

  }, 1000);

}

function debug(resContent){

  const loversContainers = document.getElementById('lovers');
  loversContainers.textContent = JSON.stringify(resContent);

}

function copyLink(){

  const copyBtn = document.getElementById('copy');
  let timeOutCopyLink = null;
  copyBtn.addEventListener('click', async () => {

    await navigator.clipboard.writeText(url);
    copyBtn.innerText = 'Link copied';
    copyBtn.classList.add('light-green');
    copyBtn.classList.remove('blue-grey');
    copyBtn.classList.remove('lighten-4');

    if(timeOutCopyLink){

      clearTimeout(timeOutCopyLink);

    }

    timeOutCopyLink = setTimeout(() => {

      copyBtn.innerText = 'Copy link';
      copyBtn.classList.add('blue-grey');
      copyBtn.classList.add('lighten-4');
      copyBtn.classList.remove('light-green');

    }, 1000);

  }, false);

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

  copyLink();
  debug(resContent);

  if (resContent.coeurOwner === id) {

    moveIt();

  }

  checkStatus();

  const notify = new Notify();
  await notify.init();

}

export default () => {

  window.addEventListener('load', () => {

    start().catch(error => console.error(error) );

  });

};
