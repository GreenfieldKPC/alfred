var express = require('express');
const session = require('express-session');
const db = require('../models');
const googleMapsClient = require('@google/maps').createClient({
  key: 'your API key here',
  Promise: Promise
});
const hostname = 'localhost';
const port = 8080;
const app = express();
const passport = require('passport');
const request = require('request');
const bodyParser = require('body-parser');
const path = require('path');
const axios = require('axios');
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());
// app.use('/public', express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
app.set('view options', { layout: false });

app.use(express.static(__dirname + 'dist/browser'));
app.use(bodyParser.json())
app.use(express.static('dist/browser'))

// **********SETTING UP INTIAL SESSION********//
app.use(session({
  secret: 'hackerman',
  resave: true,
  saveUninitialized: true,
  username: null,
  cookie: {
    path: '/',
  },
}));

//*****  HANDELING SIGN UP******//
app.post('/signUp',(req,res) =>{
console.log(req.body)
var  picture;
var  info;
// const phone = Number(req.body.phone);
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
      res.end("user added");
    }

})
})


//********* HANDELING LOGIN********//
app.post("/login", (req, res) => {
  console.log(req.body);
 const username = req.body.username;
 const password = req.body.password;
db.sequelize.query(` SELECT * FROM users WHERE username = '${username}' AND password = '${password}';`).then((user) =>{
  if (user[0][0] ===undefined || user[0][0].id === undefined) {
    res.send(false);
  }else{
    return req.session.regenerate(() => {
      req.session.user = username;
      res.send(true);
    });
    }
  });
})
   
//*********HANDELING ADDING A JOB*******//

app.post("/add",(req,res) =>{
  console.log(req.body); 
  console.log(req.session)
})

// *************** HANDELING LOGOUt******//
app.get("/logOUt", (req,res) => {
  req.session.destroy();
  res.send(true);
})





app.listen(port, hostname, () => {
  // connect to the DB
  console.log(`Server running at http://${hostname}:${port}/`);
});