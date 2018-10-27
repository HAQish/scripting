// ==UserScript==
// @name         Coursera Video Fixer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Watch Coursera videos without interruption when not registered as a student
// @author       You
// @match        https://www.coursera.org/lecture/*
// ==/UserScript==

//tends to pop up in the exact middle of the video

//adding jQuery manually because grant isn't working
let scriptTag = document.createElement("script");
scriptTag.src = "https://code.jquery.com/jquery-3.3.1.min.js";
document.querySelector("head").appendChild(scriptTag);

setInterval(function() {
  if ($(".rc-Modal").length > 0) {
      //remove modal
      $(".rc-Modal")[0].remove();

      //trigger play button
      $(".vjs-play-control").trigger("click");
  }
}, 1500);
