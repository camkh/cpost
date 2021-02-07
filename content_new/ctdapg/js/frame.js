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
$( document ).ready(function() {
    if(window.location.hash.substr(1) == 'active') {
    	$('.notactive').hide();
    	$('.active').show();
    }
});

//setting event listeners on current frame
function setEventListener(){
	addEventListener("message", function(event) {
	}, false);
	//event listner for close button
	targetButton1 = "close-button";
	$('#' + targetButton1).click(function(e){
		var postData = {};
		postData.name = targetButton1;
		top.postMessage(postData, "*");
	});
	//to decrease height of iframe
	targetButton3 = "resize-button";
	$('#' + targetButton3).click(function() {
		var postData = {};
		postData.name = targetButton3;
		top.postMessage(postData, "*");
		toggleResizeButtons();
	});
	//to increase height of iframe
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
	//function for restarting tool
	targetButton10="restartTool";
	document.getElementById(targetButton10).addEventListener("click",function(e){
		var postData = {};
		postData.name =targetButton10;
		top.postMessage(postData, "*");
	});
	//prevent form submission
	document.getElementById("submitForm").addEventListener("submit",function(e){
		e.preventDefault();
	});
	document.getElementById("submitButton").addEventListener("click",function(e){
		//inviteFriendsToLikePage
		var postData = {};
		postData.name = "deletepostsingroup";
		postData.id=document.getElementById("idInput").value;
		postData.delay=document.getElementById("delayTime").value;
		top.postMessage(postData, "*");
	});
	document.getElementById("delButton").addEventListener("click",function(e){
		//inviteFriendsToLikePage
		var postData = {};
		postData.name = "deletenow";
		postData.delay=document.getElementById("delayTime").value;
		top.postMessage(postData, "*");
	});
	//for appending access token	
}

function loaded(){
	setEventListener();
}
window.onload=loaded;
