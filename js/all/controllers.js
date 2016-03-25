"use strict";

(function() {
	
	// -------------controller inherit:demo1 start------------------- 
	MetronicApp.controller('ctrl_grp1_greetCtrl', ['$scope', '$rootScope', function($scope,$rootScope){
		$scope.name = 'World';
		$scope.department = 'Angular';
	}]);
	
	MetronicApp.controller('ctrl_grp1_ListCtrl', ['$scope', function ($scope) {
		$scope.names = ['Igor', 'Misko', 'Vojta'];
	}]);
	// -------------controller inherit:demo1 end------------------- 
	
	// -------------controller event:demo2 start------------------- 
	MetronicApp.controller('ctrl_grp2_grandpaCtrl', ['$scope', function($scope){
		$scope.count = 0;
		$scope.$on('aEventName', function() {
			$scope.count++;
		});
	}])
	
	MetronicApp.controller('ctrl_grp2_dadCtrl', ['$scope', function($scope){
		$scope.count = 0;
		$scope.$on('aEventName', function() {
			$scope.count++;
		});
	}]);
	
	MetronicApp.controller('ctrl_grp2_sonCtrl', ['$scope', function($scope){
		$scope.count = 0;
		$scope.$on('aEventName', function() {
			$scope.count++;
		});
	}]);
	// -------------controller event:demo2 end------------------- 
})();
