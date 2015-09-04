(function(){
	app.filter('convDate',function(){
		return function(strDate){
			return new Date(strDate);
		}
	});

	app.filter('convDayColor',function(){
		return function(strDate){
			var _d  = new Date(strDate);
			var day = _d.getDay();
			var week = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
			
			var viewDay = _d.getDate()
  		
			if(week[day] == 'Sun'){
				return '<span class="daySun">'+viewDay+'<span>';
			}else if(week[day] == 'Sat'){
				return '<span class="daySat">'+viewDay+'<span>';
			}else{
				return '<span>'+viewDay+'</span>';
			}
		}
	});

})();

