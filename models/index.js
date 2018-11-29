const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(module.filename);
const db = {};
const {
  DB_HOST,
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
} = process.env;
const db_url = `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}`
const sequelize = new Sequelize(db_url);

fs
  .readdirSync(__dirname)
  .filter(file =>
    (file.indexOf('.') !== 0) &&
    (file !== basename) &&
    (file.slice(-3) === '.js'))
  .forEach(file => {
    const model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;