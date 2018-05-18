// ==UserScript==
// @name         YT Time redux 7
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.youtube.com/watch?v*
// @grant        none
// ==/UserScript==

setInterval(function(){window.history.replaceState({}, "",
  window.location.href.slice(0, 43)
  + "&t=" 
  + Math.floor(document.querySelector("#movie_player").getCurrentTime() / 60 / 60 % 60) 
  + "h" 
  + Math.floor(document.querySelector("#movie_player").getCurrentTime() / 60 % 60) 
  + "m" 
  + Math.floor(document.querySelector("#movie_player").getCurrentTime() % 60) 
  + "s")}
, 1000);
