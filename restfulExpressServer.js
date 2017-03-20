'use strict';

// Setting up requires for core modules including: fs, path, express
const fs = require('fs');
const path = require('path');
const petsPath = path.join(__dirname, 'pets.json');
const express = require('express');
const app = express();
// Setting express to a port
app.set('port', process.env.PORT || 8000)

// Requiring middle ware that parse the body to use req.body and to log to terminal with morgan
const bodyParser = require('body-parser');
app.use(bodyParser.json());
const morgan = require('morgan');
app.use(morgan('short'));

app.disable('x-powered-by');

//===========READ FILE===========
// Read pets.json db and parse the string into an object
fs.readFile('pets.json', 'utf8', (err, petsJSON) => {
    if (err) {
        return res.sendStatus(404)
    }
    let pets = JSON.parse(petsJSON)

        // =============GET /PETS ARRAY=============
        app.get('/pets', function(req, res) {
            if (err) {
                return res.sendStatus(400)
            }
            res.set('Content-Type', 'application/json')
            res.send(JSON.stringify(pets));
        });

        // ================GET /PETS/INDEX=============
        app.get('/pets/:index', function(req, res) {
            var index = Number.parseInt(req.params.index);

            // Error handling - non-existent index
            if (Number.isNaN(index) || index < 0 || index >= pets.length) {
                return res.sendStatus(404);
            }
            res.set('Content-Type', 'application/json')
            res.send(JSON.stringify(pets[index]));
        });

    //===========POST===========
    // Post new objects to pets.json
    app.post('/pets', (req, res) => {
        let pet = req.body;

        // error handling
        if (!pet || pet.age === '' || pet.kind === '' || pet.name === ''||pet.age === NaN) {
            return res.sendStatus(400);
        }

        pets.push(pet);
        // console.log('pets', pets);
        // console.log('type of pet', typeof pet);
        let petsJSON = JSON.stringify(pets)
        res.set('Content-Type', 'application/json')
        res.send(JSON.stringify(pet));

         // Write file to db
        fs.writeFile(petsPath, petsJSON, (err) => {
            if (err) {
                return res.sendStatus(400);
            }
        })
    });

    // ===============PATCH /PETS/INDEX ===========
    app.patch('/pets/:index', function(req, res) {
        var index = Number.parseInt(req.params.index);

        // Error handling - nonexistent index
        if (Number.isNaN(index) || index < 0 || index >= pets.length) {
            return res.sendStatus(404);
        }

        let pet = req.body;

        // Error handling - value to be updated not there
        if (!pet || pet.age === NaN || pet.age === '') {
            return res.sendStatus(400);
        }
        // Come back to to understand error handling
        // Loop through JSON data to find same key to update
        for (let key in req.body) {
            console.log('pets key', pets[index][key], 'pet key', pet[key]);
            pets[index][key] = pet[key]
        }

        // Write file of updated information to db
        fs.writeFile(petsPath, JSON.stringify(pets), (err) => {
            if (err) {
                return res.sendStatus(404)
            }
        })
  console.log('pets index ', pets[index]);
        res.set('Content-Type', 'application/json')
        res.send(pets[index])

    });

    // ================== DELETE PETS/INDEX=============
    app.delete('/pets/:index', function(req, res) {
        var index = Number.parseInt(req.params.index);

        // Error handling - non-existent index
        if (Number.isNaN(index) || index < 0 || index >= pets.length) {
            return res.sendStatus(404);
        }

        var pet = pets.splice(index, 1)[0];
        res.set('Content-Type', 'application/json')
        res.send(JSON.stringify(pet));

        // Write file
        fs.writeFile(petsPath, JSON.stringify(pets), (err) => {
            if (err) {
                return res.sendStatus(400)
            }
        })
    });

    app.use('/', (req, res) => {
        res.sendStatus(404)
    })
})

// ================END READFILE ===========

// ============= LISTENER ============
app.listen(app.get('port'), function() {
    console.log('Listening on', app.get('port'));
});

module.exports = app;
