const jwt = require('jsonwebtoken');

const db = require('../util/Database');
const config = require('../util/Config');

const User = db.user;
const Classroom = db.classroom;

exports.checkExistingEmail = async (req, res, next) => {
    const email = req.body.email;
    try {
        const user = await User.findOne({ where: { email: email } })
        if (user) {
            const error = new Error('Email is already in use!');
            error.statusCode = 400;
            throw error;
        } else {
            next();
        }
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }

};

exports.veryfiToken = (req, res, next) => {
    let authHeader = req.get('Authorization');

    let decodedToken;

    if (!authHeader) {
        const error = new Error('No token provided');
        error.statusCode = 403;
        throw error;
    }
    const token = authHeader.split(' ')[1];
    try {
        decodedToken = jwt.verify(token, config.jwtSecret);
    } catch (err) {
        err.statusCode = 500;
        throw err;
    }
    if (!decodedToken) {
        const error = new Error('Not authenticated.');
        error.statusCode = 401;
        throw error;
    }
    req.userId = decodedToken.id;
    next();
}

exports.checkExistingTodo = async (req, res, next) => {
    const todoId = req.params['todoId'];
    try {
        const todo = await TodoList.findOne({ where: { id: todoId } })
        if (!todo) {
            const error = new Error('Todo not found!');
            error.statusCode = 404;
            throw error;
        } else {
            console.log('checked', todo.checked);
            req.checked = todo.checked;
            next();
        }
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }

};