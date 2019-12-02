const express = require('express');
const cors = require('cors');
const { body, param } = require('express-validator');

const adminController = require('../controllers/AdminController');
const authMiddleware = require('../middleware/AuthMiddleware');

const router = express.Router();

// router.get('/userlist', cors(), authMiddleware.veryfiToken, adminController.getUsers);

router.post('/add-student', cors(), [
    body('username')
        .trim()
        .not().isEmpty().withMessage('username is required.'),
    body('password')
        .trim()
        .not().isEmpty().withMessage('username is required.'),
    authMiddleware.veryfiToken,
    authMiddleware.veryfiAdmin,
    authMiddleware.checkUsedUsername
],
    adminController.addStudent);

router.post('/add-classroom', cors(), [
    body('name')
        .trim()
        .not().isEmpty().withMessage('username is required.'),
    authMiddleware.veryfiToken,
    authMiddleware.veryfiAdmin
],
    adminController.addClassroom);

router.put('/edit-classroom/:classroomId', cors(), [
    param('classroomId')
        .exists()
        .withMessage('classroomId is required.'),
    body('name')
        .trim()
        .not().isEmpty().withMessage('Name is required.'),
    authMiddleware.veryfiToken,
    authMiddleware.veryfiAdmin,
    authMiddleware.checkExistingClassroom
],
    adminController.updateClassroom);

router.delete('/remove-user/:userId', cors(), [
    authMiddleware.veryfiToken,
    authMiddleware.veryfiAdmin,
    authMiddleware.checkExistingUsername
],
    adminController.removeUser);

router.delete('/remove-classroom/:classroomId', cors(), [
    authMiddleware.veryfiToken,
    authMiddleware.veryfiAdmin,
    authMiddleware.checkExistingClassroom
],
    adminController.removeClassroom);

router.put('/edit-user/:userId', cors(), [
    param('userId')
        .exists()
        .withMessage('classroomId is required.'),
    authMiddleware.veryfiToken,
    authMiddleware.veryfiAdmin,
    authMiddleware.checkExistingUsername
],
    adminController.updateUser);

module.exports = router;