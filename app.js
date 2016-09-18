/**
 * Module dependencies.
 */
var gcloud = require('gcloud');
const exec = require('child_process').exec,
    child;
const fileUpload = require('express-fileupload');
const request = require('request');
const inspect = require('util').inspect;
const express = require('express');
const os = require('os');
const fs = require('fs');
const http = require('http');
const util = require('util');
const compression = require('compression');
const session = require('express-session');
const bodyParser = require('body-parser');
const logger = require('morgan');
const chalk = require('chalk');
const errorHandler = require('errorhandler');
const lusca = require('lusca');
const dotenv = require('dotenv');
const flash = require('express-flash');
const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');
const expressValidator = require('express-validator');
const sass = require('node-sass-middleware');
const multer = require('multer');
const upload = multer({
    dest: path.join(__dirname, 'uploads')
});
/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
dotenv.load({
    path: '.env.example'
});
/**
 * Controllers (route handlers).
 */
const homeController = require('./controllers/home');
const userController = require('./controllers/user');
const apiController = require('./controllers/api');
const contactController = require('./controllers/contact');
/**
 * API keys and Passport configuration.
 */
const passportConfig = require('./config/passport');
/**
 * Create Express server.
 */
const app = express();
/**
 * Connect to MongoDB.
 */
mongoose.connect(process.env.MONGODB_URI || process.env.MONGOLAB_URI);
mongoose.connection.on('connected', () => {
    console.log('%s MongoDB connection established!', chalk.green('✓'));
});
mongoose.connection.on('error', () => {
    console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
    process.exit();
});
var gcloud = require('gcloud')({
    projectId: 'errorcode - c57a3',
    keyFilename: '/path/to/keyfile.json'
});
/**
 * Express configuration.
 */
app.set('port', process.env.PORT || 3000);
app.use(express.static('static'));
app.use(compression());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(expressValidator());
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
});
app.use(function(req, res, next) {
    // After successful login, redirect back to the intended page
    if (!req.user && req.path !== '/login' && req.path !== '/signup' && !req.path.match(/^\/auth/) && !req.path.match(/\./)) {
        req.session.returnTo = req.path;
    }
    next();
});
/**
 * Primary app routes.
 */
app.get('/', homeController.index);
app.get('/login', userController.getLogin);
app.post('/login', userController.postLogin);
app.get('/logout', userController.logout);
app.get('/forgot', userController.getForgot);
app.post('/forgot', userController.postForgot);
app.get('/reset/:token', userController.getReset);
app.post('/reset/:token', userController.postReset);
app.get('/signup', userController.getSignup);
app.post('/signup', userController.postSignup);
app.get('/contact', contactController.getContact);
app.post('/contact', contactController.postContact);
app.get('/account', passportConfig.isAuthenticated, userController.getAccount);
app.post('/account/profile', passportConfig.isAuthenticated, userController.postUpdateProfile);
app.post('/account/password', passportConfig.isAuthenticated, userController.postUpdatePassword);
app.post('/account/delete', passportConfig.isAuthenticated, userController.postDeleteAccount);
app.get('/account/unlink/:provider', passportConfig.isAuthenticated, userController.getOauthUnlink);
app.get('/run', function(req, res) {
    
    var config = {
        apiKey: "AIzaSyCBXy9kpuP2BZc7zIKaj53opFLtMpYG2tU",
        authDomain: "errorcode-c57a3.firebaseapp.com",
        databaseURL: "https://errorcode-c57a3.firebaseio.com",
        storageBucket: "errorcode-c57a3.appspot.com",
        messagingSenderId: "890888182551"
    };
    firebase.initializeApp(config);
    
    res.send(testRun());
});
/*
 * 1. Get code from Firebase.
 * 2. Get test cases from Firebase.
 * 3. Execute the Python test script with the code and the test cases. Return
 * the result.
 */
var testRun = function() {
    var code;
    var test;
    var bucket = gcs.bucket('errorcode-c57a3.appspot.com');
    bucket.getFiles(function(errs, files) {
        files.forEach(function(file) {
            file.download({
                destination: '/python/code/file.name'
            }, function(err) {});
        });
    });
    bucket.getFiles(function(errs, files) {
        files.forEach(function(file) {
            file.download({
                destination: '/python/test/file.name'
            }, function(err) {});
        });
    });
    /*
     * Child accesses the command line. Execute a python script
     * located in the subfolder "python" and pass it the file of the code,
     * and the test cases.
     */
    var codeNames = fs.readdirSync("/python/code");
    var testNames = fs.readdirSync("/python/test");
    for (i = 0; i < codeNames.length(); i++) {
        for (i = 0; i < testNames.length(); i++) {
            child = exec('python python/testGenerator.py {{codeNames[i], test}}', function(error, stdout, stderr) {
                console.log('stdout: ' + stdout);
                console.log('stderr: ' + stderr);
                if (error !== null) {
                    console.log('exec error: ' + error);
                }
            });
        };
    };
    child = exec('/python/generated.py', function(error, stdout, stderr) {
        console.log('stdout: ' + stdout);
        console.log('stderr: ' + stderr);
        if (error !== null) {
            console.log('exec error: ' + error);
        }
    });
    return (testresults.log);
};
/**
 * OAuth authentication routes. (Sign in)
 */
app.get('/auth/facebook', passport.authenticate('facebook', {
    scope: ['email', 'user_location']
}));
app.get('/auth/facebook/callback', passport.authenticate('facebook', {
    failureRedirect: '/login'
}), (req, res) => {
    res.redirect(req.session.returnTo || '/');
});
app.get('/auth/github', passport.authenticate('github'));
app.get('/auth/github/callback', passport.authenticate('github', {
    failureRedirect: '/login'
}), (req, res) => {
    res.redirect(req.session.returnTo || '/');
});
app.get('/auth/google', passport.authenticate('google', {
    scope: 'profile email'
}));
app.get('/auth/google/callback', passport.authenticate('google', {
    failureRedirect: '/login'
}), (req, res) => {
    res.redirect(req.session.returnTo || '/');
});
app.get('/auth/twitter', passport.authenticate('twitter'));
app.get('/auth/twitter/callback', passport.authenticate('twitter', {
    failureRedirect: '/login'
}), (req, res) => {
    res.redirect(req.session.returnTo || '/');
});
app.get('/auth/linkedin', passport.authenticate('linkedin', {
    state: 'SOME STATE'
}));
/**
 * Error Handler.
 */
app.use(errorHandler());
/**
 * Start Express server.
 */
app.listen(app.get('port'), () => {
    console.log('%s Express server listening on port %d in %s mode.', chalk.green('✓'), app.get('port'), app.get('env'));
});
module.exports = app;