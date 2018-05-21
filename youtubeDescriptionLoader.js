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

const CLASS_NAME = "ytDescriptionSet";
const DESC_CACHE = {};
let DISPLAY_DIV;

console.log("beginning of script");

function setup() {
    let relevant = getRelevantByPage();

    console.log("relevant as been declared, and it is", relevant);

    relevant.forEach(el => {
        el.classList.add(CLASS_NAME); // to mark it so we never iterate over it twice
        el.addEventListener("mouseenter", function(e) {

            console.log("eventlistener for mouseenter on anchor activated");
            // IF NOT CACHED =>
            if (DESC_CACHE[el.title]) {
                console.log("READING FROM CACHE");
                $(".YDLdesc")[0].innerHTML = DESC_CACHE[el.title];
            } else {
                $.ajax({
                    type: "GET",
                    url: el.href,
                    success: function(data) {
                        console.log("success in ajax call");
                        try {
                            var reg = /shortDescription...(.+)...isCrawlable/;
                            var description = ((reg.exec(data) || [])[1] || "Description not available").replace(/\\n/g, "<br>");
                            DESC_CACHE[el.title] = description;
                            DISPLAY_DIV.innerHTML = description;

                        } catch(e) {
                            console.log(e);
                        }
                    },
                    error: function(data) {
                        el.classList.remove(CLASS_NAME);
                        console.log("error in ajax call");
                    }
                });
            }
        });
        el.addEventListener("mouseleave", function(e) {
            // is mouse in the DISPLAY_DIV?
            setTimeout(function () {
                if ($('.YDLdesc:hover').length === 0) DISPLAY_DIV.innerHTML = "";
            }, 1);
        });
    });
}

$(window).on("load", function() {
    setupCss();
    setTimeout(function(){
        $("body").append("<div class='YDLdesc'></div>");
        DISPLAY_DIV = $(".YDLdesc")[0];
        DISPLAY_DIV.addEventListener("mouseleave", function (e) {
            DISPLAY_DIV.innerHTML = "";
        });
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

function getRelevantByPage() {
    let relevant = Array.prototype.filter.call($(`a.yt-simple-endpoint#video-title:not(.${CLASS_NAME})`), function(el) {
        console.log("running filter on anchors");
        return el.href.length < 65 && el.href.includes("youtube.com/watch?v=");
    });
    return relevant;
}

function setupCss() {
    try {
        let style = `
        <style>
            .YDLdesc {
                border: solid;
                border-width: 1;
                background-color: white;
                position: fixed;
                left: 1%;
                bottom: 3%;
                max-width: 70%;
                z-index: 50;
                padding: 12px;
                -webkit-transition: opacity 0.4s, width 0.6s, height 0.6s;
                transition-timing-function: ease-out;
            }
            .YDLdesc:empty {
                opacity: 0;
                -webkit-transition: opacity 0s;
            }
        </style>
        `;
        let $style = $(style);
        $('head').append($style);
    } catch(e) {
        console.log(e);
    }
}

//.on("DOMSubtreeModified") fires off all of the time, with any miniscule event; if used, must use throttled version

//#contents for home, #content for video, #items for channel

//it's terrible to use timeouts, but there seems to be no other way to get it to work on regular video pages
  //regular video pages have the "load" event activate before everything is loaded, throwing an error and stopping the script
  //video pages load in a way that is less reliable and more complicated than when on a channel page or the home page
  //my assumption is that everything loads later because priority is given to the video, so that can start as fast as possible while nothing else loads

//occasionally does not work, but works fine with a reload - not sure why
