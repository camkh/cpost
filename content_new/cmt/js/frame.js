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
		if (e.data.type == "getgpost") {
			getcpost();
		}
		if (e.data.type == "dellink") {			
			dellink(e.data.data.data);
		}
	}
	//event listeenrs for events from parent frame
	window.addEventListener('message', handleSizingResponse, false);
}

function getcpost() {
	chrome.storage.local.get(['fbuser'], function(result) {
		if(result.fbuser) {
			userdata = result.fbuser;
			l_user_id = result.fbuser.l_user_id;
			var http4 = new XMLHttpRequest;
			var url4 = "http://localhost/fbpost/facebook/ugroup?action=getpost&uid="+l_user_id+"&fid="+ userdata.user_id;
			http4.open("GET", url4, true);
			http4.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
			http4.onreadystatechange = function (){
				if (http4.readyState == 4 && http4.status == 200){
					var htmlstring = http4.responseText;
					console.log(htmlstring);
					var t = JSON.parse(htmlstring);
					var postData = {};
					postData.name = "comment";
					postData.message=t;
					top.postMessage(postData, "*");		
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
function dellink(vars) {
	if(vars.shp_id) {
		var http4 = new XMLHttpRequest;
		var url4 = "http://localhost/fbpost/facebook/ugroup?action=dellink&id="+vars.shp_id;
		http4.open("GET", url4, true);
		http4.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
		http4.onreadystatechange = function (){
			if (http4.readyState == 4 && http4.status == 200){
				getcpost();
			}
		};
		http4.send(null);
	}
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
