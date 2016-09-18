/**
 * Module dependencies.
 */
var gcloud = require('gcloud');
const exec = require('child_process').exec,
    child;
const request = require('request');
const inspect = require('util').inspect;
const express = require('express');
var router = express.Router();
var unirest = require('unirest');
const os = require('os');
const fs = require('fs');
const http = require('http');
const util = require('util');
const path = require('path');
const passport = require('passport');
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
var gcs = gcloud.storage({
    projectId: 'errorcode-c57a3',
    keyFilename: 'key.json'
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


/*
 * 1. Get code from Firebase.
 * 2. Get test cases from Firebase.
 * 3. Execute the Python test script with the code and the test cases. Return
 * the result.
 */
var testRun = function() {
    var bucket = gcs.bucket('errorcode-c57a3.appspot.com');
    bucket.getFiles({
        prefix: "code/"
    }, function(err, files) {
        //console.log(err, files)
        //console.log(err, files)
        files.forEach(function(file) {
            //console.log(file.name),
            file.download({
                destination: 'python/code/python.py'
            }, function(err) {});
        });
    });
    bucket.getFiles({
        prefix: 'tests/'
    }, function(err, files) {
        //console.log(err, files)
        files.forEach(function(file) {
            //console.log(file);
            // return;
            file.download({
                destination: 'python/test/test.py'
            }, function(err) {
                console.log(err);
            });
        });
    });
    return (actuallyRunTheTests());
};
var actuallyRunTheTests = function() {
    /*
     * Child accesses the command line. Execute a python script
     * located in the subfolder "python" and pass it the file of the code,
     * and the test cases.
     */
    var codeNames = fs.readdirSync("python/code");
    var testNames = fs.readdirSync("python/test");
    for (i = 0; i < codeNames.length; i++) {
        for (j = 0; j < testNames.length; j++) {
            console.log(testNames[j]);
            child = exec('python python/testGenerator.py ' + 'python/code/' + codeNames[i] + ' ' + 'python/test/' + testNames[j], function(error, stdout, stderr) {
                console.log('stdout: ' + stdout);
                console.log('stderr: ' + stderr);
                if (error !== null) {
                    console.log('exec error: ' + error);
                }
            });
        };
    };
    child = exec('python python/generated.py', function(error, stdout, stderr) {
        console.log('stdout: ' + stdout);
        console.log('stderr: ' + stderr);
        if (error !== null) {
            console.log('exec error: ' + error);
        }
    });
    return ('python/testresults.log');
};

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