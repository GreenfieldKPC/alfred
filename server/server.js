require('dotenv').config();
const express = require('express');
const db = require('../models');
const passport = require('passport');
const bcrypt = require('bcrypt');
const googleMapsClient = require('@google/maps').createClient({
  key: 'your API key here',
  Promise: Promise
});
var cloudinary = require('cloudinary');
cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.cloud_key,
  api_secret: process.env.cloud_secret
});
const stripe = require('stripe')('sk_test_9sVeSfkTNBDozqwFlDTzavxt');;
const port = process.env.PORT || 8080;
const app = express();
const path = require('path');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const bodyParser = require('body-parser');
app.use(bodyParser.json())
app.use(require('body-parser').urlencoded({
  extended: false
}));

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
app.use(passport.initialize());
app.use(passport.session());
app.set('view engine', 'ejs');
app.set('view options', {
  layout: false
});
app.use(express.static('dist/browser'))


//*********** PASSPORT CONFIG ************//
passport.use(new LocalStrategy(function (username, password, done) {
  db.sequelize.query(` SELECT * FROM users WHERE username = '${username}'`).then(function (user) {
    console.log(user[0][0], 'server line 50');
    if (!user[0][0]) {
      return done(null, false);
    } else if (bcrypt.compareSync(password, user[0][0].hashed_password) === false) {
      return done(null, false);
    } else {
      done(null, user[0][0]);
    }
  });
}));

passport.serializeUser((function (user, done) {
  done(null, user.id);
}));

passport.deserializeUser((function (id, done) {
  db.sequelize.query(` SELECT * FROM users WHERE id = '${id}'`).then(function (user) {
    done(null, user[0][0]);
  }).catch(function (e) {
    done(e, false);
  });
}));

//********************************************* */


//*****  HANDELING SIGN UP******//
app.post('/signUp', (req, res) => {

  var picture;
  var info;
  var area_id;
  var generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
  };

  var userPassword = generateHash(req.body.password);
  if (req.body.picture === undefined) {
    picture = "non.png"
  }
  if (req.body.info === undefined) {
    info = "N/A"
  }
  db.sequelize.query(`SELECT * FROM areas WHERE city ='${req.body.city.toLowerCase()}' `).then((area) => {
    if (area[0][0] === undefined || area[0][0].id === undefined) {
      db.sequelize.query(`INSERT INTO areas (city) VALUES ('${req.body.city.toLowerCase()}')`).then(() => {
        db.sequelize.query(`SELECT * FROM areas WHERE city ='${req.body.city.toLowerCase()}' `).then((area) => {
          area_id = area[0][0].id
        }).then(() => {
          db.sequelize.query(` SELECT * FROM users WHERE username = '${req.body.username.toLowerCase()}';`).then((user) => {
            if ((user[0][0] === undefined || user[0][0].id === undefined)) {
              //insert id_stripe from req.body.stripeId !!!!
              db.sequelize.query(
                `INSERT INTO users (username, name_first, name_last, phone, email, id_stripe, picture, id_area, hashed_password,id_category)
                 VALUES ('${req.body.username}','${req.body.firstName}','${req.body.lastName}','${req.body.phone}','${req.body.email}','${req.body.stripeId}','${picture}','${area_id}','${userPassword}','${req.body.category}')`,
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

                }).then((data) => {res.json(data) })

            } else {
              res.end("user exists");
            }
          })

        })

      })
    } else {
      area_id = area[0][0].id
      db.sequelize.query(` SELECT * FROM users WHERE username = '${req.body.username.toLowerCase()}';`).then((user) => {
        if ((user[0][0] === undefined || user[0][0].id === undefined)) {
          db.sequelize.query(`INSERT INTO users (username, name_first, name_last, phone, email, id_stripe, picture, id_area, hashed_password,id_category) 
          VALUES ('${req.body.username}','${req.body.firstName}','${req.body.lastName}','${req.body.phone}','${req.body.email}','${req.body.stripeId}','${picture}','${area_id}','${userPassword}','${req.body.category}')`,
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

            }).then((data) => { res.json(data)})

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
      const temp = req.session.passport;
      return req.session.regenerate(() => {
        req.session.passport = temp;
        req.session.user = user.username;
        req.session.userId = user.id;
        res.send('true');
      });;
    });
  })(req, res, next);
});
// ***************************************//
// ************** universal category id finder****//
app.post('/category', (req, res) => {
  db.sequelize.query(`SELECT * FROM categories WHERE name = '${req.body.category}';`).then((category) => {
    res.send(category[0]);
  })
})
// ************universal area id finder*****//

app.post('/areas', (req, res) => {
  db.sequelize.query(`SELECT * FROM areas WHERE city = '${req.body.city.toLowerCase()}';`).then((areaObj) => {
    if (areaObj[0][0] === undefined || areaObj[0][0].id === undefined) {
      db.sequelize.query(`INSERT INTO areas (city) VALUES ('${req.body.city.toLowerCase()}')`).then(() => {
        db.sequelize.query(`SELECT * FROM areas WHERE city = '${req.body.city.toLowerCase()}';`).then((areaObj) => {
          res.send(areaObj[0]);
        })
      })
    } else {
      res.send(areaObj[0]);
    }
  })
})

//*********HANDELING ADDING A JOB*******//
app.post("/add", (req, res) => {
  let profile;
  db.sequelize.query(` SELECT * FROM users WHERE username = '${req.session.user}';`).then((user) => {
    profile = user[0][0];
    db.sequelize.query(` SELECT * FROM areas WHERE city = '${req.body.city}';`).then((area) => {
      if (area[0][0] === undefined || area[0][0].id === undefined) {
        db.sequelize.query(`INSERT INTO areas (city) VALUES ('${req.body.city.toLowerCase()}')`).then(() => {
          db.sequelize.query(`SELECT * FROM areas WHERE city ='${req.body.city.toLowerCase()}' `).then((area) => {
            profile.area = area[0][0].id;
          }).then(() => {
            db.sequelize.query(`INSERT INTO jobs (poster, doer, category, description, created_at, payment, id_area, address, zip, lat, lon, completed ) Values('${profile.id}','${0}','${req.body.category}','${req.body.description}', '${Date.now()}','${req.body.suggestedPay}','${profile.area}','${req.body.address}','${req.body.zipcode}','${req.body.lat}','${req.body.lng}','${false}')`).then(() => {
              res.send("job added")
              res.end()
            })
          })
        })
      } else {
        profile.area = area[0][0].id;
        db.sequelize.query(`INSERT INTO jobs (poster, doer, category, description, created_at, payment, id_area, address, zip, lat, lon, completed ) Values('${profile.id}','${0}','${req.body.electedCategory}','${req.body.description}' ,'${Date.now()}','${req.body.suggestedPay}','${profile.area}','${req.body.address}','${req.body.zipcode}','${req.body.lat}','${req.body.lng}','${false}')`).then(() => {
          res.send("job added")
          res.end()
        })
      }
    })
  });
})

//************** GETTING JOBS FOR MAP ******************//
app.get('/jobs', (req, res) => {
  let profile;
  db.sequelize.query(` SELECT * FROM users WHERE username = '${req.session.user}';`).then((user) => {
    profile = user[0][0];
  }).then(() => {
    db.sequelize.query(` SELECT * FROM jobs WHERE id_area = '${profile.id_area}';`).then((jobs) => {
      res.send(jobs[0])
    });
  })

})


//********* GET USER'S JOBS ******/
app.get('/jobs/taken', (req, res) => {
  console.log(req.session.user, req.session.userId, 'jobs taken');
  // change query to use req.session.userID when not testing on postman
  const q = `SELECT * from jobs WHERE doer = ${req.session.userId}`
  db.sequelize.query(q).then((data) => {
    console.log(data[0]);
    res.json(data[0]);
  });
});

app.get('/jobs/posted', (req, res) => {
  // change query to use req.session.userID when not testing on postman
  const q = `SELECT * from jobs WHERE poster = ${req.session.userId}`
  db.sequelize.query(q).then((data) => {
    console.log(data[0]);
    res.json(data[0]);
  });
});
//********************************* */


//********* USER TAKE JOB ******/
app.patch("/dashboard/takeChore", (req, res) => {
  // console.log(req.body, '///', req.session.userId);
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
    if (data[1].rowCount > 0) {
      res.send(true);
    } else {
      res.send(false);
    }
  }).catch((err) => console.log(err));
});
//***********************************************//




//*****************getting intial user data*****//
app.get('/user', (req, res) => {
  console.log(req.session)
  
  db.sequelize.query(` SELECT * FROM users WHERE username = '${req.session.user}';`)
    .then((user) => {
      const profile = user[0][0];
      db.sequelize.query(` SELECT * FROM areas WHERE id = '${user[0][0].id_area}';`).then((area) => {
        profile.area = area[0][0].city;
        res.send(profile);
        res.end();
      })
    })
})
// ******************************************************//



// **************** handeling search jobs/ people ******//
app.post('/searchJobs', ((req, res) => {
  let searchObj = {};
  if (req.body.category === 'all' || req.body.category === undefined) {
    db.sequelize.query(` SELECT * FROM jobs WHERE id_area = '${req.body.area}';`).then((jobs) => {
      searchObj.jobs = jobs[0]
    }).then(() => {
      res.send(searchObj);
    });
  } else {
    db.sequelize.query(` SELECT * FROM users WHERE id_area = '${req.body.area}' AND id_category = '${req.body.category}';`).then((users) => {
      console.log(users[0])
      searchObj.users = users[0];
    }).then(() => {
      db.sequelize.query(` SELECT * FROM jobs WHERE id_area = '${req.body.area}' and category = '${req.body.category}';`).then((jobs) => {
        searchObj.jobs = jobs[0]
      }).then(() => {
        res.send(searchObj);
      });
    })

  }
}))
// ****************************************//


// *************handling photo uploads*******//

// app.post('/photo', (req, res) => {
//   console.log(req.body)
//   cloudinary.uploader.upload(req.body.photo, function (result) {
//     console.log(result)
//   })
// })


// *************** HANDELING LOGOUt******//
app.get("/logOUt", (req, res) => {
  req.session.destroy();
  res.send(true);
})

//**************************************//

//************ CREATE STRIPE CUSTOMER ***************/
app.post('/stripe', function (req, res) {
  console.log('post incomming');
  // console.log('token id:', req.body.token.id)

  stripe.customers.create({
    source: req.body.token.id,
    email: req.body.email,
  })
  .then((customer) => {
    // console.log('customer:', customer)
    res.json(customer);
  }).catch((err) => {
    console.log(err);
    res.json(false)
  })
});
//******************************************/

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});