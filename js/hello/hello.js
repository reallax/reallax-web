"use strict";

(function() {
	
	MetronicApp.controller("helloCtrl2", ["$scope", "$interval", function($scope, $interval) {
		$scope.arr = [];
		
		var cnt = 1;
		var timmer;
		$scope.start =  function() {
			timmer = $interval(function() {
				if(cnt%10 == 0) {
					$scope.arr = [];
				}
				$scope.arr.push( {index:cnt++, dates:new Date} ); 
			}, 1000);
		}
		$scope.stop = function() {
			$interval.cancel(timmer);
		}
		
		$scope.showIndex = function(index) {
			alert("line number:" + index);
		}
		
	}]);
	
})();
