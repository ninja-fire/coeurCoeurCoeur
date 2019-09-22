const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
// const logger = require('morgan');

const port = 3000;
const timeInactive = 60 * 1000;
let timeoutInactive = null;

// app.use(logger('dev') );
app.use(bodyParser.json() );
app.use(cors() );

const lovers = new Set();
let coeurOwner = null;


function setNewOwner(id){

  clearTimeout(timeoutInactive);

  coeurOwner = id;
  console.log(`New owner ${coeurOwner}`);

  timeoutInactive = setTimeout(() => {

    if(coeurOwner !== id){

      return false;

    }

    const newOwner = distribute();
    console.log(`Lover escape ${id}`);
    lovers.delete(id);

    if(lovers.size === 0){

      coeurOwner = null;
      console.log('Everyone gone');

    } else {

      setNewOwner(newOwner);

    }

  }, timeInactive);

}

function distribute(){

  if(lovers.size === 1){

    return coeurOwner;

  }

  const nb = Math.round(Math.random() * (lovers.size -2) );
  return Array.from(lovers).filter(lover => lover !== coeurOwner)[nb];

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

  lovers.add(id);

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
    lovers: Array.from(lovers),
    coeurOwner,
  });

});

app.listen(port, () => console.log(`Coeur coeur listening on port ${port}!`) );
