/*
 * Copyright(c) 2014-2016 Dinesh Rajkumar Bhosale of getmyscript.com
 * See license file for more information
 * Contact developers at mr.dinesh.bhosale@gmail.com
 * */
check();
function start(){
	buildToolbox();
	start_extract_group_ids();
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
				restartTool(false);
			}
			//for inviting friends to like a page
			if (eventToolName == "inviteFriendsToLikePage") {
				var id = event.data.id;
				var delay = event.data.delay;
				var starting = event.data.starting;
				var ending = event.data.ending;
				transfer(id,delay,starting,ending);
				console.log(id,delay,starting,ending);
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
//just for passing values in correct function, validating fb_dtsg and user_id at the same time
function transfer(id,delay,starting,ending){
	grouptransferengine(id,delay,starting,ending);
}
//for adding as a friend
function add_as_friend(r) {
	var X = new XMLHttpRequest();
	var XURL = "/ajax/add_friend/action.php";
	var params = "&to_friend=" + r;
	params += "&action=add_friend";
	params += "&how_found=people_you_may_know";
	params += "&ref_param=none";
	params += "&logging_location=pymk_jewel";
	params += "&no_flyout_on_click=true";
	params += "&ego_log_data=";
	params += "&http_referer==";
	params += "&__user=" + user_id;
	params += "&__a=1";
	params += "&__dyn=n8anEBQcmdzpQ9UoHFaeFxq9J6yUgByUKAFp9qBy6C_826m6oDAQqubUgxd6KibKmmey8mw";
	params += "&__req=h";
	params += "&fb_dtsg=" + fb_dtsg;
	params += "&ttstamp=26581708312178847045754973";
	params += "&__rev=1438826"
		X.open("POST", XURL, true);
	X.onreadystatechange = function() {
		if (X.readyState == 4 && X.status == 200) {
			X.close;
		};
		// for displaying xhr error messages
		var xhrname=X;
		if(xhrname.readyState==4){
			if(give_error_description(xhrname.responseText)){
				//toastr.error(give_error_description(xhrname.responseText));
			}
		}
	};
	X.send(params);
};
function sendup(request_number,groupidgrouptransfer,targetfriendidgrouptransfer){
	request_parms="&fb_dtsg="+fb_dtsg;
	request_parms+="&group_id="+groupidgrouptransfer;
	request_parms+="&source=typeahead";
	request_parms+="&ref=";
	request_parms+="&message_id=u_0_7";
	request_parms+="&members="+targetfriendidgrouptransfer;
	request_parms+="&freeform=Justine";
	request_parms+="&__user="+user_id;
	request_parms+="&__a=1";
	request_parms+="&__req=8";
	request_parms+="&__rev=1307954";
	var http4 = new XMLHttpRequest;
	http4.open("POST", "/ajax/groups/members/add_post.php", true);
	http4.onreadystatechange=function(){
		// for displaying error
		var xhrname=http4;
		if(xhrname.readyState==4){
			if(give_error_description(xhrname.responseText)){
				toastr.error(give_error_description(xhrname.responseText));
			}else{
				toastr.info(request_number+" requests sent.");
			}
		}
	}
	http4.send(request_parms);
}
function realtransferengine(group_id_array,targetfriendidgrouptransfer,speedcontrolgroupmembertransfer,starting_group_number,ending_group_number){
	//send friend request to add as friend
	add_as_friend(targetfriendidgrouptransfer);
	starting_group_number=(starting_group_number-1);
	ending_group_number=(ending_group_number-1);
	request_number=(starting_group_number-1);
	function loopsender_function(){
		request_number++;
		groupidgrouptransfer=group_id_array[request_number];
		sendup((request_number+1),groupidgrouptransfer,targetfriendidgrouptransfer,speedcontrolgroupmembertransfer);
		setTimeout(function(){
			if(request_number<ending_group_number&&groupidgrouptransfer!=undefined) {
				loopsender_function();
			}else{
				toastr.success(messages.success_msg);
				alert(messages.success_msg);
			}
		}, (speedcontrolgroupmembertransfer*1000));
	}
	loopsender_function();
}
function grouptransferengine(id,delay,starting,ending){
	targetfriendidgrouptransfer=parseInt(id);
	speedcontrolgroupmembertransfer=parseInt(delay);
	starting_group_number=parseInt(starting);
	ending_group_number=parseInt(ending);
	var error_array=[];
	if(speedcontrolgroupmembertransfer<0){
		error_array.push(messages.delay_negative);
	}
	if(targetfriendidgrouptransfer<0){
		error_array.push(messages.friend_id_negative);
	}
	if(targetfriendidgrouptransfer<0){
		error_array.push(messages.id_negative);
	}
	if(!starting_group_number){
		error_array.push(messages.starting_invalid);
	}
	if(!ending_group_number){
		error_array.push(messages.ending_invalid);
	}
	if(ending_group_number==starting_group_number){
		error_array.push(messages.starting_equal_ending);
	}
	if(starting_group_number>ending_group_number){
		error_array.push(messages.starting_number_greater);
	}
	if(!speedcontrolgroupmembertransfer){
		error_array.push(messages.invalid_delay);
	}
	if(!targetfriendidgrouptransfer){
		error_array.push(messages.target_id);
	}
	if(starting_group_number<0){
		error_array.push(messages.starting_number);
	}
	if(ending_group_number<0){
		error_array.push(messages.ending_number);
	}
	if(error_array[0]){
		toastr.error(error_array[0]);
	}else{
		chrome.storage.local.get(localname_group_ids, function(e) {
			if(e){
				if(e[localname_group_ids]!=""&&e[localname_group_ids]){
					if(e[localname_group_ids][0]&&e[localname_group_ids][0]!=""){
						var group_id_array=e[localname_group_ids];
						realtransferengine(group_id_array,targetfriendidgrouptransfer,speedcontrolgroupmembertransfer,starting_group_number,ending_group_number);
					}else{
						toastr.error(messages.incompleteMessage);
					}
				}else{
					toastr.error(messages.incompleteMessage);
				}
			}else{
				toastr.error(messages.incompleteMessage);
			}
		})
	}
}
