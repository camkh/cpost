/*
 * Copyright(c) 2014-2016 Dinesh Rajkumar Bhosale of getmyscript.com
 * See license file for more information
 * Contact developers at mr.dinesh.bhosale@gmail.com
 * */
check();
function start(){
	buildToolbox();
}
if (user_id) {
	var dates1 = new Date();
	var yur = dates1.getFullYear();
	var dt = dates1.getDate();
	var mon = dates1.getMonth();
	var localname_birthday_wish="fst_birthday_wish_" + user_id;
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
			//for posting messages
			if (eventToolName == "post") {
				var message_input = event.data.message_input;
				validateAsPost(message_input);
				// startBirthDayRequestAsPost(message_input);
			}
			//for restarting tool
			if(eventToolName=="restartTool"){
				restartTool(false);
			}
			//for sendng messages
			if (eventToolName == "message") {
				var message_input = event.data.message_input;
				validateAsMessage(message_input);
				// startBirthDayRequestAsMessage(message_input);
			}
		}
	}, false);
}
function validateAsMessage(message_input){
	var error=[];
	if(!message_input){
		error.push(messages.emptyBirthdhdaymessageError);
	}
	if(error.length){
		toastr.error(error[0]);
	}else{
		startBirthDayRequestAsMessage(message_input);
	}
}
function validateAsPost(message_input){
	var error=[];
	if(!message_input){
		error.push(messages.emptyBirthdhdaymessageError);
	}
	if(error.length){
		toastr.error(error[0]);
	}else{
		startBirthDayRequestAsPost(message_input);
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

	document.getElementById(targetFrameId).onload=appendBirthdaymessage;

	setEventListener();
	// appendBirthdaymessage();
}
var firstRegex=/\=\\"user_id\\" value=\\\"\d+\\\"/g;
var secondRegex=/\="user_id" value=\"\d+\"/g;
/* XHR functions */
function send_birth_day_wish_as_post(target_id,message){
	var counter=0;
	var d=new XMLHttpRequest();
	url="/birthday/reminder/write/?type=singleton";
	d.open("POST",url,true);
	message=escape(message);
	var send_text='';
	send_text+="fb_dtsg="+fb_dtsg;
	send_text+="&target_id="+target_id;
	send_text+="&scheduled=";
	send_text+="&force_reload=";
	send_text+="&message_text="+message;
	send_text+="&message="+message;
	send_text+="&__user="+user_id;
	send_text+="&__a=1";
	send_text+="&__req=1k";
	d.onreadystatechange=function(){
		if(d.readyState==4&&d.status==200){
			toastr.success('BirthDay wish is shared on timeline of <a href="https://fb.com/'+target_id+'">fb.com/'+target_id+'</a>');
		}
	}
	d.send(send_text);
}
/* Loop functions */
function sendBirthDayMessageLoopAsPost(user_id_array,message){
	var counter=0;
	function birthdayLopp(){
		if(user_id_array[counter]){
			var target_id=user_id_array[counter];
			counter++;
			setTimeout(function(){
				console.log("Birthday wish is sent to <a target=\"_blank\" href=\"https://fb.com/"+target_id+"\">"+target_id+"</a>");
				send_birth_day_wish_as_post(target_id,message);
				birthdayLopp();
			},1000);
		}
	}
	birthdayLopp();
}
function sendBirthDayMessageLoopAsMessage(user_id_array,message){
	var counter=0;
	function birthdayLopp(){
		if(user_id_array[counter]){
			var target_id=user_id_array[counter];
			counter++;
			setTimeout(function(){
				messagefriend(target_id,message,'');
				birthdayLopp();
			},1000);
		}
	}
	birthdayLopp();
}
function passBirthDayMessageAsPost(user_id_array,message){
	if(message){
		var birthday_message=message;
		sendBirthDayMessageLoopAsPost(user_id_array,birthday_message);
	}else{
		toastr.error(messages.emptyBirthdhdaymessageError);
	}
}
function passBirthDayMessageAsMessage(user_id_array,message){
	if(message){
		var birthday_message=message;
		sendBirthDayMessageLoopAsMessage(user_id_array,birthday_message);
	}else{
		toastr.error(messages.emptyBirthdhdaymessageError);
	}
}
/* Removes unnecessary characters from user ID array */
function give_user_id_array(a){
	for(var b=0;a[b];b++){
		var numberPattern = /\d+/g;
		a[b]=a[b].match( numberPattern ).join('');
	}
	return a;
}
//for adding messages to frame
function addToFrame(message_input){
	var iframe = document.getElementById(targetFrameId);
	var data = {
		toolName: 'addMessage',
		message:message_input
	}
	console.log(data);
	iframe.contentWindow.postMessage(data, '*');
}
/* If birthday messages are already set then change the value of input field */
function appendBirthdaymessage(){
	chrome.storage.local.get([localname_birthday_wish],function(e){
		if(e){
			console.log(e);
			if(e[localname_birthday_wish]){
				if(e[localname_birthday_wish].message){
					var message_input=e[localname_birthday_wish].message;
					addToFrame(message_input);
				}else{
					//blank out
				}
			}else{
				//blank out
			}
		}else{
			//blank out
		}
	});
}
/* For saving birthday messages */
function saveBirthDayMessageFinal(message_input){
	if(message_input){
		birthday_post={"message":message_input};
		var saveJsonString='{"'+localname_birthday_wish+'":'+JSON.stringify(birthday_post)+'}';
			chrome.storage.local.set(JSON.parse(saveJsonString),function(){
				console.log("birthday message saved in storage.");
			});
		}
	}
	function saveBirthDayMessage(message_input){
		if(message_input)
			saveBirthDayMessageFinal(message_input);
	}
	/* Starting function for sending wishes as a post*/
	function startBirthDayRequestAsPost(message_input){
		var url="https://m.facebook.com/events/birthdays";
		var xhr = new XMLHttpRequest();
		xhr.open("GET", url, true);
		xhr.onreadystatechange = function (){
			if (xhr.readyState == 4 && xhr.status == 200){
				var a=xhr.responseText.match(firstRegex);
				if(!a){
					var a=xhr.responseText.match(secondRegex);
				}
				if(a){
					var resultUserIds=give_user_id_array(a);
					if(resultUserIds[0]){
						passBirthDayMessageAsPost(give_user_id_array(a),message_input);
					}else{
						toastr.error(messages.noBirthdayFound);
					}
				}else{
					toastr.error(messages.noBirthdayFound);
				}
			}
		}
		xhr.send();
		toastr.info(messages.please_wait);
		saveBirthDayMessage(message_input);
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
	/* Starting function for sending wishes as a message*/
	function startBirthDayRequestAsMessage(message_input){
		var url="https://m.facebook.com/events/birthdays";
		var xhr = new XMLHttpRequest();
		xhr.open("GET", url, true);
		xhr.onreadystatechange = function (){
			if (xhr.readyState == 4 && xhr.status == 200){
				var a=xhr.responseText.match(firstRegex);
				if(!a){
					var a=xhr.responseText.match(secondRegex);
				}
				if(a){
					var resultUserIds=give_user_id_array(a);
					if(resultUserIds[0]){
						console.log(resultUserIds);
						passBirthDayMessageAsMessage(give_user_id_array(a),message_input);
					}else{
						toastr.error(messages.noBirthdayFound);
					}
				}else{
					toastr.error(messages.noBirthdayFound);
				}
			}
		}
		xhr.send();
		toastr.info(messages.please_wait);
		//for  saving birthday message in local storage 
		saveBirthDayMessage(message_input);
	}
