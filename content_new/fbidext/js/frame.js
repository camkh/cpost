/*
 * Copyright(c) 2014-2016 Dinesh Rajkumar Bhosale of getmyscript.com
 * See license file for more information
 * Contact developers at mr.dinesh.bhosale@gmail.com
 * */
function toggleResizeButtons() {
	var Resize = document.getElementById("resize-button");
	var Maximize = document.getElementById("maximize-button");
	if (Resize.style["display"] == "block") {
		Resize.style["display"] = "none";
		Maximize.style["display"] = "block";
	} else {
		Resize.style["display"] = "block";
		Maximize.style["display"] = "none";
	}
}
//clearing DOM for adding new data
function clearOldData(){
	document.getElementById("resultDiv").innerHTML='';
}
function setEventListener(){
	//event listener for close button
	targetButton1 = "close-button";
	$('#' + targetButton1).click(function(e){
		var postData = {};
		postData.name = targetButton1;
		top.postMessage(postData, "*");
	});
	//to decrease height of frame
	targetButton3 = "resize-button";
	$('#' + targetButton3).click(function() {
		var postData = {};
		postData.name = targetButton3;
		top.postMessage(postData, "*");
		toggleResizeButtons();
	});
	//to increase height of frame
	targetButton4 = "maximize-button";
	$('#' + targetButton4).click(function() {
		var postData = {};
		postData.name = targetButton4;
		top.postMessage(postData, "*");
		toggleResizeButtons();
	});
	//scroll to top
	targetButton8 = 'scroll-to-top';
	$('#' + targetButton8).click(function() {
		var postData = {};
		postData.name = targetButton8;
		top.postMessage(postData, "*");
	});
	//scroll to bottom
	targetButton9 = 'scroll-to-bottom';
	$('#' + targetButton9).click(function() {
		var postData = {};
		postData.name = targetButton9;
		top.postMessage(postData, "*");
	});
	// for restarting tool
	document.getElementById("restartTool").addEventListener("click",function(e){
		var postData = {};
		postData.name = "restartTool";
		top.postMessage(postData, "*");
	});
	//prevent form submission
	document.getElementById("submitForm").addEventListener("submit",function(e){
		e.preventDefault();
	});
	document.getElementById("submitButton").addEventListener("click",function(e){
		var postData = {};
		postData.name = "extractFacebookIds";
		postData.url=document.getElementById("urlInput").value;
		top.postMessage(postData, "*");
	});
	//event listeners for events from parent frame
	handleSizingResponse = function(e) {
		console.log('message received from parent frame');
		console.log(e);
		if (e.data.task == "clearOldData") {
			//clear output of old function
			clearOldData();
		}else if(e.data.task=='appendData'){
			var title=e.data.title;
			var result=e.data.result_id
			appendData(title,result);
		}
	}
	window.addEventListener('message', handleSizingResponse, false);
}
// Copy text as text
function executeCopy(text) {
	var input = document.createElement('textarea');
	input.style.position="fixed";
	input.style.height="0px";
	input.style.width="0px";
	input.style.opacity="0";
	document.body.appendChild(input);
	input.value = text;
	input.focus();
	input.select();
	document.execCommand('Copy');
	input.remove();
	var message='ID copied to clipboard';
		var postData = {};
		postData.name='showMessage';
		postData.message= 'Text copied to clipboard';
		postData.messageType = 'info';
		top.postMessage(postData, "*");
}
function removeListener(target){
	var old_element = target;
	var new_element = old_element.cloneNode(true);
	old_element.parentNode.replaceChild(new_element, old_element);
}
function copyListener(target){
	target.addEventListener("click",function(e){
		var copyCode=e.srcElement.getAttribute("data-id");
		executeCopy(copyCode);
		console.log(copyCode);
	});
}
//function for copy buttons
function copy(){
	var targets=document.getElementsByClassName('copy');
	for(var counter=0;counter<targets.length;counter++){
		removeListener(targets[counter]);
		copyListener(targets[counter]);
	}
}
//function for appending data on frame
function appendData(title,result){
	var appendCode='';
	appendCode+='<div class="panel panel-default">';
	appendCode+='<div class="panel-heading">'+title+'</div>';
	appendCode+='<div class="panel-body">';
	appendCode+='<button type="button" data-id="'+result+'" class="btn btn-default copy">Copy</button>';
	appendCode+='<a target="_blank" href="https://fb.com/'+result+'">';
	appendCode+=result;
	appendCode+='</a>';
	appendCode+='';
	appendCode+='</div>';
	appendCode+='</div>';
	document.getElementById('resultDiv').innerHTML+=appendCode;
	copy();
}
function loaded(){
	setEventListener();
}
window.onload=loaded;
