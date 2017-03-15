'use strict'

const http = require('http')
const fs = require('fs')
const express = require('express')
const port = 8000
const app = express()
const path = require('path');
const petsPath = path.join(__dirname, 'pets.json');
// ask lisa about join line

app.disable('x-powered-by');

app.get('/pets', (req, res) => {
  fs.readFile(petsPath, 'utf8', (err, petsJSON) => {
    if (err) {
      console.error(err.stack);
      return res.sendStatus(404)
    }
    let pets = JSON.parse(petsJSON);

    res.send(pets);
  });
});

app.get('/pets/:id', (req, res) => {
  fs.readFile(petsPath, 'utf8', (err, petsJSON) => {
    if (err) {
      console.error(err.stack);
      return res.sendStatus(404)
    }

    let id = Number.parseInt(req.params.id);
    let pets = JSON.parse(petsJSON);

    if (id < 0 || id >= pets.length || Number.isNaN(id)){
      return res.sendStatus(404);
    }
    res.send(pets[id]);
  });
});

app.use( (req, res) => {
  res.sendStatus(404)
})

app.listen(port, () => {
  console.log('Hey there, we are listening on ', port);
})
