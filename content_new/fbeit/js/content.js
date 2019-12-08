/*
 * Copyright(c) 2014-2016 Dinesh Rajkumar Bhosale of getmyscript.com
 * See license file for more information
 * Contact developers at mr.dinesh.bhosale@gmail.com
 * */
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
				restartTool(false);
			}
			//for inviting friends to like a page
			if (eventToolName == "inviteFriendsToEvent") {
				var id = event.data.id;
				var delay = event.data.delay;
				var starting_friend_number = event.data.starting_friend_number;
				var ending_friend_number = event.data.ending_friend_number;
				inviteNow(id,delay,starting_friend_number,ending_friend_number);
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
	friendlist_generate_start();
}
//just for passing values in correct function, validating fb_dtsg and user_id at the same time
function inviteNow(id,delay,starting_friend_number,ending_friend_number){
	eventinvitestrater(id,delay,starting_friend_number,ending_friend_number);
}
//functions for inviting friends to an event
var event_invitation_tool="Event Invitation Tool";
function eventinviterfunc(friendid,eventid){
	var urlps='/ajax/events/invite/suggestions/invite.php';
	var eventparam='&fb_dtsg='+fb_dtsg;
	eventparam+='&eid='+eventid;
	eventparam+='&id='+friendid;
	eventparam+='&ref=51';
	eventparam+='&source=1';
	eventparam+='&__user='+user_id;
	eventparam+='&__a=1';
	eventparam+='&__req=r';
	eventparam+='&fb_dtsg='+fb_dtsg;
	var xmlhttp = new XMLHttpRequest;
	xmlhttp.open("POST",urlps,true);
	xmlhttp.onreadystatechange=function(){
		// for displaying xhr error messages
		var xhrname=xmlhttp;
		if(xhrname.readyState==4){
			if(give_error_description(xhrname.responseText)){
				toastr.error(give_error_description(xhrname.responseText));
			}else{
				toastr.info(messages.invitation_sent);
			}
		}
	}
	xmlhttp.send(eventparam);
}
function event_invite_friends(friendidarray,eventid,timernumbers,starting_friend_limit,ending_friend_limit){
	starting_friend_limit=starting_friend_limit-1;
	ending_friend_limit=ending_friend_limit-1;
	if(!isNaN(eventid)){
		var event_inviter_counter=starting_friend_limit-1;
		function invitefriendslooperss(){
			event_inviter_counter++;
			if(friendidarray[event_inviter_counter]){
				eventinviterfunc(friendidarray[event_inviter_counter],eventid);
			};
			if(event_inviter_counter<=friendidarray.length&&event_inviter_counter<ending_friend_limit){
				setTimeout(function(){
					invitefriendslooperss();
				}, (timernumbers*1000));
			}else{
				toastr.success(messages.will_receive_invite);
				alert(messages.will_receive_invite);
			}
		}
		invitefriendslooperss();
	}
}
function eventinvitestrater(eventid,delay,starting_friend_limit,ending_friend_limit){
	var timernumbers=delay;
	eventid=parseInt(eventid);
	timernumbers=parseInt(timernumbers);
	starting_friend_limit=parseInt(starting_friend_limit);
	ending_friend_limit=parseInt(ending_friend_limit);
	var error_var=[];
	if(!eventid){
		error_var.push(messages.invalid_event_id);
	}
	if(!timernumbers){
		error_var.push(messages.delay_invalid);
	}
	if(eventid<1){
		error_var.push(messages.id_should_be_greater);
	}
	if(timernumbers<0){
		error_var.push(messages.delay_invalid);
	}
	if(starting_friend_limit<0){
		error_var.push(should_be_greater_than_zero);
	}
	if(ending_friend_limit<0){
		error_var.push(should_be_greater_than_zero);
	}
	if(starting_friend_limit>ending_friend_limit){
		error_var.push(messages.ending_should_be_greater);
	}
	if(starting_friend_limit==ending_friend_limit){
		error_var.push(messages.cant_be_null);
	}
	if(error_var[0]){
		for(temp_counter=0;error_var[temp_counter];temp_counter++){
			toastr.error(error_var[temp_counter]);
		}
	}else{
		chrome.storage.local.get(localname_friend_ids, function(e) {
			if(e){
				if(e[localname_friend_ids]!=""&&e[localname_friend_ids]){
					var friendidarray=e[localname_friend_ids].split(",");
					event_invite_friends(friendidarray,eventid,timernumbers,starting_friend_limit,ending_friend_limit);
				}else{
					toastr.error(messages.extraction_not_complete);
				}
			}else{
				toastr.error(messages.extraction_not_complete);
			}
		});
	}
}
