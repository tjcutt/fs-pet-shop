'use strict';

let fs = require('fs');
let path = require('path');

const node = path.basename(process.argv[0])
const file = path.basename(process.argv[1])
let cmd = process.argv[2];
let num = process.argv[3];

if (cmd === 'read') {
  fs.readFile("pets.json", 'utf8', (err, data) => {
    data = JSON.parse(data);

    if (err) {
      throw err;
    }
    else if (num < 0 || num > data.length-1) {
      console.log(`USAGE node pets.js read INDEX`);
      process.exit(1);
    } else if (num === undefined){
      console.log(data);
    } else {
    console.log(data[num]);
    }
  });
}
else if (cmd === 'create') {
  fs.readFile('pets.json', 'utf8', function(err, data) {
    if (err) {
      throw err;
    }
    let newPetParse = JSON.parse(data)
    let newPet = {
      'age': parseInt(process.argv[3]),
      'kind': process.argv[4],
      'name': process.argv[5]
    }
    if (process.argv.length !=6){
      console.error(`Usage: ${node} ${file} ${cmd} AGE KIND NAME`);
      process.exit(1);
    }

    newPetParse.push(newPet)

    let newPets = JSON.stringify(newPetParse)

    fs.writeFile('pets.json', newPets, function(err){
      if (err) {
        throw err
      }
      console.log(newPet);
    })
  });
}
else {
  console.error(`Usage: node ${file} [read | create | update | destroy]`);
  process.exit(1);
}
