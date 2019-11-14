//Packages
const express = require('express');
const bodyParser = require('body-parser');

const db = require('./util/Database');

//Routes
const authRoute = require('./routes/AuthRoute');
const userRoute = require('./routes/UserRoute');
const adminRoute = require('./routes/AdminRoute');

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
app.use('/api/user', userRoute);
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
        app.listen(8080);
    })
    .catch(err => {
        console.log(err)
    });
