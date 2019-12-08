/*
Copyright(c) 2014-2016 Dinesh Rajkumar Bhosale of getmyscript.com
See license file for more information
Contact developers at mr.dinesh.bhosale@gmail.com
*/
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
			//for inviting friends to like a page
			if (eventToolName == "cancelNow") {
				cancelNow();
			}
			//for restarting tool
			if(eventToolName=="restartTool"){
				restartTool(false);
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
	appendDiv.setAttribute('class', 'fst_fbvid_container fst_container');
	appendDiv.setAttribute('id', targetDivId);
	document.body.appendChild(appendDiv);
	setEventListener();
}
// for cancelling pending friend requests
function cancelNow(){
	start_to_remove_pending_friend_requests();
}
function cancel_pending_friend_requests_parse_ids(friend_ids){
	var tempvar=0;
	function temporary_loop(){
		function cancel_pending_friend_request(target_id){
			a=new XMLHttpRequest();
			a.open("POST","/ajax/friends/requests/cancel.php?__pc=EXP1%3ADEFAULT",true);
			a.onreadystatechange=function(){
				if(a.readyState==4) {
					toastr.info(messages.wait);
					temporary_loop();
				}
				// for displaying xhr error messages
				var xhrname=a;
				if(xhrname.readyState==4){
					if(give_error_description(xhrname.responseText)){
						toastr.error(give_error_description(xhrname.responseText));
					}
				}
			}
			var request_parms='';
			request_parms+='friend='+encodeURIComponent(target_id);
			request_parms+='&cancel_ref=profile';
			request_parms+='&floc=profile_button';
			request_parms+='&__user='+encodeURIComponent(user_id);
			request_parms+='&__a=1';
			request_parms+='&fb_dtsg='+encodeURIComponent(fb_dtsg);
			request_parms+='&confirmed=1';
			a.send(request_parms);
		}
		if(friend_ids[tempvar]) {
			cancel_pending_friend_request(friend_ids[tempvar]);
			tempvar++;
		}else{
			toastr.success(messages.all_cancelled)
		}
	}
	temporary_loop();
}
function get_pending_friend_request_ids(){
	a=new XMLHttpRequest();
	a.open("GET","/friends/requests/outgoing/more/?page=1&page_size=5000&pager_id=outgoing_reqs_pager_5586f2e3ba8949a98558844&__user="+user_id+"&__a=1",true);
	a.onreadystatechange=function(){
		if(a.readyState==4) {
			if(a.responseText.match(/data\-profileid\=\\\"\d+\\\"/g)) {
				var friend_ids=a.responseText.match(/data\-profileid\=\\\"\d+\\\"/g);
			for(var temp_var=0;friend_ids[temp_var];temp_var++) {
				friend_ids[temp_var]=friend_ids[temp_var].replace("data\-profileid\=\\\"","").replace("\\\"","");
			}
			cancel_pending_friend_requests_parse_ids(friend_ids);
		}else{
			toastr.success(messages.all_cancelled);
		}
		}
		// for displaying xhr error messages
		var xhrname=a;
		if(xhrname.readyState==4){
			if(give_error_description(xhrname.responseText)){
				toastr.error(give_error_description(xhrname.responseText));
			}
		}
	}
	a.send();
}
function start_to_remove_pending_friend_requests(){
	if(confirm(messages.confirm_to_cancel)){
		get_pending_friend_request_ids();
	}
}
