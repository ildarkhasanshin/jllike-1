jQuery.noConflict();
(function($, w, d, undefined) {
    
function getParam(key) {
	if(key) {
		var pairs = top.location.search.replace(/^\?/, '').split('&');

		for(var i in pairs) {
			var current = pairs[i];
			var match = current.match(/([^=]*)=(\w*)/);
			if(match[1] === key) {
				return decodeURIComponent(match[2]);
			}
	    }
	}
return false;
}

/*
function file_get_contents( url ) { // Reads entire file into a string
  var req = null;
	    try { req = new ActiveXObject("Msxml2.XMLHTTP"); } catch (e) {
	        try { req = new ActiveXObject("Microsoft.XMLHTTP"); } catch (e) {
	            try { req = new XMLHttpRequest(); } catch(e) {}
	        }
	    }
	    if (req == null) throw new Error('XMLHttpRequest not supported');
	 
	    req.open("GET", url, false);
	    req.send(null);
	 
	    return req.responseText;

	}*/
	


    
var ButtonConfiguration = function(params) {
    if(params) {
		return $.extend(true, ButtonConfiguration.defaults, params)
    }    
return ButtonConfiguration.defaults;
}
    
ButtonConfiguration.defaults = {
	selectors: {
		facebookButton: '.l-fb',
		twitterButton: '.l-tw',
		vkontakteButton: '.l-vk',
		odnoklassnikiButton: '.l-ok',
		gplusButton: '.l-gp',

		count: '.l-count',
		ico: '.l-ico',

		shareTitle: 'h2:eq(0)',
		shareSumary: 'p:eq(0)',
		shareImages: 'img[src]'
	},

	buttonDepth: 2,
	alternativeImage: '',
	alternativeSummary: '',
	alternativeTitle: '',
	forceAlternativeImage: false,
	forceAlternativeSummary: false,
	forceAlternativeTitle: false,

	classes: {
		countVisibleClass: 'like-not-empty'
	},

	keys: {
		shareLinkParam: 'href'
	},

	popupWindowOptions: [
		'left=0',
		'top=0',
		'width=500',
		'height=250',
		'personalbar=0',
		'toolbar=0',
		'scrollbars=1',
		'resizable=1'
		]
};
     
var Button = function() {};
Button.lastIndex = 0;

    Button.prototype = {
/*@methods*/
init: function($context, conf, index) {
this.config = conf;
this.index = index;

this.$context = $context;
this.$count = $(this.config.selectors.count, this.$context);
this.$ico = $(this.config.selectors.ico, this.$context);

this.collectShareInfo();
this.bindEvents();
this.ajaxRequest = this.countLikes();
},

bindEvents: function() {
this
.$context
.bind('click', Button.returnFalse);

this
.$ico
.bind('click', this, this.openShareWindow);

},

setCountValue: function(count) {
	this
	.$context
	.addClass(this.config.classes.countVisibleClass);

	this
	.$count
	.text(count);
},

getCountLink: function(url) {
return this.countServiceUrl + encodeURIComponent(url);
},

collectShareInfo: function() {
var
$parent = this.$context,
button = this;

for(var i = 0; i < this.config.buttonDepth; i++) {
$parent = $parent.parent();
}

var
href = this.$context.attr(this.config.keys.shareLinkParam),
origin = pathbs; //w.location.origin || w.location.href.replace(w.location.pathname + w.location.search, '');

//this.domenhref = pathbs;
//this.domenhref = w.location.href.replace(w.location.pathname + w.location.search, '');
this.domenhref = w.location.protocol + "//" + w.location.host;

this.linkhref = w.location.href.replace(w.location.pathname + w.location.search, '') + href;
this.linkToShare = href;
if(!href) {
href = w.location.origin + w.location.pathname;
} else if(href.indexOf('http://') == -1 & href.indexOf('https://') == -1) {
this.linkToShare
= (href[0] == '/' ? origin + href : w.location.origin + w.location.pathname + href);
}

var
$title = $(this.config.selectors.shareTitle, $parent),
$summary = $(this.config.selectors.shareSumary, $parent),
$images = $(this.config.selectors.shareImages, $parent);

this.title = $title.text();
if(this.config.forceAlternativeTitle) {
this.title = this.config.alternativeTitle;
} else if($title.length == 0 && this.config.alternativeTitle) {
this.title = this.config.alternativeTitle;
} else {
this.title = d.title;
}

if($summary.length > 0 & !this.config.forceAlternativeSummary) {
this.summary = $summary.text();
} else {
this.summary = this.config.alternativeSummary ? this.config.alternativeSummary : undefined;
}

this.images = [];
if($images.length > 0 & !this.config.forceAlternativeImage) {
$images.each(function(index, element) {
button.images[index] = element.src;
});
} else {
this.images[0] = this.config.alternativeImage ? this.config.alternativeImage : undefined;
}
},

getPopupOptions: function() {
return this.config.popupWindowOptions.join(',');
},

openShareWindow: function(e) {
var
button = e.data,
shareUri = button.getShareLink(),
windowOptions = button.getPopupOptions();

var
newWindow = w.open(shareUri, '', windowOptions);

if(w.focus) {
newWindow.focus()
}
},

/*@properties*/
linkToShare: null,
title: d.title,
summary: null,
images: [],

countServiceUrl: null,
$context: null,
$count: null,
$ico: null
    };
    
    Button = $.extend(Button, {
/*@methods*/
returnFalse: function(e) {
return false;
}

/*@properties*/

    });
    
    
    
    var FacebookButton = function($context, conf, index) {
this.init($context, conf, index);
this.type = 'facebook';
    };
    FacebookButton.prototype = new Button;
    FacebookButton.prototype
= $.extend(FacebookButton.prototype,
    {
/*@methods*/
countLikes: function() {
var
serviceURI = this.getCountLink(this.linkToShare),
execContext = this;

return $.ajax({
url: serviceURI,
dataType: 'jsonp',
success: function(data, status, jqXHR) {
if(status == 'success' && data[0]) {
if(data[0].share_count > 0) {
execContext.setCountValue(data[0].share_count)
}
}
}
});
},

getCountLink: function(url) {
return this.countServiceUrl + encodeURIComponent(url) + '%27&format=json';
},

getShareLink: function() {
var images = '';

for(var i in this.images) {
images += ('&p[images][' + i +']=' + encodeURIComponent(this.images[i]));
}
images=this.images;
return 'http://www.facebook.com/sharer/sharer.php'
+ '?src=sp&u=' + encodeURIComponent(this.linkToShare)
+ '&p[title]=' + encodeURIComponent(this.title);
},

/*@properties*/
countServiceUrl: 'https://api.facebook.com/method/fql.query?query=select%20total_count,like_count,comment_count,share_count,click_count%20from%20link_stat%20where%20url=%27'
});
    
    
    
    var TwitterButton = function($context, conf, index) {
this.init($context, conf, index);
this.type = 'twitter';
    };
    TwitterButton.prototype = new Button;
    TwitterButton.prototype
= $.extend(TwitterButton.prototype,
    {
/*@methods*/
countLikes: function() {
var
serviceURI = this.getCountLink(this.linkToShare),
execContext = this;

return $.ajax({
url: serviceURI,
dataType: 'jsonp',
success: function(data, status, jqXHR) {
if(status == 'success' & data.count > 0) {
execContext.setCountValue(data.count)
}
}
});
},

getShareLink: function() {
return 'https://twitter.com/share'
+ '?url=' + encodeURIComponent(this.linkToShare)
+ (this.title ? '&text=' + encodeURIComponent(this.title) : '');
},

/*@properties*/
countServiceUrl: 'http://urls.api.twitter.com/1/urls/count.json?url='
    });
    
    
    
    var VkontakteButton = function($context, conf, index) {
this.init($context, conf, index);
this.type = 'vkontakte';
    };
    VkontakteButton.prototype = new Button;
    VkontakteButton.prototype
= $.extend(VkontakteButton.prototype,
    {
/*@methods*/
countLikes: function() {
var serviceURI = this.getCountLink(this.linkToShare) + '&index=' + this.index;

w.socialButtonCountObjects[this.index] = this;

return $.ajax({
url: serviceURI,
dataType: 'jsonp'
});
},

getShareLink: function() {
return 'http://vkontakte.ru/share.php?'
+ 'url=' + encodeURIComponent(this.linkToShare)
+ (this.summary ? '&description=' + encodeURIComponent(this.summary) : '')
+ '&title=' + encodeURIComponent(this.title)
+ '&image=' + encodeURIComponent(this.images[0]);
},

/*@properties*/
countServiceUrl: 'http://vkontakte.ru/share.php?act=count&url='
    });
	
	
	
	
	   // костыль для Вконтакте
    w.socialButtonCountObjects = {};
    
    function vkShare(index, count) {
var button = w.socialButtonCountObjects[index];
if(count > 0) {
button.setCountValue(count);
}
delete w.socialButtonCountObjects[index];
    }
    
    if(!w.VK) {
w.VK = {
Share: {
count: function(index, count) {
vkShare(index, count);
}
}
}
    } else {
var originalVkCount = w.VK.Share.count;

w.VK.Share.count = function(index, count) {
vkShare(index, count);
originalVkCount.call(w.VK.Share, index, count);
};
    }
	
	
	
	
// +++++++++	   
	   var odnoklassnikiButton = function($context, conf, index) {
this.init($context, conf, index);
this.type = 'odnoklassniki';
    };
    odnoklassnikiButton.prototype = new Button;
    odnoklassnikiButton.prototype
= $.extend(odnoklassnikiButton.prototype,
    {
/*@methods*/

countLikes: function() {
var serviceURI = "http://www.odnoklassniki.ru/dk?st.cmd=extOneClickLike&uid=odklocs0&ref=" + this.linkhref;//encodeURIComponent(this.linkhref);
//alert(serviceURI);
execOd = this;
return $.post(this.domenhref + '/plugins/content/jllike/models/ajax.php',{curl:serviceURI,variant:'od',tpget:typeGet}, function(data){
	if (data!=0) {
		execOd.setCountValue(data);
	}
});

},

getShareLink: function() {
return 'http://www.odnoklassniki.ru/dk?st.cmd=addShare&st._surl='
+ encodeURIComponent(this.linkhref);
},

/*@properties*/
countServiceUrl: 'http://www.odnoklassniki.ru/dk?st.cmd=extOneClickLike&uid=odklocs0&ref=' + this.linkhref
    });
	


	var gplusButton = function($context, conf, index) {
this.init($context, conf, index);
this.type = 'gplusButton';
    };
    gplusButton.prototype = new Button;
    gplusButton.prototype
= $.extend(gplusButton.prototype,
    {
/*@methods*/

countLikes: function() {
//serviceURI = 'https://plusone.google.com/_/+1/fastbutton?url='+ this.linkhref;//encodeURIComponent(this.linkhref);
serviceURI = this.linkhref;//encodeURIComponent(this.linkhref);
//alert(serviceURI);
execGP = this;
return $.post(this.domenhref + '/plugins/content/jllike/models/ajax.php',{curl:serviceURI,variant:'gp',tpget:typeGet}, function(data){
	if (data!=0) {
		execGP.setCountValue(data);
	}
});

},

getShareLink: function() {
return 'https://plus.google.com/share?url='
+ encodeURIComponent(this.linkhref);
},

/*@properties*/
countServiceUrl: 'https://plusone.google.com/_/+1/fastbutton?url='
    });



    
    
//+++++++++    


 
    

    $.fn.socialButton = function(config) {
	
this.each(function(index, element) {
setTimeout(function() {
var
$element = $(element),
conf = new ButtonConfiguration(config),
b = false;

Button.lastIndex++;

if($element.is(conf.selectors.facebookButton)) {
b = new FacebookButton($element, conf, Button.lastIndex);
} else if($element.is(conf.selectors.twitterButton)) {
b = new TwitterButton($element, conf, Button.lastIndex);
} else if($element.is(conf.selectors.vkontakteButton)) {
b = new VkontakteButton($element, conf, Button.lastIndex);
} else if($element.is(conf.selectors.odnoklassnikiButton)) {
b = new odnoklassnikiButton($element, conf, Button.lastIndex);
} else if($element.is(conf.selectors.gplusButton)) {
b = new gplusButton($element, conf, Button.lastIndex);
}

$
.when(b.ajaxRequest)
.then(
function() {
$element.trigger('socialButton.done', [b.type]);
}
,function() {
$element.trigger('socialButton.done', [b.type]);
}
);
}, 0);
});

return this;
    };
    
    $.scrollToButton = function(hashParam, duration) {
if(!w.location.hash) {
if(w.location.search) {
var currentHash = getParam(hashParam);
if(currentHash) {
var $to = $('#' + currentHash);
if($to.length > 0) {
$('html,body')
.animate({
scrollTop: $to.offset().top,
scrollLeft: $to.offset().left
}, duration || 1000);
}
}
}
}

return this;
    };
        
})(jQuery, window, document);

	jQuery(document).ready(function($) {
		$('.like').socialButton();
	});