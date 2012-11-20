var test = widget.preferences.callback;
var insta = {
  prefs : widget.preferences,
  photos:{},
  grid : function(photos){
    document.getElementById('frames').innerHTML='';
    for(var i=0;insta.photos.length>i;i++){
      var url = insta.photos[i].images.thumbnail.url;
      var img = document.createElement("IMG");
      img.className="grid";
      img.src = url;
      document.getElementById('frames').appendChild(img);
    }

    document.body.className='';
    opera.contexts.speeddial.title="Speedie-gram"; 
  },

  cron : function(){
    // Endpoint
    switch(insta.prefs.feed){
      default:
        var api_url = insta.prefs.apiEndpoint + insta.prefs.feedPath + insta.prefs.token; 
        break;
    }

    // Layout
    switch(insta.prefs.layout){
      case 'grid':
        insta.get(api_url, insta.grid);
        setTimeout(insta.cron, insta.prefs.updateInterval);
        break;
      case 'stack':
        insta.interval = setInterval(function(){
          if(insta.photos.length){
            var photo = insta.photos.shift();
            // etc
          }
          else{
            insta.get(api_url, insta.stack);
          }
        });
        setTimeout(insta.cron, insta.prefs.updateInterval);
        break;
      case 'fade':
        insta.get(api_url, insta.fade);
        setTimeout(insta.cron, insta.prefs.updateInterval);
        break;
    }
  },

  get : function(url, callback){
    var api = new XMLHttpRequest();
    api.open( 'GET', url, true );
    api.onreadystatechange=function(e){
      if(this.readyState===4){
        var feed = JSON.parse(this.response);
        insta.photos = feed.data;
        callback(insta.photos);
      }
    }
    api.send(null);
  },

  message : function(e){
    var m = e.data;
    switch(m.action){
      case 'success':
        insta.prefs.token = m.access_token;
        insta.grid();
        break;
      case 'error':
        console.log('auth error');
        document.body.innerHTML = 'auth error';
        break;
    }
  },

  init : function(){
    insta.authDialog = insta.prefs.authEndpoint+
      '?client_id='+insta.prefs.clientId
      +'&redirect_uri='+insta.prefs.callback
      +'&response_type=token';

    opera.extension.onmessage = insta.message;

    if(insta.prefs.token=='undefined' || insta.prefs.token==''){
      opera.contexts.speeddial.title="Click to Login";
      opera.contexts.speeddial.url = insta.authDialog;
      return false;
    }

    // Set Loading text
    opera.contexts.speeddial.title="Loading...";
    opera.contexts.speeddial.url = insta.authDialog;

    insta.cron();
  }
}
window.addEventListener("load", insta.init, false); insta