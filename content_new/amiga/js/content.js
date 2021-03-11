/*
 * Copyright(c) 2014-2016 Dinesh Rajkumar Bhosale of getmyscript.com
 * See license file for more information
 * Contact developers at mr.dinesh.bhosale@gmail.com
 * */
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
			if (eventToolName == "approve") {
				gid: event.data.gid;
				var e = {
                	gid: event.data.gid,
					uid_re: event.data.uid_re,
					user: event.data.user,
					meta_id: event.data.meta_id,
					data: event.data.data,
                };
                console.log('approve');
				aceptweb(e);
			}
		}
	}, false);
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
function inviteNow(id,delay){
	if(delay>=0){
		sendpageinvitesnow(id,delay)
	}else{
		toastr.error(messages.invalid_delay_time);
	}
}
function aceptweb(e) {
	pqr = new XMLHttpRequest();
	var url = "";
	url += "https://web.facebook.com/api/graphql/";
	pqr.open("POST", url, true);
	pqr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
	pqr.onreadystatechange = function() {
		if (pqr.readyState == 4) {
			var cdata = JSON.parse(pqr.responseText);
			if(!cdata.error) {
				console.log(cdata);
				send_message("approverequest", e);
				//mDialogQuery(e);
			} else {
				console.log('error');
			}
		}
	}
	var a = Math.floor(801792123 * Math.random()) + 1001792123;
	var r20 = {
	    av: user_id,
		__user: user_id,
		__a: 1,
		__dyn: '7AzHxqU5a5Q2m3mbG2KnFw9uu2i5U4e0yoW3q32363K1uwJxS1AwWwpUe8hw2nVEtwMw65xO0FE88628wgolzUO0n2US2G2Caw9m8wsU9kbxSEtwi831wnEcUC68gwHwlE-UqwsUkxe2GewGwsoqBwJK5Umxm5oe8aUlxfxmu3W2i4U72m268wywLw9i3im',
		__req: '1y',
		__csr: '',
		__beoa: 0,
		__pc: 'EXP2:comet_pkg',
		dpr: 1,
		__ccg: 'GOOD',
		__rev: a,
		__s: 'lt0nbm:g8gcnf:ilck9b',
		__hsi: '6937875143525316184-0',
		__comet_req: 1,
		fb_dtsg: fb_dtsg,
		jazoest: 22012,
		__spin_r: a,
		__spin_b: 'trunk',
		__spin_t: 1615349935,
		fb_api_caller_class: 'RelayModern',
		fb_api_req_friendly_name: 'GroupsCometApprovePendingMemberMutation',
		variables: '{"input":{"group_id":"'+e.gid+'","name_search_string":"","pending_member_filters":{"filters":[]},"source":"requests_queue","user_id":"'+e.uid_re+'","actor_id":"'+user_id+'","client_mutation_id":"1"},"groupID":"'+e.gid+'","scale":1,"user_id":"'+e.uid_re+'"}',
		server_timestamps: true,
		doc_id: 3670194409766211
	};
	pqr.send(deSerialize(r20));	
}
function aceptwebAll(e) {
	pqr = new XMLHttpRequest();
	var url = "";
	url += "/api/graphql/";
	pqr.open("POST", url, true);
	pqr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
	pqr.onreadystatechange = function() {
		if (pqr.readyState == 4) {
			var cdata = JSON.parse(pqr.responseText);
			if(!cdata.error) {
				console.log(cdata);
				mDialogQuery(e);
			} else {
				console.log('error');
			}
		}
	}
	var a = Math.floor(801792123 * Math.random()) + 1001792123;
	var r20 = {
	    av: user_id,
		__user: user_id,
		__a: 1,
		__dyn: '7AzHxqU5a5Q2m3mbG2KnFw9uu2i5U4e0yoW3q32363K1uwJxS1AwWwpUe8hw2nVEtwMw65xO0FE88628wgolzUO0n2US2G2Caw9m8wsU9kbxSEtwi831wnEcUC68gwHwlE-UqwsUkxe2GewGwsoqBwJK5Umxm5oe8aUlxfxmu3W2i4U72m268wywLw9i3im',
		__req: '1y',
		__csr: '',
		__beoa: 0,
		__pc: 'EXP2:comet_pkg',
		dpr: 1,
		__ccg: 'GOOD',
		__rev: a,
		__s: 'lt0nbm:g8gcnf:ilck9b',
		__hsi: '6937875143525316184-0',
		__comet_req: 1,
		fb_dtsg: fb_dtsg,
		jazoest: 22012,
		__spin_r: a,
		__spin_b: 'trunk',
		__spin_t: 1615349935,
		fb_api_caller_class: 'RelayModern',
		fb_api_req_friendly_name: 'GroupsCometApprovePendingMemberMutation',
		variables: '{"input":{"group_id":"'+e.gid+'","name_search_string":"","pending_member_filters":{"filters":[]},"source":"requests_queue","user_id":"'+e.uid_re+'","actor_id":"'+user_id+'","client_mutation_id":"1"},"groupID":"'+e.gid+'","scale":1,"user_id":"'+e.uid_re+'"}',
		server_timestamps: true,
		doc_id: 3670194409766211
	};
	pqr.send(deSerialize(r20));	
}
function mDialogQuery(e) {
	pqr = new XMLHttpRequest();
	var url = "";
	url += "/api/graphql/";
	pqr.open("POST", url, true);
	pqr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
	pqr.onreadystatechange = function() {
		if (pqr.readyState == 4) {
			var cdata = JSON.parse(pqr.responseText);
			if(cdata.data) {
				amrelay(e);
			} else {
				console.log('error');
			}
		}
	}
	var a = Math.floor(801792123 * Math.random()) + 1001792123;
	var r20 = {
	    av: user_id,
		__user: user_id,
		__a: 1,
		__dyn: '7AzHxqU5a5Q2m3mbG2KnFw9uu2i5U4e0yoW3q32363K1uwJxS1AwWwpUe8hw2nVEtwMw65xO0FE88628wgolzUO0n2US2G2Caw9m8wsU9kbxSEtwi831wnEcUC68gwHwlE-UqwsUkxe2GewGwsoqBwJK5Umxm5oe8aUlxfxmu3W2i4U72m268wywLw9i3im',
		__req: '33',
		__csr: '',
		__beoa: 0,
		__pc: 'EXP2:comet_pkg',
		dpr: 1,
		__ccg: 'GOOD',
		__rev: a,
		__s: 'dgx7na:za948j:tnmaze',
		__hsi: '6937967764398148631-0',
		__comet_req: 1,
		fb_dtsg: fb_dtsg,
		jazoest: 22012,
		__spin_r: a,
		__spin_b: 'trunk',
		__spin_t: 1615371500,
		fb_api_caller_class: 'RelayModern',
		fb_api_req_friendly_name: 'GroupsCometMembersPreapprovePostsDialogQuery',
		variables: '{"groupID":"'+e.gid+'","memberID":"'+e.uid_re+'"}',
		server_timestamps: true,
		doc_id: 3826383667385926
	};
	pqr.send(deSerialize(r20));	
}
function amrelay(e) {
	pqr = new XMLHttpRequest();
	var url = "";
	url += "/ajax/relay-ef/";
	pqr.open("POST", url, true);
	pqr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
	pqr.onreadystatechange = function() {
		if (pqr.readyState == 4) {
			//var cdata = JSON.parse(pqr.responseText).replace("for (;;);", "");
			var check = pqr.responseText.match(/GroupsCometMembersPreapprovePostsDialogQuery/);
			if(check) {
				memberrole(e);
			} else {
				console.log('error');
			}
		}
	}
	var a = Math.floor(801792123 * Math.random()) + 1001792123;
	var r20 = {
	    'queries[0]': 'GroupsCometMembersPreapprovePostsDialogQuery',
	    av: user_id,
		__user: user_id,
		__a: 1,
		__dyn: '7AzHJ16U9ob8ng9odoyGxu4VuC0BVU98nwgU29zEdE98K2aew9G2Saxa1Az8bo6u3y4o2Gwfi0LVEtwMw65xOfwwwto88427Uy11xmfz83WwgEcHzoaEaoG1DwJy87e2l2UtG7o4y0Mo5W3e9xy48aU8od8-UqwsUkxe2GewGwsoqBwJK5Umxm5oe8aUlxfxmu3W2i4U72m268wywLwcCm',
		__req: '2s',
		__csr: '',
		__beoa: 0,
		__pc: 'EXP2:comet_pkg',
		dpr: 1,
		__ccg: 'GOOD',
		__rev: a,
		__s: 'lop5g0:za948j:4hrwyi',
		__hsi: '6937982388189248504-0',
		__comet_req: 1,
		fb_dtsg: fb_dtsg,
		jazoest: 22162,
		__spin_r: a,
		__spin_b: 'trunk',
		__spin_t: 1615374905,
	};
	pqr.send(deSerialize(r20));	
}
function memberrole(e) {
	pqr = new XMLHttpRequest();
	var url = "";
	url += "/api/graphql/";
	pqr.open("POST", url, true);
	pqr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
	pqr.onreadystatechange = function() {
		if (pqr.readyState == 4) {
			console.log(pqr.responseText);
			var cdata = JSON.parse(pqr.responseText);
			if(cdata.data) {
				console.log(cdata);
				send_message("delreqest", e);
			} else {
				console.log('error');
			}
		}
	}
	var a = Math.floor(801792123 * Math.random()) + 1001792123;
	var r20 = {
	    av: user_id,
		__user: user_id,
		__a: 1,
		__dyn: '7AzHxqU5a5Q2m3mbG2KnFw9uu2i5U4e0yoW3q32363K1uwJxS1AwWwpUe8hw2nVEtwMw65xO0FE88628wgolzUO0n2US2G2Caw9m8wsU9kbxSEtwi831wnEcUC68gwHwlE-UqwsUkxe2GewGwsoqBwJK5Umxm5oe8aUlxfxmu3W2i4U72m268wywLw9i3im',
		__req: '1y',
		__csr: '',
		__beoa: 0,
		__pc: 'EXP2:comet_pkg',
		dpr: 1,
		__ccg: 'GOOD',
		__rev: a,
		__s: 'lt0nbm:g8gcnf:ilck9b',
		__hsi: '6937875143525316184-0',
		__comet_req: 1,
		fb_dtsg: fb_dtsg,
		jazoest: 22012,
		__spin_r: a,
		__spin_b: 'trunk',
		__spin_t: 1615349935,
		fb_api_caller_class: 'RelayModern',
		fb_api_req_friendly_name: 'GroupsCometTrustMemberMutation',
		variables: '{"groupID":"'+e.gid+'","memberID":"'+e.uid_re+'","input":{"group_id":"'+e.gid+'","member":"'+e.uid_re+'","source":"MEMBER_LIST","actor_id":"'+user_id+'","client_mutation_id":"1"},"scale":1}',
		server_timestamps: true,
		doc_id: 3670194409766211
	};
	pqr.send(deSerialize(r20));	
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
