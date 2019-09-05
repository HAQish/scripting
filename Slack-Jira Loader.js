// ==UserScript==
// @name         Slack-Jira Loader
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Load relevant data of JIRA tickets and construct useful anchors
// @author       Habib Qureshi
// @match        https://app.slack.com/client/*
// @grant        none
// ==/UserScript==

//example ticket link https://genomemedical.atlassian.net/browse/EHR-2645

let timer = setInterval(isReadyCheck, 1000);

function isReadyCheck () {
  if (document.querySelector(".c-virtual_list__scroll_container")) {
    if (document.querySelector(".c-virtual_list__scroll_container").children.length > 0) {
      setTimeout(observerSetupAndInitial, 2500);
      clearInterval(timer);
    }
  }
}

function observerSetupAndInitial() {
  messageParser();
  observerSetup();
}

function observerSetup() {
  let messageList = document.querySelector(".c-virtual_list__scroll_container");
  const observer = new MutationObserver(messageParser);
  observer.observe(messageList, {childList: true});
}

function messageParser() {
  Array.from(document.querySelectorAll(".c-message__body")).forEach(messageNode => {
    let matches = messageNode.innerHTML.match(/([A-Z]{2,4}-\d{3,4})(?!<\/span>|"|\S*<\/a>|\S+" rel="|\d)/g);
    if (matches) {
        let uniqueMatches = Array.from(new Set(matches));
        uniqueMatches.forEach(str => {
        let newRegEx = new RegExp(str, "g");
        messageNode.innerHTML = messageNode.innerHTML.replace(newRegEx, `<span><a href="https://genomemedical.atlassian.net/browse/${str}">${str}</a></span>`);
      });
    }
  });
}

//as per CORS policy on JIRA, the proposed get request won't work - may have to use a headerless browser tab or iframe in the background to do it
