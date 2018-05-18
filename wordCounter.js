// ==UserScript==
// @name         Word Counter Redux
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https*
// @match        http*
// @match        http://*
// @match        https://*
// @match        *.com/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @grant        none
// ==/UserScript==

$(window).on("load", function() {
    Array.prototype.forEach.call($("a"), function(el) {
        el.addEventListener("mouseenter", function(e) {
            $.ajax({
                type: "GET",
                url: el.href,
                success: function(data) {
                    let count = $.parseHTML(data);
                    let str = "";
                    count.forEach(el => str += el.innerText);
                    str = str.replace(/{[^}]+}/g);
                    let numWords = str.match(/\S\s\S/g).length;
                    console.log(numWords + " words in the link.");
                }
            })
        })
    })
})
