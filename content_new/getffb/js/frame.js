/*
 * Copyright(c) 2014-2016 Dinesh Rajkumar Bhosale of getmyscript.com
 * See license file for more information
 * Contact developers at mr.dinesh.bhosale@gmail.com
 * */
 getlist(0);
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
$( document ).ready(function() {
    if(window.location.hash.substr(1) == 'active') {
    	$('.notactive').hide();
    	$('.active').show();
    }
});

//setting event listeners on current frame
function setEventListener(){
	// addEventListener("message", function(event) {
	// }, false);
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
	//prevent form submission
	document.getElementById("submitForm").addEventListener("submit",function(e){
		e.preventDefault();
	});
	document.getElementById("submitButton").addEventListener("click",function(e){
		//inviteFriendsToLikePage
		checknow();
	});
	document.getElementById("gennow").addEventListener("click",function(e){
		//inviteFriendsToLikePage
		var postData = {};
		postData.name = "gennow";
		postData.max=document.getElementById("Max").value;
		postData.phone=document.getElementById("setphone").value;
		postData.ccode=document.getElementById("input17").value;
		gennow(postData);
	});
	document.getElementById("imacros").addEventListener("click",function(e){
		var postData = {};
		postData.name = "testimacros";
		top.postMessage(postData, "*");
	});
	//for appending access token	

	handleSizingResponse = function(e) {
		
		if (e.data.type == "next") {
			console.log('clearpost is starting...');
			getnext(e);
		}		
	}
	//event listeenrs for events from parent frame
	addEventListener('message', handleSizingResponse, false);
}
function checknow() {
	var http4 = new XMLHttpRequest;
	var url4 = site_url + "facebook/getnumlist?limit=1";
	http4.open("GET", url4, true);
	http4.onreadystatechange = function (){
		if (http4.readyState == 4 && http4.status == 200){
			var htmlstring = http4.responseText;
			if(htmlstring) {
				var t = JSON.parse(htmlstring);
				var a = '';			
				if(t.list) {
					for(var k in t.list){
					  	var phone = t.list[k].f_phone;
					  	var pass = t.list[k].f_pass;	
					  	var id = t.list[k].id;
					  	var postData = {};
						postData.name = "checknow";
						postData.delay=document.getElementById("delay").value;
						postData.chromename=document.getElementById("chromename").value;
						postData.phone=phone;
						postData.pass=pass;
						postData.phoneid=id;
					  	updatefb(postData);	
					}
				}
			}
			http4.close;
		};
	};
	http4.send(null);
}
function gennow(postData) {
	var r20 = {
		max: postData.max,
		phone: postData.phone,
		ccode: postData.ccode,
	};
	var request = new XMLHttpRequest;

	request["open"]("POST", site_url + "facebook/gennum");
	request["setRequestHeader"]("Content-type", "application/x-www-form-urlencoded");
	request["onreadystatechange"] = function () {
		if (request["readyState"] == 4 && request["status"] == 200){	
			getlist(1);
		}
	};
	request["send"](deSerialize(r20));
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
function checknext() {
	var delay=parseInt(document.getElementById("delay").value);
	setTimeout(function(){
		checknow();
	}, (delay*1000));
}
function updatefb(postData) {	
	var http4 = new XMLHttpRequest;
	var url4 = site_url + "facebook/fbupdate?status=7&id="+postData.pass;
	http4.open("GET", url4, true);
	http4.onreadystatechange = function (){
		if (http4.readyState == 4 && http4.status == 200){			
			top.postMessage(postData, "*");
			http4.close;
		};
	};
	http4.send(null);
}
function getlist(act) {
	$('#phone').val('');
	$('#pass').val('');
	$('#phoneid').val('');
	$('#dataresults').html('');
	var http4 = new XMLHttpRequest;
	var url4 = site_url + "facebook/getnumlist";
	http4.open("GET", url4, true);
	http4.onreadystatechange = function (){
		if (http4.readyState == 4 && http4.status == 200){
			var htmlstring = http4.responseText;
			if(htmlstring) {
				var t = JSON.parse(htmlstring);
				var a = '';			
				if(t.list) {
					for(var k in t.list){
					  	var phone = t.list[k].f_phone;
					  	var pass = t.list[k].f_pass;	
					  	var id = t.list[k].id;	
						if(k == 0) {
					  		$('#phone').val(phone);
					  		$('#pass').val(pass);
					  		$('#phoneid').val(id);
					  		var delay=document.getElementById("delay").value;
					  		if(act==1) {
					  			
					  		}
					  	}
					    //alert('Given date is not greater than the current date.');
						//console.log('Given date is not greater than the current date.');
						status = '<span class="label label-danger"> Uncheck </span>';
						a += '<tr>';					
						a += '<td style="width: 40%;">'+phone+'</td>';
						a += '<td>'+pass+'</td>';
						a += '<td>'+status+'</td>';
						a += '<td style="width: 120px;"><button type="button" class="btn btn-xs btn-danger del_post" id="" data-link="" data-title=""><i class="glyphicon glyphicon-trash"></i></button></td>';
						a += '</tr>';

					  	/*End check post that less than 15munite*/
					}
					//document.getElementById('group_results').innerHTML = 
					$('#dataresults').html(a);
					$('#dataresults').fadeIn(1000);
				}
				if(t.count) {
					$('#listcount').html(t.count);
				}
			}
			http4.close;
		};
	};
	http4.send(null);
}
function loaded(){
	setEventListener();
}
function deSerialize(json) {
	return Object.keys(json).map(function (key) {
		return encodeURIComponent(key) + '=' + encodeURIComponent(json[key]);
	}).join('&');
}
function testimacros() {
	var macroCode = '';
	macroCode += 'TAB OPEN\n TAB T=2\n';
	macroCode += 'SET !ERRORIGNORE YES\n SET !TIMEOUT_PAGE 3600\n';
	macroCode += 'URL GOTO=http://localhost/fbpost/Facebook/fblist\n';
	launchMacro(macroCode);
}
function launchMacro(macroCode)
{
try
   {
      if(!/^(?:chrome|https?|file)/.test(location))
      {
         alert('iMacros: Open webpage to run a macro.');
         return;
      }
   
      var macro = {}; 
      macro.source = macroCode;
      macro.name = 'EmbeddedMacro';
   
      var evt = document.createEvent('CustomEvent');
      evt.initCustomEvent('iMacrosRunMacro', true, true, macro);
      window.dispatchEvent(evt);
   }
	catch(e)
	{
	   alert('iMacros Bookmarklet error: '+e.toString());
	};
}
window.onload=loaded;
