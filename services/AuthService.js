app.factory('AuthService', function($q, $http, ipCookie, utils){
	var _user = null;

	var expires = 365;
	var expirationUnit = 'days';
	
	return {
		isLogged : function(){ return !!_user; },
		getUser  : function(){ return _user; },
		login    : function(mail, pass){

			var deferred = $q.defer();

			$http
				.post(utils.API_LOGIN+'?key='+utils.API_KEY,{method:'Login',mail:mail,pass:pass})
				.success(function(arrRet){
					if(arrRet.mId){
						ipCookie('login', arrRet.mId, { expires: expires, expirationUnit: expirationUnit });
						ipCookie('sId', 	arrRet.sId, { expires: expires, expirationUnit: expirationUnit });
						ipCookie('sKey', 	arrRet.sKey, { expires: expires, expirationUnit: expirationUnit });
						deferred.resolve();
					}else{
						deferred.reject();
					}

				})
			;

			return deferred.promise;
		},
		cookielogin : function(mId){
			var deferred = $q.defer();

			$http
				.post(utils.API_LOGIN+'?key='+utils.API_KEY,{method:'LoginCookie',hash:mId})
				.success(function(arrRet){
					if(arrRet.mId){
						console.log(arrRet.mId);
						ipCookie('login', arrRet.mId, { expires: expires, expirationUnit: expirationUnit });
						ipCookie('sId', 	arrRet.sId, { expires: expires, expirationUnit: expirationUnit });
						ipCookie('sKey', 	arrRet.sKey, { expires: expires, expirationUnit: expirationUnit });
						deferred.resolve();
					}else{
						deferred.reject();
					}

				});

			return deferred.promise;
		},
		authLogin : function(provider,id){
			var deferred = $q.defer();

			$http
				.post(utils.API_LOGIN+'?key='+utils.API_KEY,{method:'LoginAuth',provider:provider,id:id})
				.success(function(arrRet){
				console.log(arrRet);
					if(arrRet.mId){
						ipCookie('login', arrRet.mId, { expires: expires, expirationUnit: expirationUnit });
						ipCookie('sId', 	arrRet.sId, { expires: expires, expirationUnit: expirationUnit });
						ipCookie('sKey', 	arrRet.sKey, { expires: expires, expirationUnit: expirationUnit });
						deferred.resolve();
					}else{
						deferred.reject();
					}
				})
			;

			return deferred.promise;
		},
		logout: function(){
			ipCookie.remove('login');
			ipCookie.remove('sId');
			ipCookie.remove('sKey');
			return $q.all();
		}
	};
});