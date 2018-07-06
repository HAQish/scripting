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
