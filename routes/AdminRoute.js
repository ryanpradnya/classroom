const express = require('express');
const cors = require('cors');
const { body, param } = require('express-validator/check');

const adminController = require('../controllers/AdminController');
const authMiddleware = require('../middleware/AuthMiddleware');

const router = express.Router();

router.get('/userlist', cors(), authMiddleware.veryfiToken, adminController.getUsers);

router.post('/add-student', cors(), [
    body('username')
        .trim()
        .not().isEmpty().withMessage('username is required.'),
    body('password')
        .trim()
        .not().isEmpty().withMessage('username is required.'),
    authMiddleware.veryfiToken,
    authMiddleware.veryfiAdmin
],
    adminController.addStudent);

router.put('/edit-classroom/:classroomId', cors(), [
    param('todoId')
        .exists()
        .withMessage('todoId is required.'),
    body('title')
        .trim()
        .not().isEmpty().withMessage('Title is required.'),
    authMiddleware.veryfiToken
],
    adminController.updateClassroom);

router.delete('/remove-classroom/:classroomId', cors(), [
    authMiddleware.veryfiToken],
    adminController.removeClassroom);

module.exports = router;