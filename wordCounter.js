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
console.log("Word Counter script running");
$(window).on("load", function() {
    console.log("WC window loaded");
    Array.prototype.forEach.call($("a"), function(el) {
        console.log("WC iterating over anchors");
        el.addEventListener("mouseenter", function(e) {
            console.log("WC in event listeners");
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

                        //let parsed = $.parseHTML(HTML); // an array of dom nodes
                        //if (parsed) {
                        //    for (let i = 0; i < parsed.length; i++) {
                        //        wordCount += recursiveWC(parsed[i], frame + 1);
                        //    }
                        //}
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
                    alert(`There are ${finalWC} words in this link, with ${max} being the max.`);
                },
                error: function(data) {
                    console.log("WC There was an error in ajax call, perhaps a CORS issue.");
                }
            });
        });
    });
});



















