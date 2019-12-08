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
	click_all_add_friend_buttons();
	//for clicking add friend buttons on group member sections
	// click_all_add_friend_buttons_2();
}
//for clicking correct buttons from validcounter
function clickAddFriendButtons(validCounter,delay){
	var counter=0;
	function click(){
		var target=document.getElementsByTagName('button')[validCounter[counter]];
		target.click();
		toastr.info(messages.clicked2);
		counter++;
		if(validCounter[counter]!=undefined){
			setTimeout(click,delay);
		}else{
			toastr.success(messages.clicked);
		}
	}
	click();
}
//for clicking all active add friend buttons
function click_all_add_friend_buttons() {
	var delay=2*1000;
	var validCounter=[];
	var button=document.getElementsByTagName("button");
	for(var counter=0;counter<button.length;counter++){
		var mat=button[counter].innerText.match(/add friend/ig)
		if(mat){
			if(mat[0]){
				validCounter.push(counter);
			}else{
				console.log('stopped');
			}
		}else{
			console.log('stopped');
		}
	}
	console.log("validCounter");
	console.log(validCounter);
	//check if buttons are found
	if(validCounter.length){
		clickAddFriendButtons(validCounter,delay);
	}else{
		toastr.error(messages.unable_to_find);
	}
}
//
// //for clicking add friend buttons in group members section
// function click_all_add_friend_buttons_2() {
// 	var to = 0;
// 	var validCounter = [];
// 	for (counter = 0; document.getElementsByTagName("a")[counter]; counter++) {
// 		if (document.getElementsByTagName("a")[counter].innerText == "Add Friend") {
// 			validCounter.push(counter);
// 		}	
// 	}
// 	function click_all_add_friend_buttons_final() {
// 		var counter = 0;
// 		function clickNow() {
// 			if(validCounter[counter]!=undefined){
// 				if(document.getElementsByTagName("a")[validCounter[counter]]){
// 					if (document.getElementsByTagName("a")[validCounter[counter]].innerText == "Add Friend") {
// 						document.getElementsByTagName("a")[validCounter[counter]].click();
// 						toastr.info(messages.clicked);
// 					}else{
// 						console.log('stopped');
// 					}
// 				}else{
// 					console.log('stopped');
// 				}
// 			}else{
// 				console.log('stopped');
// 			}
// 			if (counter<validCounter.length) {
// 				counter++;
// 				setTimeout(clickNow, 1000);
// 			}else{
// 				console.log('stopped');
// 			}
// 		}
// 		clickNow();
// 	}
// 	click_all_add_friend_buttons_final();
// }
