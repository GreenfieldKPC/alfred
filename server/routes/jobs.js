const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  const { user } = req.session;
  db.sequelize.query(` SELECT * FROM users WHERE username = '${user}';`)
    .then((user) => {
      const profile = user[0][0];
  })
    .then(() => {
      db.sequelize.query(` SELECT * FROM jobs WHERE id_area = '${profile.id_area}';`)
        .then((jobs) => {
          res.send(jobs[0])
        });
  })

})
router.get('/taken', (req, res) => {
  const { userId } = req.session; 
  // change query to use req.session.userID when not testing on postman
  const q = `SELECT * from jobs WHERE doer = ${userId}`
  db.sequelize.query(q)
    .then((data) => {
      console.log(data[0]);
      res.json(data[0]);
    });
});

router.get('/posted', (req, res) => {
  const { userId } = req.session;
  // change query to use req.session.userID when not testing on postman
  const q = `SELECT * from jobs WHERE poster = ${userId}`
  db.sequelize.query(q)
    .then((data) => {
      console.log(data[0]);
      res.json(data[0]);
  });
});





module.exports = router;