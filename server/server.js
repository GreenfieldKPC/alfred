var express = require('express');
const db = require('../models');
const passport = require('passport');
const bcrypt = require('bcrypt-nodejs');
const googleMapsClient = require('@google/maps').createClient({
  key: 'your API key here',
  Promise: Promise
});
const hostname = 'localhost';
const port = process.env.PORT || 8080;
const app = express();
const path = require('path');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const bodyParser = require('body-parser');
app.use(bodyParser.json())
app.use(require('body-parser').urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());
app.set('view engine', 'ejs');
app.set('view options', { layout: false });
app.use(express.static('dist/browser'))
app.use(passport.initialize());



//***********setting up passport ************//
var User = require('../models').Users;
passport.use(new LocalStrategy(function (username, password, done) {

  db.sequelize.query(` SELECT * FROM users WHERE username = '${username}'`).then(function (user) {
  
    if (!user[0][0]) {
     
      return done(null, false, {
        message: 'Incorrect username.'
      });
    } else if (bcrypt.compareSync(password, user[0][0].hashed_password) === 'false') {
      
      return done(null, false, {
        message: 'Incorrect password.'
      });
    } else {
     
      done(null, user[0][0]);
    }
  });
}));


passport.serializeUser((function (user, done) {
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

// ************ passport config *********//
var User = require('../models').Users;
passport.use(new LocalStrategy(function (username, password, done) {

  db.sequelize.query(` SELECT * FROM users WHERE username = '${username}'`).then(function(user) {
    if (!user[0][0]) {
     
      return done(null, false, { message: 'Incorrect username.' });
    } else if (bcrypt.compareSync(password, user[0][0].hashed_password) === 'false') {
     
      return done(null, false, { message: 'Incorrect password.' });
    } else {
     
      done(null, user[0][0]);
    }
  });
  }));

passport.serializeUser((function(user, done) {
  done(null, user.id);
}));

//*****  HANDELING SIGN UP******//
app.post('/signUp',(req,res) =>{

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
      }).then(() => {
        db.sequelize.query(` SELECT * FROM users WHERE username = '${req.body.username.toLowerCase()}';`).then((user) => {
          if ((user[0][0] === undefined || user[0][0].id === undefined)) {
            db.sequelize.query(`INSERT INTO users (username, name_first, name_last, phone, email, picture, info, id_area, hashed_password) VALUES ('${req.body.username}','${req.body.firstName}','${req.body.lastName}','${req.body.phone}','${req.body.email}','${picture}','${info}','${area_id}','${userPassword}')`,
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

              }).then((data) => {})

          } else {
            res.end("user exists");
          }
        })

      })

    })
    }else{
      area_id = area[0][0].id;
      db.sequelize.query(` SELECT * FROM users WHERE username = '${req.body.username.toLowerCase()}';`).then((user) => {
        if ((user[0][0] === undefined || user[0][0].id === undefined)) {
          db.sequelize.query(`INSERT INTO users (username, name_first, name_last, phone, email, picture, info, id_area, hashed_password) VALUES ('${req.body.username}','${req.body.firstName}','${req.body.lastName}','${req.body.phone}','${req.body.email}','${picture}','${info}','${area_id}','${userPassword}')`,
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

            }).then((data) => {})

        } else {
          res.end("user exists");
        }
      })
    }
  })
  })
// **********************************//



//********* HANDELING LOGIN********//
app.post('/login', function (req, res, next) {
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
        req.session.user = user.username;
        req.session.userId = user.id;
        res.send('true');
      });;

    });
  })(req, res, next);
});
// ***************************************//


app.get('/sign-up', function (req, res) {
  res.render('sign-up', {});
});



// *************** HANDELING LOGOUt******//
app.get("/logOUt", (req, res) => {
  req.session.destroy();
  res.send(true);
})

app.get('/sign-up', function (req, res) {
  res.render('sign-up', {});
});



// *************** HANDELING LOGOUt******//
app.get("/logOUt", (req, res) => {
  req.session.destroy();
  res.send(true);
})


//*********HANDELING ADDING A JOB*******//
app.post("/add",(req,res) =>{
 console.log(req.body);
 var addressString = req.body.address +" " + req.body.city + " " + req.body.zipcode
 console.log(addressString.split(" ").join("+"))
console.log(req.session)
})
app.get('/user', (req,res) =>{
  console.log(req.session)
   let profile;
   db.sequelize.query(` SELECT * FROM users WHERE username = '${req.session.user}';`).then((user) => {
     profile = user[0][0];
      db.sequelize.query(` SELECT * FROM areas WHERE id = '${user[0][0].id_area}';`).then((area) => {
       profile.area = area[0][0].city;
       res.send(profile);
       res.end();
     })
   })
})

//********* get user jobs ******/
app.get("/job/jobsTaken", (req, res) => {
  const q = `SELECT * from jobs WHERE doer = ${req.body.session.user.id}`
  db.sequelize.query(q).then((data) => {
    console.log(data);
    res.end();
  });
});

app.post("/job/jobsPosted", (req, res) => {
  const q = `SELECT * from jobs WHERE poster = ${req.query.session.user.id}`
  db.sequelize.query(q).then((data) => {
    console.log(data);
    res.end(data);
  });
});

//********* User take job ******/
app.patch("/dashboard/takeChore", (req, res) => {
  console.log(req.body, '///', req.session.userId);
  const q = `UPDATE jobs SET doer=${req.session.userId} WHERE id=${req.body.choreId}`
  db.sequelize.query(q, function (err) {
    if (err) {
      return res.json(400, {
        response: {
          code: 400,
          message: 'An error addding job to your profile.'
        }
      });
    } else {
      console.log('success');
    }
  }).then((data) => {
    console.log(data);
    // add check for doer id not assigned already
    // update this to return true of false!
    // res.send(true);
    if (data[1].rowCount > 0) {
      res.send(true);
    } else {
      res.send(false);
    }
  }).catch((err) => console.log(err));
});

app.listen(port, hostname, () => {
  // connect to the DB
  console.log(`Server running at http://${hostname}:${port}/`);
});