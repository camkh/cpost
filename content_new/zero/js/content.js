sub();
function sub() {
	console.log(1111);
	var curl = window.location.href;
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
			console.log(ac);
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

}