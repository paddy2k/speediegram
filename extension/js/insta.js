var test = widget.preferences.callback;
var insta = {
  prefs : widget.preferences,
  photos:{},
  grid : function(photos){
    document.getElementById('frames').innerHTML='';
    for(var i=0;photos.length>i;i++){
      var url = photos[i].images.thumbnail.url;
      var img = document.createElement("IMG");
      img.className="grid";
      img.src = url;
      document.getElementById('frames').appendChild(img);
    }

    document.body.className='';
    opera.contexts.speeddial.title="OMG Muffins @ Cafe Bliss"; 
  },

  cron : function(){
    if(this.prefs.token=='undefined' || this.prefs.token==''){
      return false;
    }

    // Endpoint
    switch(insta.prefs.feed){
      default:
        var api_url = insta.prefs.apiEndpoint + insta.prefs.feedPath + insta.prefs.token; 
        break;
    }

    // Layout
    switch(insta.prefs.layout){
      case 'grid':
        insta.get(api_url, this.grid);
        break;
    }
    setTimeout(insta.cron, insta.prefs.updateInterval);
  },

  get : function(url, callback){
    var api = new XMLHttpRequest();
    api.open( 'GET', url, true );
    api.onreadystatechange=function(e){
      if(this.readyState===4){
        var feed = JSON.parse(this.response);
        callback(feed.data);
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

    // Set Loading text
    opera.contexts.speeddial.title="Loading...";
    opera.contexts.speeddial.url = this.authDialog;
    opera.extension.onmessage = insta.message;

    insta.cron();
  }
}
window.addEventListener("load", insta.init, false); insta