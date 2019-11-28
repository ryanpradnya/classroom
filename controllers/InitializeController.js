const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const db = require('../util/Database');

const User = db.user;

exports.initializeAdmin = async () => {
    try {
        const administrator = await User.findOne({ where: { username: 'administrator' } });
        if (!administrator) {
            const hashedPw = await bcrypt.hashSync('admin', 12);
            await User.create({
                name: 'administrator',
                username: 'administrator',
                password: hashedPw,
                isAdmin: true
            });
            console.log('Administrator created!');
        }

    } catch (err) {
        throw err;
    }
}