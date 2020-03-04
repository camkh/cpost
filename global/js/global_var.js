/*
 * Copyright(c) 2014-2016 Dinesh Rajkumar Bhosale of getmyscript.com
 * See license file for more information
 * Contact developers at mr.dinesh.bhosale@gmail.com
 * */
var main_url="http://fst.getmyscript.com";
var site_url="http://localhost/fbpost/";
var extensionName="AutoPost For Facebook";
// global manifest variable for accessing data stored in manifest file
var manifest = chrome.runtime.getManifest();
// regex for checking correct hostname
var hname_regex=/\.facebook\.com/ig;