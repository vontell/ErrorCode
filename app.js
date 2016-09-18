/**
 * Module dependencies.
 */
const exec = require('child_process').exec,
    child;
const fileUpload = require('express-fileupload');
const Busboy = require('busboy');
const inspect = require('util').inspect;
const express = require('express');
const multiparty = require('multiparty');
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
const MongoStore = require('connect-mongo')(session);
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
    secret: process.env.SESSION_SECRET,
    store: new MongoStore({
        url: process.env.MONGODB_URI || process.env.MONGOLAB_URI,
        autoReconnect: true
    })
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
/*
 * Mutlipart file upload using multiparty and http. Just hit the endpoint on
 * 8080 and you'll get back the form offering a file upload. Will render a
 * result when done.
 */
// http.createServer(function(req, res) {
//     if (req.method === 'POST') {
//         var busboy = new Busboy({
//             headers: req.headers
//         });
//         busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
//             var saveTo = path.join(os.tmpDir(), path.basename(fieldname));
//             file.pipe(fs.createWriteStream(saveTo));
//         });
//         busboy.on('finish', function() {
//             res.writeHead(200, {
//                 'Connection': 'close'
//             });
//             res.end("That's all folks!");
//         });
//         return req.pipe(busboy);
//     }
//     res.writeHead(404);
//     res.end();
// }).listen(8080, function() {
//     console.log('Listening for requests');
// });

app.use(fileUpload());

app.post('/uploadCode', function(req, res) {
    var codeUpload;
 
    if (!req.files) {
        res.send('No files were uploaded.');
        return;
    }
 
    codeUpload = req.files.codeUpload;
    codeUpload.mv('/uploads/code/codeUpload.py', function(err) {
        if (err) {
            res.status(500).send(err);
        }
        else {
            res.send('File uploaded!');
        }
    });
});

app.post('/uploadTest', function(req, res) {
    var testUpload;
 
    if (!req.files) {
        res.send('No files were uploaded.');
        return;
    }
 
    testUpload = req.files.testUpload;
    testUpload.mv('/uploads/tests/testUpload.py', function(err) {
        if (err) {
            res.status(500).send(err);
        }
        else {
            res.send('File uploaded!');
        }
    });
});

var onTestUpload = function() {
    /*
     * Child accesses the command line. Execute a python script
     * located in the subfolder "python" and pass it the file of the code,
     * and the test cases.
     */
    child = exec('python python/testGenerator.py {{recieved_file_one, recieved_file_two}}', function(error, stdout, stderr) {
        console.log('stdout: ' + stdout);
        console.log('stderr: ' + stderr);
        if (error !== null) {
            console.log('exec error: ' + error);
        }
    });
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