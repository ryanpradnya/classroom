const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

const db = require('../util/Database');

const Classroom = db.classroom;
const User = db.user;

exports.getUsers = async (req, res, next) => {
    const errors = validationResult(req);

    try {
        if (!errors.isEmpty()) {
            const error = new Error('Validation failed.');
            error.statusCode = 422;
            throw error;
        }

        const result = await User.findAll()

        if (!result) {
            const error = new Error('User list not found!');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({
            message: 'Fetched users successfully.',
            User: result
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }

};

exports.addStudent = async (req, res, next) => {
    const errors = validationResult(req);

    const name = req.body.name;
    const username = req.body.username;
    const password = req.body.password;
    try {
        if (!errors.isEmpty()) {
            const error = new Error('Validation failed.');
            error.statusCode = 422;
            error.data = errors.array();
            throw error;
        }
        const hashedPw = await bcrypt.hashSync(password, 12);
        const result = await User.create({
            name: name,
            username: username,
            password: hashedPw,
            isAdmin: false
        });

        const user = await User.findOne({ where: { id: result.id } });

        res.status(201).json({ message: 'User created!', user: user });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.addClassroom = async (req, res, next) => {
    const errors = validationResult(req);

    const name = req.body.name;
    try {
        if (!errors.isEmpty()) {
            const error = new Error('Validation failed.');
            error.statusCode = 422;
            error.data = errors.array();
            throw error;
        }
        const result = await Classroom.create({
            name: name,
        });

        const classroom = await Classroom.findOne({ where: { id: result.id } });

        res.status(201).json({ message: 'Classroom created!', classroom: classroom });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.updateClassroom = async (req, res, next) => {
    const errors = validationResult(req);

    const name = req.body.name;
    try {
        if (!errors.isEmpty()) {
            const error = new Error('Validation failed.');
            error.statusCode = 422;
            error.data = errors.array();
            throw error;
        }

        await Classroom.update({
            name: name
        }, {
            where: { id: req.classroom.id }
        });
        const updatedClassroom = await Classroom.findByPk(req.classroom.id);

        res.status(201).json({ message: 'Classroom updated!', classroom: updatedClassroom });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.removeClassroom = async (req, res, next) => {
    const errors = validationResult(req);

    try {
        if (!errors.isEmpty()) {
            const error = new Error('Validation failed.');
            error.statusCode = 422;
            error.data = errors.array();
            throw error;
        }

        await Classroom.destroy({
            where: { id: req.classroom.id }
        });

        res.status(201).json({ message: 'Classroom deleted successfully', deletedClassroom: req.classroom });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.removeUser = async (req, res, next) => {
    const errors = validationResult(req);

    try {
        if (!errors.isEmpty()) {
            const error = new Error('Validation failed.');
            error.statusCode = 422;
            error.data = errors.array();
            throw error;
        }

        await User.destroy({
            where: { id: req.user.id }
        });

        res.status(201).json({ message: 'User deleted successfully', deletedUser: req.user });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};
