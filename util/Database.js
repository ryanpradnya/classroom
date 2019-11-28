const Sequelize = require('sequelize');

const config = require('./Config');

const sequelize = new Sequelize(config.database, config.username, config.password, {
    dialect: config.dialect,
    host: config.host
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require('../models/User')(sequelize, Sequelize);
db.classroom = require('../models/Classroom')(sequelize, Sequelize);

db.user.belongsTo(db.classroom, { constraints: true, onDelete: 'CASCADE' });
db.classroom.hasMany(db.user);

module.exports = db;


