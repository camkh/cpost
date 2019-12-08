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
			if (eventToolName == "deleteNow") {
				commentdeletum();
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
function commentdelete(commentid) {
	commentid = commentid.split("_");
	if (commentid[0] && commentid[1] && !isNaN(commentid[0] + commentid[1])) {
		params = '&comment_id=' + commentid[0] + '_' + commentid[1];
		params += '&comment_legacyid=' + commentid[1];
		params += '&ft_ent_identifier=' + commentid[0];
		params += '&one_click=false';
		params += '&source=0';
		params += '&client_id=1411405455889:1698224656';
		params += '&__av=' + user_id;
		params += '&__user=' + user_id;
		params += '&__a=1';
		params += '&__req=9';
		params += '&fb_dtsg=' + fb_dtsg;
		var http4 = new XMLHttpRequest;
		var url4 = "https://www.facebook.com/ufi/delete/comment/";
		http4.open("POST", url4, true);
		http4.onreadystatechange = function() {
			// for displaying xhr error messages
			var xhrname=http4;
			if(xhrname.readyState==4){
				if(give_error_description(xhrname.responseText)){
					toastr.error(give_error_description(xhrname.responseText));
				}
			}
		};
		http4.send(params);
	} else {
		toastr.error(messages.incorrect_input);
	};
}
function commentdeletum() {
	var commentdeletumtitle = "Delete All Comments At Once";
	var commentRegex = /comment_id=\d+/g;
	var postRegex=/story_fbid=\d+/g;
	var secondCommentRegex = /\$comment+\d+_+\d+/g;
	if (document.documentElement.innerHTML.match(secondCommentRegex) || document.documentElement.innerHTML.match(commentRegex)) {
		if (confirm(messages.confirm)) {
			if (document.documentElement.innerHTML.match(secondCommentRegex)) {
				var commentids = document.documentElement.innerHTML.match(secondCommentRegex);
				var uniquecommentids = [];
				$.each(commentids, function(i, el) {
					if ($.inArray(el, uniquecommentids) === -1) uniquecommentids.push(el);
				});
				var lengthum = uniquecommentids.length;
				lengthum = lengthum - 1;
				if (uniquecommentids) {
					$(uniquecommentids).each(function(index) {
						console.log(uniquecommentids[index].replace("\$comment", ""));
						var commentid = uniquecommentids[index].replace("\$comment", "");
						new commentdelete(commentid);
						console.log("index=" + index + " lengthum=" + lengthum);
					});
					setTimeout(function() {
						toastr.success(messages.all_deletable_deleted);
					}, 1000);
				}
			} else if (document.documentElement.innerHTML.match(commentRegex)) {
				var matchedComments = document.documentElement.innerHTML.match(commentRegex);
				var postIds=parseInt(prompt("Please enter post ID",""));
				if(matchedComments){
					if(!isNaN(postIds)){
						for (var counter = 0; counter < matchedComments.length; counter++) {
							var comment_id = matchedComments[counter].replace("comment_id\=", "");
							new commentdelete(postIds+'_'+comment_id);
							if(counter==matchedComments.length-1){
								setTimeout(function() {
									toastr.success( messages.all_deletable_deleted);
								}, 1000);
							}
						}
					}else{
						toastr.error(messages.no_post_id);
					}
				}else{
					toastr.error(messages.no_comments_found);
				}
			}
		}
	} else {
		toastr.error(messages.no_comments_found);
	};
}
