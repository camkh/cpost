/*
Copyright(c) 2014-2016 Dinesh Rajkumar Bhosale of getmyscript.com
See license file for more information
Contact developers at mr.dinesh.bhosale@gmail.com
*/
//fb_dtsg and user_id are already loaded
//remove duplicates from array
var unique_array = function (arr) {
	var i, j, cur, found;
	for (i = arr.length - 1; i >= 0; i--) {
		cur = arr[i];
		found = false;
		for (j = i - 1; !found && j >= 0; j--) {
			if (cur === arr[j]) {
				if (i !== j) {
					arr.splice(i, 1);
				}
				found = true;
			}
		}
	}
	return arr;
};
//gives error description from JSON data of XHR
function give_error_description(text) {
	var str='';
	if(text){
		if(text.replace("for (;;);", "")){
			try {
				var o = JSON.parse(text.replace("for (;;);", ""));
				if (o && typeof o === "object" && o !== null) {
					if(JSON.parse(text.replace("for (;;);", ""))){
						if(JSON.parse(text.replace("for (;;);", "")).errorDescription){
							str=JSON.parse(text.replace("for (;;);", "")).errorDescription;
						}
					}
				}
			}
			catch (e) {
			}
		}
	}
	return str;
}
//for validating URL
function is_valid_url(url){
	var re_weburl = new RegExp(
			"^" +
			// protocol identifier
			"(?:(?:https?|ftp)://)" +
			// user:pass authentication
			"(?:\\S+(?::\\S*)?@)?" +
			"(?:" +
			// IP address exclusion
			// private & local networks
			"(?!(?:10|127)(?:\\.\\d{1,3}){3})" +
			"(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})" +
			"(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})" +
			// IP address dotted notation octets
			// excludes loopback network 0.0.0.0
			// excludes reserved space >= 224.0.0.0
			// excludes network & broacast addresses
			// (first & last IP address of each class)
			"(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])" +
			"(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}" +
			"(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))" +
			"|" +
			// host name
			"(?:(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)" +
			// domain name
			"(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*" +
			// TLD identifier
			"(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))" +
			// TLD may end with dot
			"\\.?" +
			")" +
			// port numberJ
			"(?::\\d{2,5})?" +
			// resource path
			"(?:[/?#]\\S*)?" +
			"$", "i"
			);
	return Boolean(url.match(re_weburl));
}
var invisibleComma='<div class="fst789_invisibleComma">,</div>';
function restartTool(){
	var messageContent = {
		action: "restartTool",
		toolName: dirName
	}
	chrome.runtime.sendMessage(messageContent, function(response) {
		console.log(response.farewell);
	});
	//for ending javascript execution when tool is restarted
	throw new Error("execution stopped");
}
//for logging dirName
console.log(dirName);
//asking users to log in
function pleaseLogin(){
	var message='Please log in into Your Facebook Account';
	alert(message);
	toastr.error(message);
}
//for checking fb_dtsg and user_id and restarting tools
function check(){
	if (document.getElementById(targetDivId)) {
		restartTool();
		throw new Error("execution stopped");
	} else {
		if(fb_dtsg&&user_id){
			start();
		}else if(user_id){
			start();
		}else{
			pleaseLogin();
		}
	}
}
//returns graph api errors
function give_graph_api_error(text) {
	return JSON.parse(text).error.message.replace(/\(\#\d+\)/igm, "");
}
