// Cookie Compliance in a Single Include
function cookieMonster() {
	
	// Ths will be used to reset the original body style
	this.originalPaddingTop 	= '';
	this.cookie 				= '';
	this.debug					= true;
	this.showDecline			= true;
	this.cookieList				= new Array();
	
	// Checks for a Cookies Existance
	this.getCookie = function(cookie){		
		this.cookie = cookie;
				
		// first we'll split this cookie up into name/value pairs
		// note: document.cookie only returns name=value, not the other components
		var a_all_cookies 	= document.cookie.split(';');
		var a_temp_cookie 	= '';
		var	cookie_name 	= '';
		var	cookie_value 	= '';
		var b_cookie_found 	= false;
		for ( i = 0; i < a_all_cookies.length; i++ ) {
			// split and trim
			a_temp_cookie 	= a_all_cookies[i].split( '=' );
			cookie_name 	= a_temp_cookie[0].replace(/^\s+|\s+$/g, '');
			// if the extracted name matches passed this.cookie
			if(cookie_name == cookie){
				b_cookie_found = true;
				// we need to handle case where cookie has no value but exists (no = sign, that is):
				if ( a_temp_cookie.length > 1 ) cookie_value = unescape( a_temp_cookie[1].replace(/^\s+|\s+$/g, '') );
				return true;
				break;
			}
			
			a_temp_cookie = null;
			cookie_name 	= '';	
		}
		if (!b_cookie_found) return null;
	}
	
	// Sets the Accept Cookie
	this.acceptCookies = function(){
		this.setCookie('cookie-monster', 'accept');
		document.body.removeChild(document.getElementById('cookie-monster'));
		document.body.style.paddingTop = this.originalPaddingTop;
	}
	
	// Sets the Decline Cookie
	this.declineCookies = function(){
		this.setCookie('cookie-monster', 'decline');
		// Kill the list of cookies
		for(c = 0; c <= this.cookieList.length; c++){
			this.killCookie(this.cookieList[c]);	
		}
		document.body.removeChild(document.getElementById('cookie-monster'));
		document.body.style.paddingTop = this.originalPaddingTop;
	}
	
	// Kills a Cookie
	this.killCookie = function(cookieName){
		document.cookie = cookieName + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; domain=" + document.domain.replace('www','') + "; path=/";			
	}
	
	// Sets a given cookie ( Expires in twenty years )
	this.setCookie = function(name, value){
		var exdate = new Date();
		exdate.setDate(exdate.getDate() + (20 * 365 * 24 * 60 * 60));
		document.cookie = name + "=" + escape(value) + "; expires=" + exdate.toUTCString() + "; domain=" + document.domain.replace('www','') + "; path=/";			
	}
	
	// Gets a given cookies value
	this.mineCookie = function(cookieTarget){
		var mine = (typeof cookieTarget == 'undefined') ? this.cookie : cookieTarget;
		var i, x, y, ARRcookies = document.cookie.split(";");
		for (i=0; i < ARRcookies.length; i++){
			x = ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
			y = ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
			x = x.replace(/^\s+|\s+$/g,"");
			if(x == mine){
				return unescape(y);
			}
		}
		return false;				
	}
	
	// Initialises the Cookie Monster
	this.init = function(){					
		// Grab the Query Paramters
		var requestURL = document.getElementById('cookie-monster-source').getAttribute('src');
		//next use substring() to get querystring part of src
		var queryString = requestURL.substring(requestURL.indexOf("?") + 1, requestURL.length);
		
		//Next split the querystring into array
		var params = queryString.split("&");
		
		//Next loop through params
		for(var i = 0; i < params.length; i++){
			var name  = params[i].substring(0,params[i].indexOf("="));
			var value = params[i].substring(params[i].indexOf("=") + 1, params[i].length);
			
			if(name == 'debug'){
				var new_debug = (value == 'true') ? true: false;
				this.debug = new_debug;
			}
			
			if(name == 'showDecline'){
				var new_decline = (value == 'true') ? true: false;
				this.showDecline = new_decline;				
			}
			
			if(name == 'cookieList'){
				this.cookieList = value.split(',');	
			}
		}
		// first check for the settings cookie ...
		if(this.getCookie('cookie-monster') != null){
			if(this.mineCookie() == 'decline'){				
				// Kill the list of cookies
				for(c = 0; c <= this.cookieList.length; c++){
					this.killCookie(this.cookieList[c]);	
				}
			}
		}else{
			// Attach the popper CSS
			var fileref = document.createElement("link")
			fileref.setAttribute("rel", "stylesheet")
			fileref.setAttribute("type", "text/css")
			fileref.setAttribute("href", 'http://www.lomogo.co.uk/cookie-compliance/cookie-monster.css')
			document.getElementsByTagName("head")[0].appendChild(fileref);
			
			// Show the Pop Over
			var popper 				= document.createElement('div');
			popper.id 				= 'cookie-monster';
			popper.innerHTML 		= '';
			popper.innerHTML += '<p><span>UK Cookie Law Compliance</span><br />This website makes use of Cookies and by using this website you are consenting to this. We use these cookies to ensure we provide you with a better service. Cookies are small text files held on your computer. They allow us to give you the best browsing experience possible and mean we can understand how you use our site.<br /><br /> Some cookies have already been set. You can delete / block cookies but parts of our site won\'t work correctly. By using our website you accept our use of cookies.</p>';
			popper.innerHTML += '<div><input type="button" value="Accept Cookies" onclick="javascript: cookieMonster.acceptCookies();" class="cookie-monster-btn" /><br /><input type="button" value="Decline Cookies" onclick="javascript: cookieMonster.declineCookies();" id="cookie-monster-decline" style="display: none;" class="cookie-monster-btn" /><br/><input type="button" onclick="javascript: cookieMonster.dumpTests();" id="cookie-monster-test"  style="display: none;" value="Dump Test Cookies" class="cookie-monster-btn" /></div>';
			popper.innerHTML += '<div style="clear: both;"></div>';
			
			// Push body margin top down by height of popper
			this.originalPaddingTop = document.body.style.paddingTop;
			document.body.style.paddingTop = '115px';
			
			// Attach the popper
			document.body.appendChild(popper);
			
			// Alter to suit config
			if(this.debug == true) document.getElementById('cookie-monster-test').style.display = 'inline';
			if(this.showDecline == true) document.getElementById('cookie-monster-decline').style.display = 'inline-block';
			
		}			
	}
	
	this.dumpTests = function(){
	  // Kill the list of cookies
	  for(c = 0; c < this.cookieList.length; c++){
		  this.setCookie(this.cookieList[c],'coookie-monster-test-cookie-' + c);	
	  }
	}
	
	// Self Initialising
	this.init();
}		
// The Global Cookie Object
var cookieMonster;
// Start the monster ...
window.onload = function(){ cookieMonster = new cookieMonster(); };