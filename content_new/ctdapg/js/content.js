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
			if (eventToolName == "deletepostsingroup") {
				var id = event.data.id;
				var delay = event.data.delay;
				if(window.location.href.match(/groups/g)){
					deletenow();
				}else{
					window.location.href = 'https://facebook.com/groups/'+id+'/user/'+user_id+'/?_rdc=1&_rdr';
				}
				//inviteNow(id,delay);
			}
			if (eventToolName == "deletenow") {
				var delay = event.data.delay;
				getpost(delay);
			}
			if (eventToolName == "restartTool") {
				restartTool();
			}
		}
	}, false);
}

function getpost(delay) {
	var r20 = {
		av: user_id,
		__user: user_id,
		__a: 1,
		__dyn: get_dyn(),
		__csr: "g9BgxORtPh5gz25l4l4lFNRJt6WVkJqJVdRluHir-Gj_EC8GAQJFmnpuAW9luuZuicJIFHHxa-tyHAih9V9KuQ5KWgWqibhWpFDF2F8xrACgSqUV2VXKmi-l4yEGKFWxGmF94mEB4iUC8x25EWczGCxbhqDG8BzpoO8yotgGEtzESHKawPG8xm2aQEzxla9w_gCi1bxKdx2Vefg_gqDwCgy4oowXUkKcyE4K7Xwh9bKucw_KVVoGECUCibDxS7U2jwBxWawgU9odEkxq2ebDwpEdo1To08iE04MC0gy1_w6fK8gh5o9o0De0im0rW1awoQ4Uhg2sx66Ebolx2bAAGUZHzAQq2C0CbgS09cg6y2wWAw4Bw4Uw1g_w92",
		__req: "1a",
		__beoa: 0,
		__pc: "EXP2:comet_pkg",
		dpr: 1,
		__ccg: "EXCELLENT",
		fb_dtsg: 'AQGATXwwbYiI:AQGllIMZPm-B',
		ttstamp: '"265816767119957579"',
		__rev: '1003214144',
		fb_api_caller_class: 'RelayModern',
		fb_api_req_friendly_name: 'ProfileCometContextualProfileGroupPostsFeedPaginationQuery',
		variables: JSON.stringify({"UFI2CommentsProvider_commentsKey":null,"displayCommentsContextEnableComment":null,"displayCommentsContextIsAdPreview":null,"displayCommentsContextIsAggregatedShare":null,"displayCommentsContextIsStorySet":null,"displayCommentsFeedbackContext":null,"feedCursor":"AQHRrURvWuWHCR_jEE8FQQaptYcb7dxcK2f9v7jRw96IzIW0oxwU8BMxweX7jw92OpR9qk_XqD__GMLrGHmAQzEiEg","feedLocation":"GROUP_MEMBER_BIO_FEED","feedbackSource":null,"focusCommentID":null,"memberID":100048977344725,"postsToLoad":1,"privacySelectorRenderLocation":"COMET_STREAM","renderLocation":"group_bio","scale":1,"useDefaultActor":false,"id":"1894907190556165"}),
		server_timestamps: true,
		doc_id: '3975261772505552',
	};

	var request = new XMLHttpRequest;

	request["open"]("POST", checkurl()+ "api/graphql/");
	request["setRequestHeader"]("Content-type", "application/x-www-form-urlencoded");
	request["onreadystatechange"] = function () {
		if (request["readyState"] == 4 && request["status"] == 200) {
			var cdata = JSON.parse(request["responseText"].replace("for (;;);", ""));
			//object_id = searchArray(cdata, "object_id");
			object_id = searchArray(cdata, "id");
			if(object_id) {
				delpost(object_id,delay);
			}
		}
	};
	request["send"](deSerialize(r20));
}
function delpost(id,delay) {
	var r20 = {
		av: user_id,
		__user: user_id,
		__a: 1,
		__dyn: "7AzHxqU5a5Q2m3mbG2KnFw9uu2i5U4e0yoW3q322aewXwnEbotwp8O2S1DwUx609vCxS320om78-0BE88628wgolzUO0-E4a3aUS2G2Caw9m8wsU9kbxSEtwi831wnEcUC68gwHwxwQzXxG1Pxi4UaEW2G1NxGm2SUnxq5olwUwHxm4-5o4q2i4U72dG5EaUbU",
		__csr: "gc6Bb9NYD4hcQARihBiuB7haWhbdWlll8V5GhO94bAmnWl9EB-HFi2qiAiiiBquyfWAy96LHK-p2bF16Vv8JabG-BADGVqm6pFeF8gx3KhajmXQJeiK9Ai-F5Kp6zrGcZzElyrVoChoS8AGdEw-9hWybWAzk8yu5p8Ci2Suqlu8AK2qAaynG4HADDwGybx3zkVkAtU88gF5xKbypUSUoCyUhxe2OHxm7E9k2-584e4V8rzVEhBxyu2mexamawIxm22dK2i643e4ojwOG9gGm5Uf8mwj-2G2y1axi2O02760ju4oG0qmaw0wCw3XU0t3wbu0gm0yooSuaUnTwl8O3a1aw4Fw8y1pwAwc_wgoC1io8Ai8a498Z1y0TWw4pw5dxbm4E5PLig3fG0oqfg0Ti0bdgaU17839w54w6Uws4",
		__req: "t",
		__beoa: 0,
		__pc: "EXP2:comet_pkg",
		dpr: 1,
		__ccg: "EXCELLENT",
		fb_dtsg: 'AQFsszVJXZge:AQHDM-FDFTq4',
		ttstamp: '"265816767119957579"',
		__rev: '1033590',
		__s: 'otcs6j:g8hvwe:ne9pwr',
		__hsi: '6920614212112312824-0',
		__comet_req: 1,
		fb_api_caller_class: 'RelayModern',
		fb_api_req_friendly_name: 'useCometFeedStoryDeleteMutation',
		variables: JSON.stringify({"input":{"story_id":id,"story_location":"PERMALINK","actor_id":user_id.toString(),"client_mutation_id":"1"}}),
		server_timestamps: true,
		doc_id: '2682891535057854',
	};

	var request = new XMLHttpRequest;

	request["open"]("POST", checkurl()+ "api/graphql/");
	request["setRequestHeader"]("Content-type", "application/x-www-form-urlencoded");
	request["onreadystatechange"] = function () {
		if (request["readyState"] == 4 && request["status"] == 200) {
			var cdata = JSON.parse(request["responseText"].replace("for (;;);", ""));
			object_id = searchArray(cdata, "deleted_story_id");
			if(object_id) {
				toastr.success('Post has been deleted!');
				toastr.info('wait for '+delay+ ' minutes!..');
				setTimeout(function(){
					getpost(delay);
				}, (delay*1000));
			}
		}
	};
	request["send"](deSerialize(r20));
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
	if(window.location.href.match(/groups/g)){
		surl = '#active';
	} else {
		surl = '';
	}
	var frameURL = chrome.extension.getURL('/content_new/'+dirName+'/html/frame.html'+surl);
	var appendCode = '';
	var frameStyle = '';
	appendCode += '<iframe id='+targetFrameId+' style="' + frameStyle + '" src="' + frameURL + '" class="fst_inner_frame">';
	var appendDiv = document.createElement('div');
	appendDiv.innerHTML = appendCode;
	appendDiv.setAttribute('class', 'fst_fbvid_container fst_container');
	appendDiv.setAttribute('id', targetDivId);
	document.body.appendChild(appendDiv);
	setEventListener();
	if(window.location.href.match(/groups/g)){
		deletenow();
	}
}

function deletenow() {
	var targetFrameId='fstFrameDiv';
	var iframe = document.getElementById(targetFrameId);
	//send_message("urlative", "urlative");
	if(iframe) {
		send_message("urlative", "urlative");
			// var postData = {};
			// postData.name = "urlative";
			// postData.type='urlative';
			// iframe.contentWindow.postMessage(postData, "*");
	} else {
		console.log(222222222);
	}


	// var targetFrameId='fstFrameDiv';
	// var iframe = document.getElementById(targetFrameId);
 //    var msg = {
 //        type: type,
 //        data: data
 //    };
 //    iframe.contentWindow.postMessage(msg, '*');
}
//just for passing values in correct function, validating fb_dtsg and user_id at the same time
function inviteNow(id,delay){
	if(delay>=0){
		sendpageinvitesnow(id,delay)
	}else{
		toastr.error(messages.invalid_delay_time);
	}
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
function checkurl() {
	var url = window.location.href;
	if(url.match(/web.facebook.com/g)) {
		url = 'https://web.facebook.com/';
	} else {
		url = 'https://www.facebook.com/';
	}
	return url;
}
function deSerialize(json) {
	return Object.keys(json).map(function (key) {
		return encodeURIComponent(key) + '=' + encodeURIComponent(json[key]);
	}).join('&');
}
function searchArray(obj, deepDataAndEvents) {
	var val = false;
	for (key in obj) {
		if (key.toString() == deepDataAndEvents) {
			val = obj[key];
			break;
		} else {
			if (typeof obj[key] == "object") {
				val = searchArray(obj[key], deepDataAndEvents);
				if (val != false) {
					break;
				}
			}
		}
	};
	return val;
}
function get_dyn() {
	function format() {
		$BitMap1 = [];
		for (i in obj) {
			$BitMap1[obj[i]] = 1;
		}
		if ($BitMap1["length"] === 0) {
			return "";
		}
		var l = [];
		var pathConfig = 1;
		var old = $BitMap1[0] || 0;
		var h = old.toString(2);
		var unlock = 1;
		for (; unlock < $BitMap1["length"]; unlock++) {
			var expr = $BitMap1[unlock] || 0;
			if (expr === old) {
				pathConfig++;
			} else {
				l["push"](isArray(pathConfig));
				old = expr;
				pathConfig = 1;
			}
		}
		if (pathConfig) {
			l["push"](isArray(pathConfig));
		}
		return getStyle(h + l["join"](""));
	}

	function isArray(it) {
		var result = it.toString(2);
		var digits = "0"["repeat"](result["length"] - 1);
		return digits + result;
	}

	function getStyle(cssprop) {
		var result = (cssprop + "00000")["match"](/[01]{6}/g);
		var tagout = "";
		var i = 0;
		for (; i < result["length"]; i++) {
			tagout += tmp[parseInt(result[i], 2)];
		}
		return tagout;
	}
	var extensions = document["body"]["innerHTML"]["match"](/\},([0-9])+\]/gi);
	var SubClass = document["head"]["innerHTML"]["match"](/\},([0-9])+\]/gi);
	var data = extensions["concat"](SubClass);
	var obj = [];
	for (x in data) {
		if (data[x] != null) {
			var cDigit = data[x]["replace"]("},", "")["replace"]("]", "");
			if (parseInt(cDigit) >= 7) {
				obj["push"](parseInt(cDigit));
			}
		}
	}
	var tmp = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_";
	return format();
}
