import uuidv4 from 'uuid/v4';
import './main.scss';
import Config from './config';

function getId(){

  if (localStorage.getItem('id') === null) {

    localStorage.setItem('id', uuidv4());

  }

  return localStorage.getItem('id');

}

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

async function start(){

  const loversContainers = document.getElementById('lovers');

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
