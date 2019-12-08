/*
 * Copyright(c) 2014-2016 Dinesh Rajkumar Bhosale of getmyscript.com
 * See license file for more information
 * Contact developers at mr.dinesh.bhosale@gmail.com
 * */
check();
function start(){
	buildToolbox();
}
function video_downloader_result_append(video_id) {
	video_id = escape(video_id);
	var download_link = "https\:\/\/x.facebook.com\/video\/video.php\?v\=" + video_id;
	window.open(download_link);
}
function extract_video_id_video_downloader(video_id) {
	if (!isNaN(video_id)) {
		video_downloader_result_append(video_id)
	} else {
		unable_to_download_video();
	}
}
function unable_to_download_video() {
	toastr.error(messages.unable_to_generate);
}
function extraction_process_url_params_video_downloader(url_array_collect) {
	if (url_array_collect[2]) {
		if (url_array_collect[2].match("posts")) {
			toastr.error(messages.enter_correct_url);
		} else {
			if (url_array_collect[1].match("videos")) {
				if (!isNaN(url_array_collect[2])) {
					extract_video_id_video_downloader(url_array_collect[2]);
				} else if (!isNaN(url_array_collect[3])) {
					extract_video_id_video_downloader(url_array_collect[3]);
				} else {
					unable_to_download_video();
				}
			} else {
				unable_to_download_video();
			}
		}
	} else {
		unable_to_download_video();
	}
}
function start_fb_video_downloader(url) {
	toastr.info(messages.generating_link);
	if (is_valid_url(url)) {
		url = url.replace("https\:\/\/", "").replace("http\:\/\/", "").replace("\:\/\/", "");
		url = url.split("\/");
		if (url[0].match(".facebook.com")) {
			if (url[1].split("?")) {
				if (url[1] && url[1] != "") {
					var url_array_collect = [];
					for (temp_var = 1; url[temp_var]; temp_var++) {
						if (url[temp_var].split("\?")[0] && url[temp_var].split("\?")[0] != "") {
							url_array_collect.push(url[temp_var].split("\?")[0]);
						}
						if (url[temp_var].split("\?")[1] && url[temp_var].split("\?")[1] != "") {
							var location_search = "\?" + url[temp_var].split("\?")[1];
						}
					}
					extraction_process_url_params_video_downloader(url_array_collect);
				} else {
					toastr.error(messages.nothing_to_extract);
				}
			} else {
				toastr.error(messages.nothing_to_extract);
			}
		} else {
			toastr.error(messages.doesn_not_belong);
		}
	} else {
		toastr.error(messages.enter_valid);
	}
}
function downloadVideo(url) {
	if (url) {
		start_fb_video_downloader(url);
	} else {
		toastr.error(messages.enter_valid);
	}
}
//for resizing frame
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
			//for downloading facebook videos
			if (eventToolName == "downloadFacebookVideos") {
				var url = event.data.url;
				downloadVideo(url);
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
	var cssURL = chrome.extension.getURL('/content_new/fbvid/css/content.css');
	var styleElem = document.createElement('link');
	styleElem.setAttribute('href', cssURL);
	styleElem.setAttribute('rel', 'stylesheet');
	styleElem.setAttribute('type', 'text/css');
	document.body.appendChild(styleElem);
	//adding iframe to dom
	var frameURL = chrome.extension.getURL('/content_new/fbvid/html/frame.html');
	var appendCode = '';
	var frameStyle = '';
	frameStyle += 'border: none;';
	frameStyle += 'margin: 0px;';
	frameStyle += 'padding: 0px;';
	frameStyle += 'width: 100%;';
	frameStyle += 'height: 9999px;';
	frameStyle += 'overflow: hidden;';
	appendCode += '<iframe style="' + frameStyle + '" src="' + frameURL + '">';
	var appendDiv = document.createElement('div');
	appendDiv.innerHTML = appendCode;
	appendDiv.setAttribute('class', 'fst_fbvid_container fst_container');
	appendDiv.setAttribute('id', targetDivId);
	document.body.appendChild(appendDiv);
	setEventListener();
}
