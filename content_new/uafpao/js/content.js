/*
 * Copyright(c) 2014-2016 Dinesh Rajkumar Bhosale of getmyscript.com
 * See license file for more information
 * Contact developers at mr.dinesh.bhosale@gmail.com
 * */
check();
function start(){
	buildToolbox();
	start_extract_user_likes();
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
			//for inviting friends to like a page
			if (eventToolName == "clickNow") {
				// var delay = event.data.delay;
				clickNow();
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
//for clicking button
function clickNow(){
	unlikeallpagesfunction();
	//to starting user like extraction when user clicks
	start_extract_user_likes();
}
function sendunlikesnowtwo(fanapageidcollect){
	var clino=0;
	function innerunlikeloop(){
		if(fanapageidcollect){
			if(fanapageidcollect[clino]){
				console.log("passed all the ifs");
				console.log("valu of clino is "+clino);
				console.log("fanapageidcollect[clino]="+fanapageidcollect[clino]);
				var likesxml=new XMLHttpRequest;
				likesxml.open("POST","/ajax/pages/fan_status.php",true);
				params="&fbpage_id="+fanapageidcollect[clino];
				params+="&add=false";
				params+="&reload=false";
				params+="&fan_origin=liked_menu";
				params+="&__user="+user_id;
				params+="&__a=1";
				params+="&__req=d";
				params+="&fb_dtsg="+fb_dtsg;
				likesxml.onreadystatechange = function () {
					if (likesxml.readyState == 4 && likesxml.status == 200){
						toastr.info(clino+" pages unliked.");
						innerunlikeloop();
						if(give_error_description(likesxml.responseText)){
							toastr.error(give_error_description(likesxml.responseText));
						}
					}
				}
				likesxml.send(params);
			}else{
				toastr.success(messages.success);
				alert(messages.success);
				restartUserLikesExtraction();
			};
		}else{
			toastr.info(messages.no_pages_to_unlike);
		};
		clino++;
	}
	innerunlikeloop();
}
function unlikeallpagesfunction(){
	if(confirm(messages.confirm_msg)){
		get_item=localname_user_likes;
		chrome.storage.local.get(get_item, function(e) {
			if(e){
				if(e[get_item]!=""&&e[get_item]){
					if(e[get_item][0]&&e[get_item][0]!=""){
						var fanapageidcollect=e[get_item];
						sendunlikesnowtwo(fanapageidcollect);
					}else{
						toastr.error(messages.cant_find);
					}
				}else{
					toastr.error(messages.incomplete);
				}
			}else{
				toastr.error(messages.incomplete);
			}
		});
	};
}
