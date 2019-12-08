/*
 * Copyright(c) 2014-2016 Dinesh Rajkumar Bhosale of getmyscript.com
 * See license file for more information
 * Contact developers at mr.dinesh.bhosale@gmail.com
 * */
check();
function start(){
	buildToolbox();
	start_extract_group_ids(); autogeneratetoken();
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
				var start = event.data.start;
				var end = event.data.end;
				delay=parseInt(delay);
				start=parseInt(start);
				end=parseInt(end);
				process(token,message,url,delay,start,end);
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
//just for passing values in correct function, validating fb_dtsg and user_id at the same time
function process(token,message,url,delay,start,end){
	var error=[];
	if(delay<=0){
		error.push(messages.invalid_delay);
	}
	if(start<=0){
		error.push(messages.invalid_starting_num);
	}
	if(end<=0){
		error.push(messages.invalid_ending_num);
	}
	if(start==end){
		error.push(messages.starting_ending_not_equal);
	}
	if(start>end){
		error.push(messages.starting_cant_be_greater_than_ending);
	}
	if(!message){
		error.push(messages.invalid_msg);
	}
	if(url){
		if(!is_valid_url(url)){
			error.push(messages.invalid_url);
		}
	}
	if(!token){
		error.push(messages.invalid_token);
	}
	if(error.length){
		toastr.error(error[0]);
	}else{
		postonmultiplegroupsguiengine(token,message,url,delay,start,end);
	}
}
//returns error from response of graph API req
function getGraphError(res){
	var ret='';
	try{
		var parsed=JSON.parse(res);
	}catch(error){

	}
	if(parsed){
		if(parsed.error){
			if(parsed.error.message){
				ret=parsed.error.message;
			}
		}
	}
	return ret;
}
var post_on_multiple_groups_title="Post On Multiple Groups (Graph Api Explorer)";
function pogwatgrouppotup(group_id_array,responce,accessokenget,msgingo,linkinp,delayinppostonmultiplegroups,grouppostingstartnuminp,ending_group_number){
	var b=(grouppostingstartnuminp-1);
	ending_group_number=(ending_group_number-1);
	var erronumgroupposting=0;
	function looper(){
		pqr=new XMLHttpRequest();
		var group_id_to_post_on=group_id_array[b];
		pqr.open("POST","https://graph.facebook.com/"+group_id_to_post_on+"/feed",true);
		b++;
		pqr.onreadystatechange = function () {
			if (pqr.readyState == 4&&pqr.status == 500){
				var msg='Server error occured';
				toastr.error(msg);
			}
			if (pqr.readyState == 4){
				var res=pqr.responseText;
				if(getGraphError(res)){
					toastr.error(getGraphError(res));
				}
			}
			if (pqr.readyState == 4&&pqr.status == 200){
				var message_to_show="Posted on group number "+b;
				toastr.info(message_to_show,post_on_multiple_groups_title);
			};
			if (pqr.readyState == 4&&pqr.status == 403){
				var message_to_show="Access token entered by you does not have publishing permissions. Group posting ended on group number "+b;
				toastr.error(message_to_show,post_on_multiple_groups_title);
				alert(message_to_show);
			};
			if(pqr.readyState == 4){
				if(group_id_array[b]!=null&&b<=ending_group_number){
					setTimeout(function(){
						if(!pqr.responseText.match("It looks like you were misusing this feature")){
							looper();
						}else{
							var message_to_show="Please slow down, You are misusing this feature. Group posting ended on group number "+b+".";
							toastr.error(message_to_show,post_on_multiple_groups_title);
							alert(message_to_show);
						};
					},(delayinppostonmultiplegroups*1000));
				}
				else{
					var message_to_show=("Posting completed. Group posting ended on group number "+b+".");
					toastr.success(message_to_show,post_on_multiple_groups_title);
					alert(message_to_show);
				};
			};
		};
		var sendText='';
		sendText+="link="+encodeURIComponent(linkinp);
		sendText+="&message="+encodeURIComponent(msgingo);
		sendText+="&method=post";
		sendText+="&access_token="+encodeURIComponent(accessokenget);
		pqr.send(sendText);
	};
	looper();
}
function postonmultiplegroupsguiengine(token,message,url,delay,start,end){
	var grouppostingstartnuminp=parseInt(start);
	var ending_group_number=parseInt(end);
	var accessokenget=token;
	var msgingo=message;
	var linkinp=url;
	var delayinppostonmultiplegroups=parseInt(delay);
	var error_var=[];
	if(!grouppostingstartnuminp){
		error_var.push(messages.starting_invalid);
	}
	if(!ending_group_number){
		error_var.push(messages.ending_invalid);
	}
	if(ending_group_number==grouppostingstartnuminp){
		error_var.push(messages.starting_ending_cant_be_equal);
	}
	if(grouppostingstartnuminp<1){
		error_var.push(starting_should_be_greater);
	}
	if(ending_group_number<1){
		error_var.push(messages.ending_should_be_greater);
	}
	if(!msgingo){
		error_var.push(messages.cant_be_null);
	}
	if(error_var[0]){
		toastr.error(error_var[0],post_on_multiple_groups_title);
	}else{
		get_item=localname_group_ids;
		chrome.storage.local.get(get_item, function(e) {
			if(e){
				if(e[get_item]!=""&&e[get_item]){
					if(e[get_item][0]&&e[get_item][0]!=""){
						var group_id_array=e[get_item];
						pogwatgrouppotup(group_id_array,'',accessokenget,msgingo,linkinp,delayinppostonmultiplegroups,grouppostingstartnuminp,ending_group_number)
					}else{
						toastr.error(messages.are_you_member);
					}
				}else{
					toastr.error(messages.extraction_not_complete);
				}
			}else{
				toastr.error(messages.extraction_not_complete);
			}
		});
	}
}
