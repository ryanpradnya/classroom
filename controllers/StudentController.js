const { validationResult } = require('express-validator');

const db = require('../util/Database');

const Classroom = db.classroom;
const User = db.user;

exports.enroollclass = (req, res, next) => { };