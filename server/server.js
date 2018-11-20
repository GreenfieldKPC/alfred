var express = require('express');
const googleMapsClient = require('@google/maps').createClient({
  key: 'your API key here',
  Promise: Promise
});
const {
  db,
  auth
} = require('./database.js')
const hostname = 'localhost';
const port = 8080;
const app = express();

app.use(express.static('dist/alfred'))

app.get('/', (req, res, next) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('connected');
});


app.listen(port, hostname, () => {
  // connect to the DB
  console.log(`Server running at http://${hostname}:${port}/`);
});