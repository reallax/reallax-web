"use strict";

angular.module("ngPermission", [])
	.run(["$rootScope", "$window", "$location", "LoginProvider", "authService",
		function($rootScope, $window, $location, LoginProvider, authService) {

			$rootScope.$on("$stateChangeStart",
				function(evt, toState, toParams, fromState, fromParams, Options) {
					//console.info(evt);
					//console.info(toState);
					//console.info(toParams);
					//console.info(fromState);
					//console.info(fromParams);
					//console.info(Options);

					//console.info(LoginProvider.purposeURL());
					if( !authService.isAuth() ) {
						evt.preventDefault();
						$window.location.href = LoginProvider.purposeURL();
					}
				});
		}
	])
	.constant("PurposeCnst", {
		show: "show",	//单点登录
		self: "self"	//登录自己的login页面
	})
	.provider("LoginProvider", function() {

		this.purpose = "self";

		this.$get = function($window, $location, PurposeCnst) {

			var allowUrlCharactersReg = new RegExp("[a-zA-Z0-9\\.\\*\\-_]");

			return {
				URLEncoder: URLEncoder,
				purpose: this.purpose,
				purposeURL: purposeURL,
			}
			
			function purposeURL() {
				var retrunURL = "returnUrl=" + URLEncoder( $location.absUrl() );
				return this.purpose === PurposeCnst.show ? "http://deverp.dmall.com/login" + "?" + retrunURL : "login/login.html";
			}
			/**
			 * URLEncoder() = java.net.URLEncoder.encode()
			 */
			function URLEncoder(URL) {
				var encodeURL = "";
				var temp = "";
				for (var i = 0; i < URL.length; i++) {
					temp = URL.charAt(i);
					if (!allowUrlCharactersReg.test(temp)) {
						var asciiHex = URL.charCodeAt(i).toString(16).toUpperCase();
						encodeURL += "%" + asciiHex;
					} else {
						encodeURL += temp;
					}
				}
				return encodeURL;
			}
		}
	})
	.service("authService", function($window, $cookies, $browser, LoginProvider, PurposeCnst) {
		var cookieKey = "UYBFEWAEE";
		
		this.isAuth = function() {
			var cv = $cookies[cookieKey];
			if(!!cv) {
				return true;
			}
			else {
				return false;
			}
		}
		this.createCookies = function(name) {
			$.cookie(cookieKey, name);
		}
		this.logout = function() {
			$.cookie(cookieKey, '', {expires: -1, path: '/', domain: 'dmall.com', secure: true});
			$.cookie(cookieKey, '', {expires: -1, path: '/', domain: '127.0.0.1', secure: true});
			$window.location.reload();
		}
	});
