// ==UserScript==
// @name         Word Counter Redux 3
// @namespace    http://tampermonkey.net/
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https*
// @match        http*
// @match        http://*
// @match        https://*
// @match        *.com/*
// @exclude      https://www.youtube.com/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @grant        none
// ==/UserScript==

let macroBody;
var cache = {};
console.log("Word Counter script running");
$(window).on("load", function() {
    console.log("WC window loaded");
    $("head").append(`<style>
                        .WCSpan {
                            display: none;
                            font-size: 6px;
                            background-color: brown;
                            width: 4px;
                            height: 4px;
                            padding: 2px;
                        }
                        .WCAlert {
                            position: fixed;
                            right: 0%;
                            bottom: 0%;
                            background-color: gray;
                            display: none;
                            z-index: 0;
                        }
                     </style>`);
    $("body").append("<div class='WCAlert'></div>");
    Array.prototype.forEach.call($("a"), function(el, i) {
        console.log("WC iterating over anchors");
        let newSpan = document.createElement("span");
        newSpan.classList.add("WCSpan");
        newSpan.innerText = "O";
        newSpan.title = "Get Word Count for " + el.href;
        el.after(newSpan);
        el.addEventListener("mouseenter", function(e) {
            $(".WCSpan")[i].style.display = "inline";
        });
        el.addEventListener("mouseleave", function(e) {
            setTimeout(function(){if ($("a:hover").length === 0 && $(".WCSpan:hover").length === 0) $(".WCSpan")[i].style.display = "none";}, 1200);
        });
        $(".WCSpan")[i].addEventListener("mouseleave", function(e) {
            setTimeout(function(){if ($("a:hover").length === 0 && $(".WCSpan:hover").length === 0) $(".WCSpan")[i].style.display = "none";}, 1200);
        });
        $(".WCSpan")[i].addEventListener("click", function(e) {
            console.log("WC in event listeners");
            if (cache[el.href]) {
                $(".WCAlert").css("display", "block");
                $(".WCAlert").css("z-index", "100000000");
                $(".WCAlert")[0].innerText = (`There are ${cache[el.href][0]} words in this link, with ${cache[el.href][1]} being the max.`);
                setTimeout(function(){$(".WCAlert").css("display", "none"); $(".WCAlert").css("z-index", "0");}, 3500);
            } else {
                $.ajax({
                    type: "GET",
                    url: el.href,
                    success: function(data) {
                        console.log("WC in success in ajax call");
                        // $.parseHTML(data) for that new array
                        var body = $(data).find("body").prevObject; // the body, because the head is irrelevant for word count, as an array of DOM nodes
                        macroBody = body;
                        console.log("WC body parsed", body);
                        let max = 0;
                        function recursiveWC(el, frame=0) { // regular HTML DOM nodes, not jQuery objects
                            console.log("WC at top of recursive function, frame is ", frame);
                            let wordCount = 0;

                            let HTML = el.innerHTML;
                            let text = el.innerText;
                            let localName = el.localName;

                            if (!HTML || !text || localName === "script" || localName === "style") {
                                console.log("WC stack frame terminating, frame is ", frame);
                                return 0;
                            }

                            if (HTML && text && HTML === text) { // if bottomed out; no more HTML to deal with
                                console.log("WC basecase hit", HTML, text.slice(0, 50));
                                let matches = text.match(/\S\s\S/g);
                                if (matches) {
                                    let words = matches.length;
                                    if (words > max) {
                                        max = words;
                                    }
                                    return words;
                                } else {
                                    return 0;
                                }
                            }

                            if (el.childNodes) {
                                if (el.childNodes.length > 0) {
                                    for (let i = 0; i < el.childNodes.length; i++) {
                                        wordCount += recursiveWC(el.childNodes[i], frame + 1);
                                    }
                                }
                            }
                            console.log("WC about to finally return out of recursive function at bottom, frame is ", frame);
                            return wordCount;
                        }
                        console.log("WC before reduce");
                        var finalWC = Array.prototype.reduce.call(body, function(acc, el, i) {
                            console.log("WC in reduce ", i);
                            return recursiveWC(el) + acc;
                        }, 0);
                        console.log("WC about to alert final WC, after reduce");
                        cache[el.href] = [finalWC, max];
                        $(".WCAlert").css("display", "block");
                        $(".WCAlert").css("z-index", "100000000");
                        $(".WCAlert")[0].innerText = (`There are ${cache[el.href][0]} words in this link, with ${cache[el.href][1]} being the max.`);
                        setTimeout(function(){$(".WCAlert").css("display", "none"); $(".WCAlert").css("z-index", "0");}, 3500);
                    },
                    error: function(data) {
                        console.log("WC There was an error in ajax call, perhaps a CORS issue.");
                    }
                });
            }
        });
    });
});



















