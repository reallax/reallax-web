"use strict";

+(function() {
	/**
	 * .service()构建服务，所有绑定在this上的属性和方法，都能在注入后被直接访问。但私有变量就不行，如：privateVal，只能通过setter/getter访问
	 * 匿名函数不需要return，service()已经为我们完成了实例化
	 * .service()的本意就是隐藏new的含义
	 */
	MetronicApp.service("s_service", function($q, $http) {
		var privateVal = "s_service";
		
		this.publicVal = "www.baidu.com";
		
		this.setPrivateVal = function(val) {
			privateVal = val;
		}
		this.getPrivateVal = function() {
			return privateVal;
		}
		
		this.testUrl = function(urlName) {
			var defered = $q.defer();
			$http({
				method:"GET",
				url: !!urlName && urlName !== ""? urlName:this.publicVal
			}).success(function(data) {
				defered.resolve(data);
			}).error(function(data) {
				defered.reject(data);
			});
			return defered.promise;
		}
	});
	
	/**
	 * .factory()构建的服务，需要用return显示的指明返回对象。
	 * 返回对象上的一切属性都能在注入后被访问
	 * 复用了s_service的功能，把s_service中的代码拷贝一份到f_service中，效果一样
	 * f_service返回的是s_service，但设置了s_service的私有变量privateVal，此时s_service的变量也会变化。因为service是单例的
	 */
	MetronicApp.factory("f_service", function(s_service) {
		s_service.setPrivateVal("f_service");
		return s_service;
	});
	
	/**
	 * .provider()构造的service，是唯一可用.config()改变配置的服务。如果我们想在服务被使用前改变一些配置，.provider()就是我们的选择
	 * this.configVal就是一个可以在.config()中改变的配置
	 * this.$get()中定义的属性和方法是私有方法，如:privateVal,demoFunc()
	 * this.$get().returnObj中的属性和方法，才是注入后能被访问的属性和方法
	 */
	MetronicApp.provider("p_service", function() {	//注意这里不注入服务
			
		this.configVal = "";
		
		this.$get = function($q, $http) {			//这里才注入服务
			var privateVal = "p_service";
			
			return {
				publicVal: "www.baidu.com",
				setPrivateVal: setPrivateVal,
				getPrivateVal: getPrivateVal,
				testUrl: testUrl,
				configVal:this.configVal		//必须返回，采能在注入后访问
			}
			
			function demoFunc() {}
			function setPrivateVal(val) {
				privateVal = val;
			}
			function getPrivateVal() {
				return privateVal;
			}
			function testUrl(urlName) {
				var defered = $q.defer();
				$http({
					method:"GET",
					url: !!urlName && urlName !== ""? urlName:this.publicVal
				}).success(function(data) {
					defered.resolve(data);
				}).error(function(data) {
					defered.reject(data);
				});
				return defered.promise;
			}
		}
	});
	
	//'p_serviceProvider', because angular add 'Provider' to the end of service name 'p_service'.
	MetronicApp.config(function(p_serviceProvider) {
		//configVal will be avaliable in module MetronicApps
		p_serviceProvider.configVal = "configVal set once!!";
	});
	
	MetronicApp.controller("servicesCtrl1", ["$scope", "s_service", "f_service", "p_service", 
		function($scope, s_service, f_service, p_service) {
		
		//------------module.service() test start------------------
		//注意访问共有变量，和私有变量的区别
		$scope.s_testUrl = 'login/login.html';
		$scope.s_btn_getPrivateVal = function() {
			$scope.s_PrivateVal = s_service.getPrivateVal();
		}
		$scope.s_btn_getPublicVal = function() {
			$scope.s_PublicVal = s_service.publicVal;
		}
		$scope.s_btn_testUrl = function() {
			s_service.testUrl( $scope.s_testUrl )
			.then(function(data) {
				$scope.s_testResult = data;
			}, function(data) {
				$scope.s_testResult = data;
			});
		}
		//------------module.service() test end------------------
		
		
		//------------module.factory() test start------------------
		$scope.f_testUrl = 'login/login.html';
		$scope.f_btn_getPrivateVal = function() {
			$scope.f_PrivateVal = f_service.getPrivateVal();
		}
		$scope.f_btn_getPublicVal = function() {
			$scope.f_PublicVal = f_service.publicVal;
		}
		$scope.f_btn_testUrl = function() {
			f_service.testUrl( $scope.f_testUrl )
			.then(function(data) {
				$scope.f_testResult = data;
			}, function(data) {
				$scope.f_testResult = data;
			});
		}
		//------------module.factory() test end------------------
		
		
		//------------module.provider() test start------------------
		$scope.p_testUrl = 'login/login.html';
		$scope.p_btn_getPrivateVal = function() {
			$scope.p_PrivateVal = p_service.getPrivateVal();
		}
		$scope.p_btn_getPublicVal = function() {
			$scope.p_PublicVal = p_service.publicVal;
		}
		$scope.p_btn_getConfigVal = function() {
			$scope.p_configVal = p_service.configVal;
		}
		$scope.p_btn_testUrl = function() {
			p_service.testUrl( $scope.p_testUrl )
			.then(function(data) {
				$scope.p_testResult = data;
			}, function(data) {
				$scope.p_testResult = data;
			});
		}
		//------------module.provider() test end------------------
	}]);
})();
