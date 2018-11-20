var express = require('express')
const {
  db,
  auth
} = require('./database.js')
const hostname = 'localhost';
const port = 8080;
const app = express();
var flash = require('connect-flash');
var passport = require('passport');
var request = require('request');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
const expressSession = require('express-session');
app.use(expressSession({ secret: 'mySecretKey' }));
app.use(passport.initialize());
app.use(passport.session());
// app.use('/public', express.static(__dirname + '/public'));
app.use(flash());
app.use(session({ secret: 'keyboard cat' }))
app.use(bodyParser());
app.set('view engine', 'ejs');
app.set('view options', { layout: false });

app.use(express.static(__dirname + 'dist/browser'));

app.get('/', (req, res, next) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.render('index');
  res.end('connected');
});


app.listen(port, hostname, () => {
  // connect to the DB
  console.log(`Server running at http://${hostname}:${port}/`);
});
