// ==UserScript==
// @name         Reddit Newsfilter (Minimalistic)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.reddit.com/*
// @exclude      https://www.reddit.com/r/*/comments/*
// @grant        none
// @require      http://code.jquery.com/jquery-latest.js
// ==/UserScript==

$("body").prepend("<input class='strings'></input>");

$(".strings").on("keydown", function(e) {
	if (e.key === "Enter") {
		Array.prototype.forEach.call($(".domain"), function(el) {
	if (el.innerText.includes($(".strings").val())) {
		el.parentNode.parentNode.parentNode.parentNode.remove()
	}
}); $(".strings").val("");
	}
})
