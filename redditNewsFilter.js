// ==UserScript==
// @name         reddit newsfixer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  remove news items from reddit
// @author       You
// @match        https://www.reddit.com/*
// @exclude      https://www.reddit.com/r/*/comments/*
// @grant        none
// @require      http://code.jquery.com/jquery-latest.js
// ==/UserScript==

const BAD_DOMAINS = ["salon.com", "buzzfeed.com", "dailymail.co", "breitbart.com", "infowars.com"];
const PARENT_DIV = document.getElementById("siteTable");
const NOTIFICATION_BAR = document.createElement("div");
const NOTIFICATION_TEXT = document.createElement("span");
const SPAN = document.createElement("span");
const INPUT = document.createElement('input');
let NUM_REMOVED = 0;

function setup() {
  PARENT_DIV.prepend(NOTIFICATION_BAR);
  SPAN.className = "tagline";
  SPAN.innerText = "Keywords to remove:";
  INPUT.className = "login-form";
  INPUT.placeholder = "Keyword to remove";
  INPUT.addEventListener('keydown', sweepPage);
  NOTIFICATION_BAR.appendChild(NOTIFICATION_TEXT);
  NOTIFICATION_BAR.appendChild(SPAN);
  NOTIFICATION_BAR.appendChild(INPUT);
  NOTIFICATION_BAR.type = 'text/css';
  NOTIFICATION_BAR.style = "display: block;position: relative;background-color: #FFEBEE;line-height: 37px;height: 37px;padding-left: 37px;margin: 5px 294px 5px 0px;border: 1px solid #EF5350;border-left: 0; border-right: 0;font-size: small;";
}

function updateNumRemoved() {
  NOTIFICATION_TEXT.innerText = `${NUM_REMOVED} elements removed.`;
}


function sweepPage(e) {
  if (e.key !== "Enter") {
    return;
  }
  const inputField = e.currentTarget;
  const stringToRemove = inputField.value;
  removeStringsFromPage([stringToRemove]);
}

function shouldRemove(badStrings, domNode) {
  return badStrings.some(badString => {
    return domNode.innerText.toLowerCase().includes(badString.toLowerCase());
  });
}

function removeStringsFromPage(strings) {
  $(".thing")
    .toArray()
    .filter(domNode => shouldRemove(strings, domNode))
    .forEach(domNode => {
      domNode.remove();
      NUM_REMOVED++;
    });
  updateNumRemoved();
}

(function() {
  'use strict';
  $(document).ready(function() {
    setup();
    removeStringsFromPage(BAD_DOMAINS);
  });
})();
