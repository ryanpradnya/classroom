const jwt = require('jsonwebtoken');

const db = require('../util/Database');
const config = require('../util/Config');

const User = db.user;
const Classroom = db.classroom;

exports.checkUsedUsername = async (req, res, next) => {
    const username = req.body.username;
    try {
        const user = await User.findOne({ where: { username: username } })
        if (user) {
            const error = new Error('Username is already in use!');
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

exports.veryfiAdmin = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.userId);
        if (user.isAdmin == false) {
            const error = new Error('Not admin.');
            error.statusCode = 401;
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
}

exports.veryfiStudent = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.userId);
        if (user.isAdmin == true) {
            const error = new Error('Not student.');
            error.statusCode = 401;
            throw error;
        } else {
            req.user = user;
            next();
        }
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }


}

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

exports.checkExistingClassroom = async (req, res, next) => {
    const classroomId = req.params['classroomId'];
    try {
        const classroom = await Classroom.findByPk(classroomId);

        if (!classroom) {
            const error = new Error('Classroom not found!');
            error.statusCode = 404;
            throw error;
        } else {
            req.classroom = classroom;
            next();
        }
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }

};

exports.checkExistingUsername = async (req, res, next) => {
    const userId = req.params['userId'];
    try {
        const user = await User.findByPk(userId);

        if (!user) {
            const error = new Error('User not found!');
            error.statusCode = 404;
            throw error;
        } else {
            req.user = user;
            next();
        }
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }

};