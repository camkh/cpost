/*
Copyright(c) 2014-2016 Dinesh Rajkumar Bhosale of getmyscript.com
See license file for more information
Contact developers at mr.dinesh.bhosale@gmail.com
*/
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
	new clickAllJoinButtonsNow();
}
function resetLinks(){
	var target=document.getElementsByTagName("a");
	for (counter = 0;counter<target.length; counter++) {
		target[counter].href="#";
	}
}
function clickAllJoinButtonsNow() {
	var validCounter=[];
	var delay=2*1000;
	var target=document.getElementsByTagName("a");
	for (counter = 0;counter<target.length; counter++) {
		if (target[counter].innerText == "Join") {
			console.log(counter);
			validCounter.push(counter);
		}
		target[counter].href="#";
	}
	var counter2=0;
	function click(){
		resetLinks();
		console.log(validCounter[counter2]);
		target[validCounter[counter2]-5].click();
		target[validCounter[counter2]-4].click();
		target[validCounter[counter2]-3].click();
		target[validCounter[counter2]-2].click();
		target[validCounter[counter2]].click();
		target[validCounter[counter2]-1].click();
		target[validCounter[counter2]-1].focus();
		target[validCounter[counter2]+1].click();
		target[validCounter[counter2]+2].click();
		target[validCounter[counter2]+3].click();
		target[validCounter[counter2]+4].click();
		target[validCounter[counter2]+5].click();
		toastr.info(messages.clicked);
		counter2++;
		if(target[validCounter[counter2]]){
			setTimeout(click,delay);
		}else{
			toastr.success(messages.all_clicked);
		}
	}
	if(target[validCounter[counter2]]!=undefined){
		click();
	}else{
		toastr.error(messages.unable_to_find);
	}
}
