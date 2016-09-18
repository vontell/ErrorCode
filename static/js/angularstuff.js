var project = angular.module('myTestApp', ['ngMaterial']);

project.controller('testController', function($rootScope, $scope, $http, $window, $mdDialog) {
    
    // EXAMPLE CODE
    
    //var exampleString = undefined;
    var exampleString = "# Merge Sort Python Solution\r\n# By: Mark Miyashita\r\n\r\ndef merge_sort(lst):\r\n    \"\"\"Sorts the input list using the merge sort algorithm.\r\n\r\n    >>> lst = [4, 5, 1, 6, 3]\r\n    >>> merge_sort(lst)\r\n    [1, 3, 4, 5, 6]\r\n    \"\"\"\r\n    if len(lst) <= 1:\r\n        return lst\r\n    mid = len(lst) \/\/ 2\r\n    left = merge_sort(lst[:mid])\r\n    right = merge_sort(lst[mid:])\r\n    return merge(left, right)\r\n\r\ndef merge(left, right):\r\n    \"\"\"Takes two sorted lists and returns a single sorted list by comparing the\r\n    elements one at a time.\r\n\r\n    >>> left = [1, 5, 6]\r\n    >>> right = [2, 3, 4]\r\n    >>> merge(left, right)\r\n    [1, 2, 3, 4, 5, 6]\r\n    \"\"\"\r\n    if not left:\r\n        return right\r\n    if not right:\r\n        return left\r\n    if left[0] < right[0]:\r\n        return [left[0]] + merge(left[1:], right)\r\n    return [right[0]] + merge(left, right[1:])"
    
    $scope.testCases = [];
    
    var testCase1 = {
        name: "Zero-length List",
        user: "vontell",
        votes: 1,
        starred: false,
        content: "# This will test the operation on empty lists\r\nresult = merge_sort([])\r\nassertEquals(result, [])"
    }
    var testCase2 = {
        name: "Simple List",
        user: "cooperp",
        votes: 5,
        starred: true,
        content: "# This will test sorting some easy lists\r\nresult = merge_sort([2,1,4])\r\nassertEquals(result, [1,2,4])"
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
    $scope.code = exampleString;
    $scope.author = "Ben Bitdittle"
    $scope.title = "Merge Sort Implementation"
    
    $scope.submitCode = function() {
        
        var storageRef = firebase.storage().ref();
        var ref = storageRef.child('code/' + $scope.files[0].name);
        
        var file = $scope.files[0];
        ref.put(file).then(function(snapshot) {
            
            console.log('Uploaded a blob or file!');

            var r = new FileReader();
            r.onload = function(e) { 
                var contents = e.target.result;
                // Do something with contents
                $scope.setFiles(null);
                $scope.files = null;
            }
            
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
    
    /*
        Takes a test case with the following properties
            name
            user
            votes
            starred
            content
    */
    $rootScope.addTestCase = function(testCase) {
        
        testCases.append(testCase);
        
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

                            $http.get("/run").then(function(res) {
                                console.log(res);
                            }, function(err) {
                                console.log(err);
                            })

                        });

                    };
    
    $scope.close = function() {
        
        $mdDialog.cancel();
        
    };
    
    $scope.submit = function() {
        
        $mdDialog.cancel();
        
    };
    
});