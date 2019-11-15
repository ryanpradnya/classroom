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

db.classroom.belongsTo(db.user, { constraints: true, onDelete: 'CASCADE' });
db.user.hasMany(db.classroom);

module.exports = db;


