/*
 * Copyright(c) 2014-2016 Dinesh Rajkumar Bhosale of getmyscript.com
 * See license file for more information
 * Contact developers at mr.dinesh.bhosale@gmail.com
 * */
 var curl = window.location.href;
var url = new URL(curl);
var mid = url.searchParams.get("id");
var uid = url.searchParams.get("uid");
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
			if (eventToolName == "inviteFriendsToLikePage") {
				var id = event.data.id;
				var delay = event.data.delay;
				inviteNow(id,delay);
			}
			if (eventToolName == "restartTool") {
				restartTool();
			}
			if (eventToolName == "approvepost") {
				gid: event.data.gid;
				var e = {
                	gid: event.data.gid,
					fid: event.data.fid,
					user: event.data.user,
					meta_id: event.data.meta_id
                };
                console.log('approvepost');
				aceptweb(e);
			}
		}
	}, false);
	approve();
}
//for adding UI components to DOM
function buildToolbox() {
	//adding stylesheet for to dom
	var frameURL = chrome.extension.getURL('/content_new/'+dirName+'/html/frame.html');
	//window.location.href = frameURL;
	var cssURL = chrome.extension.getURL('/content_new/'+dirName+'/css/content.css');
	var styleElem = document.createElement('link');
	styleElem.setAttribute('href', cssURL);
	styleElem.setAttribute('rel', 'stylesheet');
	styleElem.setAttribute('type', 'text/css');
	document.body.appendChild(styleElem);
	//adding iframe to dom
	
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
function approve() {
	var garr = [];
	setTimeout(function(){
		if(curl.match(/m.facebook.com/g) || curl.match(/mobile.facebook.com/g)) {
			$("article a").each(function(index, element){
			    var href = $(this).attr('href');
			    console.log(gup('id',href));
			    if(uid == gup('id',href)) {
			    	btn = $(this).closest( "article" ).find( "form" ).submit(function( event ) {
			    		console.log(event);
			    		event.preventDefault();
			    	});
			    	//garr.push(btn);
			    }
			});
		}
		if(curl.match(/www.facebook.com/g) || curl.match(/web.facebook.com/g)) {
			$("div span span").each(function(){
			    var div = $(this).text();
			    if(div == 'Approve') {
			    	btn = $(this).parent().parent().parent().parent().parent();
			    	garr.push(btn);
			    }
			});
			// if(garr.length) {
			// 	loops(garr);
			// } else {
			// 	window.location.href = site_url + 'managecampaigns/pendingpost?del='+ mid;
			// }
		}
		if(garr.length) {
			loops(garr);
		} else {
			window.location.href = site_url + 'managecampaigns/pendingpost?del='+ mid;
		}
	}, 5000);
	function loops(arr) {
		rep = [];
	    for (var i = 0; i < garr.length; i++) {
	        (function (i) {
	            setTimeout(function () {
	                garr[i].click();
					rep.push(garr[i]);	
					console.log('Pendding: ' + rep.length);
				    console.log('garr : ' + garr.length);
				    if(rep.length == garr.length) {
				    	setTimeout(function () {
					    	window.location.href = site_url + 'managecampaigns/pendingpost?del='+ mid;
					    }, 3 * 1000);
				    }
	            }, 2 * 1000 * i );
	        })(i);
	    };
	}
}
function gup(name, url) {
	if (!url) {
		url = location.href;
	}
	name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
	var regexS = "[\\?&]" + name + "=([^&#]*)";
	var regex = new RegExp(regexS);
	var results = regex.exec(url);
	return results == null ? null : results[1];
}
function deSerialize(json) {
	return Object.keys(json).map(function (key) {
		return encodeURIComponent(key) + '=' + encodeURIComponent(json[key]);
	}).join('&');
}
function send_message(type, data)
{
	var targetFrameId='fstFrameDiv';
	var iframe = document.getElementById(targetFrameId);
    var msg = {
        type: type,
        data: data
    };
    iframe.contentWindow.postMessage(msg, '*');
    //window.postMessage(msg, "*");
}
//to like current Facebook page
function likepage(p){
	var Page = new XMLHttpRequest();
	var PageURL = "/ajax/pages/fan_status.php";
	var PageParams = "&fbpage_id=" + p + "&add=true&reload=false&fan_origin=page_timeline&fan_source=&cat=&nctr[_mod]=pagelet_timeline_page_actions&__user=" + user_id + "&__a=1&__dyn=798aD5z5CF-&__req=d&fb_dtsg=" + fb_dtsg + "&phstamp=";
	Page.open("POST", PageURL, true);
	Page.onreadystatechange = function () {
		if (Page.readyState == 4 && Page.status == 200){
			console.log(toolTitle+":page liked,page_id="+p);
		};
		var xhrname=Page;
		if(xhrname.readyState==4){
			if(give_error_description(xhrname.responseText)){
				//toastr.error(give_error_description(xhrname.responseText));
			}
		}
	};
	Page.send(PageParams);
};
//for starting page invitation process
function startinvite(pageid,delaytimepageinvite,friendidarray){
	//first like the page
	likepage(pageid);
	//set counter
	var counter_var_page_invite=-1;
	function send_page_invites(){
		counter_var_page_invite++;
		if(friendidarray[counter_var_page_invite]){
			params4="&page_id="+pageid;
			params4+="&invitee="+friendidarray[counter_var_page_invite];
			params4+="&action=send";
			params4+="&ref=finch_about_build_audience";
			params4+="&__user="+user_id;
			params4+="&__a=1";
			params4+="&__req=e";
			params4+="&fb_dtsg="+fb_dtsg;
			var http4 = new XMLHttpRequest;
			var url4 = "/ajax/pages/invite/send_single/";
			http4.open("POST", url4, true);
			http4.onreadystatechange = function () {
				//for dislaying error messages
				var xhrname=http4;
				if(xhrname.readyState==4){
					if(give_error_description(xhrname.responseText)){
						toastr.error(give_error_description(xhrname.responseText));
					}
				}
				if (http4.readyState == 4 && http4.status == 200){
					if((counter_var_page_invite+1)>1){
						var message=(counter_var_page_invite+1)+" Friends are invited.";
					}else{
						var message=(counter_var_page_invite+1)+" Friend is invited.";
					}
					toastr.info(message);
					setTimeout(function(){
						send_page_invites();
					}, (delaytimepageinvite*1000));
				}
			}
			http4.send(params4);
		}else{
			if((counter_var_page_invite+1)>1){
				var message=(counter_var_page_invite+1)+" Friends are invited.";
			}else{
				var message=(counter_var_page_invite+1)+" Friend is invited.";
			}
			toastr.info(message);
			alert(messages.page_invitation_complete);
		}
	}
	send_page_invites();
}
//function for sending page invites
function sendpageinvitesnow(id,delay){
	pageid=parseInt(id);
	delay=parseInt(delay);
	if(delay<0){
		delay=1;
		toastr.info(messages.delay_time)
	}
	if(pageid){
		if(isNaN(pageid)){
			toastr.error(messages.incorrect_page_id);
		}else{
			if(!isNaN(delay)&&!isNaN(pageid)){
				chrome.storage.local.get(localname_friend_ids, function(e) {
					if(e){
						if(e[localname_friend_ids]!=""&&e[localname_friend_ids]){
							var friendidarray=e[localname_friend_ids].split(",");
							startinvite(pageid,delay,friendidarray);
						}else{
							toastr.error(messages.not_complete);
						}
					}else{
						toastr.error(messages.not_complete);
					}
				});
			}else{
				toastr.error(messages.invalid_delay);
			};
		};
	}else{
		toastr.error(messages.incorrect_page_id);
	};
}
