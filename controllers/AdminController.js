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

exports.updateClassroom = async (req, res, next) => {
    const errors = validationResult(req);

    const classroomId = req.params['classroomId'];
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
            where: { id: classroomId }
        });
        const updatedClassroom = await Classroom.findOne({ where: { id: classroomId } });

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

    const classroomId = req.params['classroomId'];
    try {
        if (!errors.isEmpty()) {
            const error = new Error('Validation failed.');
            error.statusCode = 422;
            error.data = errors.array();
            throw error;
        }
        const deletedClassroom = await Classroom.findOne({ where: { id: classroomId } });

        await Classroom.destroy({
            where: { id: classroomId }
        });

        res.status(201).json({ message: 'Classroom deleted successfully', deletedClassroom: deletedClassroom });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};
