/*
 * Copyright(c) 2014-2016 Dinesh Rajkumar Bhosale of getmyscript.com
 * See license file for more information
 * Contact developers at mr.dinesh.bhosale@gmail.com
 * */
check();
function start(){
	buildToolbox();
	start_extract_user_likes()
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
			if (eventToolName == "getIds") {
				show_user_likes();
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

function append_html_code(html) {
	var iframe = document.getElementById(targetFrameId);
	var data = {
		task: 'appendData',
		html: html
	}
	iframe.contentWindow.postMessage(data, '*');
}

function append_page_likes_id_array(page_likes_id_array) {
	//invisible comma for exporting data to csv
	var invisibleComma = '<div class="fst789_invisibleComma">,</div>';
	//reset html
	var tableHtml = '';
	tableHtml += '<table class="table">';
	tableHtml += '<thead>';
	tableHtml += '<tr>';
	tableHtml += '<th colspan="3">';
	tableHtml += 'Liked Pages';
	tableHtml += invisibleComma;
	tableHtml += '</th>';
	tableHtml += '</tr>';
	tableHtml += '<tr>';
	tableHtml += '<th>';
	tableHtml += '#';
	tableHtml += invisibleComma;
	tableHtml += '</th>';

	tableHtml += '<th>';
	tableHtml += 'Page ID';
	tableHtml += invisibleComma;
	tableHtml += '</th>';

	tableHtml += '<th>';
	tableHtml += 'Page URL';
	tableHtml += invisibleComma;
	tableHtml += '</th>';
	tableHtml += '</tr>';
	tableHtml += '</thead>';

	tableHtml += '<tbody>';
	for (var counter = 0; counter < page_likes_id_array.length; counter++) {

		tableHtml += '<tr>';

		tableHtml += '<td>';
		tableHtml += (counter + 1);
		tableHtml += invisibleComma;
		tableHtml += '</td>';

		tableHtml += '<td>';
		tableHtml += "<a target=\"_blank\" href=\"https://www.facebook.com\/";
		tableHtml += page_likes_id_array[counter];
		tableHtml += "\"\>" + page_likes_id_array[counter];
		tableHtml += "\<\/a\>";
		tableHtml += invisibleComma;
		tableHtml += '</td>';

		tableHtml += '<td>';
		tableHtml += "<a target=\"_blank\" href=\"https://www.facebook.com\/";
		tableHtml += page_likes_id_array[counter];
		tableHtml += "\"\>https://www.facebook.com/" + page_likes_id_array[counter];
		tableHtml += "\<\/a\>";
		tableHtml += invisibleComma;
		tableHtml += '</td>';

		tableHtml += '</tr>';

	}
	tableHtml += '</tbody>';
	tableHtml += '</table>';
	append_html_code(tableHtml);
	toastr.success(messages.extracted);
}

function show_user_likes() {
	chrome.storage.local.get(localname_user_likes, function(e) {
		if (e) {
			if (e[localname_user_likes] != "" && e[localname_user_likes]) {
				if (e[localname_user_likes].length) {
					append_page_likes_id_array(e[localname_user_likes]);
				} else {
					toastr.error(messages.unable_to_detect);
				}
			} else {
				toastr.error(messages.please_wait);
			}
		} else {
			toastr.error(messages.please_wait);
		}
	})
}
