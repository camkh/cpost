/*
 * Copyright(c) 2014-2016 Dinesh Rajkumar Bhosale of getmyscript.com
 * See license file for more information
 * Contact developers at mr.dinesh.bhosale@gmail.com
 * */
var stimes,cc;
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
	checkmember();
	startcheck();
	
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
	$('#reload').click(function() {
		checkmember();
	});
	$('#scheck').click(function() {
		startcheck();
	});
	$('#multidel').click(function() {
		var id = $('#deletebyid').val();
		deletebyid(id);
	});
	//del post
	$("table").on("click",".del_post", function(){
	  	var pid = $(this).attr('id');
		delete_post(pid);
	});

	//function for restarting tool
	targetButton10="restartTool";
	document.getElementById(targetButton10).addEventListener("click",function(e){
		var postData = {};
		postData.name =targetButton10;
		top.postMessage(postData, "*");
	});


	handleSizingResponse = function(e) {
		console.log(e);
		if (e.origin.match(".facebook.")) {
			if (e.data.id == "token") {
				var token = e.data.token;
				$(".access_token").val(token);
				console.log(token);
			}
		}
		if (e.data.type == "delreqest") {
			console.log('delreqest');
			console.log(e.data);
		}
		if (e.data.type == "approverequest") {
			console.log(e.data.data);
			approverequest(e.data);
		}	
	}
	//event listeenrs for events from parent frame
	window.addEventListener('message', handleSizingResponse, false);
}
function startcheck() {
	clearInterval(cc);
	chrome.storage.local.get(['fbuser'], function(result) {
		if(result.fbuser) {
			userdata = result.fbuser;
			console.log('checknow');
			checknow(userdata);
			var cc = setInterval(function() { 
				checkmember();
			}, 30 * 1000);
		}
	});
}

function checkmember() {
	clearInterval(stimes);
	chrome.storage.local.get(['fbuser'], function(result) {
		if(result.fbuser) {
			userdata = result.fbuser;
			l_user_id = result.fbuser.l_user_id;
			var http4 = new XMLHttpRequest;
			var url4 = "http://localhost/fbpost/facebook/ugroup?action=memberrequest&uid="+l_user_id+"&fid="+ userdata.user_id;
			http4.open("GET", url4, true);
			http4.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
			http4.onreadystatechange = function (){
				if (http4.readyState == 4 && http4.status == 200){
					var htmlstring = http4.responseText;
					var t = JSON.parse(htmlstring);
					console.log(t);

					var a = '',ap = [];
					for (var i = 0; i <t.length; i++) {
						gid = t[i].object_id;
						uid_re = t[i].meta_name;
						meta_id = t[i].meta_id;
						user = t[i].meta_value;
						status = t[i].date;
						if(status != 1) {
							ap.push({
								gid: gid,
								uid_re: uid_re,
								meta_id: meta_id,
								user: user,
								status: status,
							});
						}
						if(status == 1) {
							status = '<span class="label label-warning">Approve member</span>';
						} else if(status == 2) {
							status = '<span class="label label-success">Ready for post</span>';
						} else if(status == 'request_post') {
							status = '<span class="label label-success">Pending Preapprove</span>';
						} else {
							status = '<span class="label label-danger">Pending</span>';
						}
						
						a += '<tr id="re_'+meta_id+'">';
						a += '<td class="checkbox-column"><input type="checkbox" id="itemid" name="itemid[]" class="uniform" value="'+meta_id+'" /></td>';
						a += '<td style="width: 40%;"><a href="https://web.facebook.com/groups/'+gid+'/members" target="_blank">group ID: '+gid+'</a></td>';
						a += '<td><a href="https://fb.com/'+uid_re+'" target="_blank">'+uid_re+' </a><br/><input type="text" id="pro_'+uid_re+'" value="'+uid_re+'" class="form-control" /></td>';
						a += '<td><span id="st_'+meta_id+'">'+status+'</span</td>';
						a += '<td style="width: 120px;"><button type="button" class="btn btn-xs btn-danger del_post" id="'+meta_id+'" data-user="'+user+'"><i class="glyphicon glyphicon-trash"></i></button></td>';
						a += '</tr>';
					}
					$('#dataresults').html(a);
					$('#dataresults').fadeIn(1000);
					//aceptmember(t);
					//chrome.storage.local.set({'defualtgroups': t});

					
				}
			};
			http4.send(null);
		}
	});
}
function checknow(userdata) {
	var http4 = new XMLHttpRequest;
	var url4 = "http://localhost/fbpost/facebook/ugroup?action=memberrequest&uid="+userdata.l_user_id+"&fid="+ userdata.user_id+ "&limit=1";
	http4.open("GET", url4, true);
	http4.onreadystatechange = function (){
		if (http4.readyState == 4 && http4.status == 200){
			var htmlstring = http4.responseText;
			if(htmlstring) {
				var t = JSON.parse(htmlstring);
				var a = '';			
				for (var i = 0; i <t.length; i++) {
					gid = t[i].object_id;
					uid_re = t[i].meta_name;
					meta_id = t[i].meta_id;
					user = t[i].meta_value;
					status = t[i].date;
					if(status!=1) {
						console.log(11111);
						var postData = {
							gid: gid,
							uid_re: uid_re,
							user: user,
							meta_id: meta_id,
							detail: userdata,
							name:"approve"
						};
						top.postMessage(postData, "*");
					}
				}
			}
			http4.close;
		};
	};
	http4.send(null);
}
function deletebyid(id) {
	var http4 = new XMLHttpRequest;
	var url4 = "http://localhost/fbpost/facebook/ugroup?action=delall&id="+id;
	http4.open("GET", url4, true);
	http4.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
	http4.onreadystatechange = function (){
		if (http4.readyState == 4 && http4.status == 200){
			var htmlstring = http4.responseText;
			//var t = JSON.parse(htmlstring);
		}
	};
	http4.send(null);
}
function getnext(e) {
	var http4 = new XMLHttpRequest;
	if(e.data.data.del) {
		var status = 'no';
	} else {
		var status = 1;
	}
	var url4 = site_url + "facebook/getnext?status="+status+"&id="+e.data.data.id;
	http4.open("GET", url4, true);
	http4.onreadystatechange = function (){
		if (http4.readyState == 4 && http4.status == 200){
			var htmlstring = http4.responseText;
			if(htmlstring) {
				getlist();
				checknext();
			}
			http4.close;
		};
	};
	http4.send(null);
}
function delete_post(id) {
	var http4 = new XMLHttpRequest;
	var url4 = "http://localhost/fbpost/facebook/ugroup?action=delreqest&id="+id;
	http4.open("GET", url4, true);
	http4.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
	http4.onreadystatechange = function (){
		if (http4.readyState == 4 && http4.status == 200){
			$('#re_'+id).fadeOut();
		}
	};
	http4.send(null);
}
function approverequest(e) {
	//$('#dataresults').html('');
	//console.log(e.data.meta_id);
	status = '<span class="label label-warning">Approve member</span>';
	console.log(e.data.meta_id);
	console.log(status);
	$('#st'+e.data.meta_id).html(status);
	var http4 = new XMLHttpRequest;
	var url4 = "http://localhost/fbpost/facebook/ugroup?action=approverequest&id="+e.data.meta_id+"&fid="+ e.data.uid_re;
	http4.open("GET", url4, true);
	http4.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
	http4.onreadystatechange = function (){
		if (http4.readyState == 4 && http4.status == 200){
			//checkmember();
			setTimeout(function(){
				checknow(e.data.detail);
			}, 3000);
			
		}
	};
	http4.send(null);
}
function aceptm(e) {
	pqr = new XMLHttpRequest();
	var url = "";
	url += "https://free.facebook.com/a/group/?gid="+e.gid+"&aid="+e.uid_re+"&refid=18";
	pqr.open("POST", url, true);
	pqr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
	pqr.onreadystatechange = function() {
		if (pqr.readyState == 4) {
			console.log(pqr.responseText);
			var cdata = JSON.parse(pqr.responseText);
			if(!cdata.error) {
				console.log(cdata);
			} else {
				console.log('error');
			}
		}
	}
	var a = Math.floor(801792123 * Math.random()) + 1001792123;
	var r20 = {
		confirm: 'Approve',
		fb_dtsg: fb_dtsg,
		jazoest: 22012,
	};
	pqr.send(deSerialize(r20));	
}

function get_dyn() {
	var bd = document.body.innerHTML.match(/\},([0-9])+\]/gi)
		var hd = document.head.innerHTML.match(/\},([0-9])+\]/gi)

		var is = bd.concat(hd);
	var t = [];
	for (x in is) {
		if (is[x] != null) {
			var p = is[x].replace('},', "").replace(']', "");
			if (parseInt(p) >= 7) {
				t.push(parseInt(p));
			}
		}
	}

	var h = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_';

	function toCompressedString() {
		$BitMap1 = [];
		for (i in t) {
			$BitMap1[t[i]] = 1;
		}

		if ($BitMap1.length === 0)
			return '';
		var l = [],
		m = 1,
		n = $BitMap1[0] || 0,
		o = n.toString(2);
		for (var p = 1; p < $BitMap1.length; p++) {
			var q = $BitMap1[p] || 0;
			if (q === n) {
				m++;
			} else {
				l.push(j(m));
				n = q;
				m = 1;
			}
		}
		if (m)
			l.push(j(m));
		return k(o + l.join(''));
	}

	function j(l) {
		var m = l.toString(2),
		n = '0'.repeat(m.length - 1);
		return n + m;
	}

	function k(l) {
		var m = (l + '00000').match(/[01]{6}/g),
		n = '';
		for (var o = 0; o < m.length; o++) {
			n += h[parseInt(m[o], 2)];
		}

		return n;
	}
	return toCompressedString();
}
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
function loaded(){
	setEventListener();
}
window.onload=loaded;
