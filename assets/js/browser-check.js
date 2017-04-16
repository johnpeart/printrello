---
---

$( document ).ready(function() {

	var isChromium = !!window.chrome;

	if (isChromium == false) {

		$('#browser-warning').show();

	};

});