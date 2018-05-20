// ==UserScript==
// @name         YouTube Description Loader
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.youtube.com/*
// @match        http://www.youtube.com/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.3.1.js
// ==/UserScript==

console.log("beginning of script");

function setup() {
    var relevant = Array.prototype.filter.call($("a"), function(el) {
        console.log("running filter on anchors");
        return el.href.includes("youtube.com/watch?v=") && el.href.length < 45 && !el.getAttribute("ytDescriptionListener") && el.id != "thumbnail";
    });

    console.log("relevant as been declared, and it is", relevant);

    relevant.forEach(el => {el.setAttribute("ytDescriptionListener", true); // to mark it so we never iterate over it twice
        el.addEventListener("mouseenter", function(e) {
            $("body").append("<div class='YDLdesc'></div>");
            console.log("eventlistener for mouseenter on anchor activated");
            $.ajax({
                type: "GET",
                url: el.href,
                success: function(data) {
                    console.log("success in ajax call");
                    var reg = /shortDescription...(.+)...isCrawlable/;
                    var description = reg.exec(data)[1].replace(/\\n/g, "<br>");
                    $(".YDLdesc")[0].innerHTML = description;
                    $(".YDLdesc").css("border", "solid");
                    $(".YDLdesc").css("border-width", "1");
                    $(".YDLdesc").css("background-color", "white");
                    $(".YDLdesc").css("position", "fixed");
                    $(".YDLdesc").css("left", "1%");
                    $(".YDLdesc").css("bottom", "3%");
                    $(".YDLdesc").css("max-width", "70%");
                    $(".YDLdesc")[0].style.zIndex = "50";
                },
                error: function(data) {
                    console.log("error in ajax call");
                }
            });
        });
        el.addEventListener("mouseleave", function(e) {
            $(".YDLdesc").remove();
        });
    });
}

$(window).on("load", function() {
    setTimeout(function(){
        setup(); // still need to run setup initially, the mutations observers run only when new content is loaded

        var target1 = $("#items")[0];
        var target2 = $("#content")[0];
        var target3 = $("#contents")[0];
        var target4 = $("#contents")[0].childNodes[0].childNodes[5];

        var observer1 = new MutationObserver(setup);
        var observer2 = new MutationObserver(setup);
        var observer3 = new MutationObserver(setup);
        var observer4 = new MutationObserver(setup);

        var options = {childList: true}; // when new children are added or old children are removed

        observer1.observe(target1, options);
        observer2.observe(target2, options);
        observer3.observe(target3, options);
        observer4.observe(target4, options);
    }, 1500);
});

//.on("DOMSubtreeModified") fires off all of the time, with any miniscule event; if used, must use throttled version

//#contents for home, #content for video, #items for channel

//it's terrible to use timeouts, but there seems to be no other way to get it to work on regular video pages
  //regular video pages have the "load" event activate before everything is loaded, throwing an error and stopping the script
  //video pages load in a way that is less reliable and more complicated than when on a channel page or the home page
  //my assumption is that everything loads later because priority is given to the video, so that can start as fast as possible while nothing else loads

//occasionally does not work, but works fine with a reload - not sure why
