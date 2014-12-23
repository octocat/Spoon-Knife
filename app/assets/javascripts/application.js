// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/sstephenson/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery_ujs
//= require turbolinks
//= require_tree .

/*global window*/

window.onload = function () {
    var searchEl = document.getElementById("search"),
        searchButton = document.getElementById("searchButton");

    function highlight() {
        var divs = document.getElementsByTagName('div'),
            innerHTML = '',
            text = this.value,
            i = divs.length,
            index = null;

        while (i--) {
            innerHTML = divs[i].innerHTML;
            index = innerHTML.indexOf(text);
            if (index >= 0) {
                innerHTML = innerHTML.substring(0, index) + '<span class="highlight">' + innerHTML.substring(index, index + text.length) + '</span>' + innerHTML.substring(index + text.length);
                divs[i].innerHTML = innerHTML;
            }
        }
    }

    function addHandler(element, type, handler) {
    	if (element.addEventListener){
			element.addEventListener(type, handler, false);
		} else if (element.attachEvent){
			element.attachEvent('on' + type, handler);
		} else {
			element['on' + type] = handler;
		}
	}

	addHandler(searchEl, 'change', highlight);
	addHandler(searchButton, 'change', highlight);
};


