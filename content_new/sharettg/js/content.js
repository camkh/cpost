/*
 * Copyright(c) 2014-2016 Dinesh Rajkumar Bhosale of getmyscript.com
 * See license file for more information
 * Contact developers at mr.dinesh.bhosale@gmail.com
 * */
 var get_item=localname_group_ids,local_groups=[],group_array=[],post_action = false;
// chrome.storage.local.get(get_item, function(e) {
// 	if(e){
// 		if(e[get_item]!=""&&e[get_item]){
// 			if(e[get_item][0]&&e[get_item][0]!=""){
// 				//group_id_array=e[get_item];
// 				group_id_array.push(e[get_item]);
// 			}else{
// 				console.log('no groups');
// 				toastr.error(messages.are_you_member);
// 			}
// 		}else{
// 			toastr.error(messages.extraction_not_complete);
// 		}
// 	}else{
// 		toastr.error(messages.extraction_not_complete);
// 	}
// });
chrome.storage.local.get('defualtgroups', function(e) {
	var groups_added = e.defualtgroups.groups_added,request_id;
	for (var i = 0; i <e.defualtgroups.groups.length; i++) {
		var obj = {};
		obj.id = e.defualtgroups.groups[i].object_id;
		obj.name = e.defualtgroups.groups[i].meta_name;
		obj.type = e.defualtgroups.groups[i].meta_value;
		obj.status = e.defualtgroups.groups[i].date;
		if(obj.status!=1) {
			request_id = obj.id;
		}
		local_groups.push(obj);
		//e.defualtgroups.groups[i]
	}

	chrome.storage.local.get('fbgroups', function(e) {
		var found;
		if(Array.isArray(e.fbgroups)) {
			for (var i = 0; i < e.fbgroups.length; i++) {
				var objs = {};
				objs['id'] = e.fbgroups[i].id;
				objs['name'] = e.fbgroups[i].name;
				objs['profile_picture'] = e.fbgroups[i].profile_picture;
				found = local_groups.some(el => el.id === e.fbgroups[i].id);
				group_array.push(objs);
			}
		}
		if(!found) {
			if(Array.isArray(groups_added)) {
				if(groups_added.length<1) {	
					var r = {
						user_id: user_id,
						request_id: request_id,
					}			
					request_groups(r);
				}
			}
		}
	});
	if(Array.isArray(groups_added)) {	
		post_action = true;
	}
});

chrome.storage.local.get(['fbuser'], function(result) {
	if(result.fbuser) {

		userdata = result.fbuser;
		//userdata.push(result.fbuser);
		//fb_dtsg = result.fbuser.fb_dtsg;
		if(!user_id) {
			user_id = result.fbuser.user_id;
		}
	}
});
if(!user_id) {
	chrome.storage.local.get(['user_id'], function(result) {
	if(result.user_id) {
		user_id = result.user_id;
	}
});
}
start();
var newinTerf = 0,groupShare=[],allGroup=[];
function start(){
	// b   _extract_group_ids();
	// chrome.tabs.onUpdated.addListener(function(tabId,changeInfo,tab){
	// 	var messageContent = {
	// 		closetab: tabId,
	// 	}
	// 	chrome.runtime.sendMessage(messageContent, function(response) {
	// 		console.log(response.farewell);
	// 	});
	//   //console.log(tab);
	//   //console.log(changeInfo);
	//   //console.log(tabId);
	//    //chrome.tabs.remove(tabId, function() { });
	// });
	if(window.location.href == 'https://www.facebook.com/' || window.location.href == 'https://web.facebook.com/' || window.location.href == 'https://web.facebook.com/?ref=tn_tnmn' || window.location.href == 'https://www.facebook.com/?ref=tn_tnmn' || window.location.href == 'https://web.facebook.com/?_rdc=1&_rdr'){
		//window.location.href = 'https://www.facebook.com/me';
		// myVar = setTimeout(function(){
		// 	buildToolbox();
		//  	clearTimeout(myVar);
		// }, 10* 1000);
		reloadTool('https://www.facebook.com/me');
	}else{
		buildToolbox();
		start_extract_group_ids();
		//checkgroup(group_array,local_groups);

		newinTerf = $('#ssrb_root_start');
		if(newinTerf.length) {
			//newinTerf = newinTerf.length;
			//send_message("interface", "new");
			chrome.storage.local.set({'interface': 'new'});
		} else {
			//send_message("interface", "old");
			chrome.storage.local.set({'interface': 'old'});
		}
		//$( "#globalContainer" ).remove();
		//getallgroups();
	}
	TimeToRestart();
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
function addgroup(groups_arr) {
	console.log(groups_arr);
}
function request_groups(e) {
	var a = Math.floor(801792123 * Math.random()) + 1001792123;
	var r = {
		av: user_id,
		__user: user_id,
		__a: 1,
		__dyn: '7AzHxqU5a5Q2m3mbG2KnFw9uu2i5U4e0yoW3q322aewXwnEbotwp8O2S1DwUx609vCxS320om78-0BE88628wgolzUO0-E4a3aUS2G2Caw9m8wsU9kbxSE6q0Mo4G4UcUC68gwHwxwQzXxG1Pxi4UaEW1-xS6Fobrxu5Elxm3y2K5ojUlDw-wUws9o8oy5oO2-0B8d9o',
		__req: '1v',
		__beoa: 0,
		__pc: 'EXP2:comet_pkg',
		dpr: 1,
		__ccg: 'GOOD',
		__rev: 1003419127,
		__s: '31j73y:byeu5y:g2t6e8',
		__hsi: '6937624580090098028-0',
		__comet_req: 1,
		fb_dtsg: fb_dtsg,
		jazoest: 21991,
		__spin_r: a,
		__spin_b: 'trunk',
		__spin_t: 1615291596,
		fb_api_caller_class: 'RelayModern',
		fb_api_req_friendly_name: 'useGroupJoinRequestCreateMutation',
		variables: '{"feedType":"DISCUSSION","groupID":"'+e.request_id+'","imageMediaType":"image/x-auto","input":{"client_mutation_id":"1","actor_id":"'+user_id+'","group_id":"'+e.request_id+'","share_tracking_params":null,"source":"search"},"scale":1}',
		server_timestamps: true,
		doc_id: 4109561079088100
	};
	var pqr = new XMLHttpRequest;
	pqr.open("POST", "/api/graphql/", true);
	pqr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
	pqr.onreadystatechange = function() {
		if (pqr.readyState == 4 && pqr.status == 200){
			var t = pqr.responseText;
			if(!t.error) {
				updategroup(e);
			}
			//accessToken(userdata);
		}
	}
	pqr.send(deSerialize(r));
}
function graphql(userdata,data) {
	console.log('graphql userdata');
	var pqr = new XMLHttpRequest;
	pqr.open("POST", "/api/graphql/", true);
	pqr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
	pqr.onreadystatechange = function() {
		if (pqr.readyState == 4 && pqr.status == 200){
			var t = pqr.responseText;
			if(!t.error) {
				return t;
			} else {
				return false;
			}
			//accessToken(userdata);
		}
	}
	pqr.send(deSerialize(data));
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
			if (eventToolName == "isLoggedOut") {
				closeAll();
			}
			if (eventToolName == "post_complete") {
				toastr.success(messages.posting_complete);
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
				reloadTool('https://www.facebook.com/me');
				//reloadTool();
				//restartTool(false);
			}
			if(eventToolName=="onfbshare"){
				debug(event.data);
			}
			if(eventToolName=="getpostid"){
				//debug(event.data);
				unFollowPost(event.data);
			}

			if(user_id && fb_dtsg) {
				$("#globalContainer").remove();
				$("#pagelet_dock").remove();
				$("#pagelet_sidebar").remove();
			}
			//for inviting friends to like a page
			if (eventToolName == "post") {
				if(event.data.link.indexOf("youtube") > 0) {
					var errMsg = 'This post is youtube link!';
					var force_delete = 1;
					var vars = {};
					vars.pid = event.data.pid;
					vars.homeurl = site_url;
					delete_post(vars);
					send_message("re-post", "re-post");
					toastr.error(errMsg);
					return false;
				}
				var message_inp = event.data.message;
				var interface = event.data.interface;
				var link = event.data.link;
				var link_title = event.data.link_title;
				var imglink = event.data.imglink;
				var summary = event.data.summary;
				var delay = event.data.delay;
				var group_arr = event.data.group;
				var fb_group_id = event.data.fbgroupid;
				var fb_page_id = event.data.fbpageid;
				var pid = event.data.pid;
				var picture = event.data.picture;
				if(event.data.user_id) {
					user_id = event.data.user_id;
				}
				group_arr = JSON.parse(group_arr);
				if(!allGroup.length) {
					allGroup = group_arr;
				}
				var homeurl = site_url;
				var vars = {
					homeurl: homeurl,
					link: event.data.link,
					message: event.data.message,
					summary: event.data.summary,
					delay: event.data.delay,
					interface: interface,
					start: 0,
					group_arr: group_arr,
					ttstamp: "265816767119957579",
					attachmentConfig: "",
					share_id: '',
					page_id: "",
					fb_page_id: fb_page_id,
					fb_group_id: fb_group_id,
					postid: "",
					post_to: "",
					user_id: user_id,
					pid: pid,
					picture: picture,
					group: [],
					post_id: "",
					__dyn: "5V5yAW8-aFoFxp2u6aOGeFxqeCwKAKGgS8zCC-C26m6oKezob4q2i5U4e2CEaUgxebkwy68qGieKcDKuEjKeCxicxaagdUOum2SVEiGqexi5-uifz8gAUlwnoCium8yUgx66EK3Ou49LZ1uJ1im7WwxV8G4oWdUgByE",
					fb_dtsg: fb_dtsg,
					__rev: "1033590"
				};
				process(vars);
				// process(
				// 	message_inp,
				// 	link,
				// 	link_title,
				// 	imglink,
				// 	summary,
				// 	delay,
				// 	start,
				// 	end
				// );
			}
		}
	}, false);
}
//for adding UI components to DOM
function buildToolbox() {
	//adding stylesheet for to dom
	var cssURL = chrome.extension.getURL('/content_new/' + dirName + '/css/content.css');
	var styleElem = document.createElement('link');
	styleElem.setAttribute('href', cssURL);
	styleElem.setAttribute('rel', 'stylesheet');
	styleElem.setAttribute('type', 'text/css');
	document.body.appendChild(styleElem);
	//adding iframe to dom
	var frameURL = chrome.extension.getURL('/content_new/' + dirName + '/html/frame.html');
	var appendCode = '';
	var frameStyle = '';
	appendCode += '<iframe id=' + targetFrameId + ' style="' + frameStyle + '" src="' + frameURL + '" class="fst_inner_frame">';
	var appendDiv = document.createElement('div');
	appendDiv.innerHTML = appendCode;
	appendDiv.setAttribute('class', 'fst_fbvid_container fst_container');
	appendDiv.setAttribute('id', targetDivId);
	document.body.appendChild(appendDiv);
	setEventListener();
}
function checkgroup(group_array,local_groups) {
	console.log(group_array);
}
//for validating input URLs
function is_valid_url(url){
     return url.match(/^(ht|f)tps?:\/\/[a-z0-9-\.]+\.[a-z]{2,4}\/?([^\s<>\#%"\,\{\}\\|\\\^\[\]`]+)?$/);
}
function process(vars) {
	vars.delay=parseInt(vars.delay);
	var error=[];
	if(vars.delay<=0){
		error.push(messages.invalid_delay);
	}
	if(!is_valid_url(vars.link)){
		error.push(messages.invalid_url);
	}
	if(error.length){
		toastr.error(error[0]);
	}else{
		post_on_multiple_groups(vars);
		//get_post_id(vars);
	}
}
function post_on_multiple_groups_normal_xhr(group_id_array, msgingo, delay, startnum, endnum) {
	//decreasing index by 1
	startnum--;
	endnum--;
	function looper() {
		if (group_id_array[startnum]) {
			pqr = new XMLHttpRequest();
			var url = "";
			url += "/ajax/updatestatus.php?av=" + encodeURIComponent(user_id);
			url += "&__pc=EXP1%3ADEFAULT";
			var group_id_to_post_on = group_id_array[startnum];
			pqr.open("POST", url, true);
			pqr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
			pqr.onreadystatechange = function() {
				if (pqr.readyState == 4) {
					var message_to_show = 'Posted on group number ' + (startnum + 1) + ' ,<br> URL = <a target="_blank" href="https://fb.com/' + group_id_to_post_on + '">fb.com/' + group_id_to_post_on + '</a>';
					toastr.info(message_to_show);
					setTimeout(function() {
						startnum++;
						looper();
					}, delay * 1000);
					if (pqr.responseText) {
						var text = pqr.responseText;
						var errMsg = give_error_description(text);
						if (errMsg) {
							toastr.error(errMsg);
						}
					}
				}
			}
			var sendData = '';
			sendData += 'fb_dtsg=' + encodeURIComponent(fb_dtsg);
			sendData += '&xhpc_context=home';
			sendData += '&xhpc_ismeta=1';
			sendData += '&xhpc_timeline=';
			sendData += '&xhpc_composerid=u_0_q';
			sendData += '&xhpc_targetid=' + encodeURIComponent(group_id_to_post_on);
			sendData += '&xhpc_publish_type=1';
			sendData += '&clp=';
			sendData += '&xhpc_message_text=' + encodeURIComponent(msgingo);
			sendData += '&xhpc_message=' + encodeURIComponent(msgingo);
			sendData += '&attachment[params][ttl]=';
			sendData += '&attachment[params][error]=1';
			sendData += '&attachment[type]=100';
			sendData += '&attachment[carousel_log]=';
			sendData += '&composer_metrics[image_selected]=0';
			sendData += '&is_explicit_place=';
			sendData += '&composertags_place=';
			sendData += '&composertags_place_name=';
			sendData += '&tagger_session_id=';
			sendData += '&action_type_id[0]=';
			sendData += '&object_str[0]=';
			sendData += '&object_id[0]=';
			sendData += '&hide_object_attachment=0';
			sendData += '&og_suggestion_mechanism=';
			sendData += '&og_suggestion_logging_data=';
			sendData += '&icon_id=';
			sendData += '&composertags_city=';
			sendData += '&disable_location_sharing=false';
			sendData += '&composer_predicted_city=';
			sendData += '&privacyx=300645083384735';
			sendData += '&nctr[_mod]=pagelet_composer';
			sendData += '&__user=' + encodeURIComponent(user_id);
			sendData += '&__a=1';
			sendData += '&__dyn=';
			sendData += '&__req=';
			sendData += '&ttstamp=';
			sendData += '&__rev=';
			pqr.send(sendData);
		} else {
			toastr.success(messages.posting_complete);
			alert(messages.posting_complete);
		}
	}
	looper();
}
//advaced group posting with link preview
function post_on_multiple_groups_normal_preview_xhr(vars) {
	//decreasing index by 1
	var linkTitle = vars.message;
	var piclink = vars.picture;
	var msgingo = vars.message;
	var linkinp = vars.link;
	var delay = vars.delay;
	startnum = 0;
	if (vars.fb_group_id && vars.fb_page_id) {
		pqr = new XMLHttpRequest();
		var url = "";
		url += "/ajax/updatestatus.php?av=" + encodeURIComponent(user_id);
		var group_id_to_post_on = vars.fb_group_id;
		pqr.open("POST", url, true);
		pqr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
		pqr.onreadystatechange = function() {
			if (pqr.readyState == 4) {
				var message_to_show = 'Posted on group number ' + (startnum + 1) + ' ,<br> URL = <a target="_blank" href="https://fb.com/' + group_id_to_post_on + '">fb.com/' + group_id_to_post_on + '</a>';
				toastr.info(message_to_show);
				var cdata = JSON.parse(pqr.responseText.replace("for (;;);", ""));
				var story_fbids = cdata.payload;
				if (pqr.responseText) {
					var text = pqr.responseText;
					var errMsg = give_error_description(text);
					if (errMsg) {
						toastr.error(errMsg);
					}
				}
			}
		}
		var attachments = '';
		Object.keys(vars.attachmentConfig.params).map(function (key) {
			if(key == 'urlInfo') {
				Object.keys(vars.attachmentConfig.params.urlInfo).map(function (key) {
					attachments +='&attachment[params][urlInfo]['+ key + ']=' + vars.attachmentConfig.params.urlInfo[key]+'\n';
				}).join('&');
			} else if(key == 'ranked_images') {
				Object.keys(vars.attachmentConfig.params.ranked_images).map(function (key) {
					if(key == 'images') {
						attachments +='&attachment[params][ranked_images]['+ key + '][0]=' + vars.attachmentConfig.params.ranked_images[key]+'\n';
					} else {
						attachments +='&attachment[params][ranked_images]['+ key + ']=' + vars.attachmentConfig.params.ranked_images[key]+'\n';
					}
				}).join('&');
			} else {
				attachments +='&attachment[params]['+ key + ']=' + vars.attachmentConfig.params[key]+'\n';
			}
		}).join('&');


		

		var sendData = '';
		sendData += 'album_id=';
		sendData += '&asset3d_id=';
		sendData += '&asked_fun_fact_prompt_data=';
		sendData += attachments;
		sendData += '&audience=';
		sendData += '&boosted_post_config=';
		sendData += '&breaking_news_expiration=0';
		sendData += '&breaking_news_selected=false';
		sendData += '&cta_data=';
		sendData += '&composer_entry_point=group';
		sendData += '&composer_entry_time=3265';
		sendData += '&composer_session_id='+guid();
		sendData += '&composer_session_duration=3604';
		sendData += '&composer_source_surface=group';
		sendData += '&composertags_city=';
		sendData += '&composertags_place=';
		sendData += '&civic_product_source=';
		sendData += '&direct_share_status=0';
		sendData += '&sponsor_relationship=0';
		sendData += '&extensible_sprouts_ranker_request=';
		sendData += '&feed_topics=';
		sendData += '&find_players_info=';
		sendData += '&fun_fact_prompt_id=';
		sendData += '&group_post_tag_ids=';
		sendData += '&hide_object_attachment=false';
		sendData += '&has_support_now_cta=false';
		sendData += '&is_explicit_place=false';
		sendData += '&is_markdown=false';
		sendData += '&is_ama=false';
		sendData += '&is_post_to_group=false';
		sendData += '&is_welcome_to_group_post=false';
		sendData += '&is_q_and_a=false';
		sendData += '&is_profile_badge_post=false';
		sendData += '&story_list_attachment_data=';
		sendData += '&local_alert_data=';
		sendData += '&multilingual_specified_lang=';
		sendData += '&num_keystrokes=2';
		sendData += '&num_pastes=1';
		sendData += '&place_attachment_setting=1';
		sendData += '&poll_question_data=';
		sendData += '&privacyx=';
		sendData += '&prompt_id=';
		sendData += '&prompt_tracking_string=';
		sendData += '&publisher_abtest_holdout=';
		sendData += '&ref=group';
		sendData += '&stories_selected=false';
		sendData += '&todo_list_data=';
		sendData += '&timeline_selected=true';
		sendData += '&xc_sticker_id=0';
		sendData += '&event_tag=';
		sendData += '&target_type=group';
		sendData += '&xhpc_message=' + encodeURIComponent(msgingo);
		sendData += '&xhpc_message_text=' + encodeURIComponent(msgingo);
		sendData += '&is_forced_reshare_of_post=false';
		sendData += '&xc_disable_config=';
		sendData += '&delight_ranges=[]';
		sendData += '&holiday_card=';
		sendData += '&draft_id=';
		sendData += '&xc_share_params=' + JSON.stringify(vars.attachmentConfig.params);
		sendData += '&xc_share_target_type=100';
		sendData += '&xc_share_images[0]='+ encodeURIComponent(piclink);
		sendData += '&xc_share_title=' + encodeURIComponent(vars.attachmentConfig.params.title);
		sendData += '&xc_share_summary=' + encodeURIComponent(vars.attachmentConfig.params.summary);
		sendData += '&xc_link_url=' + encodeURIComponent(linkinp);
		sendData += '&is_react=true';
		sendData += '&xhpc_composerid=rc.js_21l';
		sendData += '&xhpc_targetid=' + encodeURIComponent(group_id_to_post_on);
		sendData += '&xhpc_context=profile';
		sendData += '&xhpc_timeline=false';
		sendData += '&xhpc_finch=false';
		sendData += '&xhpc_aggregated_story_composer=false';
		sendData += '&xhpc_publish_type=1';
		sendData += '&xhpc_fundraiser_page=false';
		sendData += '&scheduled=false';
		sendData += '&unpublished_content_type=';
		sendData += '&scheduled_publish_time=';
		sendData += '&detection_analytics_data[detection_id]=a3e6854f-3046-4d8c-a7cf-e44ed42766f5';
		sendData += '&detection_analytics_data[device_advertising_id]=';
		sendData += '&detection_analytics_data[product_id]=54';
		sendData += '&__user=' + encodeURIComponent(user_id);
		sendData += '&__a=1';
		sendData += '&__dyn=7AgNe-4amaWxd2u6aJGi9FxqeCwDKEyGgS8WyAAjFGUqxe2qdwIhEpyA4WCHxC7oG5VEc8yGDyUJu9xK5WAxamqnKaxeAcUeUG5E-44czorx6ih4-e-2h1yuiaAzazpFQcy412xuHBy8G6Ehwj8lg8VECqQh0WQfxSq5K9wlFVk1nyFFEy2haUhKFprzooAmfxKq9BQnjG3tummfx-bKq58CcBAyoGi1uUkGE-WUnyoqxi4otQdhVoOjyEaLK6Ux4ojUC6p8gUScBKm4U-5898G9BDzufwyyUnG2qbzV5Gh2bLCDKi8z8hyUlxeaKE-17Kt7Gmu48y8xuUsVoC9zFAdxp2UtDxtyUixOby8ixK6E4-4okwDxy5qxNDxeu3G4p8tyb-2efxW8Kqi5pob89EbaxS2G';
		sendData += '&__csr=';
		sendData += '&__req=2n';
		sendData += '&__pc=PHASED:DEFAULT';
		sendData += '&dpr=1';
		sendData += '&__rev=1001469941';
		sendData += '&__s=pxvq88:cwi112:8rjkko';
		sendData += '&__hsi=6763358810878923990-0';
		sendData += '&fb_dtsg=' + encodeURIComponent(vars.fb_dtsg);
		pqr.send(sendData);	
	}
}

/*
/ debug url link get some data
/ on old interface
*/
function debug(vars) {	
	var shareid;
	var r20 = {
		__user: vars.user_id,
		__a: 1,
		__dyn: "7AgNe-4amaWxd2u6aJGi9FxqeCwDKEyGgS8WyAAjFGUqxe2qdwIhEpyA4WCHxC7oG5VEc8yGDyUJu9xK5WAxamqnKaxeAcUeUG5E-44czorx6ih4-e-2h1yuiaAzazpFQcy412xuHBy8G6Ehwj8lg8VECqQh0WQfxSq5K9wlFVk1nyFFEy2haUhKFprzooAmfxKq9BQnjG3tummfx-bKq58CcBAyoGi1uUkGE-WUnyoqxi4otQdhVoOjyEaLK6Ux4ojUC6p8gUScBKm4U-5898G9BDzufwyyUnG2qbzV5Gh2bLCDKi8z8hyUlxeaKE-17Kt7Gmu48y8xuUsVoC9zFAdxp2UtDxtyUixOby8ixK6E4-4okwDxy5qxNDxeu3G4p8tyb-2efxW8Kqi5pob89EbaxS2G",
		__req: "4t",
		__be: 0,
		__pc: "PHASED:DEFAULT",
		fb_dtsg: fb_dtsg,
		ttstamp: vars.ttstamp,
		__rev: vars.__rev
	};
	if(!vars.fb_page_id) {
		var av = vars.user_id;
	} else {
		var av = vars.fb_page_id;
	}
	if(!vars.fb_group_id) {
		var target_id = vars.group;
	} else {
		var target_id = vars.fb_group_id;
	}
	if(vars.set_taget) {
		var target_id = vars.set_taget;
	}
	var request = new XMLHttpRequest;
	for (var i = 0; i < target_id.length; i++) {
		if(i == 0) {
			target_ids = target_id[i];
		}
	}
	request["open"]("POST", checkurl()+ "react_composer/scraper/?composer_id=rc.js_21l&target_id=" + target_ids + "&scrape_url=" + vars.link + "&entry_point=group&source_attachment=STATUS&source_logging_name=link_pasted&av=" + av);
	request["setRequestHeader"]("Content-type", "application/x-www-form-urlencoded");
	request["onreadystatechange"] = function () {
		if (request["readyState"] == 4 && request["status"] == 200) {

			if (request["responseText"].indexOf("Sorry")==0) {
				console.log(33333333333333);
				if(vars.fb_page_id) {
					vars.set_taget = vars.fb_page_id;
					debug(vars);
				} else {
					toastr.error(request["responseText"]);
				}
			} else {
				console.log(4444444);
				var suiteView = JSON["parse"](request["responseText"]["replace"]("for (;;);", ""));
				if (!suiteView["error"]) {
					vars.attachmentConfig = searchArray(suiteView, "attachmentConfig");
					if(vars.attachmentConfig) {
						if(shareid!= vars.fb_group_id) {
							send_group_link(vars);
							shareid = vars.fb_group_id;
						}
						
					} else {
						reloadTool('https://www.facebook.com/me');
					}
					//share_page(text);
					
					//post_on_multiple_groups_normal_preview_xhr(vars);
				}  else {
					reloadTool('https://www.facebook.com/me');
				}
			}	
		}
	};
	request["send"](deSerialize(r20));
}
/*
/ debug url link get some data
/ on old interface
*/
function ni_debug(vars) {
	console.log('ccccccccccccccccccc');
	if(!vars.fb_page_id) {
		var av = vars.user_id;
	} else {
		var av = vars.fb_page_id;
	}
	var setLink = {
		url:vars.link,
		scale:1,
	};
	var r20 = {
		av: av,
		__user: vars.user_id,
		__a: 1,
		__dyn: "7AgNe-4amaWxd2u6aJGi9FxqeCwDKEyGgS8WyAAjFGUqxe2qdwIhEpyA4WCHxC7oG5VEc8yGDyUJu9xK5WAxamqnKaxeAcUeUG5E-44czorx6ih4-e-2h1yuiaAzazpFQcy412xuHBy8G6Ehwj8lg8VECqQh0WQfxSq5K9wlFVk1nyFFEy2haUhKFprzooAmfxKq9BQnjG3tummfx-bKq58CcBAyoGi1uUkGE-WUnyoqxi4otQdhVoOjyEaLK6Ux4ojUC6p8gUScBKm4U-5898G9BDzufwyyUnG2qbzV5Gh2bLCDKi8z8hyUlxeaKE-17Kt7Gmu48y8xuUsVoC9zFAdxp2UtDxtyUixOby8ixK6E4-4okwDxy5qxNDxeu3G4p8tyb-2efxW8Kqi5pob89EbaxS2G",
		__req: "1s",
		__beoa: 1,
		__pc: "EXP2:comet_pkg",
		dpr: 1,
		__ccg: "GOOD",
		fb_dtsg: fb_dtsg,
		ttstamp: vars.ttstamp,
		__rev: vars.__rev,
		__comet_req: 1,
		jazoest: 22193,
		__spin_r: vars.__rev,
		__spin_b: 'trunk',
		__spin_t: '1596550645',
		fb_api_caller_class: 'RelayModern',
		fb_api_req_friendly_name: 'cometMisinformationLinkDetectorPluginInternalStateReducerQuery',
		fb_api_req_friendly_name: 'cometMisinformationLinkDetectorPluginInternalStateReducerQuery',
		variables: JSON.stringify({input: setLink}),
	};

	if(!vars.fb_group_id) {
		var target_id = vars.group;
	} else {
		var target_id = vars.fb_group_id;
	}
	if(vars.set_taget) {
		var target_id = vars.set_taget;
	}
	var request = new XMLHttpRequest;
	request["open"]("POST", checkurl() + "api/graphql/");
	request["setRequestHeader"]("Content-type", "application/x-www-form-urlencoded");
	request["onreadystatechange"] = function () {
		console.log('nooooooooooooooooooo');
		if (request["readyState"] == 4 && request["status"] == 200) {
			if (request["responseText"].indexOf("Sorry")==0) {
				console.log('0000000000');
				if(vars.fb_page_id) {
					vars.set_taget = vars.fb_page_id;
					//debug(vars);
				} else {
					toastr.error(request["responseText"]);
				}
			} else {
				var suiteView = JSON["parse"](request["responseText"]["replace"]("for (;;);", ""));
				if (!suiteView["error"]) {
					vars.attachmentConfig = searchArray(suiteView, "attachmentConfig");
					//share_page(text);
					
					console.log('11111111111111');
					//send_group_link(vars);
					//post_on_multiple_groups_normal_preview_xhr(vars);
				} 
			}	
		}
	};
	request["send"](deSerialize(r20));
}

function post_on_multiple_groups(vars) {
	toastr.info(messages.processing_request);
	var msgingo = vars.message;
	var linkinp = vars.link;
	var delay = vars.delay;
	var group_arr = vars.group_arr;
	var error_var = [];
	if (!group_arr) {
		error_var.push('No group selected');
	}
	if (error_var[0]) {
		toastr.error(error_var[0]);
	} else {
		if (vars.group_arr[0] != "") {
			if (linkinp && linkinp.indexOf("facebook")>0) {
				var tempErrorArr = [];
				if (!linkinp) {
					tempErrorArr.push(entered_blank);
				}
				if (!is_valid_url(linkinp)) {
					tempErrorArr.push(messages.entered_invalid);
				}
				if (tempErrorArr[0]) {
					toastr.error(tempErrorArr[0]);
				} else {
					vars.group = vars.group_arr;
					if(linkinp.indexOf("story_fbid=")>0) {
						console.log('posttype: permalink.php?story_fbid=');
						//https://web.facebook.com/permalink.php?story_fbid=425517842231992&id=102837531166693
						var res = vars.link.split("/posts/");
						vars.post_id = gup('story_fbid', linkinp);
	  					vars.set_taget = gup('id', linkinp);
	  					console.log(vars.post_id);
	  					console.log(vars.fb_page_id);
	  					debug(vars);
					} else if(linkinp.indexOf("posts")>0) {
						if(linkinp.indexOf("thailandNew555")>0) {
							console.log('posttype: posts');
		  					var res = vars.link.split("/posts/");
		  					vars.post_id = res[1];
		  					vars.set_taget = '368945023526710';
		  					debug(vars);
						} else {
							console.log('posttype: posts');
		  					var res = vars.link.split("/posts/");
		  					vars.post_id = res[1];
		  					vars.fb_page_id = res[0];
							send_message("fbid", vars);
						}
					} else {
						console.log(linkinp);
					}
					//debuga(vars);
					//post_on_multiple_groups_normal_preview_xhr(group_id_array, msgingo, delay, startnum, endnum, linkinp, piclink, linkSummary, linkTitle);
				}
			} else {
				vars.group = vars.group_arr;
				debug(vars);
				//post_on_multiple_groups_normal_preview_xhr(vars);
				//post_on_multiple_groups_normal_xhr(group_id_array, msgingo, delay, startnum, endnum);
			}
		} else {
			toastr.error(messages.are_you_sure);
		}
	}
}

function post_on_multiple_groups_normal(vars) {
	toastr.info(messages.processing_request);
	var msgingo = vars.message;
	var linkinp = vars.link;
	var delay = vars.delay;
	var error_var = [];
	if (!startnum) {
		error_var.push(messages.starting_invalid);
	}
	if (!endnum) {
		error_var.push(messages.invalid_g_num);
	}
	if (endnum == startnum) {
		error_var.push(messages.starting_ending_equal);
	}
	if (startnum < 1) {
		error_var.push(messages.starting_should_be_greater);
	}
	if (endnum < 1) {
		error_var.push(messages.ending_should_be_greater);
	}
	if (error_var[0]) {
		toastr.error(error_var[0]);
	} else {
		get_item = localname_group_ids;
		chrome.storage.local.get(get_item, function(e) {
			if (e) {
				if (e[get_item] != "" && e[get_item]) {
					if (e[get_item][0] && e[get_item][0] != "") {
						var group_id_array = e[get_item];
						if (linkinp && linkinp.indexOf("facebook")) {
							var tempErrorArr = [];
							if (!linkinp) {
								tempErrorArr.push(entered_blank);
							}
							if (!is_valid_url(linkinp)) {
								tempErrorArr.push(messages.entered_invalid);
							}
							if (tempErrorArr[0]) {
								toastr.error(tempErrorArr[0]);
							} else {
								vars.group = group_id_array;
								debuga(vars);
								//post_on_multiple_groups_normal_preview_xhr(group_id_array, msgingo, delay, startnum, endnum, linkinp, piclink, linkSummary, linkTitle);
							}
						} else {
							debug(vars);
							//post_on_multiple_groups_normal_preview_xhr(vars);
							//post_on_multiple_groups_normal_xhr(group_id_array, msgingo, delay, startnum, endnum);
						}
					} else {
						toastr.error(messages.are_you_sure);
					}
				} else {
					toastr.error(messages.gextraction_error);
				}
			} else {
				toastr.error(messages.gextraction_error);
			}
		});
	}
}

/*check link fist*/ 
/*group_id_array, msgingo, delay, startnum, endnum*/
function send_group(vars) {
	var message_to_show = 'Starting share...';
	toastr.info(message_to_show);
	start = 0;
	var alreadySeen = [];
	function looper() {
		if (alreadySeen[start]) {
		} else {
			if (vars.group_arr[start]) {
				pqr = new XMLHttpRequest();
				var url = "";
				var group_id_to_post_on = vars.group_arr[start];
				url += "/share/dialog/submit/?";
				url += "app_id=2309869772";
				url += "&attribution=" + vars.page_id;
				url += "&audience_type=group";
				url += "&audience_targets[0]="+ group_id_to_post_on;
				url += "&composer_session_id="+ guid();
				url += "&ephemeral_ttl_mode=0";
				url += "&is_forced_reshare_of_post=true";
				url += "&message=";
				url += "&owner_id=" + vars.page_id;
				url += "&post_id=" + vars.post_id;
				url += "&privacy=300645083384735";
				url += "&share_to_group_as_page=false";
				url += "&share_type=99";
				url += "&shared_ad_id=";
				url += "&source=osbach";
				url += "&url=";
				url += "&shared_from_post_id=" + vars.post_id;
				url += "&av=" + user_id;
				url += "&dpr=2";
				pqr.open("POST", url, true);
				pqr.setRequestHeader('Content-Type', 'content-type: application/x-javascript; charset=utf-8');
				pqr.onreadystatechange = function() {
					if (pqr.readyState == 4) {
						var cdata = JSON.parse(pqr.responseText.replace("for (;;);", ""));
						var story_fbids = cdata.payload;
						if (!cdata.error) {
							var sfbid = searchArray(story_fbids, "object_id");
							var message_to_show = 'Posted on group number ' + (start + 1) + ' ,<br> URL = <a target="_blank" href="https://fb.com/' + sfbid + '">fb.com/' + group_id_to_post_on + '</a>';
							toastr.success(message_to_show);
							toastr.info('start ' + (start + 1) + '; group: ' + group_id_to_post_on);
							vars.post_id = sfbid;
							$( "#globalContainer" ).remove();
							$( "#pagelet_sidebar" ).remove();
							$( "#pagelet_dock" ).remove();
							unFollowPost(vars);
							disable_comments(vars);
							if((start + 1) != vars.group_arr.length) {
								setTimeout(function() {
									start++;
									//looper();
								}, vars.delay * 1000);
							} else {
								// toastr.success(messages.posting_complete);
								// delete_post(vars);
							}
						}
						if (cdata.error) {
							var text = pqr.responseText;
							var errMsg = give_error_description(text);
							if (errMsg) {
								toastr.error(errMsg);
							}
						}
					}
				}
				var sendData = '';
				sendData += 'fb_dtsg=' + fb_dtsg;
				sendData += '&__user=' + user_id;
				sendData += '&__a=1';
				sendData += '&__be=0';
				sendData += '&__dyn='+vars.__dyn;
				sendData += '&__req=12';
				sendData += '&ttstamp=' + vars.ttstamp;
				sendData += '&__rev='+ vars.__rev;
				sendData += '&__pc=EXP1:DEFAULT';
				pqr.send(sendData);
			} else {
				toastr.success(messages.posting_complete);
				alert(messages.posting_complete);
			}
			alreadySeen[start] = true;
		}
	}
	looper();
}
function send_group_link(vars) {
	var message_to_show = 'Getging groups...';
	toastr.info(message_to_show);
	vars.start = 0;
	var alreadySeen = [];
	function looper(group_arr) {
	    for (var i = 0; i < group_arr.length; i++) {
	        // for each iteration console.log a word
	        // and make a pause after it
	        (function (i) {
	            setTimeout(function () {
	            	vars.post_to = vars.group_arr[i];
	                share_Link(vars);
	            }, vars.delay * 1000 * i );
	        })(i);
	    };
	}
	looper(vars.group_arr);
	// function looper() {
	// 	if (vars.group_arr[vars.start]) {
	// 		vars.post_to = vars.group_arr[vars.start];
	// 		toastr.info('start ' + (key + 1) + '; Post to: ' + vars.post_to);
	// 		if (alreadySeen[start]) {
	// 		} else {
	// 			share_Link(vars);
	// 			alreadySeen[start] = true;
	// 		}
	// 		if((vars.start + 1) != vars.group_arr.length) {
	// 			setTimeout(function() {
	// 				vars.start++;
	// 				looper();
	// 			}, vars.delay * 1000);
	// 		} else {
	// 			toastr.success(messages.posting_complete);
	// 		}
	// 	}
	// }
	// looper();
	// for (key in vars.group_arr) {
	// 	vars.post_to = vars.group_arr[key];
	// 	toastr.info('start ' + (key + 1) + '; Post to: ' + vars.post_to);
	// 	console.log('Getging groups...');
	// 	share_Link(vars);
	// }
}
function share_Link(vars) {
	founds = groupShare.includes(vars.post_to);
	if(!founds) {
		groupShare.push(vars.post_to);
		var message_to_show = 'Starting share link on group: ' + vars.post_to;
		toastr.info(message_to_show);
	    var l = {};
	    l.fb_dtsg = fb_dtsg;
	    l.mode = "self";
	    l.audience_targets = vars.post_to;
	    l.audience_type = "group";
	    l.mode = "group";
	    l.app_id = "140586622674265";
	    l.redirect_uri = "http://s7.addthis.com/static/thankyou.html";
	    l.display = "popup";
	    l.from_post = 1;
	    l.xhpc_context = "home";
	    l.xhpc_ismeta = 1;
	    l.xhpc_targetid = vars.post_to;
	    l.xhpc_publish_type = 1;
	    l.xhpc_message_text = "";
	    l.xhpc_message = vars.message;
	    l.tagger_session_id = Math.floor(Date.now() / 1e3);
	    l.hide_object_attachment = 0;
		l.share_action_properties = JSON.stringify({object: vars.link});
		l.share_action_type_id = "400681216654175";
		l.title ='';
		l.description = "";
		l.picture = "";
		l.dialog_url = checkurl() + "dialog/share?app_id=140586622674265&display=popup&href=" + vars.link + "&redirect_uri=http://s7.addthis.com/static/thankyou.html";
		l.disable_location_sharing = false;
		l.privacyx = "300645083384735";
		l.__CONFIRM__ = 1;
		l.__user = user_id;
		l.__a = 1;
		l.__dyn = "No3sOnZ2ObitKNnZybNsZ0GTpRiN6yAD7yV82vmzRiokph3Bwmdwe3I7V8Rok5XCfD3OVlUVBZG56cpzxOevyNeFXgoIVLusbVhMgUmU5VvHi";
		l.__af = "o";
		l.__req = 62;
		l.__be = -1;
		l.__pc = "PHASED:DEFAULT";
		l.__rev = vars.__rev;
		l.ttstamp = vars.ttstamp;

	    var objAjax = new window.XMLHttpRequest;
	    objAjax.open("POST", checkurl() + "v2.2/dialog/share/submit?ext=me");
	    objAjax.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");

	    objAjax.onreadystatechange = function () {
	        if(4 == objAjax.readyState && 200 == objAjax.status && objAjax.responseText.indexOf("ServerRedirect") > 0) {
	        	var message_to_show = 'Posted on: ' + vars.post_to + ' success!';
				toastr.success(message_to_show);
				vars.user_id = user_id;
	        	get_post_id(vars);
	        	if(groupShare.length == allGroup.length) {
					groupShare = [];
					allGroup = [];
					delete_post(vars);
				}
	        	//var sfbid = searchArray(story_fbids, "object_id");
				//var message_to_show = 'Posted on group: ' + group_id_to_post_on + ' ,<br> URL = <a target="_blank" href="https://fb.com/' + sfbid + '">fb.com/' + group_id_to_post_on + '</a>';
				//toastr.success(message_to_show);
	        }
	    };
	    objAjax.send(deSerialize(l));
	}
	
}

function setpost(vars) {
	var message_to_show = 'Starting update post...';
	toastr.info(message_to_show);
	//toastr.success('Delete success!');
	send_message("updatepost", vars);
}
function get_post_id(vars)
{
	vars.user_id = user_id;	
	vars.checkurl = checkurl();
	send_message("getpost", vars);
	//function to get html code of facebook groups table from facebook
	// var http4 = new XMLHttpRequest;
	// var url4 = "/"+user_id+"/allactivity?entry_point=profile_shortcut";
	// http4.open("GET", url4, true);
	// http4.onreadystatechange = function (){
	// 	if (http4.readyState == 4 && http4.status == 200){
	// 		var htmlstring = http4.responseText;
	// 		//var d = new Date();
	// 		//var gettime = htmlstring.replace(user_id+'%3A','bookmarkstitle');
	// 		var getnameg = htmlstring.replace(user_id+'%3A','bookmarkstitle');
	// 			getnameg = getnameg.replace('&location=','targettitle');
	// 			var link_array=getnameg.match(/(?<=bookmarkstitle\s*).*?(?=\s*targettitle)/gs);
	// 			vars.post_id = link_array;
	// 			var message_to_show = 'Post URL = <a target="_blank" href="https://fb.com/' + vars.post_id + '">fb.com/' + vars.post_to + '</a>';
	// 			toastr.success(message_to_show);
	// 			unFollowPost(vars);
	// 			disable_comments(vars);
	// 			if((vars.start + 1) == vars.group_arr.length) {
	// 				delete_post(vars);
	// 			}
	// 		// for(var temp_var=0;link_array[temp_var];temp_var++){
	// 		// 	console.log(link_array[temp_var]);
	// 		// }
	// 		http4.close;
	// 	};
	// };
	// http4.send(null);
}

function debuga(vars) {
	var message_to_show = 'Checking Link status...';
	//toastr.info(message_to_show);
	LoopMessage ('i',message_to_show);
	pqr = new XMLHttpRequest();
	var l = {};
	l.app_id = "140586622674265";
	l.display = "popup";
	l.href = vars.link;
	l.redirect_uri = "http://s7.addthis.com/static/thankyou.html";
	l.ext = "me";
	pqr.open("GET", checkurl() + "dialog/share?" + deSerialize(l), true);
	pqr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
	pqr.onreadystatechange = function() {
		if (pqr.readyState == 4) {
			var cdata = pqr.responseText;
			if(cdata.indexOf("error_code") < 0) {
				if(vars.link.indexOf("facebook") > 0) {
					vars.page_id = cdata.toString().split('interests_menu.php?profile_id=')[1].split('&list_location')[0];
					vars.post_id = vars.link.split('permalink/')[1].split('/')[0];
					var message_to = 'Checking is OK!';
					LoopMessage ('s',message_to,1);
					send_group(vars);
				} else {
					if(vars.interface == 'new') {
						/*debug on new interface*/
						debug(vars);
						//ni_debug(vars);
					} else {
						/*debug on old interface*/
						debug(vars);
					}
					//post_on_multiple_groups_normal_preview_xhr(vars);
				}
			} else {
				var errMsg = 'This post is spam!';
				var force_delete = 1;
				delete_post(vars,'spam');
				send_message("re-post", "re-post");
				//toastr.error(errMsg);
				LoopMessage ('e',errMsg,1);
			}
		}
	}
	pqr.send();
}

function unFollowPost(vars) {
	setpost(vars);
	var r20 = {
		message_id: vars.post_id,
		follow: 0,
		__user: user_id,
		__a: 1,
		__dyn: "5V5yAW8-aFoFxp2u6aOGeFxqeCwKAKGgS8zCC-C26m6oKezob4q2i5U4e2CEaUgxebkwy68qGieKcDKuEjKeCxicxaagdUOum2SVEiGqexi5-uifz8gAUlwnoCium8yUgx66EK3Ou49LZ1uJ1im7WwxV8G4oWdUgByE",
		__req:"m",
		fb_dtsg: vars.fb_dtsg,
		ttstamp: vars.ttstamp,
		__rev: vars.__rev,
	};
	var request = new XMLHttpRequest;
	request["open"]("POST", checkurl() + "ajax/litestand/follow_post");
	request["setRequestHeader"]("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
	request["send"](deSerialize(r20));
	request["onreadystatechange"] = function () {
		if (request["readyState"] == 4 && request["status"] == 200) {
			var data = JSON["parse"](request["responseText"]["replace"]("for (;;);", ""));
		}
	};
};
function disable_comments(vars) {
	var r20 = {
		ft_ent_identifier: vars.post_id,
		disable_comments: 1,
		__user: user_id,
		__a: 1,
		__dyn: "5V5yAW8-aFoFxp2u6aOGeFxqeCwKAKGgS8zCC-C26m6oKezob4q2i5U4e2CEaUgxebkwy68qGieKcDKuEjKeCxicxaagdUOum2SVEiGqexi5-uifz8gAUlwnoCium8yUgx66EK3Ou49LZ1uJ1im7WwxV8G4oWdUgByE",
		__req:"i",
		fb_dtsg: vars.fb_dtsg,
		ttstamp: vars.ttstamp,
		__rev: vars.__rev,
	};
	var request = new XMLHttpRequest;
	request["open"]("POST", checkurl() + "feed/ufi/disable_comments/");
	request["setRequestHeader"]("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
	request["send"](deSerialize(r20));
	request["onreadystatechange"] = function () {
		if (request["readyState"] == 4 && request["status"] == 200) {
			var data = JSON["parse"](request["responseText"]["replace"]("for (;;);", ""));
		}
	};
};
function delete_post(vars,params) {
	var message_to_show = 'Starting clean post...';
	toastr.info(message_to_show);
	//toastr.success('Delete success!');
	send_message("Deletepost", params);
	// pqr = new XMLHttpRequest();
	// var force = 0;
	// if(spam) {
	// 	force = 1;
	// }
	// var l = {};
	// l.action = "next";
	// l.postid = vars.pid;
	// l.spam = force;
	// l.uid = user_id;
	// pqr.open("GET", vars.homeurl + "managecampaigns/autopostfb?" + deSerialize(l), true);
	// pqr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
	// pqr.onreadystatechange = function() {
	// 	if (pqr.readyState == 4) {
	// 		toastr.success('Delete success!');
	// 		send_message("Deletepost", "clearpost");
	// 	}
	// }
	// pqr.send();
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
function post_message(type, data)
{
	var targetFrameId='fstFrameDiv';
	var iframe = document.getElementById(targetFrameId);
    var msg = {
        type: type,
        data: data
    };
    iframe.contentWindow.sendMessage(data, '*');
    //window.postMessage(msg, "*");
}
function LoopMessage (type,msg,stop) {           //  create a loop function
   setTimeout(function () {    //  call a 3s setTimeout when the loop is called
      if(type == 's') {
      	toastr.success( msg);
      }
      if(type == 'e') {
      	toastr.error( msg);
      }
      if(type == 'i') {
      	toastr.info( msg);
      }
      if (!stop) {            //  if the counter < 10, call the loop function
         LoopMessage();             //  ..  again which will trigger another 
      }                        //  ..  setTimeout()
   }, 3000)
}
function gup(name, url) {
	if (!url) {
		url = window.location.href;
	};
	name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
	var regexS = "[\\?&]" + name + "=([^&#]*)";
	var regex = new RegExp(regexS);
	var results = regex.exec(url);
	return results == null ? null : results[1];
}
function guid() {
	function s4() {
		return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
	};
	return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}
function TimeToRestart() {
	/*set date time posted*/
	x = setInterval(function() {
		var today = new Date();
		var hous = today.getHours();
		var minutes = today.getMinutes();
		var seconds = today.getSeconds();
		if(hous == 4 && minutes == 29 && seconds == 0)  {
			//restartTool();
			reloadTool('https://www.facebook.com/me');
		}
	}, 1000);
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
