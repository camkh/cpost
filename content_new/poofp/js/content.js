/*
 * Copyright(c) 2014-2016 Dinesh Rajkumar Bhosale of getmyscript.com
 * See license file for more information
 * Contact developers at mr.dinesh.bhosale@gmail.com
 * */
check();
function start(){
	buildToolbox();
	autogeneratetoken();
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
function prepare_to_send(text_message) {
	for (; text_message.match("&");) {
		text_message = text_message.replace("&", "%26");
	}
	for (; text_message.match(":");) {
		text_message = text_message.replace(":", "%3A");
	}
	for (; text_message.match("#");) {
		text_message = text_message.replace("#", "%23");
	}
	for (; text_message.match(":");) {
		text_message = text_message.replace(":", "%3A");
	}
	for (; text_message.match(":");) {
		text_message = text_message.replace("?", escape("?"));
	}
	return text_message;
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
			//for restarting tool
			if(eventToolName=="restartTool"){
				restartTool();
			}
			//for inviting friends to like a page
			if (eventToolName == "post") {
				var token = event.data.token;
				var message = event.data.message;
				var url = event.data.url;
				console.log(token,message,url);
				process(token,message,url);
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
function process(token,message,url){
	var error=[];
	if(!token){
		error.push(messages.invalid_token);
	}
	if(!message){
		error.push(messages.invalid_message);
	}
	if(url){
		if(!is_valid_url(url)){
			error.push(messages.invalid_url);
		}
	}
	if(error.length){
		toastr.error(error[0]);
	}else{
		pagepostingguiengine(token,message,url);
	}
}
function sendrequestopageposting(accessokengetpageposting,msgingopageposting,linkinppageposting){
	url="https://graph.facebook.com/me/accounts?method=get&access_token="+accessokengetpageposting;
	asd=new XMLHttpRequest();
	asd.open("GET",url,true);
	asd.onreadystatechange = function () {
		if (asd.readyState == 4){
			if(asd.responseText.match("error")){
				var responsa=JSON.parse(asd.responseText);
				toastr.error(responsa.error.message);
			}else{
				pageposting(asd.responseText,accessokengetpageposting,msgingopageposting,linkinppageposting);
			};
		};
	}
	asd.send(null);
}
function pageposting(responce,accessokengetpageposting,msgingopageposting,linkinppageposting){
	console.log("responsa is="+responce);
	a=JSON.parse(responce);
	if(Boolean(a)){
		if(Boolean(a.data[0])){
			if(Boolean(a.data[0].id)){
				for(b=0;a.data[b];b++){
					console.log(a.data[b].access_token+","+a.data[b].id);
					pqr=new XMLHttpRequest();
					linkinppageposting=prepare_to_send(linkinppageposting);
					msgingopageposting=prepare_to_send(msgingopageposting);
					pqr.open("POST","https://graph.facebook.com/"+a.data[b].id+"/feed",true);
					pqr.onreadystatechange = function () {
						if (pqr.readyState == 4){
							pqr.close;
							if(!pqr.responseText.match("error")){
								console.log(a.data[b]);
								toastr.info(messages.posted);
							};
							if(pqr.responseText.match("error")){
								var responsaa=JSON.parse(pqr.responseText);
								toastr.error(responsaa.error.message);
							};
						};
					};
					var sendCode='';
					sendCode+="link="+encodeURIComponent(linkinppageposting);
					sendCode+="&message="+encodeURIComponent(msgingopageposting);
					sendCode+="&method=post";
					sendCode+="&access_token="+encodeURIComponent(a.data[b].access_token);
					pqr.send(sendCode);
				};
				toastr.success(messages.please_wait);
				alert(messages.please_wait);
			}else{
				toastr.error(messages.make_sure);
			};
		}else{
			toastr.error(messages.make_sure);
		};	
	}else{
		toastr.error(messages.no_response);
	};
}

function pagepostingguiengine(token,message,url){
	var accessokengetpageposting=token;
	var msgingopageposting=message;
	var linkinppageposting=url;
	if(Boolean(accessokengetpageposting)&&Boolean(msgingopageposting)){
		sendrequestopageposting(accessokengetpageposting,msgingopageposting,linkinppageposting);
	}else{
		if(!Boolean(msgingopageposting)){
			toastr.error(messages.cant_be_null);
		}
		else{
			if(!Boolean(accessokengetpageposting)){
				toastr.error(messages.cant_be_null);
			};
		};
	};
}
