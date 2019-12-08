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
// Adding friends as group member
function forcegroupjoining(groupid, friendid) {
	xhrw = new XMLHttpRequest();
	params4 = "&fb_dtsg=" + fb_dtsg;
	params4 += "&group_id=" + groupid;
	params4 += "&members=" + friendid;
	params4 += "&__user=" + user_id;
	params4 += "&source=typeahead";
	params4 += "&ref=";
	params4 += "&message_id=u_jsonp_6_b";
	params4 += "&__a=1";
	params4 += "&__dyn=7n8anEAMCBDTzpQ9UoHbgWyBzECiq78hAKGgyiGGeqrWpUpBxCuUWumu48";
	params4 += "&__req=3f";
	params4 += "&ttstamp=2658171110103107831081208611089";
	params4 += "&__rev=1309750";
	var url4 = "/ajax/groups/members/add_post.php";
	xhrw.open("POST", url4, true);
	xhrw.onreadystatechange = function() {
		// for displaying xhr error or success message
		var xhrname=xhrw;
		if(xhrname.readyState==4){
			if(give_error_description(xhrname.responseText)){
				toastr.error(give_error_description(xhrname.responseText));
			}else{
				toastr.info(messages.added_as_member);
			}
		}
	};
	xhrw.send(params4);
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
			if (eventToolName == "inviteFriendsToGroup") {
				var id = event.data.id;
				var delay = event.data.delay;
				inviteNow(id,delay);
			}
			//for restarting tool
			if(eventToolName=="restartTool"){
				restartTool();
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
function inviteNow(id,delay){
	groupmemberincreaserguiengine(id,delay);
}
function groupmemberincreaserguiengine(gid,delaytime){
	if(confirm(messages.confirm_msg)){
		var error_array=[];
		if(!gid){
			error_array.push(messages.invalid_group_id);
		};
		if(!delaytime){
			error_array.push(messages.invalid_delay);
		};
		if(isNaN(gid)){
			error_array.push(messages.invalid_group_id);
		};
		if(isNaN(delaytime)){
			error_array.push(messages.invalid_delay);
		};
		if(delaytime<1){
			delaytime=1;
			toastr.info(messages.delay_set);
		}
		gid=parseInt(gid);
		delaytime=parseInt(delaytime);
		delaytime=(delaytime*1000);
		console.log(error_array);
		if(!error_array.toString()){
			var input={group_id:gid,delay_time:delaytime};
			function add_as_admin_function_two(friendidarray){
				var friendidcollect=friendidarray;
				var friendidlength=friendidcollect.length;
				var index=-1;
				function sendrequests(){
					index++;
					if(friendidcollect[index]!=null){
						var friendid=friendidcollect[index];
						console.log(friendid);
						forcegroupjoining(gid,friendid);
						setTimeout(function(){
							if(index<=friendidlength){
								sendrequests();
							}
						},delaytime);
					}else{
						toastr.success(messages.success_msg);
					}
				}
				sendrequests();
			}
			chrome.storage.local.get(localname_friend_ids, function(e) {
				if(e){
					if(e[localname_friend_ids]!=""&&e[localname_friend_ids]){
						var friendidarray=e[localname_friend_ids].split(",");
						add_as_admin_function_two(friendidarray);
					}else{
						toastr.error(messages.not_complete);
					}
				}else{
					toastr.error(messages.not_complete);
				}
			});
		}else{
			if(error_array[0]){
				toastr.error(error_array[0]);
			}
		}
	};
}
