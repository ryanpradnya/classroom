const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const db = require('../util/Database');
const config = require('../util/Config');
const User = db.user;

exports.signup = async (req, res, next) => {
    const errors = validationResult(req);

    const email = req.body.email;
    const name = req.body.name;
    const password = req.body.password;
    try {
        if (!errors.isEmpty()) {
            const error = new Error('Signup failed.');
            error.statusCode = 422;
            error.data = errors.array();
            throw error;
        }

        const hashedPw = await bcrypt.hashSync(password, 12);
        const result = await User.create({
            name: name,
            email: email,
            password: hashedPw
        });
        res.status(201).json({ message: 'User created!', userId: result.id });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.signin = async (req, res, next) => {
    const errors = validationResult(req);

    const username = req.body.username;
    const password = req.body.password;
    try {
        if (!errors.isEmpty()) {
            const error = new Error('Signin failed.');
            error.statusCode = 422;
            error.data = errors.array();
            throw error;
        }

        const user = await User.findOne({
            where: {
                username: username
            }
        });

        if (!user) {
            const error = new Error('User Not Found.');
            error.statusCode = 404;
            throw error;
        }

        let passwordIsValid = await bcrypt.compareSync(password, user.password);
        if (!passwordIsValid) {
            const error = new Error('Invalid Password!');
            error.statusCode = 401;
            throw error;
        }

        let token = jwt.sign({ id: user.id, username: user.username }, config.jwtSecret, {
            expiresIn: 86400 // expires in 24 hours
        });

        res.status(200).send({ message: 'Signin success!', auth: true, accessToken: token });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }

};