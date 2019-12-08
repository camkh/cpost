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
			if (eventToolName == "join") {
				var idlist = event.data.idlist;
				var delay = event.data.delay;
				delay=parseInt(delay);
				process(idlist,delay);
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
function validate_input_div_string(gid){
	var is_valid=true;
	if(gid.length){
		for(var tempvar=0;gid[tempvar];tempvar++){
			if(isNaN(parseInt(gid[tempvar]))){
				is_valid=false;
				break;
			}
		}
	}else{
		is_valid=false;
	}
	return is_valid;
}
function process(idlist,delay){
	var error=[];
	if(!idlist){
		error.push(messages.invalid_input);
	}
	if(delay<1){
		error.push(messages.invalid_delay);
	}
	if(idlist){
		if(idlist.split('\n').length){
			var gid=idlist.split('\n');
		}
	}
	if(gid){
		if(!gid.length){
			error.push(messages.unable_to_get_gid);
		}
	}else{
		error.push(messages.invalid_input);
	}
	if(gid){
		if(!validate_input_div_string(gid)){
			error.push(messages.invalid_gid);
		}
	}
	if(error.length){
		toastr.error(error[0]);
	}else{
		join_group_id_array(gid,delay);
	}
}
//for joining current group
function join_group(group_id) {
	var url = '';
	url += "/ajax/groups/membership/r2j.php";
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	var sendcode = '__user=' + user_id
	sendcode += '&__a=1';
	sendcode += '&fb_dtsg=' + fb_dtsg;
	sendcode += '&group_id=' + group_id;
	sendcode += '&__req=46';
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4 && xhr.status == 200) {
			var xhrname=xhr;
			if(xhrname.readyState==4){
				if(give_error_description(xhrname.responseText)){
					toastr.error(give_error_description(xhrname.responseText));
				}else{
					toastr.info(messages.req_sent);
				}
			}
		}
	};
	xhr.send(sendcode);
}
function join_group_id_array(group_id_array,delay_time){
	var starting_group_number=0;
	function send_group_join_request(){
		if(group_id_array[starting_group_number]){
			join_group(group_id_array[starting_group_number]);
			starting_group_number++;
			setTimeout(function(){
				send_group_join_request();
			},(delay_time*1000));
		}else{
			toastr.success(messages.request_sent);
			alert(messages.request_sent);
		}
	}
	send_group_join_request();
}
