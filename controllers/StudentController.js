const { validationResult } = require('express-validator');

const db = require('../util/Database');

const Classroom = db.classroom;
const User = db.user;

exports.enroollclass = async (req, res, next) => {
    const errors = validationResult(req);

    try {
        if (!errors.isEmpty()) {
            const error = new Error('Validation failed.');
            error.statusCode = 422;
            error.data = errors.array();
            throw error;
        }

        const classroomStudent = await User.findAndCountAll({ where: { classroomId: req.classroom.id } });
        console.log('classroomStudent: ', classroomStudent.count);

        if (classroomStudent.count > 20) {
            const error = new Error('Classroom maximum students exceeded!');
            error.statusCode = 406;
            throw error;
        }
        await User.update({
            classroomId: req.classroom.id
        }, {
            where: { id: req.user.id }
        });
        const updatedUser = await User.findByPk(req.user.id);

        res.status(201).json({ message: 'Classroom enrolll successfully', user: updatedUser.name, classroom: req.classroom.name });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};