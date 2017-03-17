'use strict';

const fs = require('fs');
const path = require('path');
const petsPath = path.join(__dirname, 'pets.json');

const express = require('express');
const app = express();
app.set('port', process.env.PORT || 8000)

const bodyParser = require('body-parser');
app.use(bodyParser.json());
const morgan = require('morgan');
app.use(morgan('short'));

app.disable('x-powered-by');

fs.readFile('pets.json', 'utf8', (err, petsJSON) => {
    let pets = JSON.parse(petsJSON)

    app.post('/pets', (req, res) => {
        let pet = req.body;

        if (!pet) {
            return res.sendStatus(400);
        }

        pets.push(pet);

        res.send(pet);

        fs.writeFile(petsPath, JSON.stringify(pets), (err) => {
            if (err) {
                throw err;
            }
        })
    });

    app.get('/pets', function(req, res) {
        res.send(pets);
    });

    app.get('/pets/:index', function(req, res) {
        var index = Number.parseInt(req.params.index);

        if (Number.isNaN(index) || index < 0 || index >= pets.length) {
            return res.sendStatus(404);
        }

        res.send(pets[index]);
    });

    app.patch('/pets/:index', function(req, res) {
        var index = Number.parseInt(req.params.index);

        if (Number.isNaN(index) || index < 0 || index >= pets.length) {
            return res.sendStatus(404);
        }

        var pet = req.body;

        if (!pet) {
            return res.sendStatus(400);
        }

        // console.log(process.argv[2]);
        pets[index] = pet;

        res.send(pet);

        fs.writeFile(petsPath, JSON.stringify(pets), (err) => {
            if (err) {
                throw err;
            }
        })

    });

    // DELETE
    app.delete('/pets/:index', function(req, res) {
        var index = Number.parseInt(req.params.index);

        if (Number.isNaN(index) || index < 0 || index >= pets.length) {
            return res.sendStatus(404);
        }

        var pet = pets.splice(index, 1)[0];

        res.send(pet);

        fs.writeFile(petsPath, JSON.stringify(pets), (err) => {
            if (err) {
                throw err;
            }
        })
    });
})

app.listen(app.get('port'), function() {
    console.log('Listening on', app.get('port'));
});

module.exports = app;
