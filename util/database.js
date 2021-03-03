const Sequelize = require('sequelize');

const sequelize = new Sequelize('academind__nodejs', 'root', 'Lakindu@123', {
  dialect: 'mysql',
  host: 'localhost'
});

module.exports = sequelize;
