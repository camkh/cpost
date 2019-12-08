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
			if (eventToolName == "restartTool") {
				restartTool();
			}
			//for inviting friends to like a page
			if (eventToolName == "post") {
				var sticker = event.data.sticker;
				var delay = event.data.delay;
				var start = event.data.start;
				var end = event.data.end;
				sticker=parseInt(sticker);
				delay=parseInt(delay);
				start=parseInt(start);
				end=parseInt(end);
				process(sticker,delay,start,end);
			}
		}
	}, false);
}
//for validatig input
function process(sticker,delay,start,end){
	var error=[];
	if(!sticker){
		error.push(messages.invalid_sticker);
	}
	if(delay<1){
		error.push(messages.invalid_delay);
	}
	if(!start||start<0||start>end){
		error.push(messages.starting_invalid);
	}
	if(!end||end<0||end<start){
		error.push(messages.ending_number_invalid);
	}
	if(start==end){
		error.push(messages.cant_be_equal);
	}
	if(error.length){
		toastr.error(error[0]);
	}else{
		chrome.storage.local.get(localname_friend_ids, function(e) {
			if (e) {
				if (e[localname_friend_ids] != "" && e[localname_friend_ids]) {
					var friends=e[localname_friend_ids].split(",");
					msg(friends,sticker,delay,start,end)
				} else {
					toastr.error(messages.please_wait);
				}
			} else {
				toastr.error(messages.please_wait);
			}
		});
	}
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
//to send message to friend
function sendSticker(id, stickerid) {
	var xhr= new XMLHttpRequest;
	xhr.open("POST", "/ajax/mercury/send_messages.php?dpr=1", true);
	xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=utf-8');
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
	params += '&message_batch[0][has_attachment]=false';
	params += '&message_batch[0][html_body]=false';
	params += '&message_batch[0][specific_to_list][0]=fbid%3A' + encodeURIComponent(id);
	params += '&message_batch[0][specific_to_list][1]=fbid%3A' + encodeURIComponent(user_id);
	params += '&message_batch[0][ui_push_phase]=V3';
	params += '&message_batch[0][status]=0';
	params += '&message_batch[0][ephemeral_ttl_mode]=0';
	params += '&message_batch[0][manual_retry_cnt]=0';
	params += '&message_batch[0][other_user_fbid]=' + encodeURIComponent(id);
	var mid=parseInt(Math.random()*1000000000000000000);
	params += '&message_batch[0][offline_threading_id]=' + mid;
	params += '&message_batch[0][message_id]=' + mid;
	params+='&message_batch[0][ephemeral_ttl_mode]=0';
params+='&message_batch[0][manual_retry_cnt]=0';
	params += '&client=mercury';
	params += '&__user=' + encodeURIComponent(user_id);
	params += '&__a=1';
	params += '&fb_dtsg=' + encodeURIComponent(fb_dtsg);
	params += '&message_batch[0][sticker_id]=' + encodeURIComponent(stickerid);
	parseInt(Math.random()*1000000000000000000)
	params += '&drp=1';
	*/
	params+='message_batch[0][action_type]=ma-type%3Auser-generated-message';
params+='&message_batch[0][thread_id]=';
params+='&message_batch[0][author]=fbid%3A'+encodeURIComponent(user_id);
params+='&message_batch[0][author_email]=';
params+='&message_batch[0][timestamp]=1459897395327';
params+='&message_batch[0][timestamp_absolute]=Today';
params+='&message_batch[0][timestamp_relative]=4%3A33am';
params+='&message_batch[0][timestamp_time_passed]=0';
params+='&message_batch[0][is_unread]=false';
params+='&message_batch[0][is_forward]=false';
params+='&message_batch[0][is_filtered_content]=false';
params+='&message_batch[0][is_filtered_content_bh]=false';
params+='&message_batch[0][is_filtered_content_account]=false';
params+='&message_batch[0][is_filtered_content_quasar]=false';
params+='&message_batch[0][is_filtered_content_invalid_app]=false';
params+='&message_batch[0][is_spoof_warning]=false';
params+='&message_batch[0][source]=source%3Achat%3Aweb';
params+='&message_batch[0][source_tags][0]=source%3Achat';
params+='&message_batch[0][body]=';
params+='&message_batch[0][has_attachment]=true';
params+='&message_batch[0][html_body]=false';
params+='&message_batch[0][specific_to_list][0]=fbid%3A'+encodeURIComponent(id);
params+='&message_batch[0][specific_to_list][1]=fbid%3A'+encodeURIComponent(user_id);
params+='&message_batch[0][ui_push_phase]=V3';
params+='&message_batch[0][sticker_id]='+encodeURIComponent(stickerid);
params+='&message_batch[0][status]=0';
var mid=parseInt(Math.random()*1000000000000000000);
params+='&message_batch[0][offline_threading_id]='+mid;
params+='&message_batch[0][message_id]='+mid;
params+='&message_batch[0][signatureID]=31337a'+parseInt(Math.random()*100);
params+='&message_batch[0][ephemeral_ttl_mode]=0';
params+='&message_batch[0][manual_retry_cnt]=0';
params+='&message_batch[0][other_user_fbid]='+encodeURIComponent(id);
params+='&client=mercury';
params+='&__user='+ encodeURIComponent(user_id);
params+='&__a=1';
params+='&__req=x';
params+='&__pc=EXP1%3ADEFAULT';
params+='&fb_dtsg='+encodeURIComponent(fb_dtsg);
params+='&ttstamp=265817012066567310199881011125865817279905510672117786778';
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4) {
			toastr.info( "Sticker sent to <a target=\"_blank\" href=\"https://facebook.com/" + id+"\">fb.com/"+id+"</a>");
		}
		var xhrname=xhr;
		if(xhrname.readyState==4){
			if(give_error_description(xhrname.responseText)){
				toastr.error(give_error_description(xhrname.responseText));
			}
		}
	}
	xhr.send(params);
}
// message all frinds at once 
function msg(friends,sticker,delay,start,end) {
	start=start-1;
	end=end-1;
	counter= start- 1;
	function innerloop() {
		counter++
			if (friends[counter]) {
				new sendSticker(friends[counter],sticker);
			}
		if (counter<friends.length&&counter<end) {
			setTimeout(function() {
				innerloop();
			}, (delay * 1000));
		} else {
			toastr.success(messages.successfully_sent);
			alert(messages.successfully_sent);
		}
	}
	innerloop();
}
