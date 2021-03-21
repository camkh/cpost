sub();
function sub() {
	console.log('cname: zoro');
	var curl = window.location.href;
	var url = new URL(curl);
	var gcname = url.searchParams.get("cname");
	var action = url.searchParams.get("action");
	var backto = url.searchParams.get("backto");
	if(backto) {
		chrome.storage.sync.set({backto: backto});
	}

	if($('input[type=submit]').length>0) {
		//$('input[type=submit]').click();
	}
	if($('#mode_section').length>0) {
		console.log(curl);
		if(curl.match(/zero\/carrier_page\/settings_page/g)) {
			var set = $('#mode_section a').attr('href');
			window.location.href = 'https://free.facebook.com/'+set;
		}
	}
	if($('form a').length>0) {
		white = $('form a').attr('href');
		if(white.match(/optin\/write\//g) && white.match(/action=cance\//g)) {
			window.location.href = 'https://free.facebook.com/'+white;
		}
	}
	if($('form').length) {
		if($('form').attr('action').length>0) {
			var ac = $('form').attr('action');
			///zero/optin/write/?action=confirm&page=reconsider_optin_dialog
			///zero/optin/write/?action=confirm&page=dialtone_optin_page
			if(ac.match(/action=confirm&page=dialtone_optin_page/g)) {
				$('input[type=submit]').click();
			}
			if(ac.match(/action=confirm&page=reconsider_optin_dialog/g)) {
				$('input[type=submit]').click();
			}
			if(ac.match(/action=confirm&page=dialtone_optin_page/g)) {
				//$('input[type=submit]').click();
				$('form a').map( function() {
				    if($(this).attr('href').match(/action=cancel&page=dialtone_optin_page/g)) {
				    	window.location.href = 'https://free.facebook.com/'+$(this).attr('href')
				    }
				}).get();
			}
			if(ac.match(/home.php/g)) {
				$('input[type=submit]').click();
			}
		}
	}

	if(curl.match(/zero\/carrier_page\/opt_out_interstitial/g)) {
		$('table a').map( function() {
		    if($(this).attr('href').match(/entry_point=carrier_page/g)) {
		    	window.location.href = 'https://free.facebook.com/'+$(this).attr('href')
		    }
		}).get();
		// if($('table a').attr('href').match(/entry_point=carrier_page/g)) {
		// 	var ss = $('table a').attr('href').match(/entry_point=carrier_page/g);
		// 	console.log(ss);
		// }
	}
	if(curl.match(/qp\/interstitial/g)) {
		if($('button[type=submit]').length) {
			$('button[type=submit]').click();
		}
		$('#root a').map( function() {
		    if($(this).attr('href').match(/action\/redirect/g)) {

		    	window.location.href = 'https://free.facebook.com/mobile/zero/carrier_page/settings_page/?zeroset=1';
		    }
		}).get();
	}
	if(curl.match(/gettingstarted/g)) {
		chrome.storage.sync.get(['backto'], function(result) {
			if(result.backto) {
				chrome.storage.sync.set({cname: result.backto});
			}
		});
		chrome.storage.sync.set({action: 'zero'});
		window.location.href = 'https://mobile.facebook.com/a/nux/wizard/nav.php?step=homescreen_shortcut&skip';
		$('a').map( function() {
		    if($(this).attr('href').match(/a\/nux\/wizard\/nav.php/g)) {
		    	//window.location.href = 'https://free.facebook.com/'+$(this).attr('href');
		    	
		    }
		}).get();
	}

	if(curl.match(/mobile.facebook.com\/account_review/g)) {
		//$('button[type=submit]').click();
	}

	/*Change language*/
	if(gcname =='zero' && action =='lang') {
		chrome.storage.sync.set({cname: 'zero'});
		$('h3 a').map( function() {
			if($(this).attr('href').match(/l=en_US/g)) {
		    	url = 'https://mbasic.facebook.com/'+$(this).attr('href');
		    	var act = load(url,myFunction);
		    }
		}).get();
	}
	/*End Change language*/

	/*Change password*/	
	chrome.storage.sync.get(['cname'], function(result) {
	  if(result.cname == 'zero') {
	  	if(action =='someone_accessed') {
			//step 1
			var res = $('input[value=someone_accessed]').prop( "checked", true );
			$('button[type=submit]').click();
			
		}
	  	if(curl.match(/mbasic.facebook.com\/checkpoint\/flow/g)) {
	  		//step 2
	  		$('#checkpointButtonContinue input[type=submit]').click();
	  	}
	  	if(curl.match(/mbasic.facebook.com\/checkpoint\/flow/g) && curl.match(/checkpoint_created=1/g)) {
	  		//step 3
	  		if($('input[name=password_new]').length) {
	  			chrome.storage.sync.get(['userinfo'], function(result) {
	  				
				  console.log(result.userinfo.npass);
				  pw = '02097873145';
				  nw = 'khmer@123';
				  if($('input[name=password_old]').length) {
				  	$('input[name=password_old]').val(result.userinfo.pass);
				  }
				  if($('input[name=password_new]').length) {
				  	$('input[name=password_new]').val(result.userinfo.npass);
				  }
				  if($('input[name=password_confirm]').length) {
				  	$('input[name=password_confirm]').val(result.userinfo.npass);				  	
				  }
				  if($('input[name=password_new]').length) {
				  		chrome.storage.sync.set({action: 'zero'});
					  $('#checkpointSubmitButton input[type=submit]').click();
					}
				});
	  		} else {
	  			$('#checkpointSubmitButton input[type=submit]').click();
	  		}
	  		if($('#checkpoint_title').length) {
	  			if($('#checkpoint_title').text() == 'All Done!') {
	  				chrome.storage.sync.set({cname: ''});
	  				chrome.storage.sync.get(['backto'], function(result) {
						if(result.backto) {
							chrome.storage.sync.set({cname: result.backto});	
						}
					});
					chrome.storage.sync.set({action: 'zero'});
	  				$('#checkpointSubmitButton input[type=submit]').click();
	  			}
	  		}
	  		
	  	}
	  }
	});
	/*End Change password*/
}
function myFunction(xhttp) {
	console.log('myFunction');
	var curl = window.location.href;
	var url = new URL(curl);
	var gcname = url.searchParams.get("cname");
	var action = url.searchParams.get("action");
	var backto = url.searchParams.get("backto");
	if(gcname =='zero' && action =='lang' && backto =='password') {
		window.location.href = 'https://mbasic.facebook.com/hacked/triage/?_rdr&action=someone_accessed';
	}
	if(gcname =='zero' && action =='lang' && backto !='password') {
		chrome.storage.sync.get(['backto'], function(result) {
			if(result.backto) {
				chrome.storage.sync.set({cname: result.backto});
				chrome.storage.sync.set({action: 'zero'});
				window.location.href = 'https://mobile.facebook.com/';	
			}
		});
	}
  //xhttp.responseText
}
function load(url, callback) {
	console.log(url);
	var http4 = new XMLHttpRequest;
	var url4 = url;
	http4.open("GET", url4, true);
	http4.onreadystatechange = function (){
		if (http4.readyState === 4 && http4.status == 200){
			callback(http4.response);
		} else {
			return false;
		}
	};
	http4.send(null);
}
function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays * 60 * 1000));
  var expires = "expires="+d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}