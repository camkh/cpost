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
//setting event listeners on current frame
function setEventListener() {
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
	//prevent form submission
	document.getElementById("submitForm").addEventListener("submit",function(e){
		e.preventDefault();
	});
	// for restarting tool
	document.getElementById("restartTool").addEventListener("click",function(e){
		var postData = {};
		postData.name = "restartTool";
		top.postMessage(postData, "*");
	});
	document.getElementById("submitButton").addEventListener("click",function(e){
		var postData = {};
		postData.name = "join";
		postData.idlist=document.getElementById("idlist").value;
		postData.delay=document.getElementById("delay").value;
		top.postMessage(postData, "*");
	});
    //for appending access token
    handleSizingResponse = function (e) {
    	console.log(e);
        if (e.origin.match(".facebook.")) {
            if (e.data.id == "token") {
                var token = e.data.token;
                $(".access_token").val(token);
                console.log('access token is appended');
            }
        }
        if (e.data.type == "request_group") {
			console.log('request group...');
			console.log(e.data.data);
			requestgroup(e.data.data);
		}
    }
    //event listeenrs for events from parent frame
    window.addEventListener('message', handleSizingResponse, false);
}


function requestgroup(data) {
	//await page.goto("http://localhost/fbpost/facebook/ugroup?action=addgroups&uid="+log_id+"&gid=" + garr[i] + "&fid="+ user_id);
	var http4 = new XMLHttpRequest;
	var url4 = "http://localhost/fbpost/facebook/ugroup?action=addgroups&gid=" + data.group + "&fid="+ data.av;
	http4.open("GET", url4, true);
	http4.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
	http4.onreadystatechange = function (){
		if (http4.readyState == 4 && http4.status == 200){
			var htmlstring = http4.responseText;
			console.log(htmlstring);
		}
	};
	http4.send(null);
}
function loaded(){
	setEventListener();
}
window.onload=loaded;
