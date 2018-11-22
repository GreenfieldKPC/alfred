var express = require('express');
const db = require('../models');
const googleMapsClient = require('@google/maps').createClient({
  key: 'your API key here',
  Promise: Promise
});
const hostname = 'localhost';
const port = process.env.PORT || 8080;
const app = express();
const path = require('path');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const bCrypt = require('bcrypt-nodejs');

app.use(require('cookie-parser')());
app.use(bodyParser.json())
app.use(require('body-parser').urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());
app.set('view engine', 'ejs');
app.set('view options', { layout: false });
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

// ************ passport config *********//
var User = require('../models').Users;
passport.use(new LocalStrategy(function (username, password, done) {
    // hash password
    var generateHash = function (password) {
      return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
    };
    const userPassword = generateHash(password);

  db.sequelize.query(` SELECT * FROM users WHERE username = '${username}'`).then(function(user) {
    console.log('user////',user[0]);
    if (!user[0][0]) {
      console.log('Incorrect username.');
      return done(null, false, { message: 'Incorrect username.' });
    } else if (bCrypt.compareSync(password, user[0][0].hashed_password) === 'false') {
      console.log('Incorrect password');
      return done(null, false, { message: 'Incorrect password.' });
    } else {
      console.log('ok');
      done(null, user[0][0]);
    }
  });
  }));

passport.serializeUser((function(user, done) {
  console.log(user);
  done(null, user.id);
}));

passport.deserializeUser((function(id, done) {
  User.findById(id).then(function (user) {
    done(null, user);
  }).catch(function (e) {
    done(e, false);
  });
  }
));


app.get('/sign-up', function (req, res) {
  res.render('sign-up', {});
});


app.post('/login', function (req, res, next) {
  passport.authenticate('local', function (err, user) {
    if (err) { return next(err); }
    // Redirect if it fails
    if (!user) { 
      res.writeHead(401, { 'Content-Type': 'application/json' });
      return res.end();
    }
    req.logIn(user, function (err) {
      if (err) { return next(err); }
      // Redirect if it succeeds
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end();
    });
  })(req, res, next);
}
);

// *************** HANDELING LOGOUt******//
app.get("/logOUt", (req, res) => {
  req.session.destroy();
  res.send(true);
})
// app.get('/logout', function (req, res) {
//   req.logout();
//   res.redirect('/');
// });


//*****  HANDELING SIGN UP******//
app.post('/signUp', function (req, res, done) {
      console.log(req.body)
      var picture;
      var info;
      if (req.body.picture === undefined) {
        picture = "non.png"
      }
      if (req.body.info === undefined) {
        info = "N/A"
      }
      // hash password
      var generateHash = function (password) {
        return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
      };

      var userPassword = generateHash(req.body.password);

  db.sequelize.query(`SELECT * FROM areas WHERE city ='${req.body.city.toLowerCase()}' `).then((area) => {
    if (area[0][0] === undefined || area[0][0].id === undefined) {
      db.sequelize.query(`INSERT INTO areas (city) VALUES ('${req.body.city.toLowerCase()}')`).then(() => {
        db.sequelize.query(`SELECT * FROM areas WHERE city ='${req.body.city.toLowerCase()}' `).then((area) => {
          area_id = area[0][0].id
        });
      })
    } else {
      area_id = area[0][0].id
    }
  }).then(() => {
    db.sequelize.query(` SELECT * FROM users WHERE username = '${req.body.username.toLowerCase()}';`).then((user) => {
      if ((user[0][0] === undefined || user[0][0].id === undefined)) {
        db.sequelize.query(`INSERT INTO users (username, password, name_first, name_last, phone, email, picture, info, area, hashed_password) VALUES ('${req.body.username.toLowerCase()}','${req.body.password}','${req.body.firstName}','${req.body.lastName}',${req.body.phone},'${req.body.email}','${picture}','${info}','${area_id}','${userPassword}')`,
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
  }
)
// function (err) {
//   if (err) {
//     return res.json(400, {
//       response: {
//         code: 400,
//         message: 'An error appeared.'
//       }
//     });
//   } else {
//     console.log('succes');
//     res.end("user added");
//   }
// })


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
// ***************************************//



//*********HANDELING ADDING A JOB*******//
app.post("/add",(req,res) =>{
  console.log(req.body); 
  console.log(req.session)
})


app.listen(port, hostname, () => {
  // connect to the DB
  console.log(`Server running at http://${hostname}:${port}/`);
});