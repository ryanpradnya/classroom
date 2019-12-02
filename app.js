//Packages
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');

const db = require('./util/Database');

//Routes
const authRoute = require('./routes/AuthRoute');
const studentRoute = require('./routes/StudentRoute');
const adminRoute = require('./routes/AdminRoute');

const initialize = require('./controllers/InitializeController');
const app = express();

app.use(bodyParser.json())
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Methods',
        'OPTIONS, GET, POST, PUT, PATCH, DELETE'
    );
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use('/api/auth', authRoute);
app.use('/api/student', studentRoute);
app.use('/api/admin', adminRoute);

//Error Handling
app.use((error, req, res, next) => {
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({ message: message, data: data });
});

db.sequelize
    .sync()
    .then(result => {
        console.log("CONNECTED");
        app.listen(8080, initialize.initializeAdmin);
    })
    .catch(err => {
        console.log(err)
    });
