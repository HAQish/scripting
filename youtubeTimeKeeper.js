setInterval(function(){window.history.replaceState({}, "",
  window.location.href.slice(0, 43)
  + "&t=" 
  + Math.floor(document.querySelector("#movie_player").getCurrentTime() / 60 / 60 % 60) 
  + "h" 
  + Math.floor(document.querySelector("#movie_player").getCurrentTime() / 60 % 60) 
  + "m" 
  + Math.floor(document.querySelector("#movie_player").getCurrentTime() % 60) 
  + "s")}, 1000);
