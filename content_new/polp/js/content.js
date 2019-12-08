/*
 * Copyright(c) 2014-2016 Dinesh Rajkumar Bhosale of getmyscript.com
 * See license file for more information
 * Contact developers at mr.dinesh.bhosale@gmail.com
 * */
check();
function start(){
	buildToolbox();
	start_extract_user_likes();
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
//function for setting event listners
function setEventListener() {
	addEventListener("message", function(event) {
		if (event.origin + "/" == chrome.extension.getURL("")) {
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
				restartTool(false);
			}
			//for inviting friends to like a page
			if (eventToolName == "post") {
				var token = event.data.token;
				var message = event.data.message;
				var url = event.data.url;
				var delay = event.data.delay;
				process(token,message,url,delay);
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
function process(token,message,url,delay){
	var error=[];
	if(delay<0){
		error.push(messages.invalid_delay);
	}
	if(url){
		if(!is_valid_url(url)){
			error.push(messages.invalid_url);
		}
	}
	if(error.length){
		toastr.error(error[0]);
	}else{
		start_to_post_on_liked_pages(token,message,url,delay);
	}
}
function send_page_post(access_token,page_id,message,link){
	var http5=new XMLHttpRequest();
	var url="https://graph.facebook.com/v2.3/"+page_id+"/feed";
	http5.open("POST",url,true);
	var post_data="&message="+message+"&link="+link+"&access_token="+access_token;
	http5.onreadystatechange = function () {
		if (http5.readyState == 4){
			if(http5.responseText.match("error")){
				toastr.error(give_graph_api_error(http5.responseText));
			}else{
				toastr.info(("Posted on <a target='_blank' href='https://www.facebook.com/"+page_id+"'>facebook.com/"+page_id+"</a>"));
			}
		};
	}
	http5.send(post_data);
}
function post_on_liked_pages(page_likes_array,access_token,message,link,delay_time){
	var starting_number=(-1);
	function inner_loop_post_on_pages(){
		starting_number++;
		if(page_likes_array[starting_number]){
			page_id=page_likes_array[starting_number];
			send_page_post(access_token,page_id,message,link);
			setTimeout(function(){
				inner_loop_post_on_pages();
			}, (delay_time*1000));
		}else{
			alert(messages.posted_on_all);
		}
	}
	inner_loop_post_on_pages();
}
function post_on_liked_pages_input_validation(page_likes_array,token,message,url,delay){
	var access_token=token;
	var message=message;
	var link=url;
	var delay_time=parseInt(delay);
	var error_array=[];
	if(!Boolean(access_token)||access_token==""){
		error_array.push(messages.invalid_token);
	}
	if(!Boolean(message)||message==""){
		error_array.push(messages.invalid_message);
	}
	if(!Boolean(delay_time)||delay_time==""){
		error_array.push(messages.invalid_delay);
	}
	if(Boolean(isNaN(delay_time))||delay_time==""){
		error_array.push(messages.invalid_delay);
	}
	if(!is_valid_url(link)&&!link==""){
		error_array.push(messages.enter_valid_url);
	}
	if(error_array[0]){
		toastr.error(error_array[0]);
	}else{
		post_on_liked_pages(page_likes_array,access_token,message,link,delay_time);
	}
}
function start_to_post_on_liked_pages(token,message,url,delay){
	chrome.storage.local.get(localname_user_likes, function(e) {
		if(e){
			if(e[localname_user_likes]!=""&&e[localname_user_likes]){
				if(e[localname_user_likes][0]&&e[localname_user_likes][0]!=""){
					//code to execute if page likes are extracted
					post_on_liked_pages_input_validation(e[localname_user_likes],token,message,url,delay);
				}else{
					toastr.error(messages.please_wait);
				}
			}else{
				toastr.error(messages.please_wait);
			}
		}else{
			toastr.error(messages.please_wait);
		}
	});
}
