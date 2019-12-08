/*
Copyright(c) 2014-2016 Dinesh Rajkumar Bhosale of getmyscript.com
See license file for more information
Contact developers at mr.dinesh.bhosale@gmail.com
*/
chrome.storage.local.get('hideSeen', function(a) {
	if (a.hideSeen) {
		// hide last seen for fabeook messages
		function Interceptor(nativeOpenWrapper, nativeSendWrapper) {
			XMLHttpRequest.prototype.open = function() {
				this.allow = !(arguments[1].match("/ajax/messaging/typ.php") || arguments[1].match("/ajax/mercury/change_read_status.php"));
				return nativeOpenWrapper.apply(this, arguments);
			}
			XMLHttpRequest.prototype.send = function() {
				if (this.allow) return nativeSendWrapper.apply(this, arguments);
			}
		}
		//  Injects the code via a dynamic script tag
		var script = document.createElement("script");
		script.type = "text/javascript";
		script.textContent = "(" + Interceptor + ")(XMLHttpRequest.prototype.open, XMLHttpRequest.prototype.send);";
		document.documentElement.appendChild(script);
		document.documentElement.removeChild(script);
		//console.log('hide seen is activated');
	} else {
		//console.log('hide seen is inactive');
	}
});
