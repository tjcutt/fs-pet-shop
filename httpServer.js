'use strict'

const http = require('http')
const url = require('url')
const path = require('path')
const fs = require('fs')
const port = 8000

const server = http.createServer((req, res) => {
  let pathname = url.parse(req.url).pathname
  let pathArr = pathname.match(/[^/]+/g)

  fs.readFile('pets.json', 'utf8', (err, data) => {
    let dataParse = JSON.parse(data)
    let petPath = pathArr[0]

    if (req.method === 'GET') {
      if (err) throw err

      if (pathArr.length === 1 && petPath === 'pets') {
        if (err) throw err
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.end(data)
      }
      else if (pathArr.length === 2) {
        if (err) throw err
        let index = pathArr[1]
        let indexParse = JSON.parse(index)

        if (indexParse >= 0 && indexParse < dataParse.length) {
          res.statusCode = 200
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(dataParse[indexParse]))
        }
        else {
          if (err) throw err
          res.statusCode = 404
          res.setHeader('Content-Type', 'text/plain')
          res.end('Not Found')
        }
      }
    }
  })
})

server.listen(port, (err) => {
  if (err) throw err
  console.log('Listening at port ' + port)
})

module.exports = server
