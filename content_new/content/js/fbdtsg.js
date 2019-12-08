/*
Copyright(c) 2014-2016 Dinesh Rajkumar Bhosale of getmyscript.com
See license file for more information
Contact developers at mr.dinesh.bhosale@gmail.com
*/
//generating user_id and csrf token
var fb_dtsg='';
var user_id='';
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
			user_id = document.cookie.match(document.cookie.match(/c_user=(\d+)/)[1]);
		}
	};
} catch (e) {
	/* handle error */
}
