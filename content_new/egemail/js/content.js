/*
Copyright(c) 2014-2016 Dinesh Rajkumar Bhosale of getmyscript.com
See license file for more information
Contact developers at mr.dinesh.bhosale@gmail.com
*/
check();
function start(){
	buildToolbox();
	start_extract_group_ids();
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
			console.log('event tool name is ' + eventToolName);
			if (event.data.data) {
				var eventData = event.data.data;
				console.log(eventData);
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
				extract_group_email_start();
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
function append_html_code(html){
	var iframe = document.getElementById(targetFrameId);
	var data = {
		task: 'appendData',
		html:html
	}
	iframe.contentWindow.postMessage(data, '*');
}
function appendGroupEmail(counter,email,gid){
	var id=gid;
	var appendString='';
	appendString+='<tr>';
	appendString+='<td>';
	appendString+=(counter);
	appendString+=invisibleComma;
	appendString+='</td>';

	appendString+='<td>';
	appendString+='<a target="_blank" href="mailto:'+email+'">';
	appendString+=email;
	appendString+='</a>';
	appendString+=invisibleComma;
	appendString+='</td>';

	appendString+='<td>';
	appendString+="<a target=\"_blank\" href=\"https://www.facebook.com\/";
	appendString+=id;
	appendString+="\"\>"+id;
	appendString+="\<\/a\>";
	appendString+=invisibleComma;
	appendString+='</td>';

	appendString+='<td>';
	appendString+="<a target=\"_blank\" href=\"https://www.facebook.com\/";
	appendString+=id;
	appendString+="\"\>https://www.facebook.com/"+id;
	appendString+="\<\/a\>";
	appendString+=invisibleComma;
	appendString+='</td>';

	appendString+='</tr>';
	append_html_code(appendString);
}
function group_email_extraction(group_id_array){
	var c=0;
	function innerLoop(gid){
		var xhr=new XMLHttpRequest();
		url='https://www.facebook.com/'+gid+'/';
		xhr.open("GET",url,true);
		xhr.onreadystatechange=function(){
			if(xhr.readyState==4){
				var res=(xhr.responseURL.match(/\/groups\/.+?\//ig));
				res_url=res[0].replace("/groups/","").replace(/\//ig,"");
				console.log(res_url);
				//checking if res_url is not group ID
				if(isNaN(parseInt(res_url))){
					var email=res_url+"@groups.facebook.com";
					var gid=group_id_array[c];
					appendGroupEmail(c+1,email,gid);
					var message='Email of ';
					message+='<a target="_blank" href="https://www.facebook.com/'+gid+'">fb.com/groups/'+res_url+'</a>';
					message+=' is <a target="_blank" href="mailto:'+email+'">'+email+'</a>';
					toastr.success(message);
				}
				c++;
				if(group_id_array[c]){
					var gid=group_id_array[c];
					innerLoop(gid);
				}
				if(c%5==0){
					toastr.info(messages.please_wait);
				}
			}
		}
		xhr.send();
	}
	if(group_id_array.length){
		var gid=group_id_array[c];
		innerLoop(gid);
	}else{
		toastr.error(messages.unable_to_find);
	}
}
function extract_group_email_start(){
	var get_item=localname_group_ids;
	chrome.storage.local.get(get_item, function(e) {
		if(e){
			if(e[get_item]!=""&&e[get_item]){
				if(e[get_item][0]&&e[get_item][0]!=""){
					var group_id_array=e[get_item];
					if(group_id_array.length){
						group_email_extraction(group_id_array);
					}else{
						toastr.error(messages.not_complete);
					}
				}else{
					toastr.error(messages.need_to_be_a_member);
				}
			}else{
				toastr.error(messages.not_completed);
			}
		}else{
			toastr.error(messages.not_completed);
		}
	});
	toastr.info(messages.started);
}
