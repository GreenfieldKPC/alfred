require('dotenv').config();
const express = require('express');
aws4 = require('aws4')
// import entire SDK
var AWS = require('aws-sdk');
// import AWS object without services

AWS.config.update({
  accessKeyId: process.env.accessKeyId,
  secretAccessKey: process.env.secretAccessKey,
  region: 'us-east-1'
});

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
const stripe = require('stripe')('sk_test_9sVeSfkTNBDozqwFlDTzavxt');
const port = process.env.PORT || 8080;
const app = express();
const path = require('path');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const bodyParser = require('body-parser');
const request = require('request');

cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.cloud_key,
  api_secret: process.env.cloud_secret
});

app.use(bodyParser.json({
  parameterLimit: 100000,
  limit: '50mb',
  extended: true
}))
app.use(bodyParser.urlencoded({
  parameterLimit: 100000,
  limit: '50mb',
  extended: true
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
    // console.log(user[0][0], 'server line 50');
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
              db.sequelize.query(
                `INSERT INTO users (username, name_first, name_last, phone, email, id_stripe_customer, picture, id_area, hashed_password,id_category,is_employee)
                 VALUES ('${req.body.username}','${req.body.firstName}','${req.body.lastName}','${req.body.phone}','${req.body.email}','${req.body.stripeId}','${req.body.image}','${area_id}','${userPassword}','${req.body.category}','${false}')`,
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
                res.json(data)
              })

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
          db.sequelize.query(`INSERT INTO users (username, name_first, name_last, phone, email, id_stripe_customer, picture, id_area, hashed_password,id_category,is_employee)
          VALUES ('${req.body.username}','${req.body.firstName}','${req.body.lastName}','${req.body.phone}','${req.body.email}','${req.body.stripeId}','${req.body.image}','${area_id}','${userPassword}','${req.body.category}','${false}')`,
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
            res.json(data)
          })

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

//********* HANDELING EMPLOYEE LOGIN ********//
app.post('/login/employee', function (req, res, next) {
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
    } else if (!user.is_employee) {
      console.log(user)
      console.log('User is not an employee!');
      res.json({
        message: 'User is not an employee!'
      });
    } else {
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
        });
      });
    }

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
            db.sequelize.query(`INSERT INTO jobs (title,poster, doer, category, description, created_at, payment, id_area, address, zip, lat, lon, completed ) Values('${req.body.title}','${profile.id}','${0}','${req.body.category}','${req.body.description}', '${Date.now()}','${req.body.suggestedPay}','${profile.area}','${req.body.address}','${req.body.zipcode}','${req.body.lat}','${req.body.lng}','${false}')`).then((data) => {
              // res.send("job added")
              res.end()
            })
          })
        })
      } else {
        profile.area = area[0][0].id;
        db.sequelize.query(`INSERT INTO jobs (poster, doer, category, description, created_at, payment, id_area, address, zip, lat, lon, completed ) Values('${profile.id}','${0}','${req.body.category}','${req.body.description}' ,'${Date.now()}','${req.body.suggestedPay}','${profile.area}','${req.body.address}','${req.body.zipcode}','${req.body.lat}','${req.body.lng}','${false}')`).then((data) => {
          // res.send("job added")
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
    db.sequelize.query(` SELECT * FROM jobs WHERE id_area = '${profile.id_area}' AND doer = '${0}' ;`).then((jobs) => {
      res.send(jobs[0])
    });
  })

})


//********* GET USER JOBS ENDPOINT ******/
app.get('/jobs/taken', (req, res) => {
  console.log(req.session.user, req.session.userId, 'jobs taken');
  // change query to use req.session.userID when not testing on postman
  const q = `SELECT * from jobs WHERE doer = ${req.session.userId}`
  db.sequelize.query(q).then((data) => {
    // console.log(data[0]);
    res.json(data[0]);
  });
});


// ///////////////////////////////////////////



app.get('/jobs/posted', (req, res) => {
  const q = `SELECT * from jobs WHERE poster = ${req.session.userId}`
  db.sequelize.query(q).then((data) => {
    // console.log(data[0]);
    res.json(data[0]);
  });
});
///////////////////////////////////////////////////////




app.patch('/jobs/complete', (req, res) => {
  const q = `UPDATE jobs SET completed=true WHERE id = ${req.body.choreId}`
  db.sequelize.query(q).then((data) => {
    console.log(data[1].rowCount, 'complete');
    if (data[1].rowCount > 0) {
      res.send(true);
    } else {
      res.send(false);
    }
  });
});
//********************************* */


//********* USER TAKE JOB ******/
app.patch("/dashboard/takeChore", (req, res) => {
  console.log(req.body)
  db.sequelize.query(`SELECT * FROM jobs WHERE id=${req.body.choreId}`).then((data) =>{
    console.log(data[0]);
    if(data[0][0].doer === 0){
      console.log(req.body, '///', req.session.userId);
      const q = `UPDATE jobs SET doer=${req.session.userId} WHERE id=${req.body.choreId}`
      db.sequelize.query(q, (err) => {
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
        // add check for doer id not assigned already

        if (data[1].rowCount > 0) {
          res.send(true);
        } else {
          res.send(false);
        }
      }).catch((err) => console.log(err));
    }else{
      res.send(false);
    }
  })
 
});
//***********************************************//
//********************posting message to database*********//

app.post("/message", (req, res) => {
  console.log(req.body)
  db.sequelize.query(`INSERT INTO messages(text,id_from,id_to,read,created) VALUES('${req.body.message}','${req.session.userId}','${req.body.userid}','${false}','${Date.now()}')`)
  // res.send('message inserted')
  res.end();
})
////////////////////////////////////////////////////////////////







app.get('/message', (req, res) => {
  const {
    userId
  } = req.session;
  const mess = [];
  let tos;
  let fromm;
  let userss;
  db.sequelize.query(`SELECT * FROM messages WHERE id_from = '${userId}';`)
    .then((to) => {
      console.log(to, 'message');
      tos = to[0];
      db.sequelize.query(`SELECT * FROM messages WHERE id_to = '${userId}';`)
        .then((from) => {
          fromm = from[0];
          db.sequelize.query(`SELECT * FROM users`)
            .then((users) => {
              userss = users[0];
              console.log('hello', [tos, fromm, userss], 'hello');
              const too = tos.map((obj) => {
                const result = {};
                result.text = obj.text;
                result.read = obj.read;
                result.created = obj.created;
                result.id_from = obj.id_from;
                result.id_to = obj.id_to;
                userss.forEach((user) => {

                  if (Number(obj.id_from) === Number(user.id) && obj.id_from !== null) {
                    result.id_from_username = user.username;
                  }
                  if (Number(obj.id_to) === Number(user.id) && obj.id_to !== null) {
                    result.id_to_username = user.username;
                  }
                });
                return result;
              });
              const froms = fromm.map((obj) => {
                const result = {};
                result.text = obj.text;
                result.read = obj.read;
                result.created = obj.created;
                result.id_from = obj.id_from;
                result.id_to = obj.id_to;
                userss.forEach((user) => {

                  if (Number(obj.id_from) === Number(user.id) && obj.id_from !== null) {
                    result.id_from_username = user.username;
                  }
                  if (Number(obj.id_to) === Number(user.id) && obj.id_to !== null) {
                    result.id_to_username = user.username;
                  }
                });
                return result;
              });

              const message = [too, froms];
              console.log(message);
              message.push(users[0]);
              res.send(message);

            })
        })
    })
})
///////////////////////////////////////////////////////////////////////







//*************************************************************//
//***************** GET USER DATA *****//
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
});
////////////////////////////////////////////////////////////////






app.get('/user/photo/:id', (req, res) => {
  // console.log(req.body, '///', req.body.userId);
  const q = `SELECT * FROM users WHERE id = '${req.params.id}';`
  db.sequelize.query(q, (err) => {
    if (err) {
      return res.json(400, {
        response: {
          code: 400,
          message: 'An error retrieving user'
        }
      });
    } else {
      console.log('success');
    }
  }).then((data) => {
    //return url for user photo
    res.send({
      url: data[0][0].picture
    })
  }).catch((err) => console.log(err));
});

///////////////////////////////////////////////////////////////////////



app.get('/user/username/:id', (req, res) => {
  const q = `SELECT * FROM users WHERE id = '${req.params.id}';`
  db.sequelize.query(q, (err) => {
    if (err) {
      return res.json(400, {
        response: {
          code: 400,
          message: 'An error retrieving user'
        }
      });
    } else {
      console.log('success');
    }
  }).then((data) => {
    //return username of user
    res.send({
      username: data[0][0].username
    });
  }).catch((err) => console.log(err));

});


/////////////////////////////////////////////////////////////////////////



app.get('/user/rating/:id', (req, res) => {
  // query rating table for all with id, then return average
  const q = `SELECT * FROM ratings WHERE id_to = '${req.params.id}';`
  db.sequelize.query(q, (err) => {
    if (err) {
      return res.json(400, {
        response: {
          code: 400,
          message: 'An error retrieving user'
        }
      });
    } else {
      console.log('success');
    }
  }).then((data) => {
    // query rating table for all with id, then return average
    // return rating of user
    let ratings = data[0];
    let count = ratings.length;
    let total = ratings.reduce((total, rating) => {
      total += rating.value;
      return total;
    }, 0);
    let avg = ((50 + total) / (10 + count)).toFixed(1);

    res.send({
      rating: avg
    });
  }).catch((err) => console.log(err));

});


//////////////////////////////////////////////////////////////////////



app.get('/user/profile/:id', (req, res) => {
  // console.log(req.params, 'params////');
  const q = `SELECT * FROM users WHERE id = '${req.params.id}';`
  db.sequelize.query(q, (err) => {
    if (err) {
      return res.json(400, {
        response: {
          code: 400,
          message: 'An error retrieving user'
        }
      });
    } else {
      console.log('success');
    }
  }).then((data) => {
    console.log(data[0][0], 'user server line 446');
    //return profile info of user
    res.send({
      user: data[0][0]
    });
  }).catch((err) => console.log(err));

});


////////////////////////////////////////////////////////////////////////////////////////


app.patch('/user/photo', (req, res) => {
  const q = `UPDATE users SET picture='${req.body.url}' WHERE id='${req.session.userId}'`
  db.sequelize.query(q, (err) => {
    if (err) {
      return res.json(400, {
        response: {
          code: 400,
          message: 'An error retrieving user'
        }
      });
    } else {
      console.log('success');
    }
  }).then((data) => {
    if (data[1].rowCount > 0) {
      res.send(data);
    } else {
      res.send(false);
    }
  }).catch((err) => console.log(err));
});


////////////////////////////////////////////////////////////////////////////


app.post('/user/rating', (req, res) => {
  console.log(req.body, 'rating body');
  const q = `INSERT INTO ratings(value, id_job, id_to, id_from ) VALUES(${req.body.rating},${req.body.job}, ${req.body.to}, ${req.session.userId})`;
  db.sequelize.query(q, (err) => {
    if (err) {
      return res.json(400, {
        response: {
          code: 400,
          message: 'An error sending rating'
        }
      });
    } else {
      console.log('successful rating!');
    }
  }).then((data) => {
    console.log(data);
    res.end();
  }).catch(err => {
    console.log(err)
    res.end();
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
      // console.log(users[0])
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

app.post('/photo', (req, res) => {
  console.log('hellllloooooo cloudinary')
  console.log(req.body.image);
  cloudinary.v2.uploader.upload(req.body.image, {
      width: 500,
      height: 500,
      crop: "limit"
    },
    function (error, result) {
      console.log(result, 'result', error, 'error')
      res.send(result)
    })
})





// *************** HANDELING LOGOUt******//
app.get("/logOUt", (req, res) => {
  req.session.destroy();
  res.send(true);
})
//**************************************//

//************ CREATE STRIPE CUSTOMER ***************/
app.post('/stripe/signup', (req, res) => {
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


//******************** STRIPE CREATE CHARGE **********************/
app.post('/stripe/charge', (req, res) => {
  const q = `SELECT * from users WHERE id = ${req.session.userId}`;
  db.sequelize.query(q).then((user) => {
    // console.log('post incomming charge', req.body);
    return stripe.charges.create({
      amount: req.body.payment,
      currency: 'usd',
      customer: user[0][0].id_stripe_customer, // id from customer object
      // source: "tok_visa",
      transfer_group: "{Alfred_User}",
    });
  }).then((charge) => {
    console.log('charge:', charge)
    res.send('true');
  }).catch(err => {
    console.log(err)
    res.send('false');
  });
});

//******************** STRIPE CREATE PAYMENT ********************/
app.post('/stripe/pay', (req, res) => {

  const q = `SELECT * from users WHERE id = ${req.session.userId}`;
  db.sequelize.query(q).then((user) => {
    // console.log('post outgoing transfer', req.body);
    let payment = req.body.payment.toFixed(2).toString().replace(/\./g, '');
    console.log(payment, 'payment');
    return stripe.transfers.create({
      amount: payment,
      currency: "usd",
      //destination is user.id_stripe_account
      destination: user[0][0].id_stripe_account,
      transfer_group: "{Alfred_User}",
    });
  }).then((transfer) => {
    console.log('transfer:', transfer)
    res.send('true');
  }).catch(err => {
    console.log(err)
    // res.send('false');

    //for testing purpose, send true for nsf charge
    res.send('true');
  });

});

//******************************************/

//************** STRIPE REDIRECT **********/
app.get('/oauth/callback', (req, res) => {
  var code = req.query.code;
  console.log('code: ', code)
  // Make /oauth/token endpoint POST request
  request.post({
    url: `https://connect.stripe.com/oauth/token?client_secret=sk_test_9sVeSfkTNBDozqwFlDTzavxt&code=${code}&grant_type=authorization_code`,

  }, function (err, r, body) {
    console.log(body, 'body')
    var accessToken = JSON.parse(body).access_token;
    console.log('access: ', accessToken)
    // Do something with your accessToken
    // save token to user in database
    console.log(JSON.parse(body).stripe_user_id, 'stripe account id');

    const q = `UPDATE users SET id_stripe_account='${JSON.parse(body).stripe_user_id}' WHERE id='${req.session.userId}'`;
    db.sequelize.query(q).then((data) => {
      console.log(data);
      if (data[1].rowCount > 0) {
        //success redirect back to profile page
        res.redirect('/');
      } else {
        // error, redirect to profile page?
        res.redirect('/');
      }
    }).catch((err) => {
      console.log(err);
      return res.json(400, {
        response: {
          code: 400,
          message: 'An error creating account with Stripe!'
        }
      });
    })
  });
});

//****************************************** */


// ***********Submitting a complaint*****************//
app.post('/complaint', (req, res) => {
  console.log(req.session);
  console.log(req.body);
  // db.sequelize.query(`INSERT INTO complaints(description,address,category,id_user,photo,created_at,resolved) VALUES('${req.body.description}','${req.body.addr}','${req.body.category}','${req.session.userId}','${req.body.image}','${Date.now()}','${false}')`)
})
// {
//   description: 'okfnb',
//   address: 'odfknb',
//   city: 'okfnb',
//   zipcode: 'oknfv',
//   electedCategory: 'Unsafe conditions',
//   image: 'http://res.cloudinary.com/op-spark-thesis/image/upload/v1543599669/oxlrliknvketzauawcfy.png'
// }


// *************************************************//


// **********************getting complaints*************//
app.get('/complaints', (req, res) => {
  db.sequelize.query(`SELECT * FROM complaints`).then((complaints) => {
    console.log(complaints[0], 'server 859');
    res.send(complaints[0]);
  })

})








// ****************************************************//

// **************************handling lex endpoint****//
// app.post('/lex', (req, res) => {
//   console.log('sending to lex')
//   let opts = {
//     service: 'lex',
//     region: 'us-east-1',
//     method: 'POST',
//     Host: 'runtime.lex.us-east-1.amazonaws.com',
//     'user-key': '50d9ef140f0ee28b3dd1beea2096b576',
//     'Content-Type': 'application/json',
//     Host: 'runtime.lex.us-east-1.amazonaws.com',
//     url: process.env.lex_url,
//     headers: {
//       'Content-Type': 'application/json',
//       'Host': 'runtime.lex.us-east-1.amazonaws.com',
//     },
//     body: req.body.title
//   }

//   return new Promise(resolve => {
//     request(aws4.sign(opts, {
//         accessKeyId: process.env.lex_secret_id,
//         secretAccessKey: process.env.lex_key,
//       }),
//       function (error, response, body) {
//         if (error) {
//           console.log(error);
//         }
//         if (!error)
//           resolve(response);
//         console.log('this is the body', body)
//       })
//   }).then((data) => {
//     console.log('this is the data', data)
//   })
// })






app.post('/lex', (req, res) => {
  body = JSON.stringify({
    inputText: req.body.title
  })
  var lexruntime = new AWS.LexRuntime();
  var params = {
    botName: 'Alfred',
    botAlias: '$LATEST',
    userId: req.session.user,
    inputText: req.body.title,
  }
  lexruntime.postText(params, function (err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else console.log(data);
    res.send(data);
    res.end()
  });
})




app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
