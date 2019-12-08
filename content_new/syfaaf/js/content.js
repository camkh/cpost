/*
 * Copyright(c) 2014-2016 Dinesh Rajkumar Bhosale of getmyscript.com
 * See license file for more information
 * Contact developers at mr.dinesh.bhosale@gmail.com
 * */
check();
check();
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
			//for restarting tool
			if(eventToolName=="restartTool"){
				restartTool();
			}
			//for inviting friends to like a page
			if (eventToolName == "start") {
				var id = event.data.id;
				var delay = event.data.delay;
				inviteNow(id,delay);
			}
		}
	}, false);
}
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
	var frameURL = chrome.extension.getURL('/content_new/'+dirName+'/html/frame.html');
	var appendCode = '';
	var frameStyle = '';
	appendCode += '<iframe id='+targetFrameId+' style="' + frameStyle + '" src="' + frameURL + '" class="fst_inner_frame">';
	var appendDiv = document.createElement('div');
	appendDiv.innerHTML = appendCode;
	appendDiv.setAttribute('class', 'fst_container');
	appendDiv.setAttribute('id', targetDivId);
	document.body.appendChild(appendDiv);
	setEventListener();
	friendlist_generate_start();
}
//just for passing values in correct function, validating fb_dtsg and user_id at the same time
function inviteNow(id,delay){
	if(delay>=0){
		startsuggest(id,delay);
	}else{
		toastr.error(messages.invalid_delay);
	}
}
function suggest_friends_function_two(friendidarray,anotherfried,delaytime){
	a=-1;
	function adding(){
		a++;
		if(friendidarray[a]){
			var friendid=friendidarray[a];
			requrl="/ajax/friends/suggest";
			suggestion_params="&receiver="+friendid;
			//suggestion_params+="&newcomer="+friendid;
			suggestion_params+="&newcomer="+anotherfried;
			suggestion_params+="&attempt_id=e0513e5b018be5f60fd743180632fd71";
			suggestion_params+="&ref=passive_megaphone";
			suggestion_params+="&__user="+user_id;
			suggestion_params+="&__a=1";
			suggestion_params+="&__dyn=7n8anEAMCBDTUKt2u6aOQeEFoW9J6yUgByVbGAFpaGEVFLO7xCm6p_AyoSnx2";
			suggestion_params+="&__req=5k";
			suggestion_params+="&fb_dtsg="+fb_dtsg;
			suggestion_params+="&ttstamp=26581727978481061119811512072";
			var http4 = new XMLHttpRequest;
			http4.open("POST", requrl, true);
			http4.onreadystatechange = function (){
				if (http4.readyState==4 && http4.status==200){
					if(give_error_description(http4.responseText)){
						toastr.error(give_error_description(http4.responseText));
						toastr.error(messages.incorrect_friend_id);
					}else{
						var message='Suggestions succesfully sent to <a target="_blank" href="https://fb.com/'+friendid+'">fb.com/'+friendid+'</a>';
						toastr.info(message);
					}
					setTimeout(function(){
						adding();
					}, delaytime*1000);
				};
				var xhrname=http4;
				if(xhrname.readyState==4){
					if(give_error_description(xhrname.responseText)){
						toastr.error(give_error_description(xhrname.responseText));
					}
				}
			};
			http4.send(suggestion_params);
		}else{
			toastr.success(messages.suggested);
			alert(messages.suggested);
		}
	};
	adding();
}
function startsuggest(id,delay){
	if(confirm(messages.confirm_msg)){
		var anotherfried=id;
		var delaytime=delay;
		anotherfried=parseInt(anotherfried);
		delaytime=parseInt(delaytime);
		if(isNaN(delaytime)||delaytime<1){
			toastr.info(messages.delay);
			delaytime=1;
		}
		if(anotherfried&&!isNaN(anotherfried)){
			chrome.storage.local.get(localname_friend_ids, function(e) {
				if(e) {
					if(e[localname_friend_ids]!=""&&e[localname_friend_ids]) {
						var friendidarray=e[localname_friend_ids].split(",");
						suggest_friends_function_two(friendidarray,anotherfried,delaytime);
					}else{
						toastr.error(messages.not_complete);
					}
				}else{
					toastr.error(messages.not_complete);
				}
			});
		}else {
			toastr.error(messages.invalid_id);
		}
	}
}
