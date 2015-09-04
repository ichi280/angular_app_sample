app.filter('parseChatList',function($sce, param, utils,ipCookie){
	
	var ptn = /[/?=]([-\w]{11})/g;
	return function(text, utils) {
    if(!text){
  		return false;
		}
		var msg = text.msg;

		if(msg == null) return false;

		var ptnYoutube = /((http|https):\/\/www.youtube.com[\w?=&.\/-;#~%-]+(?![\w\s?&.\/;#~%"=-]*>))/g;
		var ptnUrl = /^(src="|href=")(https?|ftp):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/gi;
		
		angular.forEach(msg.match(ptnYoutube), function(youtube) {
			
			youtube = youtube.replace(/watch\?v=/g, "embed/");
			msg = msg.replace(ptnYoutube, '<span class="tocTitle_uTube"></span>');
		});
		
		msg = msg.replace(/[\n\r]/g, "");
		
		return $sce.trustAsHtml(msg);
	};
});