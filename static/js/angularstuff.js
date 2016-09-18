var project = angular.module('myTestApp', []);

project.controller('testController', function($rootScope, $scope, $http, $window, fileUpload) {
    
    // EXAMPLE CODE
    
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
    
    $scope.testCases = $scope.testCases.concat(testCase1);
    $scope.testCases = $scope.testCases.concat(testCase2);
    
    // END EXAMPLE CODE
    $scope.code = exampleString;
    $scope.title = "Merge Sort Implementation"
    
    $scope.uploadCode = function() {
        
        var storageRef = firebase.storage().ref("code");
        var ref = storageRef.child('project.py');
        
        var file = $scope.myFile;
        ref.put(file).then(function(snapshot) {
            console.log('Uploaded a blob or file!');
        });
        
    };
    
});

project.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            
            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);

project.service('fileUpload', ['$http', function ($http) {
    this.uploadFileToUrl = function(file, uploadUrl){
        var fd = new FormData();
        fd.append('file', file);
        $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
        .success(function(){
        })
        .error(function(){
        });
    }
}]);