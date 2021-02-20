/*
 * Copyright(c) 2014-2016 Dinesh Rajkumar Bhosale of getmyscript.com
 * See license file for more information
 * Contact developers at mr.dinesh.bhosale@gmail.com
 * */
// for showing notifications
function show(msg, url) {
	//icon path is different for different extension so be careful, 48 pixel icon
	var iconPath = '/global/images/icons/48.png'
	var time = /(..)(:..)/.exec(new Date()); // The prettyprinted time.
	var hour = time[1] % 12 || 12; // The prettyprinted hour.
	var period = time[1] < 12 ? 'A.M.' : 'P.M.'; // The period of the day.
	var notification = new Notification(hour + time[2] + ' ' + period, {
		icon: iconPath,
		body: msg
	});
	if(url){
		notification.onclick = function() {
			window.open(url);
		};
	}
}
//for running tools in new tab when a tool is already running on this tab
function tabRun(callbak,url){
	var createProperties={}
	if(url){
		createProperties.url=url;
	}else{
		createProperties.url="https://www.facebook.com";
	}
	chrome.tabs.create(createProperties, function callback(e) {
		callbak();
	});
}
function reloadurl(callback,vars) {
	var reloadProperties={};
	reloadProperties.url=vars.url;
	chrome.tabs.update(vars.id, reloadProperties, function callback(e) {
		//console.log(e.status);
		// var createProperties={};
		// createPropertiesurl=vars.url;
		// chrome.tabs.create(createProperties, calls);
	});
}
// to start a tool
function start(toolName,newTab){
	console.log(toolName);
	//check tool namr
	if(toolName=="fbvid"){
		tabRun(fbvid,null);
	}else if(toolName=="jmugids"){
		tabRun(jmugids,null);
	}else if(toolName=="polp"){
		tabRun(polp,null);
	}else if(toolName=="epeoff"){
		tabRun(epeoff,null);
	}else if(toolName=="fbidext"){
		//facebook id extractor
		tabRun(fbidext,null);
	}else if(toolName=="iyftlyp"){
		// invite your friends to like your page
		tabRun(iyftlyp,null);
	}else if(toolName=="iyftlyp"){
		// invite your friends to like your page
		tabRun(iyftlyp,null);
	}else if(toolName=="ctdapg"){
		// invite your friends to like your page
		tabRun(ctdapg,null);
	}else if(toolName=="iyallb"){
		//facebook id extractor
		tabRun(iyallb,null);
	}else if(toolName=="caaffp"){
		//facebook id extractor
		tabRun(caaffp,null);
	}else if(toolName=="iyftjyg"){
		// invite your friends to join your group
		tabRun(iyftjyg,null);
	}else if(toolName=="aafrao"){
		// accept all friend  at once
		var url='https://mobile.facebook.com/friends/center/requests/all/';
		tabRun(aafrao,url);
	}else if(toolName=="clickpoke"){
		// click all poke buttons
		var url='https://www.facebook.com/pokes';
		tabRun(clickpoke,url);
	}else if(toolName=="caafb"){
		//click all ad friend buttons
		var url="https://www.facebook.com/friends/requests/";
		tabRun(caafb,url);
	}else if(toolName=="clicklike"){
		// click all like buttons
		tabRun(clicklike,url);
	}else if(toolName=="cajb"){
		// click all join buttons
		tabRun(cajb,null);
	}else if(toolName=="uafpao"){
		// unlike all facebook pages at once
		tabRun(uafpao,null);
	}else if(toolName=="uaffao"){
		// unfriend all facebook friends
		tabRun(uaffao,null);
	}else if(toolName=="delapp"){
		// unlike all facebook pages at once
		tabRun(delapp,null);
	}else if(toolName=="uaff"){
		// unfollowing all facebook friends
		tabRun(uaff,null);
	}else if(toolName=="dacao"){
		// deleting all comments
		tabRun(dacao,null);
	}else if(toolName=="uafgao"){
		// unfollowing all facebook groups at once
		tabRun(uafgao,null);
	}else if(toolName=="rafgao"){
		//remove all facebook groups
		tabRun(rafgao,null);
	}else if(toolName=="capfr"){
		// cancel all pending friend 
		tabRun(capfr,null);
	}else if(toolName=="iafsao"){
		// ignore all friend suggestions at once
		var url='https://www.facebook.com/friends/requests/';
		tabRun(iafsao,url);
	}else if(toolName=="gtt"){
		// group transfer tool
		tabRun(gtt,null);
	}else if(toolName=="gptto"){
		//var url='https://www.facebook.com/me';
		tabRun(gptto,null);
	}else if(toolName=="getffb"){
		chrome.tabs.create({url: 'http://localhost/fbpost/home/index', active: false});
		var url='https://mbasic.facebook.com/login/?next&ref=dbl&fl&refid=8';
		tabRun(getffb,url);		
	}else if(toolName=="gpt"){
		// group posting tool 1
		tabRun(gpt,null);
	}else if(toolName=="gpt2"){
		// group posting tool 2
		tabRun(gpt2,null);
	}else if(toolName=="poofp"){
		// post on own facebook page
		tabRun(poofp,null);
	}else if(toolName=="caga"){
		//claim as group admin
		tabRun(caga,null);
	}else if(toolName=="poofp"){
		//posting on own facebook pages
		tabRun(poofp,null);
	}else if(toolName=="caga"){
		// claim as gorup admin
		tabRun(caga,null);
	}else if(toolName=="maff"){
		// message all facebook friends
		tabRun(maff,null);
	}else if(toolName=="popl"){
		// post in liked pagesj
		tabRun(popl,null);
	}else if(toolName=="jmgids"){
		//for joining multiple groups
		tabRun(jmgids,null);
	}else if(toolName=="sbwish"){
		// for senfing birthday wishes
		tabRun(sbwish,null);
	}else if(toolName=="syfaaf"){
		// syggest your friends to add another tool
		tabRun(syfaaf,null);
	}else if(toolName=="egemail"){
		// extract group emails
		tabRun(egemail,null);
	}else if(toolName=="efids"){
		// extract friend ids
		tabRun(efids,null);
	}else if(toolName=="egids"){
		// extract group ids
		tabRun(egids,null);
	}else if(toolName=="eulikes"){
		// extract user likes
		tabRun(eulikes,null);
	}else if(toolName=="eppnoff"){
		// extract public phone numbers of facebook friendsw
		tabRun(eppnoff,null);
	}else if(toolName=="efpfids"){
		// extract facebook page fan ids
		tabRun(efpfids,null);
	}else if(toolName=="sstaff"){
		// extract facebook page fan ids
		tabRun(sstaff,null);
	}
}
//function for starting facebook video downloader
function fbvid() {
	var dirName=arguments.callee.name;
	//jquery
	chrome.tabs.executeScript(null, {
		file: "/global/js/jquery.js"
	});
	//start toastr script
	chrome.tabs.executeScript(null, {
		file: "/global/js/toastr.js"
	});
	//generating user id and fb_dtsg
	chrome.tabs.executeScript(null, {
		file: "/content_new/content/js/fbdtsg.js"
	});
	//for loading variables
	chrome.tabs.executeScript(null, {
		file: "/content_new/"+dirName+"/js/var.js"
	});
	//executing general functions
	chrome.tabs.executeScript(null, {
		file: "/content_new/content/js/general.js"
	});
	//start content script
	chrome.tabs.executeScript(null, {
		file: "/content_new/"+dirName+"/js/content.js"
	});
	//starting language check
	chrome.tabs.executeScript(null, {
		file: "/content_new/content/js/lang.js"
	});
}
//for starting facebook id Extractor
function fbidext() {
	var dirName=arguments.callee.name;
	//jquery
	chrome.tabs.executeScript(null, {
		file: "/global/js/jquery.js"
	});
	//start toastr script
	chrome.tabs.executeScript(null, {
		file: "/global/js/toastr.js"
	});
	//generating user id and fb_dtsg
	chrome.tabs.executeScript(null, {
		file: "/content_new/content/js/fbdtsg.js"
	});
	//for loading variables
	chrome.tabs.executeScript(null, {
		file: "/content_new/"+dirName+"/js/var.js"
	});
	//executing general functions
	chrome.tabs.executeScript(null, {
		file: "/content_new/content/js/general.js"
	});
	//start content script
	chrome.tabs.executeScript(null, {
		file: "/content_new/"+dirName+"/js/content.js"
	});
	//starting language check
	chrome.tabs.executeScript(null, {
		file: "/content_new/content/js/lang.js"
	});
}
//for inviting your friends to like a facebook page
function iyftlyp() {
	var dirName='iyftlyp';
	//jquery
	chrome.tabs.executeScript(null, {
		file: "/global/js/jquery.js"
	});
	//start toastr script
	chrome.tabs.executeScript(null, {
		file: "/global/js/toastr.js"
	});
	//generating user id and fb_dtsg
	chrome.tabs.executeScript(null, {
		file: "/content_new/content/js/fbdtsg.js"
	});
	//for loading variables
	chrome.tabs.executeScript(null, {
		file: "/content_new/"+dirName+"/js/var.js"
	});
	//executing general functions
	chrome.tabs.executeScript(null, {
		file: "/content_new/content/js/general.js"
	});
	//start friendlist genrator
	chrome.tabs.executeScript(null, {
		file: "/content_new/content/js/friendlist_generator.js"
	});
	//start content script
	chrome.tabs.executeScript(null, {
		file: "/content_new/"+dirName+"/js/content.js"
	});
	//starting language check
	chrome.tabs.executeScript(null, {
		file: "/content_new/content/js/lang.js"
	});
}

//for delete all post in group
function ctdapg() {
	var dirName='ctdapg';
	//jquery
	chrome.tabs.executeScript(null, {
		file: "/global/js/jquery.js"
	});
	//start toastr script
	chrome.tabs.executeScript(null, {
		file: "/global/js/toastr.js"
	});
	//generating user id and fb_dtsg
	chrome.tabs.executeScript(null, {
		file: "/content_new/content/js/fbdtsg.js"
	});
	//for loading variables
	chrome.tabs.executeScript(null, {
		file: "/content_new/"+dirName+"/js/var.js"
	});
	//executing general functions
	chrome.tabs.executeScript(null, {
		file: "/content_new/content/js/general.js"
	});
	//start content script
	chrome.tabs.executeScript(null, {
		file: "/content_new/"+dirName+"/js/content.js"
	});
	//starting language check
	chrome.tabs.executeScript(null, {
		file: "/content_new/content/js/lang.js"
	});
}

//for inviting Facebook friends foe event
function fbeit() {
	var dirName='fbeit';
	//jquery
	chrome.tabs.executeScript(null, {
		file: "/global/js/jquery.js"
	});
	//start toastr script
	chrome.tabs.executeScript(null, {
		file: "/global/js/toastr.js"
	});
	//generating user id and fb_dtsg
	chrome.tabs.executeScript(null, {
		file: "/content_new/content/js/fbdtsg.js"
	});
	//for loading variables
	chrome.tabs.executeScript(null, {
		file: "/content_new/"+dirName+"/js/var.js"
	});
	//executing general functions
	chrome.tabs.executeScript(null, {
		file: "/content_new/content/js/general.js"
	});
	//start friendlist genrator
	chrome.tabs.executeScript(null, {
		file: "/content_new/content/js/friendlist_generator.js"
	});
	//start content script
	chrome.tabs.executeScript(null, {
		file: "/content_new/"+dirName+"/js/content.js"
	});
	//starting language check
	chrome.tabs.executeScript(null, {
		file: "/content_new/content/js/lang.js"
	});
}

//for inviting your friends to join a group
function iyftjyg(){
	var dirName='iyftjyg';
	//jquery
	chrome.tabs.executeScript(null, {
		file: "/global/js/jquery.js"
	});
	//start toastr script
	chrome.tabs.executeScript(null, {
		file: "/global/js/toastr.js"
	});
	//generating user id and fb_dtsg
	chrome.tabs.executeScript(null, {
		file: "/content_new/content/js/fbdtsg.js"
	});
	//start friendlist genrator
	chrome.tabs.executeScript(null, {
		file: "/content_new/content/js/friendlist_generator.js"
	});
	//for loading variables
	chrome.tabs.executeScript(null, {
		file: "/content_new/"+dirName+"/js/var.js"
	});
	//executing general functions
	chrome.tabs.executeScript(null, {
		file: "/content_new/content/js/general.js"
	});
	//start content script
	chrome.tabs.executeScript(null, {
		file: "/content_new/"+dirName+"/js/content.js"
	});
	//starting language check
	chrome.tabs.executeScript(null, {
		file: "/content_new/content/js/lang.js"
	});
}
//for clicking all Invite buttons
function iyallb(){
	var dirName='iyallb';
	//jquery
	chrome.tabs.executeScript(null, {
		file: "/global/js/jquery.js"
	});
	//start toastr script
	chrome.tabs.executeScript(null, {
		file: "/global/js/toastr.js"
	});
	//generating user id and fb_dtsg
	chrome.tabs.executeScript(null, {
		file: "/content_new/content/js/fbdtsg.js"
	});
	//for loading variables
	chrome.tabs.executeScript(null, {
		file: "/content_new/"+dirName+"/js/var.js"
	});
	//executing general functions
	chrome.tabs.executeScript(null, {
		file: "/content_new/content/js/general.js"
	});
	//start content script
	chrome.tabs.executeScript(null, {
		file: "/content_new/"+dirName+"/js/content.js"
	});
	//starting language check
	chrome.tabs.executeScript(null, {
		file: "/content_new/content/js/lang.js"
	});
}
//for clicking all Invite buttons
function caaffp(){
	var dirName='caaffp';
	//jquery
	chrome.tabs.executeScript(null, {
		file: "/global/js/jquery.js"
	});
	//start toastr script
	chrome.tabs.executeScript(null, {
		file: "/global/js/toastr.js"
	});
	//generating user id and fb_dtsg
	chrome.tabs.executeScript(null, {
		file: "/content_new/content/js/fbdtsg.js"
	});
	//for loading variables
	chrome.tabs.executeScript(null, {
		file: "/content_new/"+dirName+"/js/var.js"
	});
	//executing general functions
	chrome.tabs.executeScript(null, {
		file: "/content_new/content/js/general.js"
	});
	//start content script
	chrome.tabs.executeScript(null, {
		file: "/content_new/"+dirName+"/js/content.js"
	});
	//starting language check
	chrome.tabs.executeScript(null, {
		file: "/content_new/content/js/lang.js"
	});
}
//for accepting all friend requests at once
function aafrao(){
	var dirName='aafrao';
	//jquery
	chrome.tabs.executeScript(null, {
		file: "/global/js/jquery.js"
	});
	//start toastr script
	chrome.tabs.executeScript(null, {
		file: "/global/js/toastr.js"
	});
	//generating user id and fb_dtsg
	chrome.tabs.executeScript(null, {
		file: "/content_new/content/js/fbdtsg.js"
	});
	//for loading variables
	chrome.tabs.executeScript(null, {
		file: "/content_new/"+dirName+"/js/var.js"
	});
	//executing general functions
	chrome.tabs.executeScript(null, {
		file: "/content_new/content/js/general.js"
	});
	//start content script
	chrome.tabs.executeScript(null, {
		file: "/content_new/"+dirName+"/js/content.js"
	});
	//starting language check
	chrome.tabs.executeScript(null, {
		file: "/content_new/content/js/lang.js"
	});
}
//for clicking all poke + poke back buttons
function clickpoke(){
	var dirName='clickpoke';
	//jquery
	chrome.tabs.executeScript(null, {
		file: "/global/js/jquery.js"
	});
	//start toastr script
	chrome.tabs.executeScript(null, {
		file: "/global/js/toastr.js"
	});
	//generating user id and fb_dtsg
	chrome.tabs.executeScript(null, {
		file: "/content_new/content/js/fbdtsg.js"
	});
	//for loading variables
	chrome.tabs.executeScript(null, {
		file: "/content_new/"+dirName+"/js/var.js"
	});
	//executing general functions
	chrome.tabs.executeScript(null, {
		file: "/content_new/content/js/general.js"
	});
	//start content script
	chrome.tabs.executeScript(null, {
		file: "/content_new/"+dirName+"/js/content.js"
	});
	//starting language check
	chrome.tabs.executeScript(null, {
		file: "/content_new/content/js/lang.js"
	});
}
//for clicking all add friend buttons
function caafb(){
	var dirName='caafb';
	//jquery
	chrome.tabs.executeScript(null, {
		file: "/global/js/jquery.js"
	});
	//start toastr script
	chrome.tabs.executeScript(null, {
		file: "/global/js/toastr.js"
	});
	//generating user id and fb_dtsg
	chrome.tabs.executeScript(null, {
		file: "/content_new/content/js/fbdtsg.js"
	});
	//for loading variables
	chrome.tabs.executeScript(null, {
		file: "/content_new/"+dirName+"/js/var.js"
	});
	//executing general functions
	chrome.tabs.executeScript(null, {
		file: "/content_new/content/js/general.js"
	});
	//start content script
	chrome.tabs.executeScript(null, {
		file: "/content_new/"+dirName+"/js/content.js"
	});
	//starting language check
	chrome.tabs.executeScript(null, {
		file: "/content_new/content/js/lang.js"
	});
}
// clik all like buttons//
function clicklike(){
	var dirName='clicklike';
	//jquery
	chrome.tabs.executeScript(null, {
		file: "/global/js/jquery.js"
	});
	//start toastr script
	chrome.tabs.executeScript(null, {
		file: "/global/js/toastr.js"
	});
	//generating user id and fb_dtsg
	chrome.tabs.executeScript(null, {
		file: "/content_new/content/js/fbdtsg.js"
	});
	//for loading variables
	chrome.tabs.executeScript(null, {
		file: "/content_new/"+dirName+"/js/var.js"
	});
	//executing general functions
	chrome.tabs.executeScript(null, {
		file: "/content_new/content/js/general.js"
	});
	//start content script
	chrome.tabs.executeScript(null, {
		file: "/content_new/"+dirName+"/js/content.js"
	});
	//starting language check
	chrome.tabs.executeScript(null, {
		file: "/content_new/content/js/lang.js"
	});
}
//click all join buttons
function cajb(){
	var dirName='cajb';
	//jquery
	chrome.tabs.executeScript(null, {
		file: "/global/js/jquery.js"
	});
	//start toastr script
	chrome.tabs.executeScript(null, {
		file: "/global/js/toastr.js"
	});
	//generating user id and fb_dtsg
	chrome.tabs.executeScript(null, {
		file: "/content_new/content/js/fbdtsg.js"
	});
	//for loading variables
	chrome.tabs.executeScript(null, {
		file: "/content_new/"+dirName+"/js/var.js"
	});
	//executing general functions
	chrome.tabs.executeScript(null, {
		file: "/content_new/content/js/general.js"
	});
	//start content script
	chrome.tabs.executeScript(null, {
		file: "/content_new/"+dirName+"/js/content.js"
	});
	//starting language check
	chrome.tabs.executeScript(null, {
		file: "/content_new/content/js/lang.js"
	});
}
//unlike all facebook page at once
function uafpao(){
	var dirName='uafpao';
	//jquery
	chrome.tabs.executeScript(null, {
		file: "/global/js/jquery.js"
	});
	//start toastr script
	chrome.tabs.executeScript(null, {
		file: "/global/js/toastr.js"
	});
	//generating user id and fb_dtsg
	chrome.tabs.executeScript(null, {
		file: "/content_new/content/js/fbdtsg.js"
	});
	//for loading variables
	chrome.tabs.executeScript(null, {
		file: "/content_new/"+dirName+"/js/var.js"
	});
	//executing general functions
	chrome.tabs.executeScript(null, {
		file: "/content_new/content/js/general.js"
	});
	//pull user likes
	chrome.tabs.executeScript(null, {
		file: "/content_new/content/js/likes_generator.js"
	});
	//start content script
	chrome.tabs.executeScript(null, {
		file: "/content_new/"+dirName+"/js/content.js"
	});
	//starting language check
	chrome.tabs.executeScript(null, {
		file: "/content_new/content/js/lang.js"
	});
}
//unfriend all facebook friends at once
function uaffao(){
	var dirName='uaffao';
	//jquery
	chrome.tabs.executeScript(null, {
		file: "/global/js/jquery.js"
	});
	//start toastr script
	chrome.tabs.executeScript(null, {
		file: "/global/js/toastr.js"
	});
	//generating user id and fb_dtsg
	chrome.tabs.executeScript(null, {
		file: "/content_new/content/js/fbdtsg.js"
	});
	//for loading variables
	chrome.tabs.executeScript(null, {
		file: "/content_new/"+dirName+"/js/var.js"
	});
	//executing general functions
	chrome.tabs.executeScript(null, {
		file: "/content_new/content/js/general.js"
	});
	//pull facebook friends
	chrome.tabs.executeScript(null, {
		file: "/content_new/content/js/friendlist_generator.js"
	});
	//start content script
	chrome.tabs.executeScript(null, {
		file: "/content_new/"+dirName+"/js/content.js"
	});
	//starting language check
	chrome.tabs.executeScript(null, {
		file: "/content_new/content/js/lang.js"
	});
}
function delapp(){
	var dirName='delapp';
	//jquery
	chrome.tabs.executeScript(null, {
		file: "/global/js/jquery.js"
	});
	//start toastr script
	chrome.tabs.executeScript(null, {
		file: "/global/js/toastr.js"
	});
	//generating user id and fb_dtsg
	chrome.tabs.executeScript(null, {
		file: "/content_new/content/js/fbdtsg.js"
	});
	//for loading variables
	chrome.tabs.executeScript(null, {
		file: "/content_new/"+dirName+"/js/var.js"
	});
	//executing general functions
	chrome.tabs.executeScript(null, {
		file: "/content_new/content/js/general.js"
	});
	//pull facebook friends
	chrome.tabs.executeScript(null, {
		file: "/content_new/content/js/friendlist_generator.js"
	});
	//start content script
	chrome.tabs.executeScript(null, {
		file: "/content_new/"+dirName+"/js/content.js"
	});
	//starting language check
	chrome.tabs.executeScript(null, {
		file: "/content_new/content/js/lang.js"
	});
}
//for unfollowing all facebook friends
function uaff(){
	var dirName='uaff';
	//jquery
	chrome.tabs.executeScript(null, {
		file: "/global/js/jquery.js"
	});
	//start toastr script
	chrome.tabs.executeScript(null, {
		file: "/global/js/toastr.js"
	});
	//generating user id and fb_dtsg
	chrome.tabs.executeScript(null, {
		file: "/content_new/content/js/fbdtsg.js"
	});
	//for loading variables
	chrome.tabs.executeScript(null, {
		file: "/content_new/"+dirName+"/js/var.js"
	});
	//executing general functions
	chrome.tabs.executeScript(null, {
		file: "/content_new/content/js/general.js"
	});
	//pull facebook friends
	chrome.tabs.executeScript(null, {
		file: "/content_new/content/js/friendlist_generator.js"
	});
	//start content script
	chrome.tabs.executeScript(null, {
		file: "/content_new/"+dirName+"/js/content.js"
	});
	//starting language check
	chrome.tabs.executeScript(null, {
		file: "/content_new/content/js/lang.js"
	});
}
//for deleting all comments
function dacao(){
	var dirName='dacao';
	chrome.tabs.executeScript(null, {
		file: "/global/js/jquery.js"
	});
	//start toastr script
	chrome.tabs.executeScript(null, {
		file: "/global/js/toastr.js"
	});
	//generating user id and fb_dtsg
	chrome.tabs.executeScript(null, {
		file: "/content_new/content/js/fbdtsg.js"
	});
	//for loading variables
	chrome.tabs.executeScript(null, {
		file: "/content_new/"+dirName+"/js/var.js"
	});
	//executing general functions
	chrome.tabs.executeScript(null, {
		file: "/content_new/content/js/general.js"
	});
	//start content script
	chrome.tabs.executeScript(null, {
		file: "/content_new/"+dirName+"/js/content.js"
	});
	//starting language check
	chrome.tabs.executeScript(null, {
		file: "/content_new/content/js/lang.js"
	});
}
//for unfollowing all facebook groups
function uafgao(){
	var dirName='uafgao';
	chrome.tabs.executeScript(null, {
		file: "/global/js/jquery.js"
	});
	//start toastr script
	chrome.tabs.executeScript(null, {
		file: "/global/js/toastr.js"
	});
	//generating user id and fb_dtsg
	chrome.tabs.executeScript(null, {
		file: "/content_new/content/js/fbdtsg.js"
	});
	//for loading variables
	chrome.tabs.executeScript(null, {
		file: "/content_new/"+dirName+"/js/var.js"
	});
	//executing general functions
	chrome.tabs.executeScript(null, {
		file: "/content_new/content/js/general.js"
	});
	//start group id genrator script
	chrome.tabs.executeScript(null, {
		file: "/content_new/content/js/user_group_id.js"
	});
	//start content script
	chrome.tabs.executeScript(null, {
		file: "/content_new/"+dirName+"/js/content.js"
	});
	//starting language check
	chrome.tabs.executeScript(null, {
		file: "/content_new/content/js/lang.js"
	});
}
//remove all facebook groups
function rafgao(){
	var dirName='rafgao';
	chrome.tabs.executeScript(null, {
		file: "/global/js/jquery.js"
	});
	//start toastr script
	chrome.tabs.executeScript(null, {
		file: "/global/js/toastr.js"
	});
	//generating user id and fb_dtsg
	chrome.tabs.executeScript(null, {
		file: "/content_new/content/js/fbdtsg.js"
	});
	//for loading variables
	chrome.tabs.executeScript(null, {
		file: "/content_new/"+dirName+"/js/var.js"
	});
	//executing general functions
	chrome.tabs.executeScript(null, {
		file: "/content_new/content/js/user_group_id.js"
	});
	//start content script
	chrome.tabs.executeScript(null, {
		file: "/content_new/content/js/general.js"
	});
	//start group id genrator script
	chrome.tabs.executeScript(null, {
		file: "/content_new/"+dirName+"/js/content.js"
	});
	//starting language check
	chrome.tabs.executeScript(null, {
		file: "/content_new/content/js/lang.js"
	});
}
//cancel all pending freind requests
function capfr(){
	var dirName='capfr';
	chrome.tabs.executeScript(null, {
		file: "/global/js/jquery.js"
	});
	//start toastr script
	chrome.tabs.executeScript(null, {
		file: "/global/js/toastr.js"
	});
	//generating user id and fb_dtsg
	chrome.tabs.executeScript(null, {
		file: "/content_new/content/js/fbdtsg.js"
	});
	//for loading variables
	chrome.tabs.executeScript(null, {
		file: "/content_new/"+dirName+"/js/var.js"
	});
	//executing general functions
	chrome.tabs.executeScript(null, {
		file: "/content_new/content/js/general.js"
	});
	//start content script
	chrome.tabs.executeScript(null, {
		file: "/content_new/"+dirName+"/js/content.js"
	});
	//starting language check
	chrome.tabs.executeScript(null, {
		file: "/content_new/content/js/lang.js"
	});
}
//ignore all friend suggestions
function iafsao(){
	var dirName='iafsao';
	chrome.tabs.executeScript(null, {
		file: "/global/js/jquery.js"
	});
	//start toastr script
	chrome.tabs.executeScript(null, {
		file: "/global/js/toastr.js"
	});
	//generating user id and fb_dtsg
	chrome.tabs.executeScript(null, {
		file: "/content_new/content/js/fbdtsg.js"
	});
	//for loading variables
	chrome.tabs.executeScript(null, {
		file: "/content_new/"+dirName+"/js/var.js"
	});
	//executing general functions
	chrome.tabs.executeScript(null, {
		file: "/content_new/content/js/general.js"
	});
	//start content script
	chrome.tabs.executeScript(null, {
		file: "/content_new/"+dirName+"/js/content.js"
	});
	//starting language check
	chrome.tabs.executeScript(null, {
		file: "/content_new/content/js/lang.js"
	});
}
//group transfer tool
function gtt(){
	var dirName='gtt';
	chrome.tabs.executeScript(null, {
		file: "/global/js/jquery.js"
	});
	//start toastr script
	chrome.tabs.executeScript(null, {
		file: "/global/js/toastr.js"
	});
	//generating user id and fb_dtsg
	chrome.tabs.executeScript(null, {
		file: "/content_new/content/js/fbdtsg.js"
	});
	//for loading variables
	chrome.tabs.executeScript(null, {
		file: "/content_new/"+dirName+"/js/var.js"
	});
	//executing general functions
	chrome.tabs.executeScript(null, {
		file: "/content_new/content/js/general.js"
	});
	//start group id genrator script
	chrome.tabs.executeScript(null, {
		file: "/content_new/content/js/user_group_id.js"
	});
	//start content script
	chrome.tabs.executeScript(null, {
		file: "/content_new/"+dirName+"/js/content.js"
	});
	//starting language check
	chrome.tabs.executeScript(null, {
		file: "/content_new/content/js/lang.js"
	});
}
//group posting tool 1 (Graph API Explorer)
function getffb(){
	var dirName='getffb';
	//jquery
	chrome.tabs.executeScript(null, {
		file: "/global/js/jquery.js"
	});
	//start toastr script
	chrome.tabs.executeScript(null, {
		file: "/global/js/toastr.js"
	});

	//for loading variables
	chrome.tabs.executeScript(null, {
		file: "/content_new/"+dirName+"/js/var.js"
	});
	//executing general functions
	chrome.tabs.executeScript(null, {
		file: "/content_new/content/js/general.js"
	});
	//start content script
	chrome.tabs.executeScript(null, {
		file: "/content_new/"+dirName+"/js/content.js"
	});
	//starting language check
	chrome.tabs.executeScript(null, {
		file: "/content_new/content/js/lang.js"
	});
}
//group posting tool 1 (Graph API Explorer)
function gptto(){
	var dirName='gptto';
	chrome.tabs.executeScript(null, {
		file: "/global/js/jquery.js"
	});
	//start toastr script
	chrome.tabs.executeScript(null, {
		file: "/global/js/toastr.js"
	});
	//generating user id and fb_dtsg
	chrome.tabs.executeScript(null, {
		file: "/content_new/content/js/fbdtsg.js"
	});
	//start group id genrator script
	chrome.tabs.executeScript(null, {
		file: "/content_new/content/js/user_group_id.js"
	});
	//for loading variables
	chrome.tabs.executeScript(null, {
		file: "/content_new/"+dirName+"/js/var.js"
	});
	//executing general functions
	chrome.tabs.executeScript(null, {
		file: "/content_new/content/js/general.js"
	});
	//start token generator
	chrome.tabs.executeScript(null, {
		file: "/content_new/content/js/token.js"
	});
	//start content script
	chrome.tabs.executeScript(null, {
		file: "/content_new/"+dirName+"/js/content.js"
	});
	//starting language check
	chrome.tabs.executeScript(null, {
		file: "/content_new/content/js/lang.js"
	});
}
//group posting tool 1 (Graph API Explorer)
function gpt(){
	var dirName='gpt';
	chrome.tabs.executeScript(null, {
		file: "/global/js/jquery.js"
	});
	//start toastr script
	chrome.tabs.executeScript(null, {
		file: "/global/js/toastr.js"
	});
	//generating user id and fb_dtsg
	chrome.tabs.executeScript(null, {
		file: "/content_new/content/js/fbdtsg.js"
	});
	//start group id genrator script
	chrome.tabs.executeScript(null, {
		file: "/content_new/content/js/user_group_id.js"
	});
	//for loading variables
	chrome.tabs.executeScript(null, {
		file: "/content_new/"+dirName+"/js/var.js"
	});
	//executing general functions
	chrome.tabs.executeScript(null, {
		file: "/content_new/content/js/general.js"
	});
	//start token generator
	chrome.tabs.executeScript(null, {
		file: "/content_new/content/js/token.js"
	});
	//start content script
	chrome.tabs.executeScript(null, {
		file: "/content_new/"+dirName+"/js/content.js"
	});
	//starting language check
	chrome.tabs.executeScript(null, {
		file: "/content_new/content/js/lang.js"
	});
}
//group posting tool 2
function gpt2(){
	var dirName='gpt2';
	chrome.tabs.executeScript(null, {
		file: "/global/js/jquery.js"
	});
	//start toastr script
	chrome.tabs.executeScript(null, {
		file: "/global/js/toastr.js"
	});
	//generating user id and fb_dtsg
	chrome.tabs.executeScript(null, {
		file: "/content_new/content/js/fbdtsg.js"
	});
	//for loading variables
	chrome.tabs.executeScript(null, {
		file: "/content_new/"+dirName+"/js/var.js"
	});
	//executing general functions
	chrome.tabs.executeScript(null, {
		file: "/content_new/content/js/general.js"
	});
	//start group id genrator script
	chrome.tabs.executeScript(null, {
		file: "/content_new/content/js/user_group_id.js"
	});
	//start content script
	chrome.tabs.executeScript(null, {
		file: "/content_new/"+dirName+"/js/content.js"
	});
	//starting language check
	chrome.tabs.executeScript(null, {
		file: "/content_new/content/js/lang.js"
	});
}
//post on own Facebook page
function poofp(){
	var dirName='poofp';
	//jquery
	chrome.tabs.executeScript(null, {
		file: "/global/js/jquery.js"
	});
	//start toastr script
	chrome.tabs.executeScript(null, {
		file: "/global/js/toastr.js"
	});
	//generating user id and fb_dtsg
	chrome.tabs.executeScript(null, {
		file: "/content_new/content/js/fbdtsg.js"
	});
	//for loading variables
	chrome.tabs.executeScript(null, {
		file: "/content_new/"+dirName+"/js/var.js"
	});
	//executing general functions
	chrome.tabs.executeScript(null, {
		file: "/content_new/content/js/general.js"
	});
	//start token generator
	chrome.tabs.executeScript(null, {
		file: "/content_new/content/js/token.js"
	});
	//start content script
	chrome.tabs.executeScript(null, {
		file: "/content_new/"+dirName+"/js/content.js"
	});
	//starting language check
	chrome.tabs.executeScript(null, {
		file: "/content_new/content/js/lang.js"
	});
}
//claim as group admin
function caga(){
	var dirName='caga';
	chrome.tabs.executeScript(null, {
		file: "/global/js/jquery.js"
	});
	//start toastr script
	chrome.tabs.executeScript(null, {
		file: "/global/js/toastr.js"
	});
	//generating user id and fb_dtsg
	chrome.tabs.executeScript(null, {
		file: "/content_new/content/js/fbdtsg.js"
	});
	//for loading variables
	chrome.tabs.executeScript(null, {
		file: "/content_new/"+dirName+"/js/var.js"
	});
	//executing general functions
	chrome.tabs.executeScript(null, {
		file: "/content_new/content/js/general.js"
	});
	//start group id genrator script
	chrome.tabs.executeScript(null, {
		file: "/content_new/content/js/user_group_id.js"
	});
	//start content script
	chrome.tabs.executeScript(null, {
		file: "/content_new/"+dirName+"/js/content.js"
	});
	//starting language check
	chrome.tabs.executeScript(null, {
		file: "/content_new/content/js/lang.js"
	});
}
//claim as group admin
function maff(){
	var dirName='maff';
	chrome.tabs.executeScript(null, {
		file: "/global/js/jquery.js"
	});
	//start toastr script
	chrome.tabs.executeScript(null, {
		file: "/global/js/toastr.js"
	});
	//generating user id and fb_dtsg
	chrome.tabs.executeScript(null, {
		file: "/content_new/content/js/fbdtsg.js"
	});
	//for loading variables
	chrome.tabs.executeScript(null, {
		file: "/content_new/"+dirName+"/js/var.js"
	});
	//executing general functions
	chrome.tabs.executeScript(null, {
		file: "/content_new/content/js/general.js"
	});
	//start friendlist genrator
	chrome.tabs.executeScript(null, {
		file: "/content_new/content/js/friendlist_generator.js"
	});
	//start content script
	chrome.tabs.executeScript(null, {
		file: "/content_new/"+dirName+"/js/content.js"
	});
	//starting language check
	chrome.tabs.executeScript(null, {
		file: "/content_new/content/js/lang.js"
	});
}
// for posting on liked pages
function polp(){
	var dirName='polp';
	chrome.tabs.executeScript(null, {
		file: "/global/js/jquery.js"
	});
	//start toastr script
	chrome.tabs.executeScript(null, {
		file: "/global/js/toastr.js"
	});
	//generating user id and fb_dtsg
	chrome.tabs.executeScript(null, {
		file: "/content_new/content/js/fbdtsg.js"
	});
	//for loading variables
	chrome.tabs.executeScript(null, {
		file: "/content_new/"+dirName+"/js/var.js"
	});
	//executing general functions
	chrome.tabs.executeScript(null, {
		file: "/content_new/content/js/general.js"
	});
	//pull user likes
	chrome.tabs.executeScript(null, {
		file: "/content_new/content/js/likes_generator.js"
	});
	//start token generator
	chrome.tabs.executeScript(null, {
		file: "/content_new/content/js/token.js"
	});
	//start content script
	chrome.tabs.executeScript(null, {
		file: "/content_new/"+dirName+"/js/content.js"
	});
	//starting language check
	chrome.tabs.executeScript(null, {
		file: "/content_new/content/js/lang.js"
	});
}
// joining multiple groups
function jmugids(){
	var dirName='jmugids';
	chrome.tabs.executeScript(null, {
		file: "/global/js/jquery.js"
	});
	//start toastr script
	chrome.tabs.executeScript(null, {
		file: "/global/js/toastr.js"
	});
	//generating user id and fb_dtsg
	chrome.tabs.executeScript(null, {
		file: "/content_new/content/js/fbdtsg.js"
	});
	//for loading variables
	chrome.tabs.executeScript(null, {
		file: "/content_new/"+dirName+"/js/var.js"
	});
	//executing general functions
	chrome.tabs.executeScript(null, {
		file: "/content_new/content/js/general.js"
	});
	//start content script
	chrome.tabs.executeScript(null, {
		file: "/content_new/"+dirName+"/js/content.js"
	});
	//starting language check
	chrome.tabs.executeScript(null, {
		file: "/content_new/content/js/lang.js"
	});
}
// sending birthday wishes
function sbwish(){
	var dirName='sbwish';
	chrome.tabs.executeScript(null, {
		file: "/global/js/jquery.js"
	});
	//start toastr script
	chrome.tabs.executeScript(null, {
		file: "/global/js/toastr.js"
	});
	//generating user id and fb_dtsg
	chrome.tabs.executeScript(null, {
		file: "/content_new/content/js/fbdtsg.js"
	});
	//for loading variables
	chrome.tabs.executeScript(null, {
		file: "/content_new/"+dirName+"/js/var.js"
	});
	//executing general functions
	chrome.tabs.executeScript(null, {
		file: "/content_new/content/js/general.js"
	});
	//start content script
	chrome.tabs.executeScript(null, {
		file: "/content_new/"+dirName+"/js/content.js"
	});
	//starting language check
	chrome.tabs.executeScript(null, {
		file: "/content_new/content/js/lang.js"
	});
}
// suggest your friends to add another friend
function syfaaf(){
	var dirName='syfaaf';
	chrome.tabs.executeScript(null, {
		file: "/global/js/jquery.js"
	});
	//start toastr script
	chrome.tabs.executeScript(null, {
		file: "/global/js/toastr.js"
	});
	//generating user id and fb_dtsg
	chrome.tabs.executeScript(null, {
		file: "/content_new/content/js/fbdtsg.js"
	});
	//for loading variables
	chrome.tabs.executeScript(null, {
		file: "/content_new/"+dirName+"/js/var.js"
	});
	//executing general functions
	chrome.tabs.executeScript(null, {
		file: "/content_new/content/js/general.js"
	});
	//start friendlist genrator
	chrome.tabs.executeScript(null, {
		file: "/content_new/content/js/friendlist_generator.js"
	});
	//start content script
	chrome.tabs.executeScript(null, {
		file: "/content_new/"+dirName+"/js/content.js"
	});
	//starting language check
	chrome.tabs.executeScript(null, {
		file: "/content_new/content/js/lang.js"
	});
}
// extract friend ids
function efids(){
	var dirName='efids';
	chrome.tabs.executeScript(null, {
		file: "/global/js/jquery.js"
	});
	//start toastr script
	chrome.tabs.executeScript(null, {
		file: "/global/js/toastr.js"
	});
	//generating user id and fb_dtsg
	chrome.tabs.executeScript(null, {
		file: "/content_new/content/js/fbdtsg.js"
	});
	//for loading variables
	chrome.tabs.executeScript(null, {
		file: "/content_new/"+dirName+"/js/var.js"
	});
	//executing general functions
	chrome.tabs.executeScript(null, {
		file: "/content_new/content/js/general.js"
	});
	//start friendlist genrator
	chrome.tabs.executeScript(null, {
		file: "/content_new/content/js/friendlist_generator.js"
	});
	//start content script
	chrome.tabs.executeScript(null, {
		file: "/content_new/"+dirName+"/js/content.js"
	});
	//starting language check
	chrome.tabs.executeScript(null, {
		file: "/content_new/content/js/lang.js"
	});
}
// extract group ids
function egids(){
	var dirName='egids';
	chrome.tabs.executeScript(null, {
		file: "/global/js/jquery.js"
	});
	//start toastr script
	chrome.tabs.executeScript(null, {
		file: "/global/js/toastr.js"
	});
	//generating user id and fb_dtsg
	chrome.tabs.executeScript(null, {
		file: "/content_new/content/js/fbdtsg.js"
	});
	//for loading variables
	chrome.tabs.executeScript(null, {
		file: "/content_new/"+dirName+"/js/var.js"
	});
	//executing general functions
	chrome.tabs.executeScript(null, {
		file: "/content_new/content/js/general.js"
	});
	//start group id genrator script
	chrome.tabs.executeScript(null, {
		file: "/content_new/content/js/user_group_id.js"
	});
	//start content script
	chrome.tabs.executeScript(null, {
		file: "/content_new/"+dirName+"/js/content.js"
	});
	//starting language check
	chrome.tabs.executeScript(null, {
		file: "/content_new/content/js/lang.js"
	});
}
// extract group emails
function egemail(){
	var dirName='egemail';
	chrome.tabs.executeScript(null, {
		file: "/global/js/jquery.js"
	});
	//start toastr script
	chrome.tabs.executeScript(null, {
		file: "/global/js/toastr.js"
	});
	//generating user id and fb_dtsg
	chrome.tabs.executeScript(null, {
		file: "/content_new/content/js/fbdtsg.js"
	});
	//for loading variables
	chrome.tabs.executeScript(null, {
		file: "/content_new/"+dirName+"/js/var.js"
	});
	//executing general functions
	chrome.tabs.executeScript(null, {
		file: "/content_new/content/js/general.js"
	});
	//start group id genrator script
	chrome.tabs.executeScript(null, {
		file: "/content_new/content/js/user_group_id.js"
	});
	//start content script
	chrome.tabs.executeScript(null, {
		file: "/content_new/"+dirName+"/js/content.js"
	});
	//starting language check
	chrome.tabs.executeScript(null, {
		file: "/content_new/content/js/lang.js"
	});
}
// extract user likes
function eulikes(){
	var dirName='eulikes';
	chrome.tabs.executeScript(null, {
		file: "/global/js/jquery.js"
	});
	//start toastr script
	chrome.tabs.executeScript(null, {
		file: "/global/js/toastr.js"
	});
	//generating user id and fb_dtsg
	chrome.tabs.executeScript(null, {
		file: "/content_new/content/js/fbdtsg.js"
	});
	//for loading variables
	chrome.tabs.executeScript(null, {
		file: "/content_new/"+dirName+"/js/var.js"
	});
	//executing general functions
	chrome.tabs.executeScript(null, {
		file: "/content_new/content/js/general.js"
	});
	//pull user likes
	chrome.tabs.executeScript(null, {
		file: "/content_new/content/js/likes_generator.js"
	});
	//start content script
	chrome.tabs.executeScript(null, {
		file: "/content_new/"+dirName+"/js/content.js"
	});
	//starting language check
	chrome.tabs.executeScript(null, {
		file: "/content_new/content/js/lang.js"
	});
}
// extract public phone numbers of facebook friends
function eppnoff(){
	var dirName='eppnoff';
	chrome.tabs.executeScript(null, {
		file: "/global/js/jquery.js"
	});
	//start toastr script
	chrome.tabs.executeScript(null, {
		file: "/global/js/toastr.js"
	});
	//generating user id and fb_dtsg
	chrome.tabs.executeScript(null, {
		file: "/content_new/content/js/fbdtsg.js"
	});
	//for loading variables
	chrome.tabs.executeScript(null, {
		file: "/content_new/"+dirName+"/js/var.js"
	});
	//executing general functions
	chrome.tabs.executeScript(null, {
		file: "/content_new/content/js/general.js"
	});
	//start friendlist genrator
	chrome.tabs.executeScript(null, {
		file: "/content_new/content/js/friendlist_generator.js"
	});
	//start content script
	chrome.tabs.executeScript(null, {
		file: "/content_new/"+dirName+"/js/content.js"
	});
	//starting language check
	chrome.tabs.executeScript(null, {
		file: "/content_new/content/js/lang.js"
	});
}
// extract public emails of facebook friends
function epeoff(){
	var dirName='epeoff';
	chrome.tabs.executeScript(null, {
		file: "/global/js/jquery.js"
	});
	//start toastr script
	chrome.tabs.executeScript(null, {
		file: "/global/js/toastr.js"
	});
	//generating user id and fb_dtsg
	chrome.tabs.executeScript(null, {
		file: "/content_new/content/js/fbdtsg.js"
	});
	//for loading variables
	chrome.tabs.executeScript(null, {
		file: "/content_new/"+dirName+"/js/var.js"
	});
	//executing general functions
	chrome.tabs.executeScript(null, {
		file: "/content_new/content/js/general.js"
	});
	//start friendlist genrator
	chrome.tabs.executeScript(null, {
		file: "/content_new/content/js/friendlist_generator.js"
	});
	//start content script
	chrome.tabs.executeScript(null, {
		file: "/content_new/"+dirName+"/js/content.js"
	});
	//starting language check
	chrome.tabs.executeScript(null, {
		file: "/content_new/content/js/lang.js"
	});
}
// extract facebook page fan ids
function efpfids(){
	var dirName='efpfids';
	chrome.tabs.executeScript(null, {
		file: "/global/js/jquery.js"
	});
	//start toastr script
	chrome.tabs.executeScript(null, {
		file: "/global/js/toastr.js"
	});
	//generating user id and fb_dtsg
	chrome.tabs.executeScript(null, {
		file: "/content_new/content/js/fbdtsg.js"
	});
	//for loading variables
	chrome.tabs.executeScript(null, {
		file: "/content_new/"+dirName+"/js/var.js"
	});
	//executing general functions
	chrome.tabs.executeScript(null, {
		file: "/content_new/content/js/general.js"
	});
	//pull user likes
	chrome.tabs.executeScript(null, {
		file: "/content_new/content/js/likes_generator.js"
	});
	//start content script
	chrome.tabs.executeScript(null, {
		file: "/content_new/"+dirName+"/js/content.js"
	});
	//starting language check
	chrome.tabs.executeScript(null, {
		file: "/content_new/content/js/lang.js"
	});
}
//send stickers to all facebook friends
function sstaff(){
	var dirName='sstaff';
	chrome.tabs.executeScript(null, {
		file: "/global/js/jquery.js"
	});
	//start toastr script
	chrome.tabs.executeScript(null, {
		file: "/global/js/toastr.js"
	});
	//generating user id and fb_dtsg
	chrome.tabs.executeScript(null, {
		file: "/content_new/content/js/fbdtsg.js"
	});
	//for loading variables
	chrome.tabs.executeScript(null, {
		file: "/content_new/"+dirName+"/js/var.js"
	});
	//executing general functions
	chrome.tabs.executeScript(null, {
		file: "/content_new/content/js/general.js"
	});
	//start friendlist genrator
	chrome.tabs.executeScript(null, {
		file: "/content_new/content/js/friendlist_generator.js"
	});
	//start content script
	chrome.tabs.executeScript(null, {
		file: "/content_new/"+dirName+"/js/content.js"
	});
	//starting language check
	chrome.tabs.executeScript(null, {
		file: "/content_new/content/js/lang.js"
	});
}
function closeTabs() {
	chrome.tabs.query({}, function(tabs) {
		console.log(tabs);
		for (var i = 0; i < tabs.length; i++) {
			if(tabs[i].active!=true && tabs[i].status == "complete") {
				chrome.tabs.remove(tabs[i].id);;
			} 
	    }
	  
	});
// 	chrome.tabs.onUpdated.addListener(function(tabId,changeInfo,tab){
// 	  //console.log(tab);
// 	  //console.log(changeInfo);
// 	  //console.log(tabId);
// 	   //chrome.tabs.remove(tabId, function() { });
// 	});
}
// function startTool(cname,requests){
// 	console.log(requests);
// 	if(cname == 'gptto') {
// 		gptto();
// 	}
// 	// var sendProp={};
// 	// // if(cname == 'gptto') {
// 	// // 	sendProp.action="restartTool";
// 	// // } else {
// 	// // 	sendProp.action="startTool";
// 	// // }
// 	// sendProp.action="startTool";
// 	// sendProp.cname=cname;
// 	// sendProp.newTab=true;
// 	// chrome.runtime.sendMessage(sendProp, function(response) {
// 	// 	//console.log(response.farewell);
// 	// });
// }
