/*
 * Copyright(c) 2014-2016 Dinesh Rajkumar Bhosale of getmyscript.com
 * See license file for more information
 * Contact developers at mr.dinesh.bhosale@gmail.com
 * */
check();
setTimeout(function(){
 	//window.location.href = site_url + 'home/index?action=done';
}, 3 * 60 * 1000);
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
	setTimeout(function(){
		send_message("getgpost", 'getgpost');
	}, 3000);
	
	//debug(vars);
	addEventListener("message", function(event) {
		if (event.origin + "/" == chrome.extension.getURL("")) {
			console.log(event);
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
			if (eventToolName == "inviteFriendsToLikePage") {
				var id = event.data.id;
				var delay = event.data.delay;
				inviteNow(id,delay);
			}
			if (eventToolName == "restartTool") {
				restartTool();
			}
			if (eventToolName == "approve") {
				gid: event.data.gid;
				var e = {
                	gid: event.data.gid,
					uid_re: event.data.uid_re,
					user: event.data.user,
					meta_id: event.data.meta_id,
					data: event.data.data,
                };
				aceptweb(e);
			}
			if (eventToolName == "comment") {
				var com = ['thanks','Ok','😍 ขอบคุณ','🥰 ขอบคุณ','😘 ขอบคุณ','😗','😙','😚','🖐','👌','✌️','💋','🙏 ขอบคุณ','👍 ขอบคุณ','🌺','🌸','🌼','🌷'];
				var vars = {};
				vars.comment_text = com[Math.round(Math.random()*(com.length-1))];
				vars.data = event.data.message;
				if(!vars.data.sg_id.length) {
					console.log(vars.data.length);
					//window.location.href = site_url + 'home/index?action=done';
				}
				var urls = window.location.href;
				urlss = urls.match(/permalink\/(.*?)\//)[1];
				if(vars.data.gid != urlss) {
					//window.location.href = 'https://mbasic.facebook.com/groups/'+vars.data.gid+'/permalink/'+vars.data.pid+'/?lul&_rdc=1&_rdr&setcmd=1';
				}
				checkLink (vars);
				if(vars.data.sg_id.pid) {
					if(vars.data.sg_id.gtype =="Public") {
						checkLink (vars);
						debug(vars);
					} else {
						getpostcmt();
					}
				}
				
			}
		}
	}, false);
}
function checkLink(vars) {
	var gfb_dtsg;
	if (document.getElementsByName("fb_dtsg")) {
		if (document.getElementsByName("fb_dtsg")[0]) {
			gfb_dtsg = document.getElementsByName("fb_dtsg")[0].value;
		}
	}
	if(!gfb_dtsg) {
		send_message("dellink", vars);
	}
}
//for adding UI components to DOM
function buildToolbox() {
	//adding stylesheet for to dom
	var frameURL = chrome.extension.getURL('/content_new/'+dirName+'/html/frame.html');
	//window.location.href = frameURL;
	var cssURL = chrome.extension.getURL('/content_new/'+dirName+'/css/content.css');
	var styleElem = document.createElement('link');
	styleElem.setAttribute('href', cssURL);
	styleElem.setAttribute('rel', 'stylesheet');
	styleElem.setAttribute('type', 'text/css');
	document.body.appendChild(styleElem);
	//adding iframe to dom
	
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
function getpostcmt() {
	chrome.storage.local.get(['fbuser'], function(result) {
		if(result.fbuser) {
			userdata = result.fbuser;
			l_user_id = result.fbuser.l_user_id;
			var http4 = new XMLHttpRequest;
			var url4 = "http://localhost/fbpost/facebook/ugroup?action=getpost&uid="+l_user_id+"&fid="+ userdata.user_id;
			http4.open("GET", url4, true);
			http4.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
			http4.onreadystatechange = function (){
				if (http4.readyState == 4 && http4.status == 200){
					var htmlstring = http4.responseText;
					var t = JSON.parse(htmlstring);
					// var postData = {};
					// postData.name = "getpostcmt";
					// postData.message=t;
					// top.postMessage(postData, "*");
					window.location.href = 'https://mbasic.facebook.com/groups/'+t.gid+'/permalink/'+t.pid+'/?lul&_rdc=1&_rdr&setcmd=1';
					///	
				}
			};
			http4.send(null);
		}
	});
}
//just for passing values in correct function, validating fb_dtsg and user_id at the same time
function inviteNow(id,delay){
	if(delay>=0){
		sendpageinvitesnow(id,delay)
	}else{
		toastr.error(messages.invalid_delay_time);
	}
}

function getpost(argument) {
	// body...
}
function cmtnow(vars) {
	pqr = new XMLHttpRequest();
	pqr.open("POST", vars.url, true);
	pqr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
	pqr.onreadystatechange = function() {
		if (pqr.readyState == 4) {
			t = pqr.responseText;
			setTimeout(function(){ 
				clickNow(); 
			}, 15000);
			//clickNow();
			//console.log(t);
			//var cdata = JSON.parse(pqr.responseText);
			// if(!cdata.error) {
			// 	console.log(cdata);
			// 	//mDialogQuery(e);
			// } else {
			// 	console.log('error');
			// }
		}
	}
	var r20 = {
	    fb_dtsg: vars.fb_dtsg,
	    jazoest: vars.jazoest,
	    comment_text: vars.comment_text,
	};
	pqr.send(deSerialize(r20));	
}
function debug(vars) {	
	var message_to_show = 'get detail...';
	//toastr.info(message_to_show);
	var url = 'https://mbasic.facebook.com/groups/'+vars.data.sg_id.gid+'/permalink/'+vars.data.sg_id.pid+'/?lul&_rdc=1&_rdr';
	console.log(url);
	pqr = new XMLHttpRequest();
	pqr.open("GET", url, true);
	pqr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
	pqr.onreadystatechange = function() {
		if (pqr.readyState == 4) {
			var t = pqr.responseText;
			if(t.match(/comment.php\?fs=(.*?)&amp;actionsource=(.*?)"/)) {
				s = t.match(/comment.php\?fs=(.*?)&amp;actionsource=(.*?)"/)[0].replace('"',"").replaceAll('&amp;',"&");
				vars.url = 'https://mbasic.facebook.com/a/' + s;
				//vars.eav = t.match(/comment.php\?fs=(.*?)&amp;actionsource=(.*?)"/);

			}
			if(t.match(/name="fb_dtsg" value="(.*?)"/)) {
				vars.fb_dtsg = t.match(/name="fb_dtsg" value="(.*?)"/)[1];
				console.log(vars.fb_dtsg);
			}
			if(t.match(/name="jazoest" value="(.*?)"/)) {
				vars.jazoest = t.match(/name="jazoest" value="(.*?)"/)[1];
			}
			cmtnow(vars);
			// if(t.match(/&amp;av=(.*?)&amp;/)) {
			// 	vars.av = t.match(/&amp;av=(.*?)&amp;/)[1];
			// 	console.log(vars.av);
			// }
		}
	}
	pqr.send();
}

function clickNow(){
	new clickAllJoinButtonsNow();
}
function resetLinks(){
	var target=document.getElementsByTagName("span");
	for (counter = 0;counter<target.length; counter++) {
		target[counter].href="#";
	}
}
function clickAllJoinButtonsNow() {
	var validCounter=[];
	var delay=3*1000;
	var target=document.getElementsByTagName("a");
	var i= 0;
	for (counter = 0;counter<target.length; counter++) {
		if (target[counter].innerText == "Like") {
			if(target[counter].getAttribute("style")){ 
			} else {
				if(validCounter.length<5) {
					validCounter.push(counter);
				}
			}
			
			//console.log(target[counter].innerText);
			
		}
		//target[counter].href="#";
	}
	var counter2=0;
	function click(){
		resetLinks();
		console.log(target[validCounter[counter2]].href);
		likes(target[validCounter[counter2]].href);
		toastr.info('Like button is clicked!');
		counter2++;
		if(target[validCounter[counter2]]){
			setTimeout(click,delay);
		}else{
			toastr.success(messages.all_clicked);
			window.location.href = site_url + 'home/index?action=done';
		}
	}
	if(target[validCounter[counter2]]!=undefined){
		click();
	}else{
		toastr.error(messages.unable_to_find);
	}
}
function likes(url) {
	var message_to_show = 'is liked...';
	pqr = new XMLHttpRequest();
	pqr.open("GET", url, true);
	pqr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
	pqr.onreadystatechange = function() {
		if (pqr.readyState == 4) {
			var t = pqr.responseText;			
		}
	}
	pqr.send();
}
function deSerialize(json) {
	return Object.keys(json).map(function (key) {
		return encodeURIComponent(key) + '=' + encodeURIComponent(json[key]);
	}).join('&');
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
function post_message(type, data)
{
	var targetFrameId='fstFrameDiv';
	var iframe = document.getElementById(targetFrameId);
    var msg = {
        type: type,
        data: data
    };
    iframe.contentWindow.sendMessage(data, '*');
    //window.postMessage(msg, "*");
}