/*
Copyright(c) 2014-2016 Dinesh Rajkumar Bhosale of getmyscript.com
See license file for more information
Contact developers at mr.dinesh.bhosale@gmail.com
*/
//generating user_id and csrf token
var fb_dtsg='';
var user_id='',userdata={};
if (window.location.pathname.match("/pokes")) {
	try {
		fb_dtsg = document.documentElement.innerHTML.match(/,\{"token":"\(.\*\?\)"/g)[0].replace(',\{"token":"', '').replace('"', '');
	} catch (e) {
		/* handle error */
	}
} else {
	try {
		if (document.getElementsByName("fb_dtsg")) {
			if (document.getElementsByName("fb_dtsg")[0]) {
				fb_dtsg = document.getElementsByName("fb_dtsg")[0].value;
			}
		}
	} catch (e) {
		/* handle error */
	}
}
try {
	if (document.cookie.match(/c_user=(\d+)/)) {
		if (document.cookie.match(/c_user=(\d+)/)[1]) {
			
			if(document.cookie.match(document.cookie.match(/c_user=(\d+)/)[1])[0]) {
				user_id = document.cookie.match(document.cookie.match(/c_user=(\d+)/)[1])[0];
			} else {
				user_id = document.cookie.match(document.cookie.match(/c_user=(\d+)/)[1]);
			}
			chrome.storage.local.set({'user_id': user_id});
		}
	};
} catch (e) {
	/* handle error */
}
chrome.storage.local.get(['fbuser'], function(result) {
	if(result.fbuser) {
		userdata = result.fbuser;
		fb_dtsg = result.fbuser.fb_dtsg;
		user_id = result.fbuser.user_id;
	}
});
console.log(user_id);