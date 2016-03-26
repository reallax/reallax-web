"use strict";

(function() {
	
	MetronicApp.directive("hello", function() {
		return {
			restrict: 'E',
	        template: '<div>Hello Angular!</div>',
	        replace: true,
		};
	});
	
	MetronicApp.constant('USER_ROLES', {
	  all: {role:'all', limit:5},
	  admin: {role:'admin', limit:4},
	  staff: {role:'staff', limit:3},
	  guest: {role:'guest', limit:1}
	});
	MetronicApp.directive("haspermission", function(USER_ROLES) {
		return {
			restrict: 'A',
			link: function(scope, el, attrs, ctrls) {
				console.info(attrs.haspermission);
				
				var userRole = attrs.haspermission.split(":")[0];
				var limitRole = attrs.haspermission.split(":")[1];
				
				if(USER_ROLES[userRole].limit >= USER_ROLES[limitRole].limit) {
					el.show();
				}
				else {
					el.hide();
				}
			}
		};
	});
	
})();
