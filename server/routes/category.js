const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
  const { category } = req.body;
  db.sequelize.query(`SELECT * FROM categories WHERE name = '${category}';`)
    .then((category) => {
      res.send(category[0]);
  })
})

module.exports = router;