/*
 * Copyright(c) 2014-2016 Dinesh Rajkumar Bhosale of getmyscript.com
 * See license file for more information
 * Contact developers at mr.dinesh.bhosale@gmail.com
 * */
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
	var interval = setInterval(function() { 
		checkmember();
	}, 30 * 1000);
	
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
function checkmember() {
	chrome.storage.local.get(['fbuser'], function(result) {
		if(result.fbuser) {
			userdata = result.fbuser;
			console.log(userdata);
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
						if(status == 1) {
							status = '<span class="label label-warning">Approve member</span>';
						} else if(status == 2) {
							status = '<span class="label label-success">Ready for post</span>';
						} else {
							status = '<span class="label label-danger">Pending</span>';
						}
						if(status != 1 && status != 2) {
							ap.push({
								gid: gid,
								uid_re: uid_re,
								meta_id: meta_id,
								user: user,
								status: status,
							});
						}
						a += '<tr>';
						a += '<td id="re_'+meta_id+'" class="checkbox-column"><input type="checkbox" id="itemid" name="itemid[]" class="uniform" value="'+meta_id+'" /></td>';
						a += '<td style="width: 40%;"><a href="https://web.facebook.com/groups/'+gid+'/members" target="_blank">group ID: '+gid+'</a></td>';
						a += '<td><a href="https://fb.com/'+uid_re+'" target="_blank">Profile : '+uid_re+'</a></td>';
						a += '<td>'+status+'</td>';
						a += '<td style="width: 120px;"><button type="button" class="btn btn-xs btn-danger del_post" id="'+meta_id+'" data-user="'+user+'"><i class="glyphicon glyphicon-trash"></i></button></td>';
						a += '</tr>';
					}
					$('#dataresults').html(a);
					$('#dataresults').fadeIn(1000);
					if(ap.length) {
						for (var i = 0; i <ap.length; i++) {
							gid = ap[i].gid;
							uid_re = ap[i].uid_re;
							meta_id = ap[i].meta_id;
							user = ap[i].user;
							setTimeout(function () {
								var postData = {
									gid: gid,
									uid_re: uid_re,
									user: user,
									meta_id: meta_id,
									data: t,
									name:"approve"
								};
				     //            var postData = {
				     //            	gid: '248659569077266',
									// uid_re: '100024103188107',
									// data: t,
									// name:"approve"
				     //            };
								top.postMessage(postData, "*");
				            }, 3 * 1000 );
						}
					}
					//aceptmember(t);
					//chrome.storage.local.set({'defualtgroups': t});
				}
			};
			http4.send(null);
		}
	});
}
function delete_post(id) {
	var http4 = new XMLHttpRequest;
	var url4 = "http://localhost/fbpost/facebook/ugroup?action=delreqest&id="+id;
	http4.open("GET", url4, true);
	http4.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
	http4.onreadystatechange = function (){
		if (http4.readyState == 4 && http4.status == 200){
			$('#re_'+id).fadeOut( "slow" );
		}
	};
	http4.send(null);
}
function approverequest(e) {
	var http4 = new XMLHttpRequest;
	var url4 = "http://localhost/fbpost/facebook/ugroup?action=approverequest&id="+e.data.meta_id+"&fid="+ e.data.uid_re;
	http4.open("GET", url4, true);
	http4.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
	http4.onreadystatechange = function (){
		if (http4.readyState == 4 && http4.status == 200){
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
function loaded(){
	setEventListener();
}
window.onload=loaded;
