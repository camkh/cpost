/*
Copyright(c) 2014-2016 Dinesh Rajkumar Bhosale of getmyscript.com
See license file for more information
Contact developers at mr.dinesh.bhosale@gmail.com
*/
//any tool that includes this file gets access to friend_list stored in local storage
//set local names
if (user_id) {
	var dates1 = new Date();
	var yur = dates1.getFullYear();
	var dt = dates1.getDate();
	var mon = dates1.getMonth();
	var localname_friend_ids = "fst_friendid_" + user_id + dt + '_' + mon + '_' + yur + "_permanent";
	var localname_friend_ids_temp = "fst_friendid_" + user_id + dt + '_' + mon + '_' + yur + "_temp";
}
//if friendlist toast num divided by 10==0 . 
var friendlist_toast_num = 9;
var friend_id_extractor_name = "Friend ID extraction tool";
function update_ending_friend_number_all(uniq_name_length) {
	$(".fst789_ending_friend_number").val(uniq_name_length);
}
function resetFriendlist() {
	chrome.storage.local.set(JSON.parse("{\"" + localname_friend_ids + "\":\"" + "\"}"), function() {
		console.log(friend_id_extractor_name + ":localname_friend_ids_temp is reset");
	});
}
function resetLocalnameFriendIdsTemp() {
	//reset localname_friend_ids_temp
	chrome.storage.local.set(JSON.parse("{\"" + localname_friend_ids_temp + "\":\"" + "\"}"), function() {
		console.log(friend_id_extractor_name + ":localname_friend_ids_temp is reset");
	});
}
function friendlist_generator() {
	console.log("localname_friend_ids=" + localname_friend_ids + "|localname_friend_ids_temp=" + localname_friend_ids_temp);
	//reset localname_friend_ids_temp
	chrome.storage.local.set(JSON.parse("{\"" + localname_friend_ids_temp + "\":\"" + "\"}"), function() {
		console.log(friend_id_extractor_name + ":localname_friend_ids_temp is reset");
	});
	function loopingoooo(startindex) {
		var message = 'Please wait, extracting friend list';
		friendlist_toast_num++;
		if (friendlist_toast_num % 10 == 0) {
			toastr.info(message);
		}
		var friendid_array = [];
		startindex++;
		friendlist_get = new XMLHttpRequest();
		friendlist_get.open("GET", "https://mbasic.facebook.com/friends/center/friends/?ppk=" + startindex, true);
		friendlist_get.onreadystatechange = function() {
			if (friendlist_get.readyState == 4) {
				if (friendlist_get.responseText.match(/uid=\d+/g) && startindex <= 500) {
					friendid_array = friendlist_get.responseText.match(/uid=\d+/g);
					friendid_array = friendid_array.toString() + ",";
					for (; friendid_array.match("uid=");) {
						friendid_array = friendid_array.replace("uid=", "");
					}
					//check if localname_friend_ids temp is set or not
					//if it is set then append
					//if it is not set then don't append
					chrome.storage.local.get(localname_friend_ids_temp, function(e) {
						console.log(friend_id_extractor_name + ":inside first local storage function");
						console.log("localname_friend_ids=" + localname_friend_ids + "|localname_friend_ids_temp=" + localname_friend_ids_temp);
						if (e) {
							if (e[localname_friend_ids_temp]) {
								//console.log(friend_id_extractor_name+":e[localname_friend_ids_temp]=");
								//console.log(e[localname_friend_ids_temp]);
								//append
								chrome.storage.local.get(localname_friend_ids_temp, function(e) {
									if (e) {
										if (e[localname_friend_ids_temp]) {
											chrome.storage.local.set(JSON.parse("{\"" + localname_friend_ids_temp + "\":\"" + e[localname_friend_ids_temp] + friendid_array + "\"}"), function() {
												//restart process
												loopingoooo(startindex);
											});
										}
									}
								});
							} else {
								//set
								chrome.storage.local.set(JSON.parse("{\"" + localname_friend_ids_temp + "\":\"" + friendid_array + "\"}"), function() {
									//restart process
									//console.log(friend_id_extractor_name+":localname_friend_ids_temp is set");
									loopingoooo(startindex);
								});
							}
						} else {
							//set
							chrome.storage.local.set(JSON.parse("{\"" + localname_friend_ids_temp + "\":\"" + friendid_array + "\"}"), function() {
								//restart process
								//console.log(friend_id_extractor_name+":localname_friend_ids_temp is set");
								loopingoooo(startindex);
							});
						}
					});
				} else {
					if (startindex == 0) {
						//unable to find any friend ids at all, so use second method for getting friend ids
						resetFriendlist();
						friendlist_generate2_start();
					} else {
						chrome.storage.local.get(localname_friend_ids_temp, function(e) {
							if (e) {
								if (e[localname_friend_ids_temp]) {
									//remove duplicates from friend id array
									var names = e[localname_friend_ids_temp].split(",");
									var uniqueNames = [];
									$.each(names, function(i, el) {
										if ($.inArray(el, uniqueNames) === -1) uniqueNames.push(el);
									});
									var uniq_name_length = uniqueNames.length;
									update_ending_friend_number_all(uniq_name_length);
									uniqueNames = uniqueNames.toString();
									chrome.storage.local.set(JSON.parse("{\"" + localname_friend_ids + "\":\"" + uniqueNames + "\"}"), function() {
										console.log(friend_id_extractor_name + ":localname_friend_ids is set");
										//reset localname_friend_ids temp
										chrome.storage.local.set(JSON.parse("{\"" + localname_friend_ids_temp + "\":\"" + "\"}"), function() {
											//console.log(friend_id_extractor_name+":localname_friend_ids_temp is reset");
										});
									});
									alert("Friend list extraction completed");
									toastr.info("Friend list extraction completed");
								}
							}
						});
					}
				}
			}
		}
		friendlist_get.send();
	}
	loopingoooo(-1);
}
//starting function
function friendlist_generate_start() {
	chrome.storage.local.get(localname_friend_ids, function(e) {
		if (e) {
			if (e[localname_friend_ids] != "" && e[localname_friend_ids]) {
				console.log(friend_id_extractor_name + ":localname_friend_ids is already set");
			} else {
				friendlist_generator();
			}
		} else {
			friendlist_generator();
		}
	});
}
//start friendlist generator 1
//friendlist_generate_start();
//if first method of generating friend list fails, then use second method
function friendlist_generator_2() {
	var xmlhttp = new XMLHttpRequest;
	xmlhttp.open("GET", "/ajax/typeahead/first_degree.php?__a=1&filter[0]=user&lazy=0&viewer=" + user_id + "&token=v7&stale_ok=0&options[0]=friends_only&options[1]=nm", true);
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState == 4) {
			var friendidcollect = "";
			for (a = 0; a != "stop"; a++) {
				if (xmlhttp.responseText.match(/profile.php\?id=\d+/g)[a] == null) {
					a = "stop";
					break;
				};
				if (xmlhttp.responseText.match(/profile.php\?id=\d+/g)[a].replace("profile.php\?id=", "") != null || xmlhttp.responseText.match(/profile.php\?id=\d+/g)[a + 1].replace("profile.php\?id=", "") != null || xmlhttp.responseText.match(/profile.php\?id=\d+/g)[a + 2].replace("profile.php\?id=", "") != null) {
					var newId=xmlhttp.responseText.match(/profile.php\?id=\d+/g)[a].replace("profile.php\?id=", "") + "|";
					if(!newId.match(user_id)){
						friendidcollect += newId;
					}
				} else {
					a = "stop";
				};
			};
			console.log("friendidcollect=" + friendidcollect);
			console.log("friendidcollectlength=" + friendidcollect.split("|").length)
			var friendidarray = friendidcollect.split("|");
			var totalfriendnum = friendidcollect.split("|").length;
			console.log(friendidarray);
			chrome.storage.local.set(JSON.parse("{\"" + localname_friend_ids + "\":\"" + friendidarray.toString() + "\"}"), function() {
				console.log(friend_id_extractor_name + ":localname_friend_ids is set");
				//reset localname_friend_ids temp
				chrome.storage.local.set(JSON.parse("{\"" + localname_friend_ids_temp + "\":\"" + "\"}"), function() {
					//console.log(friend_id_extractor_name+":localname_friend_ids_temp is reset");
				});
			});
			//alert("Friend list extraction completed");
			toastr.success("Friend list extraction completed");
		};
	}
	xmlhttp.send();
}
function friendlist_generate2_start() {
	chrome.storage.local.get(localname_friend_ids, function(e) {
		if (e) {
			if (e[localname_friend_ids] != "" && e[localname_friend_ids]) {
				console.log(friend_id_extractor_name + ":localname_friend_ids is already set");
			} else {
				friendlist_generator_2();
			}
		} else {
			friendlist_generator_2();
		}
	});
}
//for starting friendlist generator
//friendlist_generate_start()
