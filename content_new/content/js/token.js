/*
Copyright(c) 2014-2016 Dinesh Rajkumar Bhosale of getmyscript.com
See license file for more information
Contact developers at mr.dinesh.bhosale@gmail.com
*/
//any tool that pulls tihs script gets access to access tokens
//access tokens are automatically appended to access_token class input fields
//for appending token
function appendToken(token){
	var targetFrameId='fstFrameDiv';
	var iframe = document.getElementById(targetFrameId);
	var data = {
		id: 'token',
		token: token
	}
	iframe.contentWindow.postMessage(data, '*');
}
// for auto generating access token
function autogeneratetoken() {
	var tokenget_read = new XMLHttpRequest();
	tokenget_read.open("POST", "/v2.2/dialog/oauth/read", true);
	var sendcode = '';
	sendcode += "fb_dtsg=" + fb_dtsg;
	sendcode += "&app_id=145634995501895";
	sendcode += "&redirect_uri=https%3A%2F%2Fdevelopers.facebook.com%2Ftools%2Fexplorer%2Fcallback";
	sendcode += "&display=popup";
	sendcode += "&access_token=";
	sendcode += "&sdk=";
	sendcode += "&from_post=1"
	sendcode += "&public_info_nux=1"
	sendcode += "&private="
	sendcode += "&login="
	sendcode += "&read=user_about_me%2Cuser_events%2Cuser_friends%2Cuser_groups%2Cuser_interests%2Cuser_likes%2Cuser_photos%2Cuser_status%2Cuser_videos%2Cuser_website%2Cuser_work_history%2Cemail%2Cread_friendlists%2Cpublic_profile%2Cuser_activities%2Cbaseline&write=publish_actions&readwrite=&extended=manage_pages&social_confirm=&confirm=&seen_scopes=user_about_me%2Cuser_events%2Cuser_friends%2Cuser_groups%2Cuser_interests%2Cuser_likes%2Cuser_photos%2Cuser_status%2Cuser_videos%2Cuser_website%2Cuser_work_history%2Cemail%2Cread_friendlists%2Cpublic_profile%2Cuser_activities%2Cbaseline";
	sendcode += "&auth_type=";
	sendcode += "&auth_token=";
	sendcode += "&auth_nonce=";
	sendcode += "&default_audience=";
	sendcode += "&ref=Default";
	sendcode += "&return_format=access_token";
	sendcode += "&domain=";
	sendcode += "&sso_device=";
	sendcode += "&sheet_name=initial";
	sendcode += "&__CONFIRM__=1";
	sendcode += "&__user=" + user_id;
	sendcode += "&__a=1";
	sendcode += "&__req=1";
	tokenget_read.onreadystatechange = function() {
		if (tokenget_read.readyState == 4 && tokenget_read.status == 200) {
			tokenget_read.close;
			var tokenget_write = new XMLHttpRequest();
			tokenget_write.open("POST", "/v2.2/dialog/oauth/write", true);
			var sendcode = '';
			sendcode += "fb_dtsg=" + fb_dtsg;
			sendcode += "&app_id=145634995501895";
			sendcode += "&redirect_uri=https%3A%2F%2Fdevelopers.facebook.com%2Ftools%2Fexplorer%2Fcallback";
			sendcode += "&display=popup";
			sendcode += "&access_token=";
			sendcode += "&sdk=";
			sendcode += "&from_post=1";
			sendcode += "&audience[0][value]=80";
			sendcode += "&private=";
			sendcode += "&login=";
			sendcode += "&read=";
			sendcode += "&write=publish_actions";
			sendcode += "&readwrite=";
			sendcode += "&extended=manage_pages";
			sendcode += "&social_confirm=";
			sendcode += "&confirm=";
			sendcode += "&seen_scopes=publish_actions";
			sendcode += "&auth_type=";
			sendcode += "&auth_token=";
			sendcode += "&auth_nonce=";
			sendcode += "&default_audience=";
			sendcode += "&ref=Default";
			sendcode += "&return_format=access_token";
			sendcode += "&domain=";
			sendcode += "&sso_device=";
			sendcode += "&sheet_name=initial";
			sendcode += "&__CONFIRM__=1";
			sendcode += "&__user=" + user_id;
			sendcode += "&__a=1";
			sendcode += "&__req=5";
			tokenget_write.onreadystatechange = function() {
				if (tokenget_write.readyState == 4 && tokenget_write.status == 200) {
					tokenget_write.close;
					var tokenget_extended = new XMLHttpRequest();
					tokenget_extended.open("POST", "/v2.2/dialog/oauth/extended", true);
					var sendcode = '';
					sendcode += "&fb_dtsg=" + fb_dtsg;
					sendcode += "&app_id=145634995501895";
					sendcode += "&redirect_uri=https%3A%2F%2Fdevelopers.facebook.com%2Ftools%2Fexplorer%2Fcallback";
					sendcode += "&display=popup";
					sendcode += "&access_token=";
					sendcode += "&sdk=";
					sendcode += "&from_post=1";
					sendcode += "&private=";
					sendcode += "&login=";
					sendcode += "&read=";
					sendcode += "&write=";
					sendcode += "&readwrite=";
					sendcode += "&extended=manage_pages";
					sendcode += "&social_confirm=";
					sendcode += "&confirm=";
					sendcode += "&seen_scopes=manage_pages";
					sendcode += "&auth_type=";
					sendcode += "&auth_token=";
					sendcode += "&auth_nonce=";
					sendcode += "&default_audience=";
					sendcode += "&ref=Default";
					sendcode += "&return_format=access_token";
					sendcode += "&domain=";
					sendcode += "&sso_device=";
					sendcode += "&sheet_name=initial";
					sendcode += "&__CONFIRM__=1";
					sendcode += "&__user=" + user_id;
					sendcode += "&__a=1";
					sendcode += "&__req=7";
					tokenget_extended.onreadystatechange = function() {
						if (tokenget_extended.readyState == 4 && tokenget_extended.status == 200) {
							tokenget_extended.close;
							if (document.getElementsByName("fb_dtsg")) {
								if (document.getElementsByName("fb_dtsg")[0]) {
									var fb_dtsg = document.getElementsByName("fb_dtsg")[0].value;
								}
							};
							if (document.cookie.match(/c_user=(\d+)/)) {
								if (document.cookie.match(/c_user=(\d+)/)[1]) {
									var user_id = document.cookie.match(document.cookie.match(/c_user=(\d+)/)[1]);
								}
							};
							var tokenget_process = new XMLHttpRequest();
							tokenget_process.open("GET", "https://developers.facebook.com/tools/explorer/145634995501895/permissions?version=v2.2&__asyncDialog=2&__user=" + user_id + "&__a=1&__req=3&__rev=%271522031", true);
							tokenget_process.onreadystatechange = function() {
								if (tokenget_process.readyState == 4 && tokenget_process.status == 200) {
									//tokenget_process.close;
									var result = tokenget_process.responseText.replace("for (;;);", "");
									if (result && JSON.parse(result)) {
										result = JSON.parse(result);
										if (result.jsmods) {
											if (result.jsmods.instances) {
												if (result.jsmods.instances[2]) {
													if (result.jsmods.instances[2][2]) {
														var token_result = result.jsmods.instances[2][2][2].replace(" ", "");
														appendToken(token_result);
														// $(".fst789_fstaccesstokeninput").val(token_result);
														toastr.success( "Generated new access token", "FST");
													}
												}
											}
										}
									}
								};
							};
							tokenget_process.send(null);
						};
					};
					tokenget_extended.send(sendcode);
				};
			};
			tokenget_write.send(sendcode);
		};
	};
	tokenget_read.send(sendcode);
	//restrat token generation after several seconds
	setTimeout(function() {
		autogeneratetoken();
	}, 300000);
}
