var project = angular.module('myTestApp', ['ngMaterial']);

project.controller('testController', function($rootScope, $scope, $http, $window, $mdDialog) {
    
    // EXAMPLE CODE
    
    $scope.testCases = [];
    
    var testCase1 = {
        name: "Simple Square",
        user: "vontell",
        votes: 1,
        starred: false,
        passed: true,
        content: "# This will test the square operation on 1\r\nresult = square(1)\r\nassertEquals(result, 1)"
    }
    var testCase2 = {
        name: "The list of not none",
        user: "cooperp",
        votes: 5,
        starred: true,
        passed: false,
        content: "# This will test a list with some elements\r\nresult = isEmpty([2,1,4])\r\nassertEquals(result, false)"
    }
    
    $scope.setFiles = function(element) {
    $scope.$apply(function(scope) {
      console.log('files:', element.files);
      // Turn the FileList object into an Array
        scope.files = []
        for (var i = 0; i < element.files.length; i++) {
          scope.files.push(element.files[i])
          $("#uploadButton").hide();
        }
      scope.progressVisible = false
      });
    };
    
    $scope.uploadFile = function() {
        
        $("#fileToUpload").trigger('click');
        
    }
    
    $scope.testCases = $scope.testCases.concat(testCase1);
    $scope.testCases = $scope.testCases.concat(testCase2);
    
    // END EXAMPLE CODE
    $scope.code = undefined;
    $scope.author = "Ben Bitdittle"
    
    $scope.submitCode = function() {
        
        var storageRef = firebase.storage().ref();
        var ref = storageRef.child('code/' + $scope.files[0].name);
        
        var file = $scope.files[0];
        ref.put(file).then(function(snapshot) {
            
            console.log('Uploaded a blob or file!');

            $http.get("/run").then(function(){
                $http.get("/file/code/" + $scope.files[0].name).then(function(res){
                $scope.code = res.data;
                reload_js('https://cdn.rawgit.com/google/code-prettify/master/loader/run_prettify.js?skin=desert');
            }, function(err) {
                $scope.code = err;
            });
            }, function() {
                $http.get("/file/code/python.py").then(function(res){
                $scope.code = res.data;
            }, function(err) {
                $scope.code = err;
            });
            });
            
            
            
        });
        
    };
    
    $scope.openTestDialog = function() {
        
        $mdDialog.show({
            controller: 'addTestController',
            templateUrl: 'testDialog.html',
            parent: angular.element(document.body),
            clickOutsideToClose: true,
            fullscreen: false //useFullScreen
        });
        
    };
    
     $scope.openSpecDialog = function() {
        
        $mdDialog.show({
            controller: 'addTestController',
            templateUrl: 'specDialog.html',
            parent: angular.element(document.body),
            clickOutsideToClose: true,
            fullscreen: false //useFullScreen
        });
        
    };
    
    /*
        Takes a test case with the following properties
            name
            user
            votes
            starred
            content
    */
    $rootScope.addTestCase = function(testCase) {
        
        $scope.testCases.push(testCase);
        
    };
    
    $scope.toggleStar = function(index) {
        
        $scope.testCases[index].starred = !$scope.testCases[index].starred;
        
    };
    
    $scope.incrementVote = function(index) {
        
        $scope.testCases[index].votes = $scope.testCases[index].votes + 1;
        
    };
    
    $scope.decrementVote = function(index) {
        
        $scope.testCases[index].votes = $scope.testCases[index].votes - 1;
        
    };
    
});

project.controller('addTestController', function($rootScope, $scope, $http, $window, $mdDialog) {
    
    var success;
    var name;
    
     $scope.setFiles2 = function(element) {
        $scope.$apply(function(scope) {
          console.log('files:', element.files);
          // Turn the FileList object into an Array
            scope.files = []
            for (var i = 0; i < element.files.length; i++) {
              scope.files.push(element.files[i])
              $("#uploadButton2").hide();
            }
          scope.progressVisible = false
          });
        };

        $scope.uploadFile2 = function() {

            $("#fileToUpload2").trigger('click');

        }
        
        $scope.submitCode2 = function() {

            var storageRef = firebase.storage().ref();
            var ref = storageRef.child('tests/' + $scope.files[0].name);

            var file = $scope.files[0];
            ref.put(file).then(function(snapshot) {

                console.log('Uploaded a blob or file!');
                
                $scope.testing = true;

                $http.get("/run").then(function(res) {
                    console.log(res);
                    
                    // Find the number of failures
                    var errorIndex = res.data.lastIndexOf("errors=");
                    console.log(res.data.charAt(errorIndex+7));
                    
                    success = res.data.charAt(errorIndex+7) == "0"
                    
                    if(success) {
                        $scope.success = true;
                        $scope.failure = false;
                        $scope.testing = false;
                    } else {
                        $scope.success = false;
                        $scope.failure = true;
                        $scope.testing = false;
                    }
                    
                }, function(err) {
                    console.log(err);
                })

            });

        };
    
    $scope.close = function() {
        
        $mdDialog.cancel();
        
    };
    
    $scope.submit = function() {
        
        var newTest = {
            name: "" + $scope.projectname,
            user: "The Correct Horse",
            votes: 0,
            starred: false,
            success: $scope.success ? true : false,
            content: "# Coming soon..."
        };
        
        $rootScope.addTestCase(newTest);
        reload_js('https://cdn.rawgit.com/google/code-prettify/master/loader/run_prettify.js?skin=desert');
        $mdDialog.cancel();
        
    };
    
});


function reload_js(src) {
    $('script[src="' + src + '"]').remove();
    $('<script>').attr('src', src).appendTo('head');
}