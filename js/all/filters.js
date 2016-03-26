"use strict";

;
(function() {

	MetronicApp.filter("myFilter", function($log) {
		/**
		 * 测试可见，第一个参数是管道左边的值
		 * v1~v4几个参数是管道右边的参数
		 * 参数之间在view中用冒号隔开，使用方式为：{{varible | filterName: param1: param2: param3 }}
		 * 自定义过滤器，记得return
		 */
		return function(variable, param1, param2, param3, param4) {
			$log.log('variable = ' + variable);
			$log.log('param1 = ' + param1);
			$log.log('param2 = ' + param2);
			$log.log('param3 = ' + param3);
			$log.log('param4 = ' + param4);

			return "这就是一个测试@.@：" + variable + " * " + param1 + " * " + param2 + " * " + param3 + " * " + param4;
		}
	});

	//注意注入时，filter的名字变成了：myFilterFilter，angular又在后面加了一个Filter
	MetronicApp.controller("filtersCtrl", ["$scope", "myFilterFilter", function($scope, myFilterFilter) {
		$scope.getNowDate = function() {
			$scope.nowDate = new Date();
		}

		$scope.testFilter = function() {
			$scope.ctrlFilterModel = myFilterFilter($scope.filterModel2, '哇哈哈', '吕峰', '填写', '放');
		}
	}]);
})();
