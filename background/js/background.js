/*
//
//  Created by Dinesh Bhosale on 10/7/15.
//  Copyright (c) 2015 Dinesh Bhosale of getmyscript.com All rights reserved.
//
*/
//for performing a task after installation
var setname=[],newTab;
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
			chrome.tabs.create({url: 'http://localhost/fbpost/home/index', active: false});
			//closeTabs();
		}
		if (request.action == "reloadTool") {
			chrome.tabs.create({url: 'http://localhost/fbpost/home/index', active: false});
			var cname=request.toolName;
			var newTab=request.newTab;
			setname.push({
				'toolName':request.toolName,
				'request':request.action,
			});
			chrome.tabs.getSelected(null, function(tab){
				var reloadProperties={};
				reloadProperties.url=request.url;
				tabid = tab.id;
				chrome.tabs.update(tabid, reloadProperties, function callback(e) {
					setTimeout(function(){
						sendResponse({
							farewell: "started"
						});
						//start(cname,newTab);
						if(cname=='gptto') {
							closeTabs(tabid);
							gptto();
						}
					}, (10*1000));
					// if (e.status == 'complete') {
					// 	console.log(cname);
					// 	// sendResponse({
					// 	// 	farewell: "started"
					// 	// });
						
					// 	// start(cname,newTab);
					// }
					
				});
			    // console.log(tab.id);
			    // var createProperties = {};
			    // createProperties.name = request.toolName;
			    // createProperties.newTab = newTab=request.newTab;
			    // createProperties.url = newTab=request.url;
			    // createProperties.id = tab.id;
			    // createProperties.request = request.action;
			    //reloadurl(request.toolName,createProperties);
			});
			
		}
		if (request.action == "startTool") {
			sendResponse({
				farewell: "started"
			});
			var cname=request.cname;
			var newTab=request.newTab;
			start(cname,newTab);
		}
		if (request.closetab) {
			alert(closetab);
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
function closeTabs(tabid) {
	chrome.tabs.query({}, function(tabs) {
		for (var i = 0; i < tabs.length; i++) {
			if(tabs[i].id!=tabid) {
				chrome.tabs.remove(tabs[i].id);
			}
	    }
	  
	});
	// chrome.tabs.query({}, function(tabs) {
	// 	for (var i = 0; i < tabs.length; i++) {
	// 		if(tabs[i].active!=true && tabs[i].status == "complete") {
	// 			if(tabs[i].id!=tabid) {
	// 				chrome.tabs.remove(tabs[i].id);
	// 			}
	// 		} 
	//     }
	  
	// });
// 	chrome.tabs.onUpdated.addListener(function(tabId,changeInfo,tab){
// 	  //console.log(tab);
// 	  //console.log(changeInfo);
// 	  //console.log(tabId);
// 	   //chrome.tabs.remove(tabId, function() { });
// 	});
}
// chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {          
// 	 //alert(changeInfo.status);
// 	 if (changeInfo.status == 'complete') {
// 		 console.log(changeInfo.status);
// 		 if(setname.length>0) {
// 		 	if(setname[0]['request'] =='reloadTool') {
// 		 		startTool(setname[0]['toolName'],setname[0]['request']);
// 		 		//var dirName=setname[0]['toolName'];		 		
// 		 		setname.push({
// 					'toolName':'',
// 					'request':'',
// 				});
// 		 	}
		 	
// 		 }
// 	 }
// });
function getCurrent() {
	chrome.tabs.getSelected(null, function(tab){
	    console.log(tab.id);
	    
	});
	//chrome.tabs.reload(tabId: number, reloadProperties: object, callback: function);
}
