var express = require('express');
const db = require('../models');
const googleMapsClient = require('@google/maps').createClient({
  key: 'your API key here',
  Promise: Promise
});
const hostname = 'localhost';
const port = 8080;
const app = express();
const axios = require('axios');
const bodyParser = require('body-parser');

app.use(bodyParser.json())
app.use(express.static('dist/browser'))

app.get('/', (req, res,) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('connected');
});


app.post('/signup',(req,res) =>{
console.log(req.body)
var  picture;
var  info;
if(req.body.picture === undefined){
  picture = "non.png"
}
if(req.body.info === undefined){
info = "N/A"
}
db.sequelize.query(`INSERT INTO users (username, password, name_first, name_last, phone, email, picture, info, area) VALUES ('${req.body.username}','${req.body.password}','${req.body.firstName}','${req.body.lastName}','${req.body.phone}','${req.body.email}','${picture}','${info}','${req.body.zipcode}')`,
    function (err) {
      if(err){
      return res.json(400, {
        response: {
          code: 400,
          message: 'An error appeared.'
        }
      });
    } else {
      console.log('succes');
      res.json(201, {
        response: {
          code: 201,
          message: 'USER HAS BEEN ADDED'
        }
      });
    }

})
})

app.listen(port, hostname, () => {
  // connect to the DB
  console.log(`Server running at http://${hostname}:${port}/`);
});
