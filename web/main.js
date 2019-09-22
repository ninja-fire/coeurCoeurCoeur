import uuidv4 from 'uuid/v4';
import './main.scss';
import Config from './config';
import 'materialize-css/dist/css/materialize.min.css';
import 'materialize-css/dist/js/materialize.min';
import Trianglify from 'trianglify';

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
      checkStatus();

    }, 1500);

  }

}

function moveIt(){

  Array.from(hearts).forEach(heart => {

    heart.addEventListener('click', onClickHeart, false);

    heart.classList.add('join');

  });

}

function checkStatus(){

  const interval = setInterval(async () => {

    const res = await fetch(`${Config.apiUrl}/giveMe`, {
      method: 'post',
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      },
      mode: 'cors',
      body: JSON.stringify({ id })
    });

    const resContent = await res.json();

    if(resContent.result){

      console.log('get it');

      clearInterval(interval);
      moveIt();

    }

  }, 1000);

}

function background(){

  const container = document.getElementById('bg-container');

  const pattern = Trianglify({
    cell_size: 40,
    x_colors: 'Greys',
    y_colors: 'match_x',
    variance: 1,
    height: container.clientHeight,
    width: container.clientWidth,
    seed: 'dl4fg3',
    color_space: 'hsv'
  });
  pattern.canvas(container);

}

async function start(){

  background();
  const copyBtn = document.getElementById('copy');
  const loversContainers = document.getElementById('lovers');

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

  const res = await fetch(`${Config.apiUrl}/ready`, {
    method: 'post',
    headers: {
      'Content-type': 'application/json; charset=UTF-8'
    },
    mode: 'cors',
    body: JSON.stringify({ id })
  });

  const resContent = await res.json();

  loversContainers.textContent = JSON.stringify(resContent);

  if (resContent.coeurOwner !== id) {

    checkStatus();

  } else {

    moveIt();

  }

}

export default () => {
  start().catch(error => console.error(error) );
};
