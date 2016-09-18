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
const chalk = require('chalk');


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


app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
});


app.get('/run', function(req, res) {
    var JSONPath = testRun();
    var contents = fs.readFileSync(JSONPath);
    // var jsonContent = JSON.parse(contents);
    // res.send(JSON.strinify(jsonContent));
    res.setHeader('content-type', 'text/javascript');
    res.send(contents);
})


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
 * Start Express server.
 */
app.listen(app.get('port'), () => {
    console.log('%s Express server listening on port %d in %s mode.', chalk.green('✓'), app.get('port'), app.get('env'));
});
module.exports = app;