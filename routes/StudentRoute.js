const express = require('express');
const cors = require('cors');
const { body, param } = require('express-validator');

const studentController = require('../controllers/StudentController');
const authMiddleware = require('../middleware/AuthMiddleware');

const router = express.Router();

router.put('/enrollclass/:classroomId', cors(), [
    authMiddleware.veryfiToken,
    authMiddleware.veryfiStudent,
    authMiddleware.checkExistingClassroom
],
    studentController.enroollclass);

module.exports = router;