// ==UserScript==
// @name         marginfixerheavy
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://*/*.txt
// @match        https://*/*.txt
// @match        *.txt
// @match        http*.txt
// @match        https*.txt
// @grant        none
// @require http://code.jquery.com/jquery-latest.js
// ==/UserScript==

// settings
const FONT = "Lato";
const TURN_ON_FONT = true;

// constants
const LINEBREAK = "\n";
const LINEBREAK2X = LINEBREAK + LINEBREAK;
const EL = "pre";

function fixMargins(body) {
  const arrayOfParagraphs = body.split(LINEBREAK2X);
  const arrayOfFixedParagraphs = arrayOfParagraphs.map(el => el.split(LINEBREAK).join(" "));
  return arrayOfFixedParagraphs.join(LINEBREAK2X);
}

const oldText = document.querySelector(EL).innerText;
document.querySelector(EL).innerText = fixMargins(oldText);

if (TURN_ON_FONT) {
  document.querySelector(EL).style.fontFamily = FONT + ",monospace";

  var link = document.createElement('link');
  link.href = ('https:' == document.location.protocol
    ? 'https'
    : 'http') + '://fonts.googleapis.com/css?family=' + FONT;
  link.rel = 'stylesheet';
  document.querySelector("body").appendChild(link);
}
