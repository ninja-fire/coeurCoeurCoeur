const webPush = require('web-push');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');

const Config = require('./config');

// const logger = require('morgan');

webPush.setVapidDetails(
  Config.VAPID.email,
  Config.VAPID.public,
  Config.VAPID.private,
);

const port = 3000;
let timeoutInactive = null;

// app.use(logger('dev') );
app.use(bodyParser.json() );
app.use(cors() );

const lovers = new Map();
let coeurOwner = null;


function setNewOwner(id){

  clearTimeout(timeoutInactive);

  if(lovers.get(id).subscription){

    webPush.sendNotification(lovers.get(id).subscription, Buffer.from(JSON.stringify({ isOwner: true }) ) )
      .catch( (error) => {

        if(error.statusCode === 410){

          lovers.set(id, {}); // todo maybe select new one ?

        } else {

          console.error('Subscription push error ', error);

        }

      });

  }

  coeurOwner = id;
  console.log(`New owner ${coeurOwner}`);

  timeoutInactive = setTimeout(() => {

    if(coeurOwner !== id){

      return false;

    }

    const newOwner = distribute();

    if(lovers.get(id).subscription){

      webPush.sendNotification(lovers.get(id).subscription, Buffer.from(JSON.stringify({ isOwner: false }) ))
        .catch( (error) => {

          if(error.statusCode !== 410){

            console.log('Subscription push error ', error);

          }

        });

    }

    console.log(`Lover escape ${id}`);
    lovers.delete(id);

    if(lovers.size === 0){

      coeurOwner = null;
      console.log('Everyone gone');

    } else {

      setNewOwner(newOwner);

    }

  }, Config.timeInactive);

}

function distribute(){

  if(lovers.size === 1){

    return coeurOwner;

  }

  const nb = Math.round(Math.random() * (lovers.size -2) );
  return Array.from(lovers.keys() ).filter(lover => lover !== coeurOwner)[nb];

}

app.post('/giveMe', (req, res) => {

  const id = req.body.id;

  res.send({
    result: id === coeurOwner,
  });

});

app.post('/finish', (req, res) => {

  const id = req.body.id;

  if(coeurOwner === id){

    console.log(`Heart is back ${id}`);
    setNewOwner(distribute() );

    res.send({
      result: 'ok',
    });

  } else {

    res.send({
      result: 'too bad',
    });

  }

});

app.post('/ready', (req, res) => {

  const id = req.body.id;
  const countLovers = lovers.size;

  lovers.set(id, {});

  if(lovers.size === countLovers){

    console.log(`Lovers connected ${id}`);

  } else {

    console.log(`New lovers ${id}`);

  }

  if(countLovers === 0){

    setNewOwner(id);

  }


  res.send({
    result: 'ok',
    lovers: Array.from(lovers.keys() ),
    coeurOwner,
  });

});

app.post('/subscribe', (req, res) => {

  const subscription = req.body.subscription;

  if(lovers.has(req.body.id) ){

    lovers.set(req.body.id, { subscription });

  }

  res.send({ result: 'ok' });

});

app.listen(port, () => console.log(`Coeur coeur listening on port ${port}!`) );
