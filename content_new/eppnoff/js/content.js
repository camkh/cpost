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
			if (event.data.data) {
				var eventData = event.data.data;
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
				start_phone_number_extraction();
			}
			//for restarting tool
			if(eventToolName=="restartTool"){
				restartTool(false);
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
var extract_phone_numbers_title = "Extract Phone Numbers";
function appendNum(counter, phone, id, username) {
	var invisibleComma = '<div class="fst789_invisibleComma">,</div>';

	var id = id;
	var appendString = '';
	appendString += '<tr>';

	appendString += '<td>';
	appendString += phone;
	appendString += invisibleComma;
	appendString += '</td>';

	appendString += '<td>';
	appendString += "<a target=\"_blank\" href=\"https://www.facebook.com\/";
	appendString += id;
	appendString += "\"\>" + id;
	appendString += "\<\/a\>";
	appendString += invisibleComma;
	appendString += '</td>';

	appendString += '<td>';
	appendString += "<a target=\"_blank\" href=\"https://www.facebook.com\/";
	appendString += username;
	appendString += "\"\>" + username;
	appendString += "\<\/a\>";
	appendString += invisibleComma;
	appendString += '</td>';

	appendString += '<td>';
	appendString += "<a target=\"_blank\" href=\"https://www.facebook.com\/";
	appendString += username;
	appendString += "\"\>https://www.facebook.com/" + username;
	appendString += "\<\/a\>";
	appendString += invisibleComma;
	appendString += '</td>';

	appendString += '</tr>';
	// $("#"+targetAppendId).append(appendString);
	append_html_code(appendString);
}
function get_html_code(id, url, index,username) {
	var http4 = new XMLHttpRequest;
	http4.open("GET", url, true);
	http4.onreadystatechange = function() {
		if (http4.readyState == 4) {
			var match = http4.responseText.match(/\>Phones\<\/span\>\<\/div\>\<div\>\<span dir\=\"ltr\"\>.+?\<\/span\>/gi);
			if(match){
				var num=match[0].replace("\>Phones\<\/span\>\<\/div\>\<div\>\<span dir\=\"ltr\"\>","").replace("\<\/span\>","");
				var message='Phone number found for <a target="_blank" href="https://fb.com/'+id+'">fb.com/'+id+'</a>';
				toastr.success(message);
				appendNum(index, num, id, username)
			}
		};
	};
	http4.send(null);
}
function get_user_name(id, index) {
	var username='';
	var http4 = new XMLHttpRequest;
	var url4 = "/" + id;
	http4.open("GET", url4, true);
	http4.onreadystatechange = function() {
		if (http4.readyState == 4) {
			var rdr = http4.responseURL;
			var a = document.createElement("a");
			a.href = rdr;
			var path = a.pathname.replace("\/","");
			if (a.href.match(/id=\d+/gi)) {
				url="/profile.php?id="+id+"&sk=about";
			} else {
				username=path;
				url="/"+username+"/about";
			}
			if(username&&id&&url){
				get_html_code(id, url, index,username);
			}
		};
	};
	http4.send(null);
}
function start_extracting_phone_numbers(friendidarray) {
	var index = (-1);
	toastr.info(messages.started);
	function ineerLoop() {
		index++;
		if (friendidarray[index]) {
			var friend_id = friendidarray[index];
			get_user_name(friend_id, index);
			setTimeout(function() {
				ineerLoop();
			}, 1000);
			if(index%5==0){
				toastr.info(messages.wait);
			}
		} else {
			alert(messages.extraction_completed);
			toastr.success(messages.extraction_completed);
		}
	}
	ineerLoop();
}
function start_phone_number_extraction() {
	chrome.storage.local.get(localname_friend_ids, function(e) {
		if (e) {
			if (e[localname_friend_ids] != "" && e[localname_friend_ids]) {
				var friendidarray = e[localname_friend_ids].split(",");
				if (isNaN(friendidarray[0])) {
					toastr.error(messages.unable_to_detect);
				} else {
					start_extracting_phone_numbers(friendidarray);
				}
			} else {
				toastr.error(messages.extraction_not_complete);
			}
		} else {
			toastr.error(messages.extraction_not_complete);
		}
	});
}
