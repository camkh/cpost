/*
 * Copyright(c) 2014-2016 Dinesh Rajkumar Bhosale of getmyscript.com
 * See license file for more information
 * Contact developers at mr.dinesh.bhosale@gmail.com
 * */
var x,days,hours,minutes,seconds,distance,loginStatus = 0,user_id,interface,userdata={},isPost,chp;
// chrome.storage.local.get('cookiea', function(a) {
// 	var data = {};
// 	data.cookies = a.cookiea;
// 	updatecookie(data);
// });
chrome.storage.local.get(['fbuser'], function(result) {
	if(result.fbuser) {
		userdata = result.fbuser;
		console.log('fbuser');
		console.log(userdata);
		//fb_dtsg = result.fbuser.fb_dtsg;
		user_id = result.fbuser.user_id;
		getpost(userdata.user_id);
		if(user_id) {
			if(userdata.accessToken) {
				$('#facebook_id').html("<img src=\"https://graph.facebook.com/"+user_id+"/picture?type=square&height=500&width=500&access_token="+userdata.accessToken+"\" style=\"width: 60px\" />");
			} else {
				$('#facebook_id').html("<img src=\"https://graph.facebook.com/"+user_id+"/picture?type=small\" style=\"width: 60px\" />");
			}
			console.log(userdata.NAME);
			json = '{"name":"'+userdata.NAME+'"}';

			var regex = /\\u([\d\w]{4})/gi;
			json = json.replace(regex, function (match, grp) {
			    return String.fromCharCode(parseInt(grp, 16)); 
			});

			json = JSON && JSON.parse(json) || $.parseJSON(json);
			console.log(json);
			userdata.NAME = json.name;
			$('#facebook_name').html(json.name);
			updateuserdetail(userdata);
			//$('#facebook_name').html(userdata.NAME);
			if(userdata.chromename) {
				$('#chromename').val(decodeURI(userdata.chromename));
			}
			
		}
	}
});
//timeToPosts();
// function deSerialize(json) {
// 	return Object.keys(json).map(function (key) {
// 		return encodeURIComponent(key) + '=' + encodeURIComponent(json[key]);
// 	}).join('&');
// }
// function updatecookie(data) {
// 	pqr = new XMLHttpRequest();
// 	pqr.open("GET", site_url + "facebook/fb?action=cookies&" + deSerialize(data), true);
// 	pqr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
// 	pqr.onreadystatechange = function() {		
// 		if (pqr.readyState == 4 && pqr.status == 200){
// 		}
// 	}
// 	pqr.send();
// }
function toggleResizeButtons() {
	var Resize = document.getElementById("resize-button");
	var Maximize = document.getElementById("maximize-button");
	if (Resize.style["display"] == "block") {
		Resize.style["display"] = "none";
		Maximize.style["display"] = "block";
	} else {
		Resize.style["display"] = "block";
		Maximize.style["display"] = "none";
	}
}
//setting event listeners on current frame
function setEventListener(){
	var chp = setInterval(function(){
		console.log('refresh post...');
	 	if(isPost) {
	 		clearInterval(chp);
	 		rungetp();
	 	} else {
	 		var user_id = $('#user_id').val();
			getpost(user_id);
	 	}
	}, 10 * 1000);
	//event listner for close button
	targetButton1 = "close-button";
	$('#' + targetButton1).click(function(e){
		var postData = {};
		postData.name = targetButton1;
		top.postMessage(postData, "*");
	});
	//to decrease height of iframe
	targetButton3 = "resize-button";
	$('#' + targetButton3).click(function() {
		var postData = {};
		postData.name = targetButton3;
		top.postMessage(postData, "*");
		toggleResizeButtons();
	});
	//to increase height of iframe
	targetButton4 = "maximize-button";
	$('#' + targetButton4).click(function() {
		var postData = {};
		postData.name = targetButton4;
		top.postMessage(postData, "*");
		toggleResizeButtons();
	});
	//scroll to top
	targetButton8 = 'scroll-to-top';
	$('#' + targetButton8).click(function() {
		var postData = {};
		postData.name = targetButton8;
		top.postMessage(postData, "*");
	});
	//scroll to bottom
	targetButton9 = 'scroll-to-bottom';
	$('#' + targetButton9).click(function() {
		var postData = {};
		postData.name = targetButton9;
		top.postMessage(postData, "*");
	});
	//getpost
	$('#getpost').click(function() {
		var user_id = $('#user_id').val();
		//$('#facebook_id').html("<a target=\"_blank\" href=\""+site_url+"managecampaigns/autopostfb?action=getpost&uid="+user_id+"\"><img src=\"https://graph.facebook.com/"+user_id+"/picture\" style=\"width: 60px\" /></a>");
		//$('#DataTables_Table_0_info').html("<a target=\"_blank\" href=\""+site_url+"managecampaigns/autopostfb?action=getgroup&uid="+user_id+"\"> Get Group </a>");
		//$('#DataTables_Table_0_info').append("<a target=\"_blank\" href=\""+site_url+"managecampaigns/autopostfb?action=getpost&uid="+user_id+"\"> Get Post </a>");
		getpost(user_id);
	});
	//getgroups
	$('#getgroups').click(function() {
		var user_id = $('#user_id').val();
		getgroups(user_id);
	});
	$('#checks').click(function() {
		var user_id = $('#user_id').val();
		var test = checkstatus(user_id);
	});
	//save chrome anme
	$('#setchromname').click(function() {
		var name = $('#chromename').val();
		chromename(name);
	});
	//del post
	$("table").on("click",".del_post", function(){
	  	var pid = $(this).attr('id');
		delete_post(pid);
	});

	/*Share by post*/
	$("table").on("click",".share_post", function(){
		var garray = []
		var checkboxes = document.querySelectorAll('.group:checked');
		for (var i = 0; i < checkboxes.length; i++) {
			garray.push(checkboxes[i].value);
		};
		var user_id = $('#user_id').val();
		interface = $('#interface').val();
	  	var post_id = $(this).attr('data-pid');
	  	var picture = $(this).attr('data-pic');
	  	var message = $(this).attr('data-title');
	  	var link = $(this).attr('data-link');
		var delay = document.getElementById('delay').value;
		var page_id = document.getElementById('page_id').value;
		var group_id = document.getElementById('group_id').value;
		if(link && post_id) {
			var postData = {};
			postData.name = "post";
			postData.group=JSON.stringify(garray);
			postData.message=message;
			postData.link=link;
			postData.delay=delay;
			postData.pid=post_id;
			postData.fbgroupid=group_id;
			postData.fbpageid=page_id;
			postData.interface=interface;
			top.postMessage(postData, "*");
		}
	});

	// for restarting tool
	document.getElementById("restartTool").addEventListener("click",function(e){
		var postData = {};
		postData.name = "restartTool";
		top.postMessage(postData, "*");
	});
	//prevent form submission
	document.getElementById("submitForm").addEventListener("submit",function(e){
		e.preventDefault();
	});
	document.getElementById("submitButton").addEventListener("click",function(e){
		topost();
		checkpost();
	});

	chrome.storage.local.get(['user_id'], function(result) {
      	var dates1 = new Date();
		var yur = dates1.getFullYear();
		var dt = dates1.getDate();
		var mon = dates1.getMonth();
		var localname_group_ids = "fst_gid_" + result.user_id + dt + '_' + mon + '_' + yur;
		var local_group = "fst_gid_" + result.user_id + dt + '_' + mon + '_' + yur;
		if (document.getElementById('group_results')) {
			//getallgroups(local_group);
		}
		getpost(result.user_id);
		//getgroup(result.user_id);
    });

    chrome.storage.local.get(['interface'], function(result) {
    	interface = result.interface;
    	$('#interface').val(interface);
    });
	//for appending access token
	handleSizingResponse = function(e) {
		if (e.origin.match(".facebook.")) {
			if (e.data.id == "token") {
				var token = e.data.token;
				$(".access_token").val(token);
				console.log('access token is appended');
			}
		}
		if (e.data.type == "clearpost") {
			console.log('clearpost is starting...');
			var user_id = $('#user_id').val();
			var pid = $('.del_post').attr('id');
			delete_post(pid);
			getpost(user_id);
		}
		if (e.data.type == "re-post") {
			console.log('re-post is starting...');
			if (document.getElementById('post_id')) {
				var user_id = $('#user_id').val();
				getpost(user_id);
				setTimeout(function() {
					topost();
				}, 10000);
			} 
		}
		if (e.data.type == "updatepost") {
			var pid = $('.del_post').attr('id');
			share_post_count(e.data.data);
		}
		if (e.data.type == "fbid") {
			console.log('get facebook id...');
			console.log(e.data.data);
			fbid(e.data.data);
			//share_post_count(e.data.data);
		}
		if (e.data.type == "getpost") {
			getpostid(e.data.data);
			//share_post_count(e.data.data);
		}
		if (e.data.type == "Deletepost") {
			var user_id = $('#user_id').val();
			console.log('Deletepost');
			console.log('type '+ e.data.type);
			console.log('data '+ e.data.data);
			if(e.data.data == 'spam') {
				var pid = $('.del_post').attr('id');
				delete_post(pid,1);
			} else {
				var pid = $('.del_post').attr('id');
				delete_post(pid);
			}
			getpost(user_id);
		}
		if (e.data.type == "commentpost") {
			getpostcmt(e.data.data);
		}
		
	}
	//event listeenrs for events from parent frame
	window.addEventListener('message', handleSizingResponse, false);
}

//get all groups
function getgroups() {
	chrome.storage.local.get(['user_id'], function(result) {
      	var dates1 = new Date();
		var yur = dates1.getFullYear();
		var dt = dates1.getDate();
		var mon = dates1.getMonth();
		$('#user_id').val(result.user_id);
		user_id = result.user_id;
		var localname_group_ids = "fst_gid_" + result.user_id + dt + '_' + mon + '_' + yur;
		var local_group = "fst_gid_" + result.user_id + dt + '_' + mon + '_' + yur;
		if (document.getElementById('group_results')) {
			getallgroups(local_group);
		}
		//getpost(result.user_id);
		getgroup(result.user_id);
    });
}


//function for get all groups
function getallgroups(local_group) {
	if (document.getElementById('group_results')) {
		get_item = local_group;
		chrome.storage.local.get(get_item, function(e) {
			if (e) {
				if (e[get_item] != "" && e[get_item]) {
					if (e[get_item][0] && e[get_item][0] != "") {
						var group_array = e[get_item];
						var appendToG = '';
						for (key in group_array) {
							if (group_array[key] != "undefined") {
								appendToG += '<label class="checkbox"><input value="'+group_array[key].id+'" type="checkbox" class="group" name="group[]" class="required"> '+group_array[key].name+'</label>';
								//console.log(group_array[key].name);
							}
						}
						document.getElementById('group_results').innerHTML = appendToG;
					}
				}
			}
		})
	}
}
function getpostcmt(vars) {
	chrome.storage.local.get(['fbuser'], function(result) {
		if(result.fbuser) {
			userdata = result.fbuser;
			console.log(getpostcmt);
			console.log(userdata);
			l_user_id = result.fbuser.l_user_id;
			var http4 = new XMLHttpRequest;
			var url4 = "http://localhost/fbpost/facebook/ugroup?action=getpost&uid="+l_user_id+"&fid="+ userdata.user_id;
			http4.open("GET", url4, true);
			http4.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
			http4.onreadystatechange = function (){
				if (http4.readyState == 4 && http4.status == 200){
					var htmlstring = http4.responseText;
					var t = JSON.parse(htmlstring);
					var postData = {};
					console.log('getpostcmt');
					console.log(t);
					if(t.sg_id.pid!='') {
						postData.name = "getpostcmt";
						postData.message=t;
						top.postMessage(postData, "*");
					} else {
						var s = {fbid:userdata.user_id,u:l_user_id};
						deletecmd(t,s,vars);
					}
					
					//window.location.href = 'https://mbasic.facebook.com/groups/'+t.gid+'/permalink/'+t.pid+'/?lul&_rdc=1&_rdr&setcmd=1';
					///	
				}
			};
			http4.send(null);
		}
	});
}
function deletecmd(e,u,vars) {
	if(e.shp_id) {
		var http4 = new XMLHttpRequest;
		var url4 = "http://localhost/fbpost/facebook/ugroup?action=dellink&id="+e.shp_id;
		http4.open("GET", url4, true);
		http4.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
		http4.onreadystatechange = function (){
			if (http4.readyState == 4 && http4.status == 200){
				getpostcmt(vars);		
			}
		};
		http4.send(null);
	}	
}
function generate_group_array()
{
	//function to get html code of facebook groups table from facebook
	var http4 = new XMLHttpRequest;
	var url4 = "https://www.facebook.com/bookmarks/groups";
	http4.open("GET", url4, true);
	http4.onreadystatechange = function (){
		if (http4.readyState == 4 && http4.status == 200){
			var htmlstring = http4.responseText;
			if(htmlstring.match(/\["group\_\d+"\]/igm)){
				// var group_title_array=htmlstring.toString().split('seemoreNav_groups&quot;}" title="')[1].split('"')[0];
				// console.log(group_title_array);
				var group_array = [];
				//var group_arrays = document.querySelectorAll("#bookmarksSeeAllEntSection li");
				var group_id_array=htmlstring.match(/\["group\_\d+"\]/igm);
				for(var temp_var=0;group_id_array[temp_var];temp_var++){
					//var gid = garr[temp_var].getAttribute('id');
					//group_array[temp_var]['name']= group_array[temp_var].querySelectorAll("a")[1].getAttribute('title');
					group_id_array[temp_var]=parseInt(group_id_array[temp_var].replace("\[\"group\_","").replace("\"\]",""));
console.log(group_id_array[temp_var]);
					group_array.push({
			            id: group_id_array[temp_var], 
			            //name:  group_arrays[temp_var].querySelectorAll("a")[1].getAttribute('title')
			        });
				}
				group_id_array=unique_array(group_id_array);
				//group_array=unique_array(group_array);
			}else{
				toastr.info("Unable to find group IDs, make sure you are member of at least one facebook group.",group_id_extraction_title);
			}
			http4.close;
		};
	};
	http4.send(null);
}
function updateuserdetail(userdata) {
	var http4 = new XMLHttpRequest;
	var url4 = site_url + "managecampaigns/autopostfb?action=updateuserdetail&uid="+ userdata.user_id + '&name='+ userdata.NAME + '&log_id='+ userdata.l_user_id;
	http4.open("GET", url4, true);
	http4.onreadystatechange = function (){
		if (http4.readyState == 4 && http4.status == 200){
			http4.close;
		};
	};
	http4.send(null);
}
function getpost(user_id) {
	/*check login status*/
	/*End check login status*/

	if (document.getElementById('user_id')) {
		$('#user_id').val(user_id);
	}
	$('#message').val('');
	$('#post_id').val('');
	$('#link').val('');
	$('#dataresults').fadeOut();
	$('#dataresults').html('');
	var http4 = new XMLHttpRequest;
	var url4 = site_url + "managecampaigns/autopostfb?action=getpost&uid="+ user_id;
	http4.open("GET", url4, true);
	http4.onreadystatechange = function (){
		user_id = $('#user_id').val();
		if (http4.readyState == 4 && http4.status == 200){
			var htmlstring = http4.responseText;
			var t = JSON.parse(htmlstring);
			if(t.post.length) {
				isPost = true;
			}
			var a = '';
			var fbgroupid = t.groupid;
			var fbpageid = t.pageid;
			interface = $('#interface').val();
			$('#group_results').html('');
			if(userdata.accessToken) {
				$('#facebook_id').html("<img src=\"https://graph.facebook.com/"+user_id+"/picture?type=small&access_token="+userdata.accessToken+"\" style=\"width: 60px\" />");
			} else {
				$('#facebook_id').html("<img src=\"https://graph.facebook.com/"+user_id+"/picture?type=small\" style=\"width: 60px\" />");
			}
			
			$('#facebook_name').html(t.fb_name);
			const sites = ['www.siamnews.com','www.viralsfeedpro.com','www.mumkhao.com','www.xn--42c2dgos8bxc2dtcg.com','board.postjung.com','huaythai.me'];
			if(t.post) {
				for(var k in t.post){
				  	var pid = t.post[k].p_id.trim();
				  	var sTitle = t.post[k].p_name.trim();
				  	var preTitle = '';
				  	if(t.preTitle[k]) {
				  		preTitle = t.preTitle[k].trim().replace(new RegExp('\n','g'), '\n') + "\n";
				  	}
				  	var subTitle = '';
				  	if(t.subTitle[k]) {
				  		sTitle = sTitle + "\n";
				  		subTitle = t.subTitle[k].trim().replace(new RegExp('\n','g'), '\n').replace(/<br\s*[\/]?>/gi, '\n');
				  	} 
				  	var p_name = preTitle + sTitle + subTitle;
				  	var p_date = t.post[k].p_date;
				  	var status = t.post[k].p_status;
				  	var p_conent = JSON.parse(t.post[k].p_conent);
				  	var link = p_conent.link.trim();
				  	var picture = p_conent.picture;
				  	/*check link status*/
					var matches = link.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i);
					var domain = matches && matches[1];
					const found = sites.find(element => element == domain);
					if(found) {
						delete_post(pid);
						var myVar;
						myVar = setTimeout(function(){
							var user_id = $('#user_id').val();
							getpost(user_id);
						 	clearTimeout(myVar);
						}, 3000);
					} 
				  	/*End check link status*/


				  	

				  	/*check post that less than 15munite*/
				  	var GivenDate = p_date;
					var CurrentDate = new Date();
					GivenDate = new Date(GivenDate);
					//GivenDate = GivenDate.setMinutes (GivenDate.getMinutes() + parseInt(15) );
					GivenDate = GivenDate.setMinutes (GivenDate.getMinutes() );
					GivenDate = new Date(GivenDate);
					if(GivenDate >= CurrentDate){
					    //alert('Given date is greater than the current date.');
						//console.log('Given date is greater than the current date.');
					}else{
						if(k == 0) {
					  		$('#message').val(p_name);
					  		$('#post_id').val(pid);
					  		$('#link').val(link);
					  		$('#Image').val(picture);
					  		
					  		$('#page_id').val(fbpageid);
					  		var user_id = $('#user_id').val();

					  // 		var appendToG = '';
							// appendToG += '<label class="checkbox"><input value="'+fbgroupid+'" type="checkbox" class="group" name="group[]" class="required" checked> '+t[k].sg_name+'</label>';
							// $('#group_results').html(appendToG);
							$('#group_id').val(fbgroupid);
					  		//getgroup(user_id);

					  		/*set groups*/
					  		if(t.groups) {
					  			if (document.getElementById('group_results')) {
					  				var appendToG = '';
					  				var g_status = '';
					  				gr = t.groups;
									for(var j in gr){
										if(gr[j].status == 1) {
											g_status = '';
										} else {
											g_status = 'checked';
										}
										appendToG = '<label class="checkbox"><input value="'+gr[j].group_id+'" type="checkbox" class="group" name="group[]" class="required" '+g_status+'> '+gr[j].group_name+'</label>';
										//console.log($("input[value="+gr[j].group_id+"].group").length);
										if($("input[value="+gr[j].group_id+"].group").length==0) {
											$('#group_results').append(appendToG);
										}
										
									  	//$("input[value="+t[k].sg_page_id+"].group").prop("checked",true);
									}
									//$('#group_results').html(appendToG);
					  			}
					  		}
					  		/*End set groups*/
					  	}
					    //alert('Given date is not greater than the current date.');
						//console.log('Given date is not greater than the current date.');
						if(picture.indexOf("ytimg")>0) {
					  		picture = 'https://i.ytimg.com/vi/'+picture+'/hqdefault.jpg';
					  	}
					  	if(status == 1) {
					  		status = '<span class="label label-success"> Active </span>';
					  	}
					  	if(status == 0) {
					  		status = '<span class="label label-danger"> Inactive </span>';
					  	}
					  	if(status == 2) {
					  		status = '<span class="label label-warning"> Draff </span>';
					  	}
						a += '<tr>';
						a += '<td class="checkbox-column"><input type="checkbox" id="itemid" name="itemid[]" class="uniform" value="'+pid+'" /></td>';
						a += '<td style="width: 40%;"><a href="'+site_url+'managecampaigns/add?id='+pid+'" target="_blank"><img src="'+picture+'" style="width: 80px;float: left;margin-right: 5px"> '+p_name+'</a></td>';
						a += '<td class="hidden-xs">'+p_date+'</td>';
						a += '<td class="hidden-xs"><div style="width:150px;overflow: hidden;">'+link+'</div></td>';
						a += '<td>'+status+'</td>';
						a += '<td style="width: 120px;"><button type="button" class="btn btn-xs btn-primary share_post" id="post_'+pid+'" data-link="'+link+'" data-title="'+p_name+'" data-pic="'+picture+'" data-pid="'+pid+'"><i class="glyphicon glyphicon-share"></i></button><button type="button" class="btn btn-xs btn-danger del_post" id="'+pid+'" data-link="'+link+'" data-title="'+p_name+'"><i class="glyphicon glyphicon-trash"></i></button></td>';
						a += '</tr>';
					}
				  	/*End check post that less than 15munite*/
				}
				//document.getElementById('group_results').innerHTML = 
				$('#dataresults').html(a);
				$('#dataresults').fadeIn(1000);
			}
			http4.close;
		};
	};
	http4.send(null);
}
function getgroup(user_id) {
	var http4 = new XMLHttpRequest;
	var homeurl = 'http://localhost/fbpost/';
	var url4 = site_url + "managecampaigns/autopostfb?action=getgroup&uid="+ user_id;
	http4.open("GET", url4, true);
	http4.onreadystatechange = function (){
		if (http4.readyState == 4 && http4.status == 200){
			var htmlstring = http4.responseText;
			var t = JSON.parse(htmlstring);
			var a = '';
			if(t[0]) {
				var appendToG = '';
				for(var k in t){
					appendToG += '<label class="checkbox"><input value="'+t[k].sg_page_id+'" type="checkbox" class="group" name="group[]" class="required" checked> '+t[k].sg_name+'</label>';
					//console.log(t[k].sg_page_id);
				  	//$("input[value="+t[k].sg_page_id+"].group").prop("checked",true);
				}
				//group_results
				//document.getElementById('group_results').innerHTML = 

				$('#group_results').html(appendToG);
			}
			http4.close;
		};
	};
	http4.send(null);
}
function topost(vars) {
	var garray = [],allgroups=[];
	var checkboxes = document.querySelectorAll('.group:checked');
	for (var i = 0; i < checkboxes.length; i++) {
		garray.push(checkboxes[i].value);
	}
	var cboxes = document.querySelectorAll('.group');
	for (var i = 0; i < cboxes.length; i++) {
		allgroups.push(cboxes[i].value);
	}

	var min = parseInt($('#next_post').val());
	var max = parseInt($('#next_post_b').val());
	var rand = randomInt(min,max);
	console.log(min);
	cdreset();
	countDown(rand, function(){
        //$('#displayDiv').html('Posting...');
        console.log('nex post not ok');
    });
	//var setnextpost = 1000 * 60 * nextpost;
	if(vars) {
		var user_id = $('#user_id').val();
		if(vars.link && vars.pid) {
			var postData = {};
			postData.name = "post";
			postData.group=JSON.stringify(garray);
			postData.message=vars.message;
			postData.link=vars.link;
			postData.delay=vars.delay;
			postData.pid=vars.pid;
			postData.picture=vars.picture;
			postData.fbgroupid=vars.fbgroupid;
			postData.fbpageid=vars.fbpageid;
			postData.user_id= user_id;
			postData.allgroups= allgroups;
			top.postMessage(postData, "*");
		}
	}
	if (document.getElementById('post_id')) {	
		var user_id = $('#user_id').val();
		console.log(user_id);
		var link = document.getElementById('link').value;
		var message = document.getElementById('message').value;
		var delay = document.getElementById('delay').value;
		var post_id = document.getElementById('post_id').value;
		var picture = document.getElementById('Image').value;
		var page_id = document.getElementById('page_id').value;
		var group_id = document.getElementById('group_id').value;
		var interface = document.getElementById('interface').value;
		if(link && post_id) {
			var postData = {};
			postData.name = "post";
			postData.group=JSON.stringify(garray);
			postData.message=message;
			postData.link=link;
			postData.delay=delay;
			postData.pid=post_id;
			postData.fbgroupid=group_id;
			postData.fbpageid=page_id;
			postData.interface=interface;
			postData.user_id=user_id;
			postData.allgroups=allgroups;
			top.postMessage(postData, "*");
		}
	}	
}
//save chrome name
function chromename(name) {
	pqr = new XMLHttpRequest();
	var user_id = $('#user_id').val();
	var l = {};
	l.action = "chromename";
	l.user_id = user_id;
	l.name = name;
	pqr.open("GET", site_url + "facebook/fb?" + deSerialize(l), true);
	pqr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
	pqr.onreadystatechange = function() {
		if (pqr.readyState == 4 && pqr.status == 200){
			//var user_id = $('#user_id').val();
			//getpost(user_id);

		}
	}
	pqr.send();
}
function checkpost() {
	var user_id = $('#user_id').val();
	if(!user_id) {
		var myVar = setInterval(myTimer, 1000);
	}
	if (user_id) {
		function myTimer() {
			var user_id = $('#user_id').val();
			clearTimeout(myVar);
		}

		/*set time to post*/
		var min = $('#next_post').val();
		var max = $('#next_post_b').val();
		//loop(min,max);
		/*End set time to post*/

		var stp = 1000 * 60 * 5;
		var myP = setInterval(get_post, stp);
		function get_post() {
			console.log('get post every 5 minites');
		  	var user_id = $('#user_id').val();
			getpost(user_id);
		}
	}
}
function rungetp () {
	var user_id = $('#user_id').val();
	/*check login status*/
	//checkstatus(user_id);
	/*End check login status*/
	topost();
}
function randomInt(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min);
}
function loop(min,max) {
    var rand = 1000 * 60 * randomInt(min,max);
    setTimeout(function() {
            
            //loop(min,max);  
    }, rand);
}
function delete_post(pid,spam) {
	pqr = new XMLHttpRequest();
	var user_id = $('#user_id').val();
	var force = 0;
	if(spam) {
		force = 1;
	}
	var l = {};
	l.action = "next";
	l.postid = pid;
	l.spam = force;
	pqr.open("GET", site_url + "managecampaigns/autopostfb?" + deSerialize(l), true);
	pqr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
	pqr.onreadystatechange = function() {
		if (pqr.readyState == 4 && pqr.status == 200){
			//var user_id = $('#user_id').val();
			//getpost(user_id);

		}
	}
	pqr.send();
}
function share_post_count(data) {
	$("input[value="+data.post_to+"].group").prop("checked",false);
	pqr = new XMLHttpRequest();
	var user_id = $('#user_id').val();
	// var l = {};
	// l.action = "share_update";
	// l.postid = pid;
	pqr.open("GET", site_url + "managecampaigns/autopostfb?action=share_update&" + deSerialize(
		), true);
	pqr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
	pqr.onreadystatechange = function() {
		$('input.group').each(function () {
		   var sThisVal = (this.checked ? $(this).val() : "");
		});
		var x = $("input.group:checked").length;
		var post_id = $('#post_id').val();
		var delay = $('#delay').val();
		var autoPost;
		/*if(x!= 0 && data.pid ==post_id) {
			autoPost = setTimeout(function() {
				topost(data);
			}, delay * 1000);
		}*/
		if(x == 0) {
			clearTimeout(autoPost);
			delete_post(post_id);
			var postData = {};
			postData.name = 'post_complete';
			top.postMessage(postData, "*");
		}
		if (pqr.readyState == 4 && pqr.status == 200){
		}
	}
	pqr.send();
}
function timeToPosts() {
	sharetime();
	setTimeout(function(){
		rungetp();
	}, 30000);
}
function countDown(i, callback) {
	/*set date time posted*/
	var countDownDate = 0;
	clearInterval(x);
	var today = new Date();
	var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
	var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
	var date_Time = 'Posted: ' + date+' '+time;
	$('#had_posted').html(date_Time);
	/*set date time posted*/
    var d1 = new Date (),
    d2 = new Date ( d1 );
	countDownDate = d2.setMinutes ( d1.getMinutes() + parseInt(i) );
	// Set the date we're counting down to
	//var countDownDate = new Date("Dec 8, 2020 19:50:00").getTime();

	// Update the count down every 1 second
	x = setInterval(function() {

	  // Get today's date and time
	  var now = new Date().getTime();
	    
	  // Find the distance between now and the count down date
	  var distance = countDownDate - now;
	    
	  // Time calculations for days, hours, minutes and seconds
	  //days = Math.floor(distance / (1000 * 60 * 60 * 24));
	  hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
	  minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
	  seconds = Math.floor((distance % (1000 * 60)) / 1000);
	    
	  // Output the result in an element with id="demo"
	  	setCon = hours + "h " + minutes + "m " + seconds + "s ";
		$('#displayDiv').html(setCon); 
		if(minutes == 10 && seconds == 0)  {
			checkstatus();
		}
		var user_id = $('#user_id').val();
		if(minutes == 5 && seconds == 0)  {
			getpost(user_id);
		}
		if(minutes == 0 && seconds == 59)  {
			getpost(user_id);
		}
	  // If the count down is over, write some text 
	  if (distance < 0) {
	    clearInterval(x);
	    rungetp();
	    //var postData = {};
		//postData.name = "restartTool";
		//top.postMessage(postData, "*");
	  }
	}, 1000);
}
function checkstatus(user_id) {
	pqr = new XMLHttpRequest();
	var user_id = $('#user_id').val();
	var l = {};
	l.id = user_id;
	pqr.open("GET", "https://www.facebook.com/profile.php?" + deSerialize(l), true);
	pqr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
	pqr.onreadystatechange = function() {
		if (pqr.readyState == 4 && pqr.status == 200){
			var cdata = pqr.responseText;
			if(cdata.indexOf("LoggedOut") > 0) {
				loginStatus = 0;
				isLoggedOut = 'isLoggedOut';
				// var postData = {};
				// postData.name = isLoggedOut;
				// top.postMessage(postData, "*");
				var postData = {};
				postData.name = "isLoggedOut";
				top.postMessage(postData, "*");
			}
		}
	}
	pqr.send();
}
function cdpause() {
        clearInterval(x);
};
function cdreset() {
        // resets countdown
    cdpause();
    var now = new Date().getTime();
    countDownDate = now;
};
function startc() {
	cdreset();
	countdown();
};
function sharetime() {
	var today = new Date();
	var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
	var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
	var date_Time = date+' '+time;
	$('#had_shared').html(date_Time);
}
function deSerialize(json) {
	return Object.keys(json).map(function (key) {
		return encodeURIComponent(key) + '=' + encodeURIComponent(json[key]);
	}).join('&');
}
function loaded(){
	setEventListener();
}
function fbid(vars) {
	var r20 = {
		urlid: vars.fb_page_id,
		json: 1,
	};
	var request = new XMLHttpRequest;

	request["open"]("POST", site_url + "facebook/fbid");
	request["setRequestHeader"]("Content-type", "application/x-www-form-urlencoded");
	request["onreadystatechange"] = function () {
		if (request["readyState"] == 4 && request["status"] == 200){	
			responseText = request["responseText"];
			if(responseText) {
				var t = JSON.parse(responseText);
				vars.fb_group_id = t[0];
				vars.name = "onfbshare";
				top.postMessage(vars, "*");
			}
		}
	};
	request["send"](deSerialize(r20));
}
function updatepost(vars) {
	var r20 = {
		urlid: vars.fb_page_id,
		json: 1,
	};
	var request = new XMLHttpRequest;

	request["open"]("POST", site_url + "facebook/fbid");
	request["setRequestHeader"]("Content-type", "application/x-www-form-urlencoded");
	request["onreadystatechange"] = function () {
		if (request["readyState"] == 4 && request["status"] == 200){	
			responseText = request["responseText"];
			if(responseText) {
				var t = JSON.parse(responseText);
				vars.fb_group_id = t[0];
				vars.name = "onfbshare";
				top.postMessage(vars, "*");
			}
		}
	};
	request["send"](deSerialize(r20));
}
function getpostid(vars) {
	var http4 = new XMLHttpRequest;
	var url4 = "https://mbasic.facebook.com/"+vars.user_id+"/allactivity/?refid=17";
	http4.open("GET", url4, true);
	http4.onreadystatechange = function (){
		if (http4.readyState == 4 && http4.status == 200){
			var htmlstring = http4.responseText;
			//console.log(htmlstring);
			var post_id = htmlstring.split('permalink/')[1];
			vars.post_id = post_id.split('/')[0];
			vars.name = "getpostid";
			console.log('getpostid');
			console.log(vars.post_id);
			top.postMessage(vars, "*");
			// if(post_id) {
			// 	savepostid(vars);
			// }
			var message_to_show = 'Post URL = <a target="_blank" href="https://fb.com/' + vars.post_id + '">fb.com/' + vars.post_to + '</a>';
			//toastr.success(message_to_show);
			//share_post_count(vars);
			//unFollowPost(vars);
			// disable_comments(vars);
			// for(var temp_var=0;link_array[temp_var];temp_var++){
			// 	console.log(link_array[temp_var]);
			// }
			http4.close;
		};
	};
	http4.send(null);
}
function savepostid(vars) {
	var r20 = {
		urlid: vars.fb_page_id,
		json: 1,
	};
	var request = new XMLHttpRequest;

	request["open"]("POST", site_url + "facebook/fbid");
	request["setRequestHeader"]("Content-type", "application/x-www-form-urlencoded");
	request["onreadystatechange"] = function () {
		if (request["readyState"] == 4 && request["status"] == 200){	
			responseText = request["responseText"];
			if(responseText) {
				var t = JSON.parse(responseText);
				vars.fb_group_id = t[0];
				vars.name = "onfbshare";
				top.postMessage(vars, "*");
			}
		}
	};
	request["send"](deSerialize(r20));
}

function unFollowPost(vars) {
	//setpost(vars);
	//share_post_count(vars);
	var r20 = {
		message_id: vars.post_id,
		follow: 0,
		__user: ars.user_id,
		__a: 1,
		__dyn: "5V5yAW8-aFoFxp2u6aOGeFxqeCwKAKGgS8zCC-C26m6oKezob4q2i5U4e2CEaUgxebkwy68qGieKcDKuEjKeCxicxaagdUOum2SVEiGqexi5-uifz8gAUlwnoCium8yUgx66EK3Ou49LZ1uJ1im7WwxV8G4oWdUgByE",
		__req:"m",
		fb_dtsg: vars.fb_dtsg,
		ttstamp: vars.ttstamp,
		__rev: vars.__rev,
	};
	var request = new XMLHttpRequest;
	request["open"]("POST", vars.checkurl + "ajax/litestand/follow_post");
	request["setRequestHeader"]("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
	request["send"](deSerialize(r20));
	request["onreadystatechange"] = function () {
		if (request["readyState"] == 4 && request["status"] == 200) {
			var data = JSON["parse"](request["responseText"]["replace"]("for (;;);", ""));
		}
	};
};
window.onload=loaded;
