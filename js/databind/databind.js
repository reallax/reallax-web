"use strict";

(function() {
	MetronicApp.controller("dataBindCtrl1", ["$scope", "$interval", "$log",
		function($scope, $interval, $log) {
			$scope.count = 0;

			var timer;
			$scope.start = function() {
					timer = setInterval(function() {
						$log.info($scope.count++); //变化不能更新到view
					}, 1000);
				}
				//注意：$interval是angular自己封装的服务，其每次执行会调用$degist()方法，所以不能用来测试数据双向绑定的效果
				//这也是为什么推荐在angularjs中，使用ng自己封装的服务
				//		$scope.start1 = function() {
				//			timer = $interval(function() {  
				//	          $scope.count1++;  
				//	          $log.info($scope.count1);  
				//	        }, 1000);
				//		}
			$scope.stop = function() {
				clearInterval(timer);
			}
		}
	]);

	MetronicApp.controller("dataBindCtrl2", ["$scope", function($scope) {
		$scope.count = 0;

		var timer;
		$scope.start = function() {
			timer = setInterval(function() {

				$scope.$apply(function() { //用$apply通知angular刷新view
					$scope.count++;
				});

				console.info($scope.count);
			}, 1000);
		}
		$scope.stop = function() {
			clearInterval(timer);
		}
	}]);

	MetronicApp.controller("dataBindCtrl3", ["$scope", function($scope) {
		$scope.count = 0;

		var timer;
		$scope.start = function() {
			timer = setInterval(function() {
				
				$scope.$apply(function() { //用$apply通知angular刷新view
					$scope.count++;
				});
				//注意与下面的方式的区别：
				//下面的方式不会触发$watch()，因为下面的方法不会触发$degiest(),那么$degist()就不会检查watcher list,即便$scope.count已经注册了watcher list
//				$scope.count++;

			}, 1000);
		}
		$scope.stop = function() {
			clearInterval(timer);
		}
		
		$scope.$watch("count", function(newVal, oldVal) {
			console.info("$watch方法调用输出count: from" + oldVal + " to " + newVal );
		});
	}]);
})();