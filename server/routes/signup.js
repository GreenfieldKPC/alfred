const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
  const { password, city, username, firstName, lastName, phone, email, stripeId, category } = req.body;
  let picture;
  let area_id;
  const generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
  };

  var userPassword = generateHash(password);
  if (picture === undefined) {
    picture = "non.png"
  }
  db.sequelize.query(`SELECT * FROM areas WHERE city ='${city.toLowerCase()}' `)
    .then((area) => {
      if (area[0][0] === undefined || area[0][0].id === undefined) {
        db.sequelize.query(`INSERT INTO areas (city) VALUES ('${city.toLowerCase()}')`)
          .then(() => {
            db.sequelize.query(`SELECT * FROM areas WHERE city ='${city.toLowerCase()}' `)
              .then((area) => {
                area_id = area[0][0].id
                })
                  .then(() => {
                    db.sequelize.query(` SELECT * FROM users WHERE username = '${username.toLowerCase()}';`)
                      .then((user) => {
                        if ((user[0][0] === undefined || user[0][0].id === undefined)) {
                //insert id_stripe from req.body.stripeId !!!!
                          db.sequelize.query(`INSERT INTO users (username, name_first, name_last, phone, email, id_stripe, picture, id_area, hashed_password,id_category)
                            VALUES ('${username}','${firstName}','${lastName}','${phone}','${email}','${stripeId}','${picture}','${area_id}','${userPassword}','${category}')`,
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

                            })
                              .then((data) => { res.json(data) })
                          } else {
                            res.end("user exists");
                          }
          })

        })

      })
    } else {
      area_id = area[0][0].id
      db.sequelize.query(` SELECT * FROM users WHERE username = '${username.toLowerCase()}';`)
        .then((user) => {
          if ((user[0][0] === undefined || user[0][0].id === undefined)) {
            db.sequelize.query(`INSERT INTO users (username, name_first, name_last, phone, email, id_stripe, picture, id_area, hashed_password,id_category) 
            VALUES ('${username}','${firstName}','${lastName}','${phone}','${email}','${stripeId}','${picture}','${area_id}','${userPassword}','${category}')`,
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
              })
              .then((data) => { res.json(data) })

          } else {
          res.end("user exists");
        }
      })
    }
  })
})

module.exports = router;