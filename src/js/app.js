"use strict";
var app = angular.module('FoodLoop', [
  'ngRoute',
  'mobile-angular-ui',
  'cordovaHTTP',
  'FoodLoop.controllers.Main'
])

// Links to the pages

.config(function($routeProvider) {
  $routeProvider.when('/', {redirectTo:'/receipt',  reloadOnSearch: false});
  $routeProvider.when('/receipt', {templateUrl:'Submit_Receipt.html',  reloadOnSearch: false});
  $routeProvider.when('/account', {templateUrl:'User_Details_Display.html',  reloadOnSearch: false});
  $routeProvider.when('/about', {templateUrl:'About_Description.html',  reloadOnSearch: false});
  $routeProvider.when('/contact', {templateUrl:'Contact_Page.html',  reloadOnSearch: false});
  $routeProvider.when('/accountedit', {templateUrl:'User_Details_Registration_Or_Edit.html',  reloadOnSearch: false});
  $routeProvider.when('/token', {templateUrl:'Initial_Invite_Token.html',  reloadOnSearch: false});
  
});



app.controller('MainController', function($rootScope, $scope){
  $scope.swiped = function(direction) {
    alert('Swiped ' + direction);
  };

  // User agent displayed in home page
  $scope.userAgent = navigator.userAgent;
  
   // Have they logged in before or first time?
	$scope.loggedin = false;
  
  // Needed for the loading screen
  $rootScope.$on('$routeChangeStart', function(){
    $rootScope.loading = true;
  });

  $rootScope.$on('$routeChangeSuccess', function(){
    $rootScope.loading = false;
  });

  // Fake text i used here and there.
  $scope.lorem = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Vel explicabo, aliquid eaque soluta nihil eligendi adipisci error, illum corrupti nam fuga omnis quod quaerat mollitia expedita impedit dolores ipsam. Obcaecati.';

  // 
  // 'Scroll' screen
  // 
  var scrollItems = [];

  for (var i=1; i<=100; i++) {
    scrollItems.push('Item ' + i);
  }

  $scope.scrollItems = scrollItems;

  //
  // 'Forms' screen
  //  
  $scope.rememberMe = true;
  $scope.email = 'me@example.com';
  
  $scope.login = function(data) {
    alert('You submitted the login form! Check your user information on "User Account".');
	$scope.data=data;
  };
  
  // Used when submitting a token
  
  $scope.tokenlogin = function(token) {
	if(token.value=='apple99'){
		alert('You\'ve logged in!');
	}
	else{
		alert('You dun goofed!');
	}
  };

  // 
  // 'Drag' screen
  // 
  $scope.notices = [];
  

	// IMAGE UPLOADING CODE
  
     
	
	// The script for picture uploading

    var pictureSource;   // picture source
    var destinationType; // sets the format of returned value
	var currencypattern; // used for currency in the form
    // Wait for device API libraries to load
    //
    document.addEventListener("deviceready",onDeviceReady,false);

    // device APIs are available
    //
    function onDeviceReady() {
        pictureSource = navigator.camera.PictureSourceType;
        destinationType = navigator.camera.DestinationType;
		currencypattern = navigator.globalization.getCurrencyPattern;
    }

	 // Called when a photo is successfully retrieved
    //
    function onPhotoURISuccess(imageURI) {

        // Show the selected image
        var smallImage = document.getElementById('smallImage');
        smallImage.style.display = 'block';
        smallImage.src = imageURI;
    }
	
	// A button will call this function
    //
    $scope.getPhoto =function(source) {
      // Retrieve image file location from specified source
      navigator.camera.getPicture(onPhotoURISuccess, onFail, { quality: 50,
        destinationType: destinationType.FILE_URI,
        sourceType: source });
    }
	
    $scope.uploadPhoto = function(receipt) {

        //selected photo URI is in the src attribute (we set this on getPhoto)
        var imageURI = document.getElementById('smallImage').getAttribute("src");
        if (!imageURI) {
            alert('Please select an image first.');
            return;
        }

        //set upload options
        var options = new FileUploadOptions();
        options.fileKey = "file";
        options.fileName = imageURI.substr(imageURI.lastIndexOf('/')+1);
        options.mimeType = "image/jpeg";
		options.chunkedMode = false;

        options.params = receipt;
		console.log (options.params);

        var ft = new FileTransfer();
        ft.upload(imageURI, encodeURI(foodloop_upload_url), win, fail, options);
    }

    // Called if something bad happens.
    //
    function onFail(message) {
      console.log('Failed because: ' + message);
    }

    function win(r) {
        console.log("Code = " + r.responseCode);
        console.log("Response = " + r.response);
        //alert("Response =" + r.response);
        console.log("Sent = " + r.bytesSent);
    }

    function fail(error) {
        alert("An error has occurred: Code = " + error.code);
        console.log("upload error source " + error.source);
        console.log("upload error target " + error.target);
    }
  
  // END OF IMAGE UPLOADING CODE
  
  //For drop down menu's in the forms
  
  angular.module('staticSelect', [])
 .controller('ExampleController', ['$scope', function($scope) {
   $scope.data = {
	name: null,
    age: null,
	gender: null,
	grouping: null,
	password: null,
    multipleSelect: [],
    option1: 'option-1',
   };

   $scope.forceUnknownOption = function() {
     $scope.data.singleSelect = 'nonsense';
   };
}]);
  
  for (var j = 0; j < 10; j++) {
    $scope.notices.push({icon: 'envelope', message: 'Notice ' + (j + 1) });
  }

  $scope.deleteNotice = function(notice) {
    var index = $scope.notices.indexOf(notice);
    if (index > -1) {
      $scope.notices.splice(index, 1);
    }
  };
});