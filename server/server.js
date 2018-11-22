var express = require('express');
const session = require('express-session');
const db = require('../models');
const passport = require('passport');
const bcrypt = require('bcrypt');
const googleMapsClient = require('@google/maps').createClient({
  key: 'your API key here',
  Promise: Promise
});
const hostname = 'localhost';
const port = 8080;
const app = express();
const bodyParser = require('body-parser');
const LocalStrategy = require('passport-local').Strategy;
app.use(bodyParser.json())
app.use(express.static('dist/browser'))
app.use(passport.initialize());
//***********setting up passport ************//
var User = require('../models').Users;
passport.use(new LocalStrategy(function (username, password, done) {

  db.sequelize.query(` SELECT * FROM users WHERE username = '${username}'`).then(function (user) {
    console.log('user////', user[0]);
    if (!user[0][0]) {
      console.log('Incorrect username.');
      return done(null, false, {
        message: 'Incorrect username.'
      });
    } else if (bcrypt.compareSync(password, user[0][0].hashed_password) === 'false') {
      console.log('Incorrect password');
      return done(null, false, {
        message: 'Incorrect password.'
      });
    } else {
      console.log('ok');
      done(null, user[0][0]);
    }
  });
}));


passport.serializeUser((function (user, done) {
  console.log(user);
  done(null, user.id);
}));

passport.deserializeUser((function (id, done) {
  User.findById(id).then(function (user) {
    done(null, user);
  }).catch(function (e) {
    done(e, false);
  });
}));

//********************************************* */



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
// *********************************//



//*****  HANDELING SIGN UP******//
app.post('/signUp',(req,res) =>{
console.log(req.body)
var  picture;
var  info;
var area_id;
    var generateHash = function (password) {
      return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
    };

    var userPassword = generateHash(req.body.password);
if(req.body.picture === undefined){
  picture = "non.png"
}
if(req.body.info === undefined){
info = "N/A"
}
 db.sequelize.query(`SELECT * FROM areas WHERE city ='${req.body.city.toLowerCase()}' `).then((area) => {
   if (area[0][0] === undefined || area[0][0].id === undefined){
   db.sequelize.query(`INSERT INTO areas (city) VALUES ('${req.body.city.toLowerCase()}')`).then(() => {
      db.sequelize.query(`SELECT * FROM areas WHERE city ='${req.body.city.toLowerCase()}' `).then((area) => {
       area_id = area[0][0].id
      });
   })
   }else{
     area_id = area[0][0].id
   }
 }).then(() => {
   db.sequelize.query(` SELECT * FROM users WHERE username = '${req.body.username.toLowerCase()}';`).then((user) => {
     if ((user[0][0] === undefined || user[0][0].id === undefined)) {
       db.sequelize.query(`INSERT INTO users (username, name_first, name_last, phone, email, picture, info, area, hashed_password) VALUES ('${req.body.username}','${req.body.firstName}','${req.body.lastName}','${req.body.phone}','${req.body.email}','${picture}','${info}','${area_id}','${userPassword}')`,
         function (err) {
           if (err) {
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

         }).then((data) => {
         console.log(data[0])
       })

     } else {
       res.end("user exists");
     }
   })

 })

})
// **********************************//



//********* HANDELING LOGIN********//
app.post('/login', function (req, res, next) {
  console.log(req)
  passport.authenticate('local', function (err, user) {
    if (err) {
      return next(err);
    }
    // Redirect if it fails
    if (!user) {
      res.writeHead(401, {
        'Content-Type': 'application/json'
      });
      return res.end();
    }
    req.logIn(user, function (err) {
      if (err) {
        return next(err);
      }
      return req.session.regenerate(() => {
        req.session.user = req.body.username;
        res.send('true');
      });;

    });
  })(req, res, next);
});
// ***************************************//




   
//*********HANDELING ADDING A JOB*******//
app.post("/add",(req,res) =>{
  console.log(req.body); 
  console.log(req.session)
})
// ****************************************//




// *************** HANDELING LOGOUt******//
app.get("/logOUt", (req,res) => {
  req.session.destroy();
  res.send(true);
})
//**************************************//

// ***************getting user data for intial map******//
app.get('/user',(req,res)=>{
  var userProfile;
  db.sequelize.query(` SELECT * FROM users WHERE username = '${req.session.user}'`).then((user)=>{
    userProfile = user[0][0];
    db.sequelize.query(` SELECT * FROM areas WHERE id = '${userProfile.area}'`).then((area) => {
      userProfile.area = area[0][0].city;
      res.send(userProfile)

    })
  })
})



app.listen(port, hostname, () => {
  // connect to the DB
  console.log(`Server running at http://${hostname}:${port}/`);
});