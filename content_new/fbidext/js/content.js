/*
 * Copyright(c) 2014-2016 Dinesh Rajkumar Bhosale of getmyscript.com
 * See license file for more information
 * Contact developers at mr.dinesh.bhosale@gmail.com
 * */
check();
function start() {
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
//function for setting event listeners
function setEventListener() {
	addEventListener("message", function(event) {
		if (event.origin + "/" == chrome.extension.getURL("")) {
			var eventToolName = event.data.name;
			console.log('event tool name is ' + eventToolName);
			if (event.data.data) {
				var eventData = event.data.data;
				console.log(eventData);
			}
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
			//for extracting Facebook IDs
			if (eventToolName == "extractFacebookIds") {
				var url = event.data.url;
				extractId(url);
			}
			//for restarting tool
			if (eventToolName == "restartTool") {
				var newTab=false;
				restartTool(newTab);
			}
			//for restarting tool
			if(eventToolName=="restartTool"){
				restartTool(false);
			}
			//showing messages
			if (eventToolName == "showMessage") {
				var message = '';
				var messageType = '';
				var title = '';
				message = event.data.message;
				if (event.data.messageType)
					messageType = event.data.messageType;
				if (event.data.title)
					title = event.data.title;
				//showing message
				toastr[messageType](message, title);
			}
		}
	}, false);
}
//for adding UI components to DOM
function buildToolbox() {
	//adding stylesheet for to dom
	var cssURL = chrome.extension.getURL('/content_new/' + dirName + '/css/content.css');
	var styleElem = document.createElement('link');
	styleElem.setAttribute('href', cssURL);
	styleElem.setAttribute('rel', 'stylesheet');
	styleElem.setAttribute('type', 'text/css');
	document.body.appendChild(styleElem);
	//adding iframe to dom
	var frameURL = chrome.extension.getURL('/content_new/' + dirName + '/html/frame.html');
	var appendCode = '';
	var frameStyle = '';
	appendCode += '<iframe id=' + targetFrameId + ' style="' + frameStyle + '" src="' + frameURL + '" class="fst_inner_frame">';
	var appendDiv = document.createElement('div');
	appendDiv.innerHTML = appendCode;
	appendDiv.setAttribute('class', 'fst_fbvid_container fst_container');
	appendDiv.setAttribute('id', targetDivId);
	document.body.appendChild(appendDiv);
	setEventListener();
}
/*
 *Functions given below does actual extraction process
 */
function extractId(url) {
	facebook_id_extractor_validate_input(url);
}

function append_html_code(title, result_id) {
	var iframe = document.getElementById(targetFrameId);
	var data = {
		task: 'appendData',
		title: title,
		result_id: result_id
	}
	iframe.contentWindow.postMessage(data, '*');
}

function extract_page_id(page_id) {
	if (!isNaN(page_id)) {
		console.log("page id=" + page_id);
		title = "Page ID";
		append_html_code(title, page_id);
	} else {
		toastr.error(messages.url_is_tampered);
	}
}

function extract_post_id(post_id) {
	if (!isNaN(post_id)) {
		console.log("post_id=" + post_id);
		title = "Post id";
		append_html_code(title, post_id);
	} else {
		toastr.error(messages.url_is_tampered);
	}
}

function event_post_id_append(post_id) {
	if (!isNaN(post_id)) {
		console.log("event_post_id=" + post_id);
		title = "Event post id";
		append_html_code(title, post_id);
	} else {
		toastr.error(messages.url_is_tampered);
	}
}

function group_post_id_append(post_id) {
	if (!isNaN(post_id)) {
		console.log("group_post_id=" + post_id);
		title = "Group post id";
		append_html_code(title, post_id);
	} else {
		toastr.error(messages.url_is_tampered);
	}
}

function id_extract_event(account_username) {
	if (!isNaN(account_username)) {
		console.log("Event id is:" + account_username);
		title = "Event ID";
		append_html_code(title, account_username);
	} else {
		toastr.error(messages.url_is_tampered);
	}
}

function extract_video_id(video_id) {
	if (!isNaN(video_id)) {
		console.log("video id is=" + video_id);
		title = "Post ID / Video id";
		append_html_code(title, video_id);
	}
}

function id_extract_group(account_username) {
	if (isNaN(account_username)) {
		pageurl = "https://mbasic.facebook.com/groups/" + account_username;
		dinesh = new XMLHttpRequest();
		dinesh.open("GET", pageurl, true);
		dinesh.onreadystatechange = function() {
			if (dinesh.readyState == 4 && dinesh.status == 200) {
				if (dinesh.responseText.match(/\/groups\/\d+/g)) {
					var responsa = dinesh.responseText.match(/\/groups\/\d+/g)[0];
					responsa = responsa.replace("\/groups\/", "");
					title = "Group ID";
					console.log(title + "=" + responsa);
					append_html_code(title, responsa);
				} else {
					var message = 'Unable to find Group ID';
					toastr.error(message);
				}
			}
		}
		dinesh.send();
	} else {
		title = "Group ID";
		console.log(title + "=" + account_username);
		append_html_code(title, account_username);
	}
}

function id_extract_account(account_username) {
	function error_msgs() {
		toastr.error("Unable to retrieve account ID");
	}
	if (isNaN(account_username)) {
		pageurl = "/" + account_username;
		dinesh = new XMLHttpRequest();
		dinesh.open("GET", pageurl, true);
		dinesh.onreadystatechange = function() {
			if (dinesh.readyState == 4 && dinesh.status == 200) {
				var responsa = dinesh.responseText;
				if (responsa.match(/fb\:\/\/page\/\?id=\d+/ig)) {
					var page_id = responsa.match(/fb\:\/\/page\/\?id=\d+/ig);
					var page_id = page_id[0].replace(/fb\:\/\/page\/\?id\=/ig, "")
						page_id = parseInt(page_id);
					if (!isNaN(page_id)) {
						title = "Page ID";
						console.log(title + "=" + page_id);
						append_html_code(title, page_id);
					}
				}
				if (responsa.match(/"profile_id":\d+/g)) {
					var account_id = responsa.match(/"profile_id":\d+/g)[0];
					account_id = parseInt(account_id.replace('"profile_id":', ""));
					if (!isNaN(account_id)) {
						title = "Account ID";
						console.log(title + "=" + account_id);
						append_html_code(title, account_id);
					}
				}
			}
		}
		dinesh.send();
	} else {
		title = "Account ID:";
		append_html_code(title, account_username);
	}
}

function extraction_process_url_params(url_array_collect) {
	if (url_array_collect[2]) {
		if (url_array_collect[2] == "permalink") {
			if (url_array_collect[0] == "groups") {
				id_extract_group(url_array_collect[1]);
				if (!isNaN(url_array_collect[3])) {
					group_post_id_append(url_array_collect[3]);
				}
			}
			if (url_array_collect[0] == "events") {
				id_extract_event(url_array_collect[1]);
				if (!isNaN(url_array_collect[3])) {
					event_post_id_append(url_array_collect[3]);
				}
			}
		}
		if (url_array_collect[1] == "videos") {
			id_extract_account(url_array_collect[0]);
			if (!isNaN(url_array_collect[2])) {
				extract_video_id(url_array_collect[2]);
			} else if (!isNaN(url_array_collect[3])) {
				extract_video_id(url_array_collect[3]);
			}
		}
		if (url_array_collect[0] == "pages") {
			if (!isNaN(url_array_collect[2])) {
				extract_page_id(url_array_collect[2]);
			}
		}
		if (url_array_collect[1] == "posts") {
			if (url_array_collect[0]) {
				id_extract_account(url_array_collect[0]);
			}
			if (!isNaN(url_array_collect[2])) {
				extract_post_id(url_array_collect[2]);
			}
		}
	} else {
		if (url_array_collect[1]) {
			if (url_array_collect[0] == "groups") {
				id_extract_group(url_array_collect[1]);
			}
			if (url_array_collect[0] == "events") {
				id_extract_event(url_array_collect[1]);
			}
		} else {
			id_extract_account(url_array_collect[0]);
		}
	}
}

function getParam(sname, location_search) {
	if (location_search && sname) {
		var params = location_search.substr(location_search.indexOf("?") + 1);
		var sval = "";
		params = params.split("&");
		// split param and value into individual pieces
		for (var i = 0; i < params.length; i++) {
			temp = params[i].split("=");
			if ([temp[0]] == sname) { sval = temp[1]; }
		}
		return sval;
	} else {
		return '';
	}
}

function resetHtmlInsideFrame() {
	var iframe = document.getElementById(targetFrameId);
	var data = {
		task: 'clearOldData',
	}
	iframe.contentWindow.postMessage(data, '*');
}

function processUrlData(original_url){
	var original_url_split=original_url.split("/");
	var url= original_url;
	var url_array_collect=[];
	url=url.replace("https\:\/\/","").replace("http\:\/\/","").replace("\:\/\/","");
	url=url.split("\/");
	for(temp_var=1;url[temp_var];temp_var++){
		console.log("url["+temp_var+"]="+url[temp_var].split("\?")[0]);
		if(url[temp_var].split("\?")[0]&&url[temp_var].split("\?")[0]!=""){
			url_array_collect.push(url[temp_var].split("\?")[0]);
		}
		if(url[temp_var].split("\?")[1]&&url[temp_var].split("\?")[1]!=""){
			var location_search="\?"+url[temp_var].split("\?")[1];
		}
	}
	//extract post if and user id from https://www.facebook.com/photo.php?fbid=1812465888979185&set=a.1410537122505399.1073741829.100006473731931&type=1&theater
	var parmData={};
	parmData.post_id=getParam('fbid',location_search);
	parmData.set=getParam('set',location_search);
	parmData.story_fbid=getParam('story_fbid',location_search);
	parmData.account_id=getParam('id',location_search);
	console.log("original_url");
	console.log(original_url);
	console.log("original_url_split");
	console.log(original_url_split);
	console.log("url_array_collect");
	console.log(url_array_collect);
	console.log("url");
	console.log(url);
	console.log("location_search");
	console.log(location_search);
	console.log("parmData");
	console.log(parmData)
		// block that uses parms start
		if(parmData.account_id){
			if(!isNaN(parmData.account_id)){
				title="Account ID";
				append_html_code(title,parmData.account_id); 
			}
		}
	if(parmData.story_fbid){
		if(!isNaN(parmData.story_fbid)){
			title="Post ID";
			append_html_code(title,parmData.story_fbid); 
		}
	}
	if(parmData.post_id!=""){
		var photo_parmDatapost_id=parmData.post_id;
		if(!isNaN(photo_parmDatapost_id)){
			title="Post ID / Photo ID";
			append_html_code(title,photo_parmDatapost_id); 
		}
	}
	if(parmData.set){
		parmData.set=parmData.set.split(".");
		if(parmData.set){
			var account_id=parmData.set[3];
			if(!isNaN(account_id)){
				title="Account ID";
				append_html_code(title,account_id); 
			}
		}
	}
	// block that uses parms ends
	//to detect facebook notes
	if(url[1]=="notes"){
		if(!isNaN(url[4])){
			title="Note ID";
			append_html_code(title,url[4]); 
		}
		if(!isNaN(url[3])){
			title="Note ID";
			append_html_code(title,url[3]); 
		}
	}
	//extract account id from https://www.facebook.com/profile.php?id=100009125604149
	if(original_url.match("profile\.php")){
		var account_id=getParam('id',location_search);
		if(!isNaN(account_id)){
			append_html_code("User ID",account_id); 
		}
	}
	if(original_url.match("\/photos\/")){
		splited=original_url.split("/");
		photo_id=splited[splited.length-2];
		if(!isNaN(photo_id)){
			title="Photo ID";
			append_html_code(title,photo_id); 
		}
		// for getting account ID
		if(!isNaN(parseInt(original_url_split[3]))){
			append_html_code("Account ID",original_url_split[3]);
		}else{
			//extract ID from account username
			id_extract_account(original_url_split[3]);
		}
	}
	extraction_process_url_params(url_array_collect);
}

function facebook_id_extractor_validate_input(original_url) {
	var url=original_url;
	var error=[];
	var original_url_split=original_url.split("/");
	toastr.info(messages.please_wait);
	//reset html inside frame
	resetHtmlInsideFrame();
	if (is_valid_url(url)){
		url=url.replace("https\:\/\/","").replace("http\:\/\/","").replace("\:\/\/","");
		url=url.split("\/");
		if(!url[0].match(".facebook.com")){
			error.push(messages.invalid_url);
		}
	} else {
		error.push(messages.enter_valid_url);
	}
	if(error.length){
		toastr.error(error[0]);
	}else{
		processUrlData(original_url);
	}
}
