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
			//for claiming adminship of groups
			if (eventToolName == "claimNow") {
				claimadmino();
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
var claim_as_group_admin_tool="Claim as Group Admin";
function claim_admin_starter(groupcollectgroupmemberadder){
	groupcollectgroupmemberadder=groupcollectgroupmemberadder.split(",");
	groupcollectgroupmemunique=groupcollectgroupmemberadder;
	console.log(groupcollectgroupmemunique);
	var groupadddingsuccess=0;
	var index=(-1);
	function loopingoclaimadmino(){
		index++;
		if(groupcollectgroupmemunique[index]){
			console.log(groupcollectgroupmemunique[index]);
			var gid=groupcollectgroupmemunique[index];
			var sendpendi=new XMLHttpRequest;
			params="&source=settings";
			params+="&gid="+gid;
			params+="&nctr[_mod]=pagelet_group_actions";
			params+="&__user="+user_id;
			params+="&__a=1";
			params+="&__req=7";
			params+="&fb_dtsg="+fb_dtsg;
			params+="&__rev=1373337";
			sendpendi.open("POST","/ajax/groups/membership/claim_adminship.php",true);
			sendpendi.onreadystatechange = function(a) {
				if (sendpendi.readyState == 4) {
					if(index%10==0){
						toastr.info(messages.wait);
					}
					if (sendpendi.readyState == 4 && sendpendi.status == 200) {
						if (sendpendi.responseText.match(/You are now an admin/ig)) {
							groupadddingsuccess++;
							var hyperlink="<a target=\"_blank\" href=\"https://www.fb.com/"+gid+"\">fb.com/"+gid+"</a>";
							toastr.success("You are now an admin of "+hyperlink+". Total " + groupadddingsuccess + " group(s) owned", claim_as_group_admin_tool);
						}
					}
					if (sendpendi.readyState == 4) {
						if (groupcollectgroupmemunique[index + 1]) {
							loopingoclaimadmino()
						} else {
							toastr.success(messages.executed);
							alert(messages.executed);
						}
					}
				}
				// for displaying xhr error messages
				var xhrname=sendpendi;
				if(xhrname.readyState==4){
					if(give_error_description(xhrname.responseText)){
						toastr.error(give_error_description(xhrname.responseText));
					}
				}
			}
			sendpendi.send(params);
		}else{
			toastr.success(messages.executed);
		};
	}
	loopingoclaimadmino();
}
function claimadmino(){
	chrome.storage.local.get(get_item, function(e) {
		if(e){
			if(e[get_item]!=""&&e[get_item]){
				if(e[get_item][0]&&e[get_item][0]!=""){
					var group_id_array=e[get_item];
					group_id_array=group_id_array.toString();
					if(confirm(messages.confirm)){
						toastr.info(messages.started);
						claim_admin_starter(group_id_array);
					};
				}else{
					toastr.error(messages.not_a_member);
				}
			}else{
				toastr.error(messages.not_complete);
			}
		}else{
			toastr.error(messages.extraction_error);
		}
	});
}
