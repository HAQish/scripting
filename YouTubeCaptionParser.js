// ==UserScript==
// @name         YouTube Caption Parser
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Parses and shows user-friendly text of closed-caption tracks
// @author       You
// @match        https://www.youtube.com/watch?v=*
// @grant        none
// @require      https://code.jquery.com/jquery-3.3.1.js
// ==/UserScript==


$(window).on("load", function() {
    setTimeout(function() {
        console.log("running caption parser");
        var transSpan = document.createElement("span");
        $("#container > h1 > yt-formatted-string").after(transSpan);
        transSpan.innerText = "Click for English Transcript";
        transSpan.classList.add("YTCPSpan");
        $(".YTCPSpan").css("padding-left", "20px");
        $(".YTCPSpan").css("font-size", "10px");
        console.log("transSpan should be added now");
        transSpan.addEventListener("click", function(e) {
            console.log("adding event listener to trans span");
            var cap;
            $.ajax({
                type: "GET",
                url: "https://www.youtube.com/api/timedtext?lang=en&v=" + window.location.href.slice(32, 43),
                success: function(data) {
                    console.log("in success, no parsing yet, data is", data);
                    try {
                        cap = data;
                        var ser = new XMLSerializer();
                        var formattedText = ser.serializeToString(cap).replace(/<\/text>/g, "\n").replace(/<[^>]+>/g, "").replace(/&amp;#39;/g, "'");
                        console.log("ran ajax call, about to alert");
                        console.log(formattedText);
                    } catch(e) {
                        console.log("in success, error caught");
                    }
                },
                error: function(data) {
                    console.log("in error, no such CC track");
                }
            });
        });
    }, 1000);
});

//changing css of transSpan only works after it has already been added to the DOM via the .after
//still need a setTimeout in the window.on("load")

//iron-dropdown paper-listbox paper-item paper-item-body in the YT native CC track transcripts are from something called Polymer Elements
//#transcript-loader on the first time is just an empty <ytd-transcript-loader> tag
//#transcript-loader has a non-empty div when activated after the first time, but the (almost) empty string is always there, perhaps an error on YT itself
//ytd-transcript-loader acts like a native HTML element
//getting rid of the "hidden" part via changing outerHTML does not simulate click or activity
//when polymer menu is in focus, scrolling is only for menu, can't scroll anything else until menu is closed

//paper-ripple on click (... in like/share menu) is another Polymer thing, seems to have the opacity of a gray circle around the element oscillate in and out once
//has a border-radius for the circle, and has the insides with background-color: rgb(0, 0, 0) for black, and has the opacity go between 0 and slightly < than 1 for 1 cycle

//tab index is normally -1 for the transcript tag, so unreachable by tabbing, although it's hidden anyways so not sure of the purpose
//when active, tab index is 0, meaning navigable via tag based on the order in the dom (not the obviously visual order on the page itself)
//if two tab indexes collide, order is given via the dom\

//element.focus() focuses on the current HTML element, element.blur() removes focus from that element, can also be .on focus and blur
//.focus() scrolls there on default, can be an object given with option, .focus(preventScroll: true), default is false
//the focus might not work so obviously with custom CSS
  //document.activeElement returns the current focus in the webpage
