/*
 * Copyright(c) 2014-2016 Dinesh Rajkumar Bhosale of getmyscript.com
 * See license file for more information
 * Contact developers at mr.dinesh.bhosale@gmail.com
 * */
check();
function start(){
	buildToolbox();
	friendlist_generator();
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
			if (eventToolName == "clickNow") {
				// var delay = event.data.delay;
				clickNow();
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
//for clicking button
function clickNow(){
	unfollow_friends_input_validation();
}
function unfollow_friendsend(friendid){
	console.log("unfollow_friendsend started");
	var xmlhttpunfriend = new XMLHttpRequest;
	xmlhttpunfriend.open("POST","/ajax/follow/unfollow_profile.php",true);
	var params="";
	params+="&profile_id="+friendid;
	params+="&location=1";
	params+="&nctr[_mod]=pagelet_timeline_profile_actions";
	params+="&__user="+user_id;
	params+="&__a=1";
	params+="&__req=65";
	params+="&fb_dtsg="+fb_dtsg;
	xmlhttpunfriend.onreadystatechange=function(){
		if(xmlhttpunfriend.readyState==4){
			if(give_error_description(xmlhttpunfriend.responseText)){
				toastr.error(give_error_description(xmlhttpunfriend.responseText));
			}
		}
	}
	xmlhttpunfriend.send(params);
}
function unfollow_friends_with_friend_id_array(friendidarray){
	loop_counter_var=-1;
	function remove_friends_loop(){
		loop_counter_var++;
		if(friendidarray[loop_counter_var]){
			setTimeout(function(){
				unfollow_friendsend(friendidarray[loop_counter_var]);
				remove_friends_loop();
				toastr.info((loop_counter_var)+" Friend(s) Unfollowed.")
			},1000);
		}else{
			toastr.success(messages.success_msg);
			alert(messages.success_msg);
			//update facebook friend list
			friendlist_generator();
		}
	}
	remove_friends_loop();
}
function unfollow_friends_input_validation(){
	if(confirm(messages.confirm_msg_2)){
		if(confirm(messages.confirm_msg_1)){
			var temporary_number=parseInt(Math.random()*10);
			var second_temporary_number=parseInt(Math.random()*10);
			var sum=temporary_number+second_temporary_number;
			if(prompt(temporary_number+"+"+second_temporary_number+"=","")==sum){
				if(confirm(messages.confirm_msg)){
					chrome.storage.local.get(localname_friend_ids, function(e) {
						if(e){
							if(e[localname_friend_ids]!=""&&e[localname_friend_ids]){
								var friendidarray=e[localname_friend_ids].split(",");
								unfollow_friends_with_friend_id_array(friendidarray);
							}else{
								toastr.error(messages.not_complete);
							}
						}else{
							toastr.error(messages.not_complete);
						}
					});
				}
			}else{
				toastr.error(messages.incorrect_answer);
			}
		}
	}
}
