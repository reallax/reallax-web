"use strict";

angular.module("ngPermission", [])
.run(["$rootScope", "$location", "$window",  function($rootScope, $location, $window, $cookieStore) {
	$rootScope.$on("$stateChangeStart", 
	function(evt, toState, toParams, fromState, fromParams, Options){
		console.info(evt);
		console.info(toState);
		console.info(toParams);
		console.info(fromState);
		console.info(fromParams);
		console.info(Options);
		
		console.info($location.path());
//		console.info($cookieStore);
//		$window.open("www.baidu.com");
//		$window.location.href = "login/login.html";
	});
}]);
