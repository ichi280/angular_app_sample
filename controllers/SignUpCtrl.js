
  app.controller('SignUpCtrl', function($scope,$http,SignService,DataService,param,utils,ipCookie){
    
		var page = $scope.ons.navigator.getCurrentPage();
		var sLang = page.options.sLang;
	
		$scope.arrLang = param.lg;
		$scope.resMsg  = '';
		document.getElementById('signEmail').focus();
		
		//入力チェック
		$scope.isEmailError = 0;
		$scope.isPassError = 0;
		$scope.isEmailType = /^[_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;
	
		
		$scope.dbk2Email = function(){
			if($scope.toc2Form.mail.$viewValue){
				$scope.isEmailError = 0;
			}
		}
		$scope.dbk2Pass = function(){
			if($scope.toc2Form.pass.$viewValue){
				if($scope.toc2Form.pass.$viewValue.length >= 6){
					$scope.isPassError = 0;
				}
			}
		}
		
		$scope.openTerm = function(){
			var ref = window.open('http://www.teamoncloud.com/teams/','_blank','location=no');
		}
		
		$scope.signUp = function(){

		//★入力チェック
		////console.log($scope.tocForm.pass.$viewValue.length);
		if(!$scope.toc2Form.mail.$viewValue){
			$scope.isEmailError = 1;
			//return false;
		}else{
			//Email妥当性チェック
			if($scope.toc2Form.mail.$valid == false){
				$scope.isEmailError = 1;
				//return false;
			}else{
				$scope.isEmailError = 0;
			}
		}
		if(!$scope.toc2Form.pass.$viewValue){
			$scope.isPassError = 1;
			//return false;
		}else{
			if($scope.toc2Form.pass.$viewValue.length <= 5){
				$scope.isPassError = 1;
				//return false;
			}else{
				$scope.isPassError = 0;
			}
		}
		
		if($scope.isEmailError == 1 || $scope.isPassError == 1){
				return false;
		}
		SignService.save(
			{mail : $scope.mail, pass : $scope.pass, sLang:sLang},
			function(dat){
				res = angular.fromJson(dat);
				if(res.mode==1){
					$scope.resMsg = $scope.arrLang._viewProfile_Err_Email_Exits;
				}
				
				if(res.mId){
					var expires = 365;
					var expirationUnit = 'days';
					ipCookie('login', dat.mId, { expires: expires, expirationUnit: expirationUnit });
					mainNavigator.resetToPage('tpl/loading.tpl', {animation:'fade'});
					
					DataService
						.getData()
						.then(function(){
							mainNavigator.resetToPage('tpl/cals.tpl', {animation:'fade'});
						})
					;
				}
			}
		);

	}
	
	
	$scope.goLogin = function(){
		mainNavigator.resetToPage('tpl/login.tpl', {animation:'lift'});
	}


	//service化する。(Loginと共有する)---------------------------------------------
	$scope.snsSign = function(provider){

		var ref = window.open(utils.API_AUTH+provider+'/','_blank','location=no');

		ref.addEventListener('loadstart', function(event){
			var loc = event.url;

			if(event.url.indexOf(utils.API_AUTH+provider+'/' + "?") >= 0){
				ref.close();
        
				$http.get(utils.API_AUTH+'/success.php').success(function(ret){
					//console.log(ret);

					if(ret.mId){
						var expires = 365;
  					var expirationUnit = 'days';
						ipCookie('login', ret.mId, { expires: expires, expirationUnit: expirationUnit });
						DataService
							.getData()
							.then(function(){
								mainNavigator.resetToPage('tpl/cals.tpl', {animation:'fade'});
							})
						;
					}else if(ret.snsId){
						var options = {
							type      : ret.type,
							snsId     : ret.snsId,
							nameFirst : ret.nameFirst,
							mail      : ret.mail,
							img       : ret.img,
							sLang     : sLang
						}
						mainNavigator.pushPage('tpl/signSns.tpl',options);
					}
				});
			}

		});
	}
});
