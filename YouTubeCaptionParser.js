// ==UserScript==
// @name         YouTube Caption Parser
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Parses and downloads user-friendly text of closed-caption tracks
// @author       You
// @match        https://www.youtube.com/watch?v=*
// @grant        none
// @require      https://code.jquery.com/jquery-3.3.1.js
// ==/UserScript==


$(window).on("load", function() {
    setTimeout(function() {
        console.log("running caption parser");
        var transSpan = document.createElement("span");
        $("#container > h1 > yt-formatted-string").after(transSpan);
        transSpan.innerText = "Click for English Transcript";
        transSpan.classList.add("YTCPSpan");
        $(".YTCPSpan").css("padding-left", "20px");
        $(".YTCPSpan").css("font-size", "10px");
        console.log("transSpan should be added now");
        transSpan.addEventListener("click", function(e) {
            console.log("adding event listener to trans span");
            transSpan.innerText = "Fetching...";
            var cap;
            $.ajax({
                type: "GET",
                url: "https://www.youtube.com/api/timedtext?lang=en&v=" + window.location.href.slice(32, 43),
                success: function(data) {
                    console.log("in success, no parsing yet, data is", data);
                    try {
                        transSpan.innerText = "Fetched!";
                        cap = data;
                        var ser = new XMLSerializer();
                        var formattedText = ser.serializeToString(cap).replace(/<\/text>/g, "\n").replace(/<[^>]+>/g, "").replace(/&amp;#39;/g, "'");
                        console.log("ran ajax call, about to alert or log");
                        console.log(formattedText);

                        //now to create an anchor element with the download, and then simulate a click so user doesn't need to click again
                        var downloadAnchor = document.createElement("a");
                        downloadAnchor.download = document.title + " English Subtitles.txt";
                        downloadAnchor.href = `data:application/csv;charset=utf-8,${encodeURI(formattedText)}`;
                        downloadAnchor.innerText = "download text";
                        $(transSpan).after(downloadAnchor);
                        downloadAnchor.style.display = "none";
                        $(downloadAnchor)[0].click();
                        downloadAnchor.remove();
                    } catch(e) {
                        console.log("in success, error caught");
                    }
                },
                error: function(data) {
                    console.log("in error, no such CC track");
                }
            });
        });
    }, 1000);
});

//changing css of transSpan only works after it has already been added to the DOM via the .after
//still need a setTimeout in the window.on("load")

//iron-dropdown paper-listbox paper-item paper-item-body in the YT native CC track transcripts are from something called Polymer Elements
//#transcript-loader on the first time is just an empty <ytd-transcript-loader> tag
//#transcript-loader has a non-empty div when activated after the first time, but the (almost) empty string is always there, perhaps an error on YT itself
//ytd-transcript-loader acts like a native HTML element
//getting rid of the "hidden" part via changing outerHTML does not simulate click or activity
//when polymer menu is in focus, scrolling is only for menu, can't scroll anything else until menu is closed

//paper-ripple on click (... in like/share menu) is another Polymer thing, seems to have the opacity of a gray circle around the element oscillate in and out once
//has a border-radius for the circle, and has the insides with background-color: rgb(0, 0, 0) for black, and has the opacity go between 0 and slightly < than 1 for 1 cycle

//tab index is normally -1 for the transcript tag, so unreachable by tabbing, although it's hidden anyways so not sure of the purpose
//when active, tab index is 0, meaning navigable via tag based on the order in the dom (not the obviously visual order on the page itself)
//if two tab indexes collide, order is given via the dom\

//element.focus() focuses on the current HTML element, element.blur() removes focus from that element, can also be .on focus and blur
//.focus() scrolls there on default, can be an object given with option, .focus(preventScroll: true), default is false
//the focus might not work so obviously with custom CSS
  //document.activeElement returns the current focus in the webpage

//with colors, any character that isn't valid hex (0-9, A-F) is turned into a 0, if string is longer than 6 characters, then it is split into 3 even subsections
  //any section being longer than 2 characters, because it's 0-99 (basically percent) for R, G, and B each, is truncated, with the end being ignored
  //then the three sections are put together into the #hexVal{6,}, with #RRGGBB being the general equation
  //color: #RRGGBB or color: rgb(0-255, 0-255, 0-255) - not sure why % in first and 256 in the second

//for downloading, with the goal being downloaded a parsed .txt file of the .srt data (or xml data coming from the YT API)
  //in HTML5, <a href=URL download="defaultFileName.ext">whatever text</a> should work out of the box, but seems to just link to regular file rather than prompt download
  //^ does work if done on the same website, probably a CORS issue - if fails due to domain-name restrictions, then just opens in the browser, needs right-click>download
  //any inapplicable characters in filename such as / get changed to _, probably just a chrome idiosyncrasy
  //even if this prompted download, it still relies on a link to a file, which can't yet exist without the script either uploading it or creating a temp file locally
  //if cookies can be created, would creating a cookie with the parsed data and then linking to that cookie .txt file be a work around?
  //<a download='fileName.txt' href='data:application/csv;charset=utf-8,{text as it appears, or encodeURI(text) to make it URL-friendly?}'>download</a>
  //^ above seems to work, not completely sure why, why is the data:application in the href, the charset (which seems needed, get network error without it)
    //and why the text after the comma, is it parsed in a remarkably specific way so that anything after the comma is put straight into the .txt file?
    //it looks a lot like the body of a get request, where the "body" is in the url, the way the "body" of the .txt file is in the href
    //if done without download='fileName.ext', it still downloads as a file called "download" with no extension, and the following warning is in the console
      //Resource interpreted as Document but transferred with MIME type application/csv: "data:application/csv;charset=utf-8,{whatever text}".
    //able to handle new lines and spaces, seems like the encodeURI(text) is done automatically anyways to change special characters to URL-based equivalents, and parse it
      //it back the other way when actually writing to the .txt file
  //still not clear on where exactly the file is before it is downloaded, or if it never exists on the local machine until the download - can it be opened in the browser
    //in any way without saving it via the prompt first?  there are add-ons where you can open files in the /temp/ folder before "officially" downloading something
      //and there is no download prompt for the file in the /temp/ folder
  //couldn't a virus be made with an .exe this way?
