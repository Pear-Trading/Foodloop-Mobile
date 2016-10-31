"use strict";
var app = angular.module('FoodLoop', [
 // 'fSCordova',
  'ngRoute',
  'mobile-angular-ui',
  'FoodLoop.controllers.Main',
]);

// Links to the pages

app.config(function($routeProvider) {
  $routeProvider.when('/', {redirectTo: '/token', reloadOnSearch: false});
  $routeProvider.when('/receipt', {templateUrl:'Submit_Receipt.html',  reloadOnSearch: false});
  $routeProvider.when('/account', {templateUrl:'User_Details_Display.html',  reloadOnSearch: false});
  $routeProvider.when('/about', {templateUrl:'About_Description.html',  reloadOnSearch: false});
  $routeProvider.when('/contact', {templateUrl:'Contact_Page.html',  reloadOnSearch: false});
  $routeProvider.when('/accountedit', {templateUrl:'User_Details_Edit.html',  reloadOnSearch: false});
  $routeProvider.when('/accountregistration', {templateUrl:'User_Details_Registration.html',  reloadOnSearch: false});
  $routeProvider.when('/token', {templateUrl:'Initial_Invite_Token.html',  reloadOnSearch: false});
});

app.controller('MainController', function($rootScope, $scope, $http, $window, $location){
  $scope.swiped = function(direction) {
    alert('Swiped ' + direction);
  };

  // User agent displayed in home page
  $scope.userAgent = navigator.userAgent;
  
  // Have they logged in before or first time?
  $scope.loggedin = false;
  
  $rootScope.init = function() {
	    var nameofFile = "localaccount.json";
		var store = cordova.file.dataDirectory;
			window.resolveLocalFileSystemURL(store + nameofFile, function (existingusermove) {
				$location.path('/receipt');
				console.log('This user should have already registered!');
			}, function (newusermove) {
				$location.path('/token');
				console.log('This user should be here for first time!');
			});
  }
  
  // Needed for the loading screen
	$rootScope.$on('$routeChangeStart', function(){
		/* var nameofFile = "localaccount.json";
		var store = cordova.file.dataDirectory;
			window.resolveLocalFileSystemURL(store + nameofFile, function (existingusermove) {
				$location.path('/receipt');
				console.log('This user should have already registered!');
			}, function (newusermove) {
				$location.path('/token');
				console.log('This user should be here for first time!');
			}); */
			
			/* readFromFile('localacccount.json', function (data) {
				console.log(data);
					if (data.keyused == true) {
						$location.path('/receipt');
						console.log('This user should have already registered!');
					} else {
						$location.path('/token');
						console.log('This user should be here for first time!');
					}
			}); */
		$rootScope.loading = true;
	});

  // Do they need to register?
 /*  $scope.$watch(function() { return $location.path(); }, function(newValue, oldValue){  
    if ($scope.loggedIn == false && newValue != '/login'){  
            $location.path('/login');  
    }  
  }); */

  $scope.testread = function() {
		readFromFile('localacccount.json', function (data) {
			console.log(data);
					$http.post(foodloop_fetch_url, {"username": data.username}).then(
						function(response) {
							console.log('STATUS : ' + response.status);
							console.log(response);
							console.log('request OK');
						if (response.data.success) {
							$scope.username = response.data.username;
						} else {
							$window.alert('The user data could not be loaded on the server!');
						}
					},
						function() {
							console.log('request is NOT OK');
						}
					);
				}
		});
	};
  
  $rootScope.$on('$routeChangeSuccess', function(){
    $rootScope.loading = false;
  });

  // 
  // 'Scroll' screen
  // 
  var scrollItems = [];

  for (var i=1; i<=100; i++) {
    scrollItems.push('Item ' + i);
  }

  $scope.scrollItems = scrollItems;

  // $scope.login = function(data) {
    // alert('You submitted the login form! Check your user information on "User Account".');
	// $scope.data=data;
  // };
  
  // Used when submitting a token
  
  $scope.tokenlogin = function(token) {
		$http.post(foodloop_token_url, {"token": token.value}).then(
			function(response) {
				console.log('STATUS : ' + response.status);
				console.log(response);
				console.log('request OK');
				if (response.data.success) {
					$scope.username = response.data.username;
					$location.path('/accountregistration');
				} else {
					$window.alert('That key is invalid or has been used!');
				}
			},
			function() {
				console.log('request is NOT OK');
			}
		);
	// Creates local file storage

   },
   
$scope.errorHandler = function (accountfile, e) {  
    var msg = '';

    switch (e.code) {
        case FileError.QUOTA_EXCEEDED_ERR:
            msg = 'Storage quota exceeded';
            break;
        case FileError.NOT_FOUND_ERR:
            msg = 'File not found';
            break;
        case FileError.SECURITY_ERR:
            msg = 'Security error';
            break;
        case FileError.INVALID_MODIFICATION_ERR:
            msg = 'Invalid modification';
            break;
        case FileError.INVALID_STATE_ERR:
            msg = 'Invalid state';
            break;
        default:
            msg = 'Unknown error';
            break;
    };

    console.log('Error (' + accountfile + '): ' + msg);
};
/*    // Create storage write method
  $scope.writetofile = function(accountfile, data) {
	  data = JSON.stringify(data, null, '\t');
        window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function (directoryEntry) {
            directoryEntry.getFile(accountfile, { create: true }, function (fileEntry) {
                fileEntry.createWriter(function (fileWriter) {
                    fileWriter.onwriteend = function (e) {
                        // for real-world usage, you might consider passing a success callback
                        console.log('Write of file "' + accountfile + '" completed.');
                    };

                    fileWriter.onerror = function (e) {
                        // you could hook this up with our global error handler, or pass in an error callback
                        console.log('Write failed: ' + e.toString());
                    };

                    var blob = new Blob([data], { type: 'text/plain' });
                    fileWriter.write(blob);
                }, errorHandler.bind(null, accountfile));
            }, errorHandler.bind(null, accountfile));
        }, errorHandler.bind(null, accountfile));
    };
 */
	// Create storage read method
  /* $scope.readFromFile = function(accountfile, cb) {
	var pathToFile = cordova.file.dataDirectory + accountfile;
	window.resolveLocalFileSystemURL(pathToFile, function (fileEntry) {
		fileEntry.file(function (file) {
			var reader = new FileReader();

			reader.onloadend = function (e) {
				cb(JSON.parse(this.result));
			};

			reader.readAsText(file);
		}, errorHandler.bind(null, accountfile));
	}, errorHandler.bind(null, accountfile));
}; */
// Used to check on app open to see if they have logged in before
//  $scope.checkifreturning = function (readfromfile) {
//	  readfromfile('localaccount.json', function ("keyused") {
//		   checkifreturning = "keyused";
//	  }
// };
	
// Called when the user submits their registration details	
  $scope.registrationsubmit = function(data) {
	  writeToFile('localaccount.json', {"fullname": data.fullname, "username": data.username, "email": data.email, "postcode": data.postcode, "age": data.age, "gender": data.gender, "grouping": data.grouping, "keyused": "true"});
	  $http.post(foodloop_register_url, {"fullname": data.fullname, "username": data.username, "email": data.email, "postcode": data.postcode, "age": data.age, "gender": data.gender, "grouping": data.grouping, "password": data.password}).then(
        function(response) {
            console.log('STATUS : ' + response.status);
			console.log(response);
            console.log('request OK');
			if (response.data.success) {
				$window.alert('Thank you for submitting your user info!');
				$location.path('/account');
			} else {
					$window.alert('The submission has failed! Are your connected to the internet?');
			}
        },
        function() {
            console.log('request is NOT OK');
		}
		);
  };

// Called when the user edits their user details	
  $scope.editsubmit = function(data) {
	  writeToFile('localaccount.json', {"fullname": data.fullname, "username": data.username, "email": data.email, "postcode": data.postcode, "age": data.age, "gender": data.gender, "grouping": data.grouping, "keyused": "true"});
	  $http.post(foodloop_edit_url, {"fullname": data.fullname, "username": data.username, "postcode": data.postcode, "age": data.age, "gender": data.gender}).then(
        function(response) {
            console.log('STATUS : ' + response.status);
			console.log(response);
            console.log('request OK');
			if (response.data.success) {
				$window.alert('User details have been edited!');
				$location.path('/account');
			} else {
					$window.alert('The editing has failed! Are you connected to the internet?');
			}
        },
        function() {
            console.log('request is NOT OK');
		}
		);
    };

//    $scope.writetofile('account.json', { foo: 'bar' });

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
    };

    // Called if something bad happens.
    //
    function onFail(message) {
      console.log('Failed because: ' + message);
    };

    function win(r) {
        console.log("Code = " + r.responseCode);
        console.log("Response = " + r.response);
        //alert("Response =" + r.response);
        console.log("Sent = " + r.bytesSent);
		if (r.data.success) {
				$window.alert('Thank you for submitting your data!');
			} else {
					$window.alert('The upload has failed! Did you send a jpeg format picture?');
			}
    };

    function fail(error) {
        alert("An error has occurred: Code = " + error.code);
        console.log("upload error source " + error.source);
        console.log("upload error target " + error.target);
		$window.alert('The upload has failed! Are you connected to the internet?');
    };
  
  // END OF IMAGE UPLOADING CODE
  
  //For drop down menu's in the forms
});

 app.controller('ExampleController', function($scope) {
   $scope.data = {
	fullname: null,
    age: null,
	email: null,
    postcode: null,
	gender: null,
	grouping: null,
	password: null,
    multipleSelect: [],
    option1: 'option-1',
   };

   $scope.forceUnknownOption = function() {
     $scope.data.singleSelect = 'nonsense';
   };
  
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

 function errorHandler(accountfile, e) {  
    var msg = '';

    switch (e.code) {
        case FileError.QUOTA_EXCEEDED_ERR:
            msg = 'Storage quota exceeded';
            break;
        case FileError.NOT_FOUND_ERR:
            msg = 'File not found';
            break;
        case FileError.SECURITY_ERR:
            msg = 'Security error';
            break;
        case FileError.INVALID_MODIFICATION_ERR:
            msg = 'Invalid modification';
            break;
        case FileError.INVALID_STATE_ERR:
            msg = 'Invalid state';
            break;
        default:
            msg = 'Unknown error';
            break;
    };
 }
 
 
function writeToFile(accountfile, data) {
	data = JSON.stringify(data, null, '\t');
	window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function (directoryEntry) {
		directoryEntry.getFile(accountfile, { create: true }, function (fileEntry) {
			fileEntry.createWriter(function (fileWriter) {
				fileWriter.onwriteend = function (e) {
					// for real-world usage, you might consider passing a success callback
					console.log('Write of file "' + accountfile + '" completed.');
				};

				fileWriter.onerror = function (e) {
					// you could hook this up with our global error handler, or pass in an error callback
					console.log('Write failed: ' + e.toString());
				};

				var blob = new Blob([data], { type: 'text/plain' });
				fileWriter.write(blob);
			}, errorHandler.bind(null, accountfile));
		}, errorHandler.bind(null, accountfile));
	}, errorHandler.bind(null, accountfile));
};
	
function readFromFile(accountfile, cb) {
	var pathToFile = cordova.file.dataDirectory + accountfile;
	window.resolveLocalFileSystemURL(pathToFile, function (fileEntry) {
		fileEntry.file(function (file) {
			var reader = new FileReader();

			reader.onloadend = function (e) {
				cb(JSON.parse(this.result));
			};

			reader.readAsText(file);
		}, errorHandler.bind(null, accountfile));
	}, errorHandler.bind(null, accountfile));
};

/* document.addEventListener("deviceready", function() {
    angular.bootstrap(document.body, ["FoodLoop"]);
}, false); */