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

console.log("beginning of YDL script");

const CLASS_NAME = "ytDescriptionSet";
const DESC_CACHE = {};
let DISPLAY_DIV;
let theme = true;
let macroDivSize = localStorage.getItem("YDLSize") ? localStorage.getItem("YDLSize") : 260; // default is small : 260 pixels
let descHeight = localStorage.getItem("descHeight") ? localStorage.getItem("descHeight") : 70; // default is small : 70%

console.log("YDL some variables declared");

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
                            //var description = ((regDesc.exec(data) || [])[1] || "Description not available").replace(/\\n/g, "<br>");
                            var description = (regDesc.exec(data) || "")[1];
                            var regLikes = /{"label":"like this video along with ([0-9]{1,3}(,?[0-9]{1,3}?)*) other pe...."}/; // can be "people" or "person"
                            var likes = (regLikes.exec(data) || "")[1];
                            var regDislikes = /{"label":"dislike this video along with ([0-9]{1,3}(,?[0-9]{1,3}?)*) other pe...."}/; // can be "people" or "person"
                            var dislikes = (regDislikes.exec(data) || "")[1];
                            var regSubs = /"subscriberCountText":{"runs":.{"text":"([0-9]{1,3}(,?[0-9]{1,3}?)*) subscribers"}.}/;
                            var subs = (regSubs.exec(data) || "")[1];
                            var regDate = /"dateText":."simpleText":"Published on (.+)".,"description"/;
                            var date = (regDate.exec(data) || "")[1];
                            var regThumb = /:\{"owner":\{"videoOwnerRenderer":\{"thumbnail":\{"thumbnails":\[\{"url":"([^"]+)","width"/;
                            var thumb = (regThumb.exec(data) || "")[1];
                            var regCaps = /(Tracks\\":\[\{\\"captionTrackIndices\\":)\[\d(.).+\\"visibility\\/; // if 2 is a comma, CC exists
                            var regCaps2 = /simpleText\\":\\"English \(auto-generated\)/;
                            var caps = regCaps.exec(data);
                            var caps2 = regCaps2.exec(data);
                            var capsFinal = regCapsBool(caps, caps2);
                            var regQual = /quality\_label\=((\d+)p)/g;
                            var quals = data.match(regQual);
                            var fixedQuals = quals ? regExFixerQuals(quals) : false; // an array of all relevant values
                            var regFPS = /fps=(\d+)/g;
                            var fpsNums = data.match(regFPS);
                            var fixedFPSNums = fpsNums ? regExFixerFPS(fpsNums) : false; // an array of all relevant values
                            let ratingBarSizes = likes != undefined && dislikes != undefined ? ratio(likes, dislikes) : undefined;
                            let dislikeLeft = ratingBarSizes ? ratingBarSizes[0] + 56 : undefined;
                            var newHTML = `<div class=${theme ? 'YDLWrapper' : 'YDLWrapper2'}>
                                                <div class=${theme ? 'YDLDescription' : 'YDLDescription2'} style='height: ${descHeight}%'>${description === undefined ? "Description not available" : decodeHTML(description)}</div> <br>
                                                <div class='YDLLikes'>${likes === undefined ? "<span class='unavailable'>Likes not available.</span>" : commaHandler(likes) + " Likes"}</div> <br>
                                                <div class='YDLDislikes'>${dislikes === undefined ? "<span class='unavailable'>Dislikes not available.</span>" : commaHandler(dislikes) + " Dislikes"}</div> <br>
                                                <div class='YDLSubs'>${subs === undefined ? "<span class='unavailable'>Subscribers not available.</span>" : commaHandler(subs) + " Subscribers"}</div> <br>
                                                <div class='YDLDate'>${date === undefined ? "<span class='unavailable'>Date not available.</span>" : "Uploaded on " + date}</div> <br>
                                                <div class='YDLThumb'>${thumb === undefined ? "Thumb not available." : "<img src="+thumb+" width=54 height=54>"}</div> <br>
                                                <div class='YDLSettingsWrapper'><div class='YDLSettingsChangeLarge'>Large</div>
                                                <div class='YDLSettingsChangeMedium'>Medium</div>
                                                <div class='YDLSettingsChangeSmall'>Small</div></div>
                                                <div class='YDLClose'><div class='YDLCloseX'>X</div></div>
                                                <div class='YDLCaps'>${capsFinal ? "CC" : ""}</div>
                                                <div class='YDLQuals'>${fixedQuals === false ? "<span class='unavailable'>Max Resolution: Unavailable.</span>" : "Max Resolution: " + fixedQuals[0]}</div>
                                                <div class='YDLFPS' title='Different quality versions of the same video can have different framerates'>${fixedFPSNums === false ? "<span class='unavailable'>Max FPS: Unavailable</span>" : "Max FPS: " + fixedFPSNums[0]}</div>
                                                <div class='YDLRatingBarLike' style='width: ${ratingBarSizes === undefined ? "0" : ratingBarSizes[0]}px;'></div>
                                                <div class='YDLRatingBarDislike' style='left: ${dislikeLeft === undefined ? "0" : dislikeLeft}px; width: ${ratingBarSizes === undefined ? "0" : ratingBarSizes[1]}px'></div>
                                                <span class='YDLThemeSwitcher'>Switch Themes</span>
                                           </div>`;
                           // if (window.location.href.slice(0, 32) === "https://www.youtube.com/watch?v=") {
                           //     DESC_CACHE[el.innerText] = newHTML;
                           // } else {
                           //     DESC_CACHE[el.title] = newHTML;
                           // }
                            //if (likes != undefined && dislikes != undefined) { // not working for some reason
                            //    let ratingBarSizes = ratio(likes, dislikes);
                            //    $(".YDLRatingBarLike").css("width", JSON.stringify(ratingBarSizes[0])+"px");
                            //    let dislikeLeft = ratingBarSizes[0] + 51;
                            //    $(".YDLRatingBarDislike").css("left", JSON.stringify(dislikeLeft)+"px");
                            //    $(".YDLRatingBarDislike").css("width", JSON.stringify(ratingBarSizes[1])+"px");
                            //    console.log("ij if statement for rating bar, likewidth, dislikeleft, dislikewidth", `${ratingBarSizes[0]}px`, `${dislikeLeft}px`, `${ratingBarSizes[1]}px`);
                            //}
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
                            $(".YDLSettingsChangeLarge").on("click", function(e) {
                                localStorage.setItem("YDLSize", 650);
                                localStorage.setItem("descHeight", 88);
                                macroDivSize = localStorage.getItem("YDLSize");
                                descHeight = localStorage.getItem("descHeight");
                                $(".macroDiv").css("width", `${macroDivSize * 1.25}px`);
                                $(".macroDiv").css("height", `${macroDivSize}px`);
                                $(".YDLDescription").css("height", `${descHeight}%`);
                                $(".YDLDescription2").css("height", `${descHeight}%`);
                                console.log("changed localStorage, now", localStorage.getItem("YDLSize"));
                                let ratingBarSizes = likes != undefined && dislikes != undefined ? ratio(likes, dislikes) : undefined;
                                let dislikeLeft = ratingBarSizes ? ratingBarSizes[0] + 56 : undefined;
                                if (ratingBarSizes) {
                                    $(".YDLRatingBarLike")[0].style.width = `${ratingBarSizes[0]}px`;
                                    $(".YDLRatingBarDislike")[0].style.left = `${dislikeLeft}px`;
                                    $(".YDLRatingBarDislike")[0].style.width = `${ratingBarSizes[1]}px`;
                                }
                            });
                            $(".YDLSettingsChangeMedium").on("click", function(e) {
                                localStorage.setItem("YDLSize", 450);
                                localStorage.setItem("descHeight", 82.6);
                                macroDivSize = localStorage.getItem("YDLSize");
                                descHeight = localStorage.getItem("descHeight");
                                $(".macroDiv").css("width", `${macroDivSize * 1.25}px`);
                                $(".macroDiv").css("height", `${macroDivSize}px`);
                                $(".YDLDescription").css("height", `${descHeight}%`);
                                $(".YDLDescription2").css("height", `${descHeight}%`);
                                console.log("changed localStorage, now", localStorage.getItem("YDLSize"));
                                let ratingBarSizes = likes != undefined && dislikes != undefined ? ratio(likes, dislikes) : undefined;
                                let dislikeLeft = ratingBarSizes ? ratingBarSizes[0] + 56 : undefined;
                                if (ratingBarSizes) {
                                    $(".YDLRatingBarLike")[0].style.width = `${ratingBarSizes[0]}px`;
                                    $(".YDLRatingBarDislike")[0].style.left = `${dislikeLeft}px`;
                                    $(".YDLRatingBarDislike")[0].style.width = `${ratingBarSizes[1]}px`;
                                }
                            });
                            $(".YDLSettingsChangeSmall").on("click", function(e) {
                                localStorage.setItem("YDLSize", 260);
                                localStorage.setItem("descHeight", 70);
                                macroDivSize = localStorage.getItem("YDLSize");
                                descHeight = localStorage.getItem("descHeight");
                                $(".macroDiv").css("width", `${macroDivSize * 1.25}px`);
                                $(".macroDiv").css("height", `${macroDivSize}px`);
                                $(".YDLDescription").css("height", `${descHeight}%`);
                                $(".YDLDescription2").css("height", `${descHeight}%`);
                                console.log("changed localStorage, now", localStorage.getItem("YDLSize"));
                                let ratingBarSizes = likes != undefined && dislikes != undefined ? ratio(likes, dislikes) : undefined;
                                let dislikeLeft = ratingBarSizes ? ratingBarSizes[0] + 56 : undefined;
                                if (ratingBarSizes) {
                                    $(".YDLRatingBarLike")[0].style.width = `${ratingBarSizes[0]}px`;
                                    $(".YDLRatingBarDislike")[0].style.left = `${dislikeLeft}px`;
                                    $(".YDLRatingBarDislike")[0].style.width = `${ratingBarSizes[1]}px`;
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

    //$("body").append("<div class='YDLSettingsToggle'>(Settings)</div>"); // settings
    //$("body").append(`<div class='macroYDLSettingsDiv'>
                           // <div class='YDLSettingsWrapper'>
                           // <div class='YDLSettingsClose'>(Close)</div>
                           // <div class='YDLSettingsText'>Change size of description box: </div><br>
                           // <div class='YDLSettingsChangeLarge'>Large</div><br>
                           // <div class='YDLSettingsChangeMedium'>Medium</div><br>
                           // <div class='YDLSettingsChangeSmall'>Small</div><br>
                           // <div class='YDLSettingsPinOn'>Keep popups pinned</div><br>
                           // <div class='YDLSettingsPinOff'>Don't keep popups pinned</div><br>
                           // </div>
                    //  </div>`);
    $(".YDLSettingsToggle").on("click", function(e) {
        $(".macroYDLSettingsDiv").css("display", "block");
    });
    $(".YDLSettingsClose").on("click", function(e) {
        $(".macroYDLSettingsDiv").css("display", "none");
        //$(".macroYDLSettingsDiv")[0].remove();
        console.log("heard click to close settings");
    });


    setTimeout(function(){ // creating the macro-level for the description
        //DISPLAY_DIV.addEventListener("mouseleave", function (e) {
        //    DISPLAY_DIV.innerHTML = "";
        //});
        setup(); // still need to run setup initially, the mutations observers run only when new content is loaded

        setInterval(function() { // for page changes because YT is largely an SPA
            currentRelevantURL = window.location.href.split("#")[0].split("&t=")[0];
            if (currentURL !== currentRelevantURL) {
                currentURL = currentRelevantURL;
                console.log("YDL detected new page loaded SPA style");
                setup();
            }
        }, 1500);

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
    }, 1500);
});

function getRelevantByPage() {

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

function decodeHTML(html) {
    var txt = document.createElement("textarea");
    txt.innerHTML = html;
    let finalText = txt.value;
    return finalText.replace(/\\n/g, "<br>")
                    .replace(/\\"/g, `"`)
                    .replace(/\\u0026/g, "&")
                    .replace(/\\u003c/g, "<")
                    .replace(/\\u003e/g, ">");
}

function commaHandler(el) {
    let splitNum = el.split(",");
    let numOfCommas = el.split(",").length - 1;
    if (numOfCommas === 1) {
        return splitNum[0] += "K";
    } else if (numOfCommas === 2) {
        return splitNum[0] += "M";
    } else if (numOfCommas === 3) {
        return splitNum[0] += "B";
    } else {
        return splitNum[0];
    }
}

function ratio(likes, dislikes) {
    // getting rid of potential commas first and turning to Number type
    let delta;
    let width = localStorage.getItem("YDLSize");
    if (width == 260) {delta = 269;}
    if (width == 450) {delta = 507;}
    if (width == 650) {delta = 756;}
    let likesNum = Number(likes.split(",").join(""));
    let dislikesNum = Number(dislikes.split(",").join(""));
    let total = likesNum + dislikesNum;
    let likesPx = Math.floor((likesNum / total) * delta);
    let dislikesPx = Math.floor((dislikesNum / total) * delta);
    console.log("in ratio, likesNum, dislikesNum, total, likesPx, dislikesPx, width, delta", likesNum, dislikesNum, likesPx, dislikesPx, width, delta);
    return [likesPx, dislikesPx];
}

function regExFixerQuals(arr) { // an array of video qualities yet to be isolated via regex
    console.log("in regExFixerQuals, arr", arr);
    var newArr = [];
    arr.forEach(el => {
        let newEl = el.match(/label=(\d+p)/)[1];
        if (!newArr.includes(newEl)) {
            newArr.push(newEl);
        }
    });
    return newArr;
}

function regExFixerFPS(arr) { // an array of FPS values yet to be isolated via regex
    console.log("in regExFixerFPS, arr", arr);
    var newArr = [];
    arr.forEach(el => {
        let newEl = el.match(/fps=(\d+)/)[1];
        if (!newArr.includes(newEl)) {
            newArr.push(newEl);
        }
    });
    return newArr;
}

function regCapsBool(regObj1, regObj2) {
    console.log("in regCapsBool, regObj1, regObj2", regObj1, regObj2);
    if (!regObj1) {
        return false;
    } else {
        if (regObj1[2] === ",") {
            return true;
        } else if (regObj1[2] === "]") {
            return !regObj2;
        } else {
            return false;
        }
    }
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
                width: ${macroDivSize * 1.25}px;
                height: ${macroDivSize}px;
                z-index: 2050;
                padding-top: 1px;
                -webkit-transition: opacity 0.4s, width 0.6s, height 0.6s;
                transition-timing-function: ease-out;
                font-size: 12.5px;
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
                top: 1px;
                right: 1px;
                color: white;
                background-color: red;
                width: 14px;
                height: 14px;
                border: thin;
                border-size: 0.5;
                border-color: black;
                border-style: ridge;
            }
            .YDLCloseX {
                top: 1px;
                right: 2px;
                padding-left: 3px;
            }
            .YDLDescription {
                position: absolute;
                top: 18px;
                left: 0.5px;
                right: 0.2px;
                background-color: #efefef;
                overflow: scroll;
                padding-top: 2px;
                padding-left: 2px;
                border: #a5a5a5;
                border-width: thin;
                border-style: ridge;
            }
            .YDLDescription2 {
                position: absolute;
                top: 18px;
                left: 0.5px;
                right: 0.2px;
                background-color: #333333;
                color: white;
                overflow: scroll;
                padding-top: 2px;
                padding-left: 2px;
                border: #a5a5a5;
                border-width: thin;
                border-style: ridge;
            }
            .YDLLikes {
                position: absolute;
                bottom: 4px;
                left: 57px;
                font-size: 12px;
            }
            .YDLDislikes {
                position: absolute;
                bottom: 4px;
                right: 2px;
                font-size: 12px;
            }
            .YDLRatingBarLike {
                position: absolute;
                bottom: 0px;
                left: 56px;
                font-size: 12px;
                background-color: lightblue;
                height: 4px;
                border: black;
                border-radius: initial;
                border-style: solid;
                border-top-width: 1px;
                border-bottom-width: 1px;
                border-left-width: 0px;
                border-right-width: 1px;
            }
            .YDLRatingBarDislike {
                position: absolute;
                bottom: 0px;
                font-size: 12px;
                background-color: red;
                height: 4px;
                border: black;
                border-radius: initial;
                border-style: solid;
                border-top-width: 1px;
                border-bottom-width: 1px;
                border-left-width: 1px;
                border-right-width: 0px;
            }
            .YDLSubs {
                position: absolute;
                bottom: 39px;
                left: 57px;
                font-size: 12px;
            }
            .YDLDate {
                position: absolute;
                bottom: 39px;
                right: 2px;
                font-size: 12px;
            }
            .YDLCaps {
                position: absolute;
                bottom: 22px;
                font-size: 11px;
                right: 2px;
                background-color: #e6e6e6;
                padding-right: 3px;
                padding-left: 3px;
                color: #676767;
            }
            .YDLQuals {
                position: absolute;
                bottom: 22px;
                font-size: 11px;
                left: 57px;
            }
            .YDLFPS {
                position: absolute;
                bottom: 22px;
                font-size: 11px;
                right: 29px;
            }
            .YDLThumb {
                position: absolute;
                height: 54px;
                width: 54px;
                left: 0px;
                bottom: 0px;
                border: black;
                border-width: 1px;
                border-radius: initial;
                border-style: solid;
            }
            .unavailable {
                font-size: 9.8px;
            }
            .YDLThemeSwitcher {
                position: absolute;
                top: 1px;
                left: 4px;
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
                height: 13px;
                top: 2px;
                padding-left: 90px;
                padding-right: 40px;
            }
            .YDLSettingsClose {
                color: red;
                position: absolute;
                top: 1px;
                right: 1px;
                width: 16px;
                height: 16px;
                border: solid;
                border-size: 0.5;
                border-color: black;
            }
            .YDLSettingsChangeLarge {
                position: absolute;
                left: 35%;
                top: 1px;
                font-size: 12.5px;
            }
            .YDLSettingsChangeMedium {
                position: absolute;
                left: 57%;
                top: 3px;
                font-size: 11px;
            }
            .YDLSettingsChangeSmall {
                position: absolute;
                left: 80%;
                top: 3.75px;
                font-size: 9.5px;
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

var currentURL = window.location.href.split("#")[0]; // to store URL on hard load to handle SPA behavior

//.on("DOMSubtreeModified") fires off all of the time, with any miniscule event; if used, must use throttled version

//#contents for home, #content for video, #items for channel

//it's terrible to use timeouts, but there seems to be no other way to get it to work on regular video pages
  //regular video pages have the "load" event activate before everything is loaded, throwing an error and stopping the script
  //video pages load in a way that is less reliable and more complicated than when on a channel page or the home page
  //my assumption is that everything loads later because priority is given to the video, so that can start as fast as possible while nothing else loads

//occasionally does not work, but works fine with a reload - because of SPA functionality

//make display div right below video
  //make scrollable
  // description expandable on click if long
  // more data from ajax call should be displayed
    // more information such as likes/dislikes, numbers of subscriptions user has, user profile picture, video category

//no date on video page, so add it

/* styling for ratings bar
position: absolute;
    bottom: 1px;
    left: 51px; dislike has like width + 51
    font-size: 12px;
    background-color: lightblue;
    width: 271px; <== (max), 758 if large, 509 if medium
    height: 5px;
*/

//look into adding video qualities available
//subtitles, closed captions

//need to deal with fact that YT is now, more or less, a SPA - need to re-run script if changing between channel - video - home - search

//sometimes the regEx captures of the video qualities and FPS numbers would fail, but work when tried again a second later, implying the incoming JSON may be different
    //depending on when you make a get request, perhaps the front end of youtube can render the video given the data either way

//need to have menu appear near anchor tag or near mouse
