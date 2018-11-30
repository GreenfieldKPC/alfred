// const express = require('express');
// const router = express.Router();

// router.get('/', (req, res) => {
//   const { user } = req.session;

//   db.sequelize.query(` SELECT * FROM users WHERE username = '${user}';`)
//     .then((user) => {
//       const profile = user[0][0];
//       db.sequelize.query(` SELECT * FROM areas WHERE id = '${user[0][0].id_area}';`)
//         .then((area) => {
//           profile.area = area[0][0].city;
//           res.send(profile);
//           res.end();
//       })
//     })
// })

// module.exports = router;