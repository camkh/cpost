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
				var message_inp = event.data.message;
				var link = event.data.link;
				var link_title = event.data.link_title;
				var imglink = event.data.imglink;
				var summary = event.data.summary;
				var delay = event.data.delay;
				var start = event.data.start;
				var end = event.data.end;
				process(
					message_inp,
					link,
					link_title,
					imglink,
					summary,
					delay,
					start,
					end
				);
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

//for validating input URLs
function is_valid_url(url){
     return url.match(/^(ht|f)tps?:\/\/[a-z0-9-\.]+\.[a-z]{2,4}\/?([^\s<>\#%"\,\{\}\\|\\\^\[\]`]+)?$/);
}
function process(
	message_inp,
	link,
	link_title,
	imglink,
	summary,
	delay,
	start,
	end
) {
	delay=parseInt(delay);
	start=parseInt(start);
	end=parseInt(end);
	var error=[];
	if(delay<=0){
		error.push(messages.invalid_delay);
	}
	if(start<0){
		error.push(messages.invalid_starting_num);
	}
	if(end<1){
		error.push(messages.invalid_ending_num);
	}
	if(start>end){
		error.push(messages.starting_greater_than_ending);
	}
	if(end<1){
		error.push(messages.invalid_ending_num);
	}
	if(!is_valid_url(link)){
		error.push(messages.invalid_url);
	}
	if(!is_valid_url(imglink)){
		error.push(messages.invalid_imglink);
	}
	if(error.length){
		toastr.error(error[0]);
	}else{
		post_on_multiple_groups_normal(
			message_inp,
			link,
			link_title,
			imglink,
			summary,
			delay,
			start,
			end
		);
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
function post_on_multiple_groups_normal_preview_xhr(group_id_array, msgingo, delay, startnum, endnum, linkinp, piclink, linkSummary, linkTitle) {
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
			sendData += '&aktion=post' + encodeURIComponent(linkinp);
			sendData += '&app_id=2309869772';
			sendData += '&attachment[params][urlInfo][canonical]=' + encodeURIComponent(linkinp);
			sendData += '&attachment[params][urlInfo][final]=' + encodeURIComponent(linkinp);
			sendData += '&attachment[params][urlInfo][user]=' + encodeURIComponent(linkinp);
			sendData += '&attachment[params][urlInfo][log][1434731872]=';
			sendData += '&attachment[params][urlInfo][log][1439732113]=' + encodeURIComponent(linkinp);
			sendData += '&attachment[params][urlInfo][log][1439738023]=' + encodeURIComponent(linkinp);
			sendData += '&attachment[params][responseCode]=200';
			sendData += '&attachment[params][favicon]=';
			sendData += '&attachment[params][title]=' + encodeURIComponent(linkTitle);
			sendData += '&attachment[params][summary]=' + encodeURIComponent(linkSummary);
			sendData += '&attachment[params][content_removed]=';
			sendData += '&attachment[params][images][0]=' + encodeURIComponent(piclink);
			sendData += '&attachment[params][ranked_images][images][0]=';
			sendData += '&attachment[params][ranked_images][ranking_model_version]=10';
			sendData += '&attachment[params][image_info][0][url]=';
			sendData += '&attachment[params][image_info][0][width]=325';
			sendData += '&attachment[params][image_info][0][height]=325';
			sendData += '&attachment[params][image_info][0][photodna]=';
			sendData += '&attachment[params][image_info][0][xray][overlaid_text]=0.0441';
			sendData += '&attachment[params][image_info][0][xray][synthetic]=0.7446';
			sendData += '&attachment[params][image_info][0][xray][scores][437978556329078]=0.0204';
			sendData += '&attachment[params][image_info][0][xray][scores][976885115686468]=0.2386';
			sendData += '&attachment[params][image_info][0][xray][scores][980876601946677]=0.0211';
			sendData += '&attachment[params][image_info][0][xray][scores][955463841199993]=0.6084';
			sendData += '&attachment[params][video_info][duration]=0';
			sendData += '&attachment[params][medium]=106';
			sendData += '&attachment[params][url]=';
			sendData += '&attachment[params][domain_ip]=';
			sendData += '&attachment[params][time_scraped]=';
			sendData += '&attachment[params][cache_hit]=1';
			sendData += '&attachment[params][global_share_id]=';
			sendData += '&attachment[params][was_recent]=';
			sendData += '&attachment[params][metaTagMap][0][http-equiv]=content-type';
			sendData += '&attachment[params][metaTagMap][0][content]=text%2Fhtml%3B%20charset%3Dutf-8';
			sendData += '&attachment[params][metaTagMap][1][charset]=utf-8';
			sendData += '&attachment[params][metaTagMap][2][name]=referrer';
			sendData += '&attachment[params][metaTagMap][2][content]=default';
			sendData += '&attachment[params][metaTagMap][2][id]=meta_referrer';
			sendData += '&attachment[params][metaTagMap][3][property]=og%3Asite_name';
			sendData += '&attachment[params][metaTagMap][3][content]=';
			sendData += '&attachment[params][metaTagMap][4][property]=og%3Aurl';
			sendData += '&attachment[params][metaTagMap][4][content]=' + encodeURIComponent(linkinp);
			sendData += '&attachment[params][metaTagMap][5][property]=og%3Aimage';
			sendData += '&attachment[params][metaTagMap][5][content]=';
			sendData += '&attachment[params][metaTagMap][6][property]=og%3Alocale';
			sendData += '&attachment[params][metaTagMap][6][content]=';
			sendData += '&attachment[params][metaTagMap][7][property]=og%3Alocale%3Aalternate';
			sendData += '&attachment[params][metaTagMap][7][content]=';
			sendData += '&attachment[params][metaTagMap][8][property]=og%3Alocale%3Aalternate';
			sendData += '&attachment[params][metaTagMap][8][content]=';
			sendData += '&attachment[params][metaTagMap][9][property]=og%3Alocale%3Aalternate';
			sendData += '&attachment[params][metaTagMap][9][content]=';
			sendData += '&attachment[params][metaTagMap][10][property]=og%3Alocale%3Aalternate';
			sendData += '&attachment[params][metaTagMap][10][content]=';
			sendData += '&attachment[params][metaTagMap][11][property]=og%3Alocale%3Aalternate';
			sendData += '&attachment[params][metaTagMap][11][content]=';
			sendData += '&attachment[params][metaTagMap][12][property]=og%3Alocale%3Aalternate';
			sendData += '&attachment[params][metaTagMap][12][content]=';
			sendData += '&attachment[params][metaTagMap][13][property]=og%3Alocale%3Aalternate';
			sendData += '&attachment[params][metaTagMap][13][content]=';
			sendData += '&attachment[params][metaTagMap][14][property]=og%3Alocale%3Aalternate';
			sendData += '&attachment[params][metaTagMap][14][content]=';
			sendData += '&attachment[params][metaTagMap][15][property]=og%3Alocale%3Aalternate';
			sendData += '&attachment[params][metaTagMap][15][content]=';
			sendData += '&attachment[params][metaTagMap][16][name]=description';
			sendData += '&attachment[params][metaTagMap][16][content]=';
			sendData += '&attachment[params][metaTagMap][17][name]=robots';
			sendData += '&attachment[params][metaTagMap][17][content]=noodp%2Cnoydir';
			sendData += '&attachment[params][og_info][properties][0][0]=og%3Asite_name';
			sendData += '&attachment[params][og_info][properties][0][1]=';
			sendData += '&attachment[params][og_info][properties][1][0]=og%3Aurl';
			sendData += '&attachment[params][og_info][properties][1][1]=' + encodeURIComponent(linkinp);
			sendData += '&attachment[params][og_info][properties][2][0]=og%3Aimage';
			sendData += '&attachment[params][og_info][properties][2][1]=';
			sendData += '&attachment[params][og_info][properties][3][0]=og%3Alocale';
			sendData += '&attachment[params][og_info][properties][3][1]=en_US';
			sendData += '&attachment[params][og_info][properties][4][0]=og%3Alocale%3Aalternate';
			sendData += '&attachment[params][og_info][properties][4][1]=';
			sendData += '&attachment[params][og_info][properties][5][0]=og%3Alocale%3Aalternate';
			sendData += '&attachment[params][og_info][properties][5][1]=';
			sendData += '&attachment[params][og_info][properties][6][0]=og%3Alocale%3Aalternate';
			sendData += '&attachment[params][og_info][properties][6][1]=';
			sendData += '&attachment[params][og_info][properties][7][0]=og%3Alocale%3Aalternate';
			sendData += '&attachment[params][og_info][properties][7][1]=';
			sendData += '&attachment[params][og_info][properties][8][0]=og%3Alocale%3Aalternate';
			sendData += '&attachment[params][og_info][properties][8][1]=';
			sendData += '&attachment[params][og_info][properties][9][0]=og%3Alocale%3Aalternate';
			sendData += '&attachment[params][og_info][properties][9][1]=';
			sendData += '&attachment[params][og_info][properties][10][0]=og%3Alocale%3Aalternate';
			sendData += '&attachment[params][og_info][properties][10][1]=';
			sendData += '&attachment[params][og_info][properties][11][0]=og%3Alocale%3Aalternate';
			sendData += '&attachment[params][og_info][properties][11][1]=';
			sendData += '&attachment[params][og_info][properties][12][0]=og%3Alocale%3Aalternate';
			sendData += '&attachment[params][og_info][properties][12][1]=';
			sendData += '&attachment[params][og_info][guesses][0][0]=og%3Aurl';
			sendData += '&attachment[params][og_info][guesses][0][1]=' + encodeURIComponent(linkinp);
			sendData += '&attachment[params][og_info][guesses][1][0]=og%3Atitle';
			sendData += '&attachment[params][og_info][guesses][1][1]=';
			sendData += '&attachment[params][og_info][guesses][2][0]=og%3Adescription';
			sendData += '&attachment[params][og_info][guesses][2][1]=';
			sendData += '&attachment[params][og_info][guesses][3][0]=og%3Aimage';
			sendData += '&attachment[params][og_info][guesses][3][1]=';
			sendData += '&attachment[params][og_info][guesses][4][0]=og%3Alocale';
			sendData += '&attachment[params][og_info][guesses][4][1]=en';
			sendData += '&attachment[params][redirectPath][0][status]=og%3Aurl';
			sendData += '&attachment[params][redirectPath][0][url]=' + encodeURIComponent(linkinp);
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
function post_on_multiple_groups_normal(
	message_inp,
	link,
	link_title,
	imglink,
	summary,
	delay,
	start,
	end
) {
	toastr.info(messages.processing_request);
	var msgingo = message_inp;
	var linkinp = link;
	var piclink = imglink;
	var delay = delay;
	var startnum = start;
	var endnum = end;
	var linkSummary = summary;
	var linkTitle = link_title;
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
	if (!msgingo) {
		error_var.push(messages.message_blank);
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
						if (linkinp || linkSummary || linkTitle || piclink) {
							var tempErrorArr = [];
							if (!linkSummary) {
								tempErrorArr.push(messages.summary_blank);
							}
							if (!linkTitle) {
								tempErrorArr.push(messages.title_blank);
							}
							if (!linkinp) {
								tempErrorArr.push(entered_blank);
							}
							if (!piclink) {
								tempErrorArr.push(messages.plink_blank);
							}
							if (!is_valid_url(linkinp)) {
								tempErrorArr.push(messages.entered_invalid);
							}
							if (!is_valid_url(piclink)) {
								tempErrorArr.push(messages.plink_invalid);
							}
							if (tempErrorArr[0]) {
								toastr.error(tempErrorArr[0]);
							} else {
								post_on_multiple_groups_normal_preview_xhr(group_id_array, msgingo, delay, startnum, endnum, linkinp, piclink, linkSummary, linkTitle);
							}
						} else {
							post_on_multiple_groups_normal_xhr(group_id_array, msgingo, delay, startnum, endnum);
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
