/*
//
//  Created by Dinesh Bhosale on 10/7/15.
//  Copyright (c) 2015 Dinesh Bhosale of getmyscript.com All rights reserved.
//
*/
//for performing a task after installation
chrome.runtime.onInstalled.addListener(function(object) {
	chrome.storage.local.get('installed', function(a) {
		if (!a.installed) {
			// after installing open main web site
			//chrome.tabs.create({url: "http://fst.getmyscript.com/"}, function (tab){});
			chrome.storage.local.set({
				'installed': true
			}, function() {});
			if (window.Notification) {
				// extensionName is stored in global_var, click on tooltip will open main_url
				show(backgroundMessages.installed, main_url);
			}
			//to initialize hide seen
			chrome.storage.local.set({
				'hideSeen': false
			}, function() {
				//console.log('Hide seen status changed to false');
			});
		}
	});
});
/*
for updating member info in background
*/
function set_update_member(e,cname,req_url){
	if(e.email&&e.key){
		var email=e.email;
		var key=e.key;
		var xhr = new XMLHttpRequest();
		if(cname){
			var callback_func_name=cname;
		}else{
			var callback_func_name='';
		}
		xhr.open("POST",req_url,true);
		xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
		xhr.onreadystatechange = function(){
			if (xhr.readyState == 4){
				if(xhr.responseText!=="ok"){
					var member=true;
				}else{
					var member=false;
				}
				information={email:email,key:key,member:member};
				chrome.storage.local.set({'information': information}, function() {
					//console.log("member info is updated");
				});
			}
		}
		var send_data='';
		send_data+="version="+encodeURIComponent(manifest.version);
		send_data+="&email="+encodeURIComponent(email);
		send_data+="&key="+encodeURIComponent(key);
		send_data+="&callback_func="+encodeURIComponent(callback_func_name);
		send_data+="&type="+encodeURIComponent("update_license_info");
		xhr.send(send_data);
	}
}
/* Callback func is added just for logging function name on server */
function update_license_info(cname,req_url){
	chrome.storage.local.get('information', function(e) {
		if(e){
			if(e.information){
				set_update_member(e.information,cname,req_url);
			}else{
				//console.log("member info is not set so it is not updated.");
			}
		}else{
			//console.log("member info is not set so it is not updated.");
		}
	});
}
// request from popup script about
// updating license info
chrome.extension.onRequest.addListener(
    function(request, sender, sendResponse){
        if(request.msg == "updateValidate"){
        	update_license_info(request.cname,request.req_url);
        }
    }
);
//function to start tools in a new tab
chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		if (request.action == "restartTool") {
			sendResponse({
				farewell: "Completed"
			});
			var name=request.toolName;
			var newTab=request.newTab;
			start(name,newTab);
		}
		if (request.action == "startTool") {
			sendResponse({
				farewell: "started"
			});
			var cname=request.cname;
			var newTab=request.newTab;
			start(cname,newTab);
		}
		if (request.contentScriptQuery == "queryPrice") {
			console.log(222222222222);
		}
	}
);

chrome.browserAction.onClicked.addListener(allAction);
function allAction(tab) {
	console.log(tab);
}