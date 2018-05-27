// ==UserScript==
// @name         YouTube Description Loader
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Load the descriptions of YouTube videos
// @author       You
// @match        https://www.youtube.com/*
// @match        http://www.youtube.com/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.3.1.js
// ==/UserScript==

const CLASS_NAME = "ytDescriptionSet";
const DESC_CACHE = {};
let DISPLAY_DIV;
let theme = true;
let macroDivSize = localStorage.getItem("YDLSize") ? localStorage.getItem("YDLSize") : 25; // default is small : 25% square

console.log("beginning of script");

function setup() {
    let relevant = getRelevantByPage();

    console.log("relevant as been declared, and it is", relevant);

    relevant.forEach(el => {
        let element = (window.location.href.slice(0, 32) === "https://www.youtube.com/watch?v=" ? el.children[0].children[1] : el);
        el.classList.add(CLASS_NAME); // to mark it so we never iterate over it twice
        element.addEventListener("mouseenter", function(e) {

            console.log("eventlistener for mouseenter on anchor activated");

            if (window.location.href.slice(0, 32) === "https://www.youtube.com/watch?v=" ? DESC_CACHE[el.innerText] : DESC_CACHE[el.title]) { // if cached
                console.log("READING FROM CACHE");
                DISPLAY_DIV.innerHTML = (window.location.href.slice(0, 32) === "https://www.youtube.com/watch?v=" ? DESC_CACHE[el.innerText] : DESC_CACHE[el.title]);
            } else {
                $.ajax({
                    type: "GET",
                    url: el.href,
                    success: function(data) {
                        console.log("success in ajax call");
                        try {
                            var regDesc = /shortDescription...(.+)...isCrawlable/;
                            var description = ((regDesc.exec(data) || [])[1] || "Description not available").replace(/\\n/g, "<br>");
                            var regLikes = /{"label":"like this video along with (\d+) other people"}/;
                            var likes = (regLikes.exec(data) || "")[1];
                            var regDislikes = /{"label":"dislike this video along with (\d+) other people"}/;
                            var dislikes = (regDislikes.exec(data) || "")[1];
                            var newHTML = `<div class=${theme ? 'YDLWrapper' : 'YDLWrapper2'}>
                                                <div class=${theme ? 'YDLDescription' : 'YDLDescription2'}>${description}</div> <br>
                                                <div class='YDLLikes'>${likes === undefined ? "Likes not available." : likes + " Likes"}</div> <br>
                                                <div class='YDLDislikes'>${dislikes === undefined ? "Dislikes not available." : dislikes + " Dislikes"}</div> <br>
                                                <span class='YDLClose'>(Close)</span>
                                                <span class='YDLThemeSwitcher'>Switch Themes</span>
                                           </div>`;
                           // if (window.location.href.slice(0, 32) === "https://www.youtube.com/watch?v=") {
                           //     DESC_CACHE[el.innerText] = newHTML;
                           // } else {
                           //     DESC_CACHE[el.title] = newHTML;
                           // }
                            DISPLAY_DIV.innerHTML = newHTML;
                            $(".YDLClose").on("click", function(e) { // for X closing
                                DISPLAY_DIV.innerHTML = "";
                            });
                            $(".YDLThemeSwitcher").on("click", function(e) {
                                theme = !theme;
                                console.log("theme switcher clicked, theme is now", theme);
                                if (!theme) {
                                    $(".YDLWrapper")[0].classList.add("YDLWrapper2");
                                    $(".YDLWrapper")[0].classList.remove("YDLWrapper");
                                    $(".YDLDescription")[0].classList.add("YDLDescription2");
                                    $(".YDLDescription")[0].classList.remove("YDLDescription");
                                } else {
                                    $(".YDLWrapper2")[0].classList.add("YDLWrapper");
                                    $(".YDLWrapper2")[0].classList.remove("YDLWrapper2");
                                    $(".YDLDescription2")[0].classList.add("YDLDescription");
                                    $(".YDLDescription2")[0].classList.remove("YDLDescription2");
                                }
                            });
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
        //element.addEventListener("mouseleave", function(e) {
        //    // is mouse in the DISPLAY_DIV?
        //    setTimeout(function () {
        //        //console.log("hover status of display div", $('.YDLdesc:hover'));
        //        if ($('.macroDiv:hover').length === 0) DISPLAY_DIV.innerHTML = "";
        //    }, 1);
        //});
    });
}

$(window).on("load", function() {
    console.log("size in localStorage is", localStorage.getItem("YDLSize"));
    $("body").append("<div class='macroDiv'></div>");
    DISPLAY_DIV = $(".macroDiv")[0];
    setupCss();

    $("body").append("<div class='YDLSettingsToggle'>(Settings)</div>"); // settings
    $("body").append(`<div class='macroYDLSettingsDiv'>
                            <div class='YDLSettingsWrapper'>
                            <div class='YDLSettingsClose'>(Close)</div>
                            <div class='YDLSettingsText'>Change size of description box: </div><br>
                            <div class='YDLSettingsChangeLarge'>Large</div><br>
                            <div class='YDLSettingsChangeMedium'>Medium</div><br>
                            <div class='YDLSettingsChangeSmall'>Small</div><br>
                            <div class='YDLSettingsPinOn'>Keep popups pinned</div><br>
                            <div class='YDLSettingsPinOff'>Don't keep popups pinned</div><br>
                            </div>
                      </div>`);
    $(".YDLSettingsToggle").on("click", function(e) {
        $(".macroYDLSettingsDiv").css("display", "block");
    });
    $(".YDLSettingsClose").on("click", function(e) {
        $(".macroYDLSettingsDiv").css("display", "none");
        //$(".macroYDLSettingsDiv")[0].remove();
        console.log("heard click to close settings");
    });
    $(".YDLSettingsChangeLarge").on("click", function(e) {
        localStorage.setItem("YDLSize", 65);
        macroDivSize = localStorage.getItem("YDLSize");
        $(".macroDiv").css("width", `${macroDivSize}%`);
        $(".macroDiv").css("height", `${macroDivSize}%`);
        console.log("changed localStorage, now", localStorage.getItem("YDLSize"));
    });
    $(".YDLSettingsChangeMedium").on("click", function(e) {
        localStorage.setItem("YDLSize", 45);
        macroDivSize = localStorage.getItem("YDLSize");
        $(".macroDiv").css("width", `${macroDivSize}%`);
        $(".macroDiv").css("height", `${macroDivSize}%`);
        console.log("changed localStorage, now", localStorage.getItem("YDLSize"));
    });
    $(".YDLSettingsChangeSmall").on("click", function(e) {
        localStorage.setItem("YDLSize", 25);
        macroDivSize = localStorage.getItem("YDLSize");
        $(".macroDiv").css("width", `${macroDivSize}%`);
        $(".macroDiv").css("height", `${macroDivSize}%`);
        console.log("changed localStorage, now", localStorage.getItem("YDLSize"));
    });

    setTimeout(function(){ // creating the macro-level for the description
        //DISPLAY_DIV.addEventListener("mouseleave", function (e) {
        //    DISPLAY_DIV.innerHTML = "";
        //});
        setup(); // still need to run setup initially, the mutations observers run only when new content is loaded

        var options = {childList: true}; // when new children are added or old children are removed

        if (window.location.href.slice(0, 32) === "https://www.youtube.com/watch?v=") {
            console.log("watching video detected");
            // var target1 = $("#items.style-scope ytd-watch-next-secondary-results-renderer")[0];
            var target1 = $("#related")[0].children[1].children[1];
            var observer1 = new MutationObserver(setup);
            observer1.observe(target1, options);
        } else if (window.location.href.slice(0, 32) === "https://www.youtube.com/results?") {
            var target2 = $("#contents.style-scope.ytd-item-section-renderer")[0];
            var observer2 = new MutationObserver(setup);
            observer2.observe(target2, options);
        } else {
            var target3 = $("#contents")[0];
            var target4 = $("#items")[0];
            var observer3 = new MutationObserver(setup);
            var observer4 = new MutationObserver(setup);
            observer3.observe(target3, options);
            observer4.observe(target4, options);
        }
    }, 500);
});

function getRelevantByPage() { // rework for video pages

    let relevant;

    if (window.location.href.slice(0, 32) === "https://www.youtube.com/watch?v=") {
        relevant = $(`a.yt-simple-endpoint.style-scope.ytd-compact-video-renderer:not(.${CLASS_NAME})`);
    } else {
        relevant = $(`a.yt-simple-endpoint#video-title:not(.${CLASS_NAME})`);
    }

    relevant = Array.prototype.filter.call(relevant, function(el) {
        console.log("running filter on anchors");
        return el.href.length < 65 && el.href.includes("youtube.com/watch?v=");
    });
    return relevant;
}

function setupCss() {
    try {
        let style = `
        <style>
            .macroDiv {
                border: solid;
                border-width: 1;
                background-color: white;
                position: fixed;
                left: 1%;
                bottom: 3%;
                width: ${macroDivSize}%;
                height: ${macroDivSize}%;
                z-index: 50;
                padding: 1px;
                -webkit-transition: opacity 0.4s, width 0.6s, height 0.6s;
                transition-timing-function: ease-out;
            }
            .macroDiv:empty {
                opacity: 0;
                -webkit-transition: opacity 0s;
                z-index: -50;
            }
            .YDLWrapper {
                position: relative;
                height: 100%;
                width: 100%;
                overflow: auto;
            }
            .YDLWrapper2 {
                position: relative;
                height: 100%;
                width: 100%;
                overflow: auto;
                background-color: black;
                color: white;
            }
            .YDLClose {
                position: absolute;
                top: 0%;
                right: 2%;
                color: red;
            }
            .YDLDescription {
                position: absolute;
                width: 98%;
                height: 80%;
                top: 5%;
                left: 1%;
                background-color: #efefef;
                overflow: scroll;
            }
            .YDLDescription2 {
                position: absolute;
                width: 98%;
                height: 80%;
                top: 5%;
                left: 1%;
                background-color: #333333;
                color: white;
                overflow: scroll;
            }
            .YDLLikes {
                position: absolute;
                width: 50%;
                height: 5%;
                bottom: 1%;
                left: 5%;
            }
            .YDLDislikes {
                position: absolute;
                width: 50%;
                height: 5%;
                bottom: 1%;
                right: 5%;
            }
            .YDLThemeSwitcher {
                position: absolute;
                top: 0%;
                left: 2%;
            }
            .YDLSettingsToggle {
                position: fixed;
                top: 0%;
                right: 0%;
                z-index: 2020;
            }
            .macroYDLSettingsDiv {
                display: none;
                position: fixed;
                top: 50%;
                right: 50%;
                background-color: #eaeaea;
                height: 35%;
                width: 20%;
                z-index: 51;
            }
            .YDLSettingsWrapper {
                position: relative;
                height: 100%;
                width: 100%;
            }
            .YDLSettingsClose {
                color: red;
                position: absolute;
                top: 1%;
                right: 1%;
            }
            .YDLSettingsChangeLarge {
                position: absolute;
                left: 5%;
                padding: 10px;
                top: 25%;
                height: 15%;
                width: 75%;
            }
            .YDLSettingsChangeMedium {
                position: absolute;
                left: 5%;
                padding: 10px;
                top: 50%;
                height: 15%;
                width: 75%;
            }
            .YDLSettingsChangeSmall {
                position: absolute;
                left: 5%;
                padding: 10px;
                top: 75%;
                height: 15%;
                width: 75%;
            }
            .YDLSettingsText {
                position: absolute;
                padding: 3px;
                left: 2%;
                top: 7%;
                height: 15%;
                width: 80%;
            }
            .YDLSettingsPinOn {
                position: absolute;
                left: 5%;
                padding: 10px;
            }
            .YDLSettingsPinOff {
                position: absolute;
                left: 5%;
                padding: 10px;
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

//make display div right below video
  //make scrollable
  // description expandable on click if long
  // more data from ajax call should be displayed
    // more information such as likes/dislikes, numbers of subscriptions user has, user profile picture, video category

//no date on video page, so add it
