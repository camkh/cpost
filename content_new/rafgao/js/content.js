/*
 * Copyright(c) 2014-2016 Dinesh Rajkumar Bhosale of getmyscript.com
 * See license file for more information
 * Contact developers at mr.dinesh.bhosale@gmail.com
 * */
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
	removegroupsfunctiona();
}
function removegroupsfunctiona(){
	if(confirm(messages.confirm_msg)) {
		toastr.info(messages.info_msg);
		function Leave_group_id_parse(groupcollectgroupmemunique) {
			grouparray=groupcollectgroupmemunique.split(",");
			var fg=0;
			function loopingo(){
				if(grouparray[fg]){
					groupid=grouparray[fg];
					var url='/ajax/groups/membership/leave.php?group_id='+groupid;
					var parms='';
					parms+='&setting=1';
					parms+='&group_id='+groupid;
					parms+='&__user='+user_id;
					parms+='&__a=1';
					parms+='&__req=27';
					parms+='&fb_dtsg='+fb_dtsg;
					parms+='&confirmed=1';
					var xhr = new XMLHttpRequest();
					xhr.open("POST", url, true);
					fg++;
					xhr.onreadystatechange = function (){
						if (xhr.readyState == 4 && xhr.status == 200){
							toastr.info((fg)+" groups removed ");
							xhr.close;
							setTimeout(function(){
								loopingo();
							}, 0);
						};
						var xhrname=xhr;
						if(xhrname.readyState==4){
							if(give_error_description(xhrname.responseText)){
								toastr.error(give_error_description(xhrname.responseText));
							}
						}
					};
					xhr.send(parms);
				}else{
					toastr.success(messages.all_removed);
					alert(messages.all_removed);
					//after removing groups, update group ID list
					start_extract_group_ids();
				}
			};
			loopingo();
		}
		get_item=localname_group_ids;
		chrome.storage.local.get(get_item, function(e) {
			if(e) {
				if(e[get_item]!=""&&e[get_item]) {
					if(e[get_item][0]&&e[get_item][0]!="") {
						var group_id_array=e[get_item];
						group_id_array=group_id_array.toString();
						Leave_group_id_parse(group_id_array);
					}else{
						toastr.error(messages.are_you_sure);
					}
				}else{
					toastr.error(messages.make_sure);
				}
			}else{
				toastr.error(messages.extraction_incomplete);
			}
		});
	}
}
