const Sequelize = require('sequelize');
const db = new Sequelize({
  database: 'alfred',
  dialect: 'postgres',
  username: 'adminuser',
  password: 'adminuser1',
  host: 'thesis.cjcaqsxvwydd.us-east-2.rds.amazonaws.com',
  port: 5432
});
const auth = db.authenticate().then(() => {
  console.log("Connected to DB");
})
  .catch((err) => {
    console.log(err);
  })

  module.exports.db = db;
  module.exports.auth = auth;