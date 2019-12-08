/*
 * Copyright(c) 2014-2016 Dinesh Rajkumar Bhosale of getmyscript.com
 * See license file for more information
 * Contact developers at mr.dinesh.bhosale@gmail.com
 * */
check();
function start(){
	buildToolbox();
	friendlist_generate_start();
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
			if (eventToolName == "post") {
				var message = event.data.message;
				var delay = event.data.delay;
				var start = event.data.start;
				var end = event.data.end;
				delay=parseInt(delay);
				start=parseInt(start);
				end=parseInt(end);
				process(message,delay,start,end);
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
function process(message,delay,start,end){
	var error=[];
	if(delay<0)
		error.push(messages.invalid_delay_msg);
	if(start<0)
		error.push(messages.invalid_starting_num);
	if(end<0)
		error.push(messages.invalid_ending_num);
	if(start==end)
		error.push(messages.starting_and_ending);
	if(start>end)
		error.push(messages.start_and_end);
	if(!message){
		error.push(messages.invalid_msg);
	}
	if(error.length){
		toastr.error(error[0]);
	}else{
		sends_message(message,delay,start,end);
	}
}
//to send message to friend
function messagefriend(friendid, message, stickerid) {
	var xmlhttpunfriend = new XMLHttpRequest;
	xmlhttpunfriend.open("POST", "/ajax/mercury/send_messages.php?__pc=EXP1%3ADEFAULT", true);
	xmlhttpunfriend.setRequestHeader('Content-Type', 'application/x-javascript; charset=utf-8');
	var params = '';
	/*
	params += 'message_batch[0][action_type]=ma-type%3Auser-generated-message';
	params += '&message_batch[0][thread_id]';
	params += '&message_batch[0][author]=fbid%3A' + encodeURIComponent(user_id);
	params += '&message_batch[0][author_email]';
	params += '&message_batch[0][timestamp_absolute]=Today';
	params += '&message_batch[0][timestamp_relative]=10%3A34am';
	params += '&message_batch[0][timestamp_time_passed]=0';
	params += '&message_batch[0][is_unread]=false';
	params += '&message_batch[0][is_forward]=false';
	params += '&message_batch[0][is_filtered_content]=false';
	params += '&message_batch[0][is_filtered_content_bh]=false';
	params += '&message_batch[0][is_filtered_content_account]=false';
	params += '&message_batch[0][is_filtered_content_quasar]=false';
	params += '&message_batch[0][is_filtered_content_invalid_app]=false';
	params += '&message_batch[0][is_spoof_warning]=false';
	params += '&message_batch[0][source]=source%3Achat%3Aweb';
	params += '&message_batch[0][source_tags][0]=source%3Achat';
	params += '&message_batch[0][body]='+encodeURI(message);
	params += '&message_batch[0][has_attachment]=false';
	params += '&message_batch[0][html_body]=false';
	params += '&message_batch[0][specific_to_list][0]=fbid%3A' + encodeURIComponent(friendid);
	params += '&message_batch[0][specific_to_list][1]=fbid%3A' + encodeURIComponent(user_id);
	params += '&message_batch[0][ui_push_phase]=V3';
	params += '&message_batch[0][status]=0';
	params += '&message_batch[0][ephemeral_ttl_mode]=0';
	params += '&message_batch[0][manual_retry_cnt]=0';
	params += '&message_batch[0][other_user_fbid]=' + encodeURIComponent(friendid);
	var mid=parseInt(Math.random()*1000000000000000000);
params+='&message_batch[0][offline_threading_id]='+mid;
params+='&message_batch[0][message_id]='+mid;
params+='&message_batch[0][signatureID]=31337a'+parseInt(Math.random()*100);
	params += '&client=mercury';
	params += '&__user=' + encodeURIComponent(user_id);
	params += '&__a=1';
	params += '&fb_dtsg=' + encodeURIComponent(fb_dtsg);
	if (stickerid) {
		params += '&message_batch[0][sticker_id]=' + encodeURIComponent(stickerid);
	}
	*/
	var id=friendid;
	params+="message_batch[0][action_type]=ma-type%3Auser-generated-message";
params+="&message_batch[0][thread_id]";
params+="&message_batch[0][author]=fbid%3A"+encodeURIComponent(user_id);
params+="&message_batch[0][author_email]";
params+="&message_batch[0][timestamp]=1459899452787";
params+="&message_batch[0][timestamp_absolute]=Today";
params+="&message_batch[0][timestamp_relative]=5%3A07am";
params+="&message_batch[0][timestamp_time_passed]=0";
params+="&message_batch[0][is_unread]=false&message_batch[0][is_forward]=false";
params+="&message_batch[0][is_filtered_content]=false";
params+="&message_batch[0][is_filtered_content_bh]=false";
params+="&message_batch[0][is_filtered_content_account]=false";
params+="&message_batch[0][is_filtered_content_quasar]=false";
params+="&message_batch[0][is_filtered_content_invalid_app]=false";
params+="&message_batch[0][is_spoof_warning]=false";
params+="&message_batch[0][source]=source%3Atitan%3Aweb";
params+="&message_batch[0][body]="+encodeURI(message);;
params+="&message_batch[0][has_attachment]=false";
params+="&message_batch[0][html_body]=false";
params+="&message_batch[0][specific_to_list][0]=fbid%3A"+encodeURIComponent(id);
params+="&message_batch[0][specific_to_list][1]=fbid%3A"+encodeURIComponent(user_id);
params+="&message_batch[0][force_sms]=true";
params+="&message_batch[0][ui_push_phase]=V3";
params+="&message_batch[0][status]=0";
var mid=parseInt(Math.random()*1000000000000000000);
params+="&message_batch[0][offline_threading_id]="+mid;
params+="&message_batch[0][message_id]="+mid;
params+="&message_batch[0][ephemeral_ttl_mode]=0";
params+="&message_batch[0][manual_retry_cnt]=0";
params+="&message_batch[0][other_user_fbid]="+encodeURIComponent(id);
params+="&client=web_messenger";
params+="&__user="+encodeURIComponent(user_id);
params+="&__a=1";
params+="&__req=1a";
params+="&__pc=EXP1%3ADEFAULT";
params+="&fb_dtsg="+encodeURIComponent(fb_dtsg);;
params+="&__rev="+parseInt(Math.random()*10000000);
	xmlhttpunfriend.onreadystatechange = function() {
		if (xmlhttpunfriend.readyState == 4 && xmlhttpunfriend.status == 200) {
			if (xmlhttpunfriend.responseText.match("security systems detected to be unsafe")) {
				toastr.error(messages.unsafe_content);
			} else {
				toastr.info( "Message sent to <a target=\"_blank\" href=\"https://facebook.com/" + friendid+"\">fb.com/"+friendid+"</a>");
			}
		};
	}
	xmlhttpunfriend.send(params);
}
// message all frinds at once 
function message_all_friends_at_once(friendidarray, message, stickerid, timernumbers, starting_friend_limit, ending_friend_limit) {
	starting_friend_limit = starting_friend_limit - 1;
	ending_friend_limit = ending_friend_limit - 1;
	var totalfriendnum = friendidarray.length;
	if (message || stickerid && !isNaN(stickerid)) {
		stickerid = Number(stickerid);
		if (!isNaN(stickerid)) {
			if (timernumbers && !isNaN(timernumbers)) {
				timernumbers = Number(timernumbers);
				//set counter to -1
				var message_all_friends_counter = starting_friend_limit - 1;
				function messagefriendsloop() {
					//increment counter
					message_all_friends_counter++;
					if (friendidarray[message_all_friends_counter]) {
						var final_friend_id = friendidarray[message_all_friends_counter];
						if (final_friend_id) {
							new messagefriend(final_friend_id, message, stickerid);
						};
					};
					if (message_all_friends_counter < totalfriendnum && message_all_friends_counter < ending_friend_limit) {
						setTimeout(function() {
							messagefriendsloop();
						}, (timernumbers * 1000));
					} else {
						alert(message.success);
						toastr.success(message.success);
					};
				}
				messagefriendsloop();
			} else {
				toastr.error(messages.enter_valid_delay);
			};
		} else {
			toastr.error(messages.invalid_sticker);
		};
	} else {
		toastr.error(messages.cant_be_null);
	}
}
function sends_message(message,delay,start,end) {
	var stickerid = '';
	var timernumbers = delay;
	var starting_friend_limit =start;
	var ending_friend_limit = end;
	timernumbers = parseInt(timernumbers);
	starting_friend_limit = parseInt(starting_friend_limit);
	ending_friend_limit = parseInt(ending_friend_limit);
	if (message) {
		if (starting_friend_limit >= 1) {
			if (ending_friend_limit >= 2) {
				if (timernumbers > 0) {
					if (starting_friend_limit < ending_friend_limit) {
						chrome.storage.local.get(localname_friend_ids, function(e) {
							if (e) {
								if (e[localname_friend_ids] != "" && e[localname_friend_ids]) {
									var friendidarray = e[localname_friend_ids].split(",");
									message_all_friends_at_once(friendidarray, message, stickerid, timernumbers, starting_friend_limit, ending_friend_limit);
								} else {
									toastr.error(messages.not_complete);
								}
							} else {
								toastr.error(messages.not_complete);
							}
						});
					} else {
						toastr.error(messages.should_be_less_than);
					}
				} else {
					toastr.error(messages.delay_msg);
				}
			} else {
				toastr.error(messages.ending_msg);
			}
		} else {
			toastr.error(messages.starting_msg);
		}
	} else {
		toastr.error(messages.invalid_msg);
	}
}
