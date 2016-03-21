"use strict";

angular.module("ngPermission", [])
.run(["$rootScope", function($rootScope) {
	$rootScope.$on("$stateChangeStart", 
	function(evt, toState, toParams, fromState, fromParams, Options){
		console.info(evt);
		console.info(toState);
		console.info(toParams);
		console.info(fromState);
		console.info(fromParams);
		console.info(Options);
	});
}]);
