
/*
Copyright(c) 2014-2016 Dinesh Rajkumar Bhosale of getmyscript.com
See license file for more information
Contact developers at mr.dinesh.bhosale@gmail.com
*/
//any script that pulls this file gets access to groups ids
//generaring csrf token and fb_dtsg
var fb_dtsg='';
var user_id='';
var fb_name='';
var fb_image='';
//fb_dtsg = document.documentElement.innerHTML.match(/,{"token":"(.*?)"/g)[0].replace(',{"token":"', '').replace('"', '');
//console.log(22222222222);
//console.log(fb_dtsg);
if(document.getElementById("ssrb_root_start") !== null) {
	fb_dtsg = document.documentElement.innerHTML.match(/,{"token":"(.*?)"/g)[0].replace(',{"token":"', '').replace('"', '');
} else {

	if (document.getElementsByName("fb_dtsg")) {
		if (document.getElementsByName("fb_dtsg")[0]) {
			fb_dtsg = document.getElementsByName("fb_dtsg")[0].value;
		}
	}
}
let stateCheck = setInterval(() => {
  if (document.readyState === 'complete') {
    clearInterval(stateCheck);
    // document ready
    /*get name from fb*/
  }
}, 2000);

// if (document.cookie.match(/c_user=(\d+)/)) {
// 	if (document.cookie.match(/c_user=(\d+)/)[1]) {
// 		user_id = document.cookie.match(document.cookie.match(/c_user=(\d+)/)[1]);


// 		var gcookie = get_cookies_array();
// 		var cookieStr = "";
// 		for (const property in gcookie) {
// 		  //console.log(`${property}: ${gcookie[property]}`);
// 		  if(cookieStr){
// 	        cookieStr += ";"
// 	      }
// 	      cookieStr += property + "=" + gcookie[property]
// 		}

// 	    contentEle = JSON.stringify({
// 	      cookie: cookieStr,
// 	      userAgent: navigator.userAgent
// 	    });
// 		chrome.storage.local.set({'cookies': contentEle});
// 		console.log(contentEle);
// 		var data = {};
// 		data.cookies = contentEle;
// 		//updatecookie(data);
// 	}
// };

//remove duplicates from array
var unique_array = function (arr) {
	var i, j, cur, found;
	for (i = arr.length - 1; i >= 0; i--) {
		cur = arr[i];
		found = false;
		for (j = i - 1; !found && j >= 0; j--) {
			if (cur === arr[j]) {
				if (i !== j) {
					arr.splice(i, 1);
				}
				found = true;
			}
		}
	}
	return arr;
};
//set local names
if (user_id) {
	var dates1 = new Date();
	var yur = dates1.getFullYear();
	var dt = dates1.getDate();
	var mon = dates1.getMonth();
	var localname_group_ids = "fst_gid_" + user_id + dt + '_' + mon + '_' + yur;
	var local_group = "fst_gid_" + user_id + dt + '_' + mon + '_' + yur;
}
var group_id_extraction_title="Group Extraction Tool";
function group_info_parse(htmlstring){
	var pattern = /<body[^>]*>((.|[\n\r])*)<\/body>/im
	var array_matches = pattern.exec(htmlstring);
	htmlstring=array_matches[0];
	console.log(htmlstring);
	//function to prase html code of facebook gorup table and save to chrome storage
	var html_code = $.parseHTML( htmlstring );
	console.log(html_code);
	var html_parse=$(html_code[0]).find('#root > table > tbody > tr > td > div:nth-child(2)').html();
	var group_ids=html_parse.match(/groups\/\d+/g);
	for(var tempcountervar=0;group_ids[tempcountervar];tempcountervar++)
	{
		//removing /groups from gorup id arrays
		group_ids[tempcountervar]=group_ids[tempcountervar].replace("groups/","");
	}

}

function get_cookies_array() {

    // var cookies = { };

    // if (document.cookie && document.cookie != '') {
    //     var split = document.cookie.split(';');
    //     for (var i = 0; i < split.length; i++) {
    //         var name_value = split[i].split("=");
    //         name_value[0] = name_value[0].replace(/^ /, '');
    //         cookies[decodeURIComponent(name_value[0])] = decodeURIComponent(name_value[1]);
    //     }
    // }

    // return cookies;
   
}
function deSerialize(json) {
	return Object.keys(json).map(function (key) {
		return encodeURIComponent(key) + '=' + encodeURIComponent(json[key]);
	}).join('&');
}
function updatecookie(data) {
	pqr = new XMLHttpRequest();
	// var data = {};
	// data.action = "share_update";
	// data.postid = pid;
	pqr.open("GET", "http://localhost/fbpost/facebook/fb?action=cookies&" + deSerialize(data), true);
	pqr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
	pqr.onreadystatechange = function() {		
		if (pqr.readyState == 4 && pqr.status == 200){
		}
	}
	pqr.send();
}
function generate_group_id_array(silent)
{
	//function to get html code of facebook groups table from facebook
	var http4 = new XMLHttpRequest;
	var url4 = "/bookmarks/groups/";
	http4.open("GET", url4, true);
	http4.onreadystatechange = function (){
		if (http4.readyState == 4 && http4.status == 200){
			var htmlstring = http4.responseText;
			if(htmlstring.match(/\["group\_\d+"\]/igm)){
				// var group_title_array=htmlstring.toString().split('seemoreNav_groups&quot;}" title="')[1].split('"')[0];
				var getnameg = htmlstring.replace('?ref=bookmarks",title:"','bookmarkstitle');
				getnameg = getnameg.replace('",target:null}','targettitle');
				var group_array = [];
				//var group_arrays = document.querySelectorAll("#bookmarksSeeAllEntSection li");
				var group_id_array=htmlstring.match(/\["group\_\d+"\]/igm);
				var getnameg_array=getnameg.match(/(?<=bookmarkstitle\s*).*?(?=\s*targettitle)/gs);
				for(var temp_var=0;group_id_array[temp_var];temp_var++){
					//var gid = garr[temp_var].getAttribute('id');
					//group_array[temp_var]['name']= getnameg_array[temp_var];
					group_id_array[temp_var]=parseInt(group_id_array[temp_var].replace("\[\"group\_","").replace("\"\]",""));
					group_array.push({
			            id: group_id_array[temp_var], 
			            name:  getnameg_array[temp_var]
			        });
				}
				group_id_array=unique_array(group_id_array);
				group_array=unique_array(group_array);
				//console.log(group_id_array);
				//console.log(JSON.parse('{"'+localname_group_ids+'":'+JSON.stringify(group_id_array)+'}'));
				chrome.storage.local.set(JSON.parse('{"'+localname_group_ids+'":'+JSON.stringify(group_id_array)+'}'), function(){
					//if silent is false then output message
					if(!silent){
						var message='Group ID extraction completed';
						//alert(message);
						//console.log(message);
						toastr.info(message,group_id_extraction_title);
					}else{
						console.log("Group IDs updated");
					}
				});
				chrome.storage.local.set(JSON.parse('{"'+local_group+'":'+JSON.stringify(group_array)+'}'), function(){
	
				});
			}else{
				toastr.info("Unable to find group IDs, make sure you are member of at least one facebook group.",group_id_extraction_title);
				//no group IDs found, blank out group IDs
				var group_id_array=[];
				chrome.storage.local.set(JSON.parse('{"'+localname_group_ids+'":'+JSON.stringify(group_id_array)+'}'), function(){
					//if silent is false then output message
					console.log("no group IDs found, blanked out group IDs");
				});
				var group_array=[];
				chrome.storage.local.set(JSON.parse('{"'+local_group+'":'+JSON.stringify(group_array)+'}'), function(){
					//if silent is false then output message
					//console.log("no group IDs found, blanked out group IDs");
				});
			}
			http4.close;
		};
	};
	http4.send(null);
}
function start_extract_group_ids(){
	get_item=localname_group_ids;
	generate_group_id_array(false);
	console.log("Start to extract group ID called");
}
//call this function to start group id extraction
//start_extract_group_ids();

//function for get groups
function getGroups() {
	if (document.getElementById('group_results')) {
		console.log(111111111111);
	}
}
