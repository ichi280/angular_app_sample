app.factory('ChatService', function($resource , utils, ipCookie){
	var hash = ipCookie('login');

	var netChat = $resource(
		utils.API_CHAT+'?key=:key&hash=:hash',
		{key:utils.API_KEY,hash:hash},
		{
			'update' : { method:'PUT' },
			'query'  : { method:'GET' },
			'get'	 : { method:'GET', isArray:true},
			'saveImg': { 
				method 			 : 'POST',
				transformRequest : undefined,
				headers 		 : {'Content-Type':undefined, enctype:'multipart/form-data'}
			}
		}
	);
	
	return netChat;
});
