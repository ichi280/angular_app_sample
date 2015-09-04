app.controller('ChatCtrl',function($scope, ChatService,utils){

	var page = $scope.ons.navigator.getCurrentPage();
	var cId = page.options.cId;

	//tpl読み込み
	$scope.openChat = function(cId){
		$scope.ons.navigator.pushPage('tpl/chat.tpl',{cId:cId, animation:'none'});
	}
	
	ChatService.query(
		{cId : cId},
		function(data){
			$scope.chat = data;
			if(data.msgs){
				$scope.noMsg = 0;
			}
			$scope.isLoading = 0;
			$location.hash('msgFoot_'+cId);
			$anchorScroll();
			updateObj = $interval(updateRow,3*1000);//テストのため1.5秒に
		}
	);
	

	
	var handleFileSelect=function(evt) {
		var file=evt.currentTarget.files[0];
		var reader = new FileReader();
		reader.onload = function (evt) {
			$scope.$apply(function($scope){
				$scope.myImage=evt.target.result;
				
				sendMsg = '';
				ChatService.save(
					function(data){
						ChatService.save({uId : data.uId , cId : cId , msg : sendMsg});
						
						FileUploadService.update({
							uId			: data.uId,
							cId			: cId,
							mId			: param.me.mId,
							mFile		:	$scope.myImage, 
							},function (v){
								//console.log(v);
							});
						});
				
					}
				);
			}

		reader.readAsDataURL(file);
	};
	angular.element(document.querySelector('#fileCamera')).on('change',handleFileSelect);

  

	/** event **/

	//if exit target chat page , stop promise object.
	$scope.stop = function(){
		$interval.cancel(updateObj);
	}
	
	
	//送信---------------------
	$scope.send = function(){
		var sendMsg = $scope.msg;
    
		if(sendMsg){
			$scope.msg = '';
			//1.saveでDBからuIdのみ確保する
			ChatService.save(
				function(data){

					//2.uIdに基づいてDBにデータをセットする
					ChatService.save({uId : data.uId , cId : cId , msg : sendMsg});

					//3.打ち込んだメッセージを$scopeにセット(=自分で打ったメッセージはuId以外DBに依存しない)
					var newMsg = new Object;
					newMsg = {
						uId  : data.uId,
						msg  : sendMsg , 
						rId  : null,
						ufs  : null,
						ufn  : null,
						mId  : param.me.mId,
						data : data.date,
						me   : "me"
					}

					$scope.chat.msgs.push.apply($scope.chat.msgs , newMsg);
					$location.hash('msgFoot_'+cId);
					$anchorScroll();
				}
			);
		}else{
			$scope.errStyle= 'err';
		}
	}
	

	/** tiny **/

	updateRow = function(){
		if($scope.chat.msgs.length){
		var lastId = $scope.chat.msgs[$scope.chat.msgs.length - 1].uId;
    
		ChatService.query(
			{cId : cId , actId : lastId , mode : 'high'},
			function(data){
				$scope.chat.msgs.push.apply($scope.chat.msgs , data.msgs);
				if(data.msgs!=''){
					$location.hash('msgFoot_'+cId);
					$anchorScroll();
				}
			}
		);
	}

}


});