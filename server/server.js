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
const logger = require('morgan');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const expressSession = require('express-session');
const request = require('request');
const axios = require('axios');
app.use(require('cookie-parser')());
app.use(bodyParser.json())
app.use(require('body-parser').urlencoded({ extended: false }));
app.use(expressSession({ secret: 'mySecretKey', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(session({ secret: 'keyboard cat' }))
app.set('view engine', 'ejs');
app.set('view options', { layout: false });

app.use(express.static('dist/browser'))
// app.use(express.static(path.join(__dirname + 'dist/browser')));

// passport config
var User = require('../models/users');
passport.use(new LocalStrategy(function(username, password, done) {
  User.findOne({ where: { username: username } }).then(function (err, user) {
    if (err) { return done(err); }
    if (!user) {
      console.log('Incorrect username.');
      return done(null, false, { message: 'Incorrect username.' });
    } else if (password != user.password) {
      console.log('Incorrect password');
      return done(null, false, { message: 'Incorrect password.' });
    } else {
      console.log('ok');
      done(null, user);
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

// app.get('/', (req, res,) => {
//   res.render('index', { user: req.user });
// });

app.get('/sign-up', function (req, res) {
  res.render('sign-up', {});
});

// app.post('/sign-up', function (req, res) {
//   User.register(new User({ username: req.body.username }), req.body.password, function (err, user) {
//     if (err) {
//       return res.render("sign-up", { info: "Sorry. That username already exists. Try again." })
//     }

//     passport.authenticate('local')(req, res, function () {
//       res.redirect('/');
//     });
//   });
// });
app.post('/signup', (req, res) => {
  console.log(req.body)
  var picture;
  var info;
  if (req.body.picture === undefined) {
    picture = "non.png"
  }
  if (req.body.info === undefined) {
    info = "N/A"
  }
  db.sequelize.query(`INSERT INTO users (username, password, name_first, name_last, phone, email, picture, info, area) VALUES ('${req.body.username}','${req.body.password}','${req.body.firstName}','${req.body.lastName}','${Number(req.body.phone)}','${req.body.email}','${picture}','${info}','${req.body.zipcode}')`,
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
        res.json(201, {
          response: {
            code: 201,
            message: 'USER HAS BEEN ADDED'
          }
        });
      }

    })
});

app.get('/login', function (req, res) {
  res.render('login', { user: req.user });
});

app.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login'
}));

app.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});

app.listen(port, hostname, () => {
  // connect to the DB
  console.log(`Server running at http://${hostname}:${port}/`);
});
