// ==UserScript==
// @name         Instagram Mass Unfollow
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Unfollow many people with a click
// @author       You
// @match        https://www.instagram.com/*
// @require      https://code.jquery.com/jquery-3.3.1.js
// @grant        none
// ==/UserScript==

//if, on profile page
  //if profile name text on page matches profile parameter in url, then currently on profile page
  //a SPA so will have to do the check once load has been done, or after a click - some kind of event, or on any mutation observed
  //sometimes loading bar appears, but sometimes app seems fast enough to where it never appears - need to find out if it always appears
  //loading bar appears more right after a 'hard GET' - implies that certain pages are maybe cached in app when loaded
    //seeing as it's a SPA, different html files as webpages wouldn't be cached - does the browser also cache SPA components when loaded?
    //if not, there could be something in code that caches what certain elements are when loaded, like I do in the YDL object store

//loading bar
  //difficult to single out, tried to make something load and then do control+command+c to target it
  //goes away as soon as it loads, and the loading of new elements makes the DOM reset, so highlighting that dom element is cancelled once the new elements load
  //debugger worked, now can target the two classes of the span that is the loader bar
    //it is a screen-width rectangle with a rainbow animation of changing colors
    //still hangs a little bit when at maximum screen-width, implying that it's done loading before it actually loads
      //the disconnect might be that the progress bar is on the request being done, and the time between being full-width and the actual loading
        //is the data in memory being parsed and inserted into the react code before being loaded into memory as an HTML page
        //that would imply the progress bar is on the download status of the "file" of the code returned from the IG database
        //that implies that any download means the browser is first sent the filename (implied in the url or in the download HTML5 code) and the size
          //although, there is the occasional file where the length of the file isn't clear until it is completely downloaded
          //it's possible that the








//a for loop with ~billion calculations normally functions as ~1 second timeout, but in a long list completely freezes the tab, because there is always some kind of
  //calculation until the loop has completely finished, implying that there is no RAM leftover, even though chrome is multi-threaded
  //above implies that chrome is multi-threaded only for the sake of having multiple tabs, but each tab is its own thread, meaning each tab has its own JS engine running?
  //furthermore, is every tab a single-threaded process, and chrome itself just managing these different applications in one gui? (not a shell, shell is command line)
  //each tab, and therefore each script being applied to a tab, can only do one operation at a time, but what about a chrome extension that affects multiple tabs or the browser itself?

//rather than navigating promises and timeouts or a for loop, adding everything immediately to the event loop, but staggering the time to execute

//add a text input to create a list of people to ignore on the mass unfollow

//perhaps also add a capability to follow everyone on the page - click all applicable follow buttons, which is one click, while unfollowing requires two

//timed out in following in one tab, but able to unfollow normally in another tab, meaning it does not reject all requests from an IP, perhaps just specifically follow or
  //unfollow requests, meaning it keeps track of how many of each kind of request, and times out that specific request per IP?
  //tab doesn't matter, unfollowing in a separate tab works normally, but following that user back gives a 403

//in the network tab, why do you need preview AND response? they are usually the same
//is there a way to figure out the flood limit without brute forcing it while paying close attention?

//the assumption is that the timeouts are only for automated tasks, because you assume scripts, programs, AIs, bots, etc. are potentially malicious
  //but any task that can be mechanically done by a human should not time out
  //not the case for instagram, manually clicking follow/unfollow can still time you out, without any visible warning

//signed up on instagram this morning, had a bot contact me via google talk ~12 hours later
//considering I have never gotten a bot on google talk or google hangouts, haven't gotten a bot on any chat service at all in several years
  //and that I signed up in instagram with my gmail account (not OAuth)
  //it can be concluded with 99%+ certainty that google sold my gmail account information to instagram, which sold my information to someone else, etc.
  //somewhere down the chain of backroom deals, someone who sends out bots to people gained access to that information, meaning it's not just traditional merchants for ads
  //I don't think I mentioned that I am a young man anywhere on my dummy IG account, google may know that I'm male, so maybe that's why I was targeted (webcam girl bot)
  //it might just be sending to anyone, even older women that don't speak english
  //perhaps the ~12 hour delay is because that's how long it took for the data to exchange hands and for the bot to send the message
  //clearly not much control or vetting when it comes to who is sold information, perhaps meaning IG itself isn't very professionally run, given their unscrupulous clients

//bad UI, buttons in header bar have no tooltip, not clear what they are or what they do, and signout is apparently not in the header bar, which is confusing
//on login page, "operator" is a suggested entry for the username field, despite me never using it, may be some IG joke that I don't get
//the dropdown size is mismatched with the text field (so is the contextual highlighting), and there are some weird overlay issues
//'temporarily disable my account' in account page doesn't change with width changing due to console being open (although it seems everything else does)

//in the post requests sent to the server when changing profile settings, there is a user ID given in the post request headers, not the username
  //is it necessary to use IDs made by the app or the backend?  should usernames themselves not matter if they are visible in requests?
  //furthermore, why have that data in the request headers? the bodies are more secure, so shouldn't any potentially identifiable information go in the body where it is hidden?
  //is it logged in the history, from the browser, router, or ISP, if it is in the request headers vs. if in the request body?  does http vs https matter in that case?
  //my impression was that https was to increase the safety of data sent over the wire in real time via encryption, but does not affect anything that is logged

//could not a script be written to change all anchors so that the visible text in the tags is the same, but the href routes to a third party service that monetizes clicks?

//when switching to a tab that has been open for a while, it is sometimes blank for a second, and there is a flood of requests in the network tab
  //the above implies that chrome or the IG app forgets the current data after a certain amount of time, and then loads when detecting a "tab switch" event?
  //or it detects you are looking at the tab for the first time in a while, and does a SPA-style reload of everything?
  //does that mean that just a web app itself can tell what tab you are looking at?
//similarly, whenever you switch to a tab, a POST request is made to https://graph.instagram.com/logging_client_events - this is not only after a long time, but every time
  //each time, the response is an object with empty key value pairs, not sure of the purpose of the response if it's empty
  //in the network tab, for the headers tab, it's "general", meaning data about the request, and then "response headers", then "request headers", then "form data"
  //that seems a bit out of order - should be all request stuff first and then response
  //shouldn't "form data" only be in the headers tab for get requests?  the body in post requests are separate, so they aren't in the headers
  //why do the response headers not contain some kind of location, url, or IP?  they still need a destination, shouldn't that information be there?
  //it seems that the posted data is tracking how much time the client is spending, presumably how much time on each feature of the site
  //if it's collecting usage data, why does it post the data on the tab switching?  why not just in intervals?
  //the posted object has app id, user id, session id, tos id (i think time on site id) and device id - are all of these different ids necessary?
    //^^ why does "app id" matter, and what does it even mean?  it's not app version number, because that is a different key value pair
    //a "serial" number to the app doesn't make sense, it's not a distributed product like a cd, it's a single resource that everyone connects to
    //after a hard reload, all of the ids are the same - shouldn't at least some of them change?  or perhaps it can't tell the difference between a hard load and a SPA load?
      //after a couple of loads and some time, only the session_id changed - it seems to refresh the session id on a timer or after a certain number of requests
    //would it be able to tell session as in closing all relevant tabs and opening a new tab?  if so, it would have to send a request to the IG back end
      //in between the click of the tab to close it and it actually being eradicated from memory - like a react unmounting event, although not sure if that works on close
      //would it also work on force quit?  it shouldn't be possible, in that force quit ends the program in the middle of code execution, which is why it's dangerous
  //what is the difference between the session id and the access token in the same form data?  is there a difference between a "session id" and a "session token"?
  //the posted data has "referrer", which is the current IG url, and "original referrer", google
    //i did GS instagram and follow the link, but at the point with the network tab open, I was several links deep into IG itself
    //is that because IG is a SPA, and so the history is somewhat artifically made, meaning they can go back to a "real" history object and see that was the referrer?
    //is it not a security concern if external websites and apps can see into your history or alter it?
    //plenty of sites about domestic violence have an "escape" function where it takes you to a neutral site and removes the DV site from the history and the back button
    //similarly, can it alter history?  it could plant 'false' history on someone's computer and frame him for whatever violation - however, if there is no real HTTP/HTTPS
      //request, would that still be logged by the router?  if so, do the DV sites fail to clear the history from the router or ISP?
  //the expiration date in the response headers is set to 2000 - what does the expiration date matter if it can come already expired?
  //there are things in each of these kinds of requests with references to facebook - facebook api version, x-fb-debug, which apparently the ID of the specific request
    //that you can use to file a bug report to facebook itself
  //does this mean instagram has been acquired by facebook?
  //when looking at the first logging event request after a hard load, there is much more data
    //"dns":38,"connect":56,"request":269,"response":15,"network":434,"domInteractive":1067,"domContentLoaded":1069,"domComplete":1431,"loadEvent":1434,
    //"displayDone":1539,"timeToInteractive":1539,"firstPaint":1562,"firstContentfulPaint":1562,"reactReady":1031,"reactRender":33
    //is this all telling the time in milliseconds for each task, and if perhaps some tasks go over a threshold, to set somewhere in the cookies to use a different server?
      //think that this is not the case, because the url posted to for these logs is always the same, https://graph.instagram.com/logging_client_events
  //the tos, assuming time on site, has a few different counters such as "tos_seq":9,"tos_cum":10 and "seq":6 that are staggered in number, but ++ with every tab switch
  //because that is the posted data, does that mean the front end code has a counter and it sends that current counter with these client logging events to see
    //how often clients switch back to their tab?  why the staggered numbers?
  //is this paired with the current time given on these post requests to see what makes people switch back the most frequently i.e. what feature is the most addictive?
    //would make sense, although it seems any data conveying which feature of the site they are on is missing - are they gathering that data from the referrer URL?
  //they can't get information on what they are doing before they switch back to IG, or is there a way to gather even that data as well?

//looking closer at the network requests that come automatically on tab switch (not the logging events), this is the preview of those requests via the network tab

/*
(function injected(eventName, injectedIntoContentWindow)
{
  let checkRequest;

   *
   * Frame context wrapper
   *
   * For some edge-cases Chrome will not run content scripts inside of frames.
   * Website have started to abuse this fact to access unwrapped APIs via a
   * frame's contentWindow (#4586, 5207). Therefore until Chrome runs content
   * scripts consistently for all frames we must take care to (re)inject our
   * wrappers when the contentWindow is accessed.
   *
  let injectedToString = Function.prototype.toString.bind(injected);
  let injectedFrames = new WeakSet();
  let injectedFramesAdd = WeakSet.prototype.add.bind(injectedFrames);
  let injectedFramesHas = WeakSet.prototype.has.bind(injectedFrames);

  function injectIntoContentWindow(contentWindow)
  {
    if (contentWindow && !injectedFramesHas(contentWindow))
    {
      injectedFramesAdd(contentWindow);
      try
      {
        contentWindow[eventName] = checkRequest;
        contentWindow.eval(
          "(" + injectedToString() + ")('" + eventName + "', true);"
        );
        delete contentWindow[eventName];
      }
      catch (e) {}
    }
  }

  for (let element of [HTMLFrameElement, HTMLIFrameElement, HTMLObjectElement])
  {
    let contentDocumentDesc = Object.getOwnPropertyDescriptor(
      element.prototype, "contentDocument"
    );
    let contentWindowDesc = Object.getOwnPropertyDescriptor(
      element.prototype, "contentWindow"
    );

    // Apparently in HTMLObjectElement.prototype.contentWindow does not exist
    // in older versions of Chrome such as 42.
    if (!contentWindowDesc)
      continue;

    let getContentDocument = Function.prototype.call.bind(
      contentDocumentDesc.get
    );
    let getContentWindow = Function.prototype.call.bind(
      contentWindowDesc.get
    );

    contentWindowDesc.get = function()
    {
      let contentWindow = getContentWindow(this);
      injectIntoContentWindow(contentWindow);
      return contentWindow;
    };
    contentDocumentDesc.get = function()
    {
      injectIntoContentWindow(getContentWindow(this));
      return getContentDocument(this);
    };
    Object.defineProperty(element.prototype, "contentWindow",
                          contentWindowDesc);
    Object.defineProperty(element.prototype, "contentDocument",
                          contentDocumentDesc);
  }

   *
   * Shadow root getter wrapper
   *
   * After creating our shadowRoot we must wrap the getter to prevent the
   * website from accessing it (#4191, #4298). This is required as a
   * workaround for the lack of user style support in Chrome.
   * See https://bugs.chromium.org/p/chromium/issues/detail?id=632009&desc=2
   *
  if ("shadowRoot" in Element.prototype)
  {
    let ourShadowRoot = document.documentElement.shadowRoot;
    if (ourShadowRoot)
    {
      let desc = Object.getOwnPropertyDescriptor(Element.prototype,
                                                 "shadowRoot");
      let shadowRoot = Function.prototype.call.bind(desc.get);

      Object.defineProperty(Element.prototype, "shadowRoot", {
        configurable: true, enumerable: true, get()
        {
          let thisShadow = shadowRoot(this);
          return thisShadow == ourShadowRoot ? null : thisShadow;
        }
      });
    }
  }

   *
   * RTCPeerConnection wrapper
   *
   * The webRequest API in Chrome does not yet allow the blocking of
   * WebRTC connections.
   * See https://bugs.chromium.org/p/chromium/issues/detail?id=707683
   *
  let RealCustomEvent = window.CustomEvent;

  // If we've been injected into a frame via contentWindow then we can simply
  // grab the copy of checkRequest left for us by the parent document. Otherwise
  // we need to set it up now, along with the event handling functions.
  if (injectedIntoContentWindow)
    checkRequest = window[eventName];
  else
  {
    let addEventListener = document.addEventListener.bind(document);
    let dispatchEvent = document.dispatchEvent.bind(document);
    let removeEventListener = document.removeEventListener.bind(document);
    checkRequest = (url, callback) =>
    {
      let incomingEventName = eventName + "-" + url;

      function listener(event)
      {
        callback(event.detail);
        removeEventListener(incomingEventName, listener);
      }
      addEventListener(incomingEventName, listener);

      dispatchEvent(new RealCustomEvent(eventName, {detail: {url}}));
    };
  }

  // Only to be called before the page's code, not hardened.
  function copyProperties(src, dest, properties)
  {
    for (let name of properties)
    {
      if (src.hasOwnProperty(name))
      {
        Object.defineProperty(dest, name,
                              Object.getOwnPropertyDescriptor(src, name));
      }
    }
  }

  let RealRTCPeerConnection = window.RTCPeerConnection ||
                              window.webkitRTCPeerConnection;

  // Firefox has the option (media.peerconnection.enabled) to disable WebRTC
  // in which case RealRTCPeerConnection is undefined.
  if (typeof RealRTCPeerConnection != "undefined")
  {
    let closeRTCPeerConnection = Function.prototype.call.bind(
      RealRTCPeerConnection.prototype.close
    );
    let RealArray = Array;
    let RealString = String;
    let {create: createObject, defineProperty} = Object;

    let normalizeUrl = url =>
    {
      if (typeof url != "undefined")
        return RealString(url);
    };

    let safeCopyArray = (originalArray, transform) =>
    {
      if (originalArray == null || typeof originalArray != "object")
        return originalArray;

      let safeArray = RealArray(originalArray.length);
      for (let i = 0; i < safeArray.length; i++)
      {
        defineProperty(safeArray, i, {
          configurable: false, enumerable: false, writable: false,
          value: transform(originalArray[i])
        });
      }
      defineProperty(safeArray, "length", {
        configurable: false, enumerable: false, writable: false,
        value: safeArray.length
      });
      return safeArray;
    };

    // It would be much easier to use the .getConfiguration method to obtain
    // the normalized and safe configuration from the RTCPeerConnection
    // instance. Unfortunately its not implemented as of Chrome unstable 59.
    // See https://www.chromestatus.com/feature/5271355306016768
    let protectConfiguration = configuration =>
    {
      if (configuration == null || typeof configuration != "object")
        return configuration;

      let iceServers = safeCopyArray(
        configuration.iceServers,
        iceServer =>
        {
          let {url, urls} = iceServer;

          // RTCPeerConnection doesn't iterate through pseudo Arrays of urls.
          if (typeof urls != "undefined" && !(urls instanceof RealArray))
            urls = [urls];

          return createObject(iceServer, {
            url: {
              configurable: false, enumerable: false, writable: false,
              value: normalizeUrl(url)
            },
            urls: {
              configurable: false, enumerable: false, writable: false,
              value: safeCopyArray(urls, normalizeUrl)
            }
          });
        }
      );

      return createObject(configuration, {
        iceServers: {
          configurable: false, enumerable: false, writable: false,
          value: iceServers
        }
      });
    };

    let checkUrl = (peerconnection, url) =>
    {
      checkRequest(url, blocked =>
      {
        if (blocked)
        {
          // Calling .close() throws if already closed.
          try
          {
            closeRTCPeerConnection(peerconnection);
          }
          catch (e) {}
        }
      });
    };

    let checkConfiguration = (peerconnection, configuration) =>
    {
      if (configuration && configuration.iceServers)
      {
        for (let i = 0; i < configuration.iceServers.length; i++)
        {
          let iceServer = configuration.iceServers[i];
          if (iceServer)
          {
            if (iceServer.url)
              checkUrl(peerconnection, iceServer.url);

            if (iceServer.urls)
            {
              for (let j = 0; j < iceServer.urls.length; j++)
                checkUrl(peerconnection, iceServer.urls[j]);
            }
          }
        }
      }
    };

    // Chrome unstable (tested with 59) has already implemented
    // setConfiguration, so we need to wrap that if it exists too.
    // https://www.chromestatus.com/feature/5596193748942848
    if (RealRTCPeerConnection.prototype.setConfiguration)
    {
      let realSetConfiguration = Function.prototype.call.bind(
        RealRTCPeerConnection.prototype.setConfiguration
      );

      RealRTCPeerConnection.prototype.setConfiguration = function(configuration)
      {
        configuration = protectConfiguration(configuration);

        // Call the real method first, so that validates the configuration for
        // us. Also we might as well since checkRequest is asynchronous anyway.
        realSetConfiguration(this, configuration);
        checkConfiguration(this, configuration);
      };
    }

    let WrappedRTCPeerConnection = function(...args)
    {
      if (!(this instanceof WrappedRTCPeerConnection))
        return RealRTCPeerConnection();

      let configuration = protectConfiguration(args[0]);

      // Since the old webkitRTCPeerConnection constructor takes an optional
      // second argument we need to take care to pass that through. Necessary
      // for older versions of Chrome such as 49.
      let constraints = undefined;
      if (args.length > 1)
        constraints = args[1];

      let peerconnection = new RealRTCPeerConnection(configuration,
                                                     constraints);
      checkConfiguration(peerconnection, configuration);
      return peerconnection;
    };

    WrappedRTCPeerConnection.prototype = RealRTCPeerConnection.prototype;

    let boundWrappedRTCPeerConnection = WrappedRTCPeerConnection.bind();
    copyProperties(RealRTCPeerConnection, boundWrappedRTCPeerConnection,
                   ["generateCertificate", "name", "prototype"]);
    RealRTCPeerConnection.prototype.constructor = boundWrappedRTCPeerConnection;

    if ("RTCPeerConnection" in window)
      window.RTCPeerConnection = boundWrappedRTCPeerConnection;
    if ("webkitRTCPeerConnection" in window)
      window.webkitRTCPeerConnection = boundWrappedRTCPeerConnection;
  }
})('abp-request-ka96z3sihkp');
*/
//end of the code in the network request



//different ways to add event listeners for right click
//select the target node, likely the body, and listen for the mousedown event with e.button === 2 for right click (1 for middle click and 0 for left click)
//select node, listen for contextmenu event, listening for the opening of the context menu specifically
//window.oncontextmenu = function(e) {whateverFunctionCode} <== not sure why this exists, should be the exact same as the above
  //there are window.events for almost, if not all, events - i guess it's for any event in that tab, rather than necessarily the body specifically, although not sure
    //what the difference would be, the right click handler doesn't work outside of the body in that it doesn't work in the console or other menus anywhere


//in the window object, under clientInformation
  //appCodeName:"Mozilla", appName:"Netscape", appVersion:"5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36"
  //why Mozilla, chrome is not made by Mozilla - and why netscape, chrome is separate
  //appVersion is OS version probably - if the app can tell the OS version of the client, why do websites make you choose your own OS when downloading?
  //presumably, because this is all on window, the website can access it - after all, it can access window.localStorage, which is on the client
    //that localStorage object only applies to the IG domain, so is the window calculated for each tab by chrome and always accessible to the website?

//running window.clearInterval() and window.clearTimeout() does not get rid of the automatic event logging and post requests - can chrome not control its own event loop?

//if an iframe is like another document in the same tab, is that tab with 2 documents still single-threaded?  does the iframe have access to the window?
  //if the iframe has access to the window because it's a single thread, that would mean the src of the iframe could read personal data meant for another website
  //so, it seems unlikely that it would be the case - so, loading an iframe must mean the tab now has two threads, meaning chrome allocates more memory for that tab
  //apparently, the iframe context can access the higher-level window with window.parent, referencing the original window object - however, that is an "attenuated" object
    //it probably takes the real window object and filters out personal information (client information and localStorage is gone) before returning the object for access
    //doing window.parent.window doesn't go any "higher", it just recursively returns itself like the regular window.window when at the highest level
    //so, the iframe can not access the real top-level window - if so, doesn't that mean it's subject to garbage collection?
      //garbage collection - on an interval, deleting any var objects (all vars are objects in JS) that don't have another object referencing that object in a key or value
      //^^ above is defunct, now the way is to recursively go down the tree of the macro-level window and see if the variable in question ever appears
        //although, if not in the window object, the JS engine cannot simply do delete obj.value, there must be some hidden way to delete values
    //given that the iframe only has certain things on the window object, taken from the higher window object, the iframe is necessarily less functional
      //so, any app in an iframe would be very limited in functionality?
      //still, given that some things go from the higher window to the iframe window, the iframe has access to things outside of itself, while the higher window has no access?

//window.close() seems to want to close the window, but chrome gives a warning that `Scripts may close only the windows that were opened by it.`

//htmlElement.webkitRequestFullScreen() is a function that immediately (it's possible that sometimes there is a prompt) makes that element the only element visible
  //that element remains in the viewport, at the same size, and everything else is black
    //no scrolling, even if element is larger than viewport - can highlight, and copy text, still contextual mouseover events like mousing over anchors
      //the swipe-left gesture makes the back arrow appear, but both that and command+left don't actually change the page
      //perhaps most curious of all, it seems to be stuck on the center of the document, no matter where you were scrolled before firing the event
        //however, you are returned to your original scroll position when you exit the fullscreen viewing mode via escape
  //not sure why it exists for every possible element, but works on HTML elements, <svg>, <iframe>, and <math> elements
  //must be invoked by the user or a "device orientation change", does that mean a change in the monitor settings, or landscape/portrait orientation in tablets and phones?
  //i figured the browsers in tablets and phones were very different, and orientation changes were meant for those devices, and not for PCs/laptops
  //however, sometimes the mobile version of a site is activated just when it detects a certain screen size or aspect ratio
  //given that, as above on the clientInformation on the window object, the app can determine the device and OS, would the front end not always know to use the mobile app?
  //even if the screen orientation changed, there's no reason for it to be inherently different from resizing the window by dragging the mouse cursor
    //so why is it a different event? it should still resize to the width of the viewport (if responsive a la PWA style) and move frames around
      //usually managing the width is more important than managing the height
  //the fullscreen function is asynchronous - it's not necessarily a read or write, it's just a resizing or re-rendering of the content, so why does it need the event loop?


//considering that a .css file is a separate file, from the perspective of an app with just one html file, wouldn't it be faster to have all styling in one style object
  //at the top of the html document to minimize the file system-based reading?

//when intending to open a link in a new window/tab (i think new tab is meaningless to JS itself, the browser decides to interpret 'new window' as 'new tab')
  //<base target="_blank"> needs to go before the anchor - without the underscore, it does not work
    //the <base> tag is just to set the base for any relative URLs, so setting the implied domain in relative (/feature/) URLs, only 1 per document, preferrably in head
  //or just target="_blank" in the anchor tag itself - needs double quotes rather than single quotes, not sure why it matters
  //also _parent for the parent frame and _self for the current frame and _top for the 'full body of the window'
  //when trying to do target="_self" in an iframe and clicking, the href page did not load in the iframe
    //i suspected that you could use an iframe as a mini-browser within the tab itself, but trying to go from an iframe to google just cleared the body of the iframe
  //couldn't a malicious script open an absurd number of tabs by adding an invisible anchor with a _blank target, and on an interval, opening 100 tabs through
    //targeting the invisible anchor element and triggering .click()?
    //apparently not, it's giving some error, although it's not logging it, not sure how to see exactly what the error is, but probably a browser feature to prevent it
    //gives same error if trying to trigger the click in another event listener, like clicking on the dom opens the new tab
    //^^ nevermind above, apparently the %0 selector doesn't work as well in some functions
    //when selecting the invisible anchor normally, it opened one tab, and all of the other ones on the dom body click were treated as popups blocked by chrome
    //it seems to do the same with timeouts and intervals, it seems to allow a maximum of one to be opened as the result of a function call and anything else is a popup
    //is there some way to jerryrig a way to open multiple tabs through some chaining of functions?
    //if you can somehow send some code "into" that new tab, then could a malicious script use that method?  line 469 of this document suggests that is possible

//just noticed this after a typo, but you can document.createElement("anything") and it will create a proper-looking <anything></anything> tag - why if potentially invalid?
  //that's probably a feature to allow different front-end libraries to create new kinds of tags specific for that library

//in query selectors, an example - document.querySelectorAll("button[title]") selects all button with the attribute (or attr) of title
  //it seems that even though [attr='value'] works, it does not work unless it's something that is custom-set
    //buttons already have an innerText property - accessing it through this method, however, doesn't work
      //leading to the conclusion that perhaps attribute specifically means something custom set by the user or a function written by someone
  //"button:contains('textOfButton')" is a jQuery thing, not a native HTML thing







