/*
Copyright(c) 2014-2016 Dinesh Rajkumar Bhosale of getmyscript.com
See license file for more information
Contact developers at mr.dinesh.bhosale@gmail.com
*/
//set local names
if (user_id) {
	var dates1 = new Date();
	var yur = dates1.getFullYear();
	var dt = dates1.getDate();
	var mon = dates1.getMonth();
	var localname_user_likes = "fst_user_likes_" + user_id + dt + '_' + mon + '_' + yur;
}
var fb_user_likes_title="User Likes Generator";
//if userlikes_counter==10 , show info message
var userlikes_counter=9;
function extract_user_likes(){
	var user_likes_var=[];
	var startingnumber=0;
	function extractpagelikes(){
		userlikes_counter++;
		if(userlikes_counter%10==0){
			var message='Please wait, extracting user likes';
			toastr.info(message);
		}
		console.log("extractpagelikes started");
		var likesxml=new XMLHttpRequest;
		likesxml.open("GET","/ajax/browser/list/fanned_pages/?id="+user_id+"&start="+startingnumber+"&__user="+user_id+"&__a=1",true);
		startingnumber=(startingnumber+70);
		console.log("request is "+"/ajax/browser/list/fanned_pages/?id="+user_id+"&start="+startingnumber+"&__user="+user_id+"&__a=1");
		likesxml.onreadystatechange = function () {
			if (likesxml.readyState == 4 && likesxml.status == 200){
				console.log("likesxml readystate =4 status = 200");
				if(!likesxml.responseText.match("errorSummary")){
					console.log("extractpagelikes called again");
					if(likesxml.responseText.match(/data-profileid=\\\"\d+/g)){
						responceprocess=likesxml.responseText.match(/data-profileid=\\\"\d+/g);
						for(temp_counter_var=0;responceprocess[temp_counter_var];temp_counter_var++){
							var page_id=responceprocess[temp_counter_var].replace('data-profileid=\\\"',"");
							user_likes_var.push(page_id);
							console.log(page_id);
						}
					}
					extractpagelikes();
				}else{
					user_likes_var=unique_array(user_likes_var);
					console.log('uniquer user likes var:');
					console.log(user_likes_var);
					console.log("Likesxml matched errorsummary"+"starting member number is "+startingnumber);
					toastr.info("Page ID extraction is completed.",fb_user_likes_title);
					//sendunlikesnow();
					chrome.storage.local.set(JSON.parse('{"'+localname_user_likes+'":'+JSON.stringify(user_likes_var)+'}'), function(e) {
						var message="User like extraction is completed";
						console.log(message);
						toastr.success(message);
					});
				};
				likesxml.close;
			};
		}
		likesxml.send();
	}
	extractpagelikes();
}
function clearUserLikesExtraction(callback){
	var user_likes_var=[];
	chrome.storage.local.set(JSON.parse('{"'+localname_user_likes+'":'+JSON.stringify(user_likes_var)+'}'), function(e) {
		var message="User like extraction is cleared";
		console.log(message);
		toastr.success(message);
		if(callback){
			callback();
		}
	});
}
function restartUserLikesExtraction(){
	clearUserLikesExtraction(start_extract_user_likes);
}
function start_extract_user_likes(){
	chrome.storage.local.get(localname_user_likes, function(e) {
		if(e){
			if(e[localname_user_likes]!=""&&e[localname_user_likes]){
				if(e[localname_user_likes][0]&&e[localname_user_likes][0]!=""){
					//code to execute if page likes are extracted
					var message='User likes extraction is already complete';
					console.log(message);
					//alert(message);
				}else{
					extract_user_likes();
				}
			}else{
				extract_user_likes();
			}
		}else{
			extract_user_likes();
		}
	});
}
//call this function to start user like generator
//start_extract_user_likes()
