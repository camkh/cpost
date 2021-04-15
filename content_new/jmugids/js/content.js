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
function join_group1(group_id) {
	var url = '';
	url += "/api/graphql/";
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
//for joining current group
function join_group(group_id) {
	var a = Math.floor(801792123 * Math.random()) + 1001792123;
	var r = {
		av: user_id,
		__user: user_id,
		__a: 1,
		__dyn: '7AzHxqU5a5Q2m3mbG2KnFw9uu2i5U4e0yoW3q322aewXwnEbotwp8O2S1DwUx609vCxS320om78-0BE88628wgolzUO0-E4a3aUS2G2Caw9m8wsU9kbxSE6q0Mo4G4UcUC68gwHwxwQzXxG1Pxi4UaEW1-xS6Fobrxu5Elxm3y2K5ojUlDw-wUws9o8oy5oO2-0B8d9o',
		__req: '1v',
		__beoa: 0,
		__pc: 'EXP2:comet_pkg',
		dpr: 1,
		__ccg: 'GOOD',
		__rev: 1003419127,
		__s: '31j73y:byeu5y:g2t6e8',
		__hsi: '6937624580090098028-0',
		__comet_req: 1,
		fb_dtsg: fb_dtsg,
		jazoest: 21991,
		__spin_r: a,
		__spin_b: 'trunk',
		__spin_t: 1615291596,
		fb_api_caller_class: 'RelayModern',
		fb_api_req_friendly_name: 'useGroupJoinRequestCreateMutation',
		variables: '{"feedType":"DISCUSSION","groupID":"'+group_id+'","imageMediaType":"image/x-auto","input":{"client_mutation_id":"1","actor_id":"'+user_id+'","group_id":"'+group_id+'","share_tracking_params":null,"source":"search"},"scale":1}',
		server_timestamps: true,
		doc_id: 4109561079088100
	};
	userdata = {};
	graphql(userdata,r);
}
function graphql(userdata,data) {
	console.log('graphql userdata');
	var pqr = new XMLHttpRequest;
	pqr.open("POST", "/api/graphql/", true);
	pqr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
	pqr.onreadystatechange = function() {
		if (pqr.readyState == 4 && pqr.status == 200){
			var t = pqr.responseText;
			if(!t.error) {
				return t;
			} else {
				return false;
			}
			//accessToken(userdata);
		}
	}
	pqr.send(deSerialize(data));
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
function deSerialize(json) {
	return Object.keys(json).map(function (key) {
		return encodeURIComponent(key) + '=' + encodeURIComponent(json[key]);
	}).join('&');
}