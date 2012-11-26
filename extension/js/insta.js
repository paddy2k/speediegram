var test = widget.preferences.callback;
var insta = {
  prefs : widget.preferences,
  photos:[],
  grid : function(photos, page){
    if(page == 2){
      document.getElementById('frames').innerHTML='';
      insta.photos=[];
    }
    for(var i=0;photos.length>i;i++){
      var url = photos[i].images.thumbnail.url;
      var img = document.createElement("IMG");
      img.className="grid";
      img.src = url;
      document.getElementById('frames').appendChild(img);
      insta.photos.push(photos[i]);
    }

    document.body.removeAttribute('class');
    opera.contexts.speeddial.title="Speedie-gram";
    opera.contexts.speeddial.url=insta.photos[0].link;
  },

  stack : function(){
    clearTimeout(insta.timeout);
    if(insta.photos.length>2){
      var photo = insta.photos.shift();
      var rotate  = (90*Math.random())-45;
      var tranX   = (56 *Math.random())-28;
      var tranY   = (20 *Math.random())-10;
      
      var url = photo.images.low_resolution.url;
      var img = document.createElement("IMG");
      img.className="stack stackHidden";
      img.src = url;
      img.style.transform="scale(1, 1) rotate("+rotate+"deg) translate("+tranX+"%, "+tranY+"%)";
      var image = document.getElementById('frames').appendChild(img).classList;
      setTimeout(function(){image.remove('stackHidden')}, 0);
      
      document.body.removeAttribute('class');
      opera.contexts.speeddial.title = photo.caption ? photo.caption.text : photo.user.username;
      opera.contexts.speeddial.url = photo.link;
    }
    else{
      insta.cron();
    }
    insta.timeout = setTimeout(insta.stack, insta.prefs.stackInterval);
  },

  prepStack : function(photos){
    insta.photos=[];
    for(var i=0;photos.length>i;i++){
      insta.photos.push(photos[i]);
    }

    while(document.getElementById('frames').getElementsByClassName('grid').length){
     document.getElementById('frames').removeChild(document.getElementById('frames').getElementsByClassName('grid')[0]);
    }

    while(document.getElementById('frames').getElementsByClassName('stack').length>10){
     document.getElementById('frames').removeChild(document.getElementById('frames').getElementsByClassName('stack')[0]);
    }

    insta.stack();
  },

  cron : function(){
    clearTimeout(insta.timeout);
    var api_url = '';
    // Endpoint
    switch(insta.prefs.feed){
      case 'tags':
        api_url = "tags/"+insta.prefs.searchTag+"/media/recent?"; 
        break;
      case 'popular':
        api_url = "media/popular?";
        break;
      case 'geo':
        api_url = "media/search?lat=48.858844&lng=2.294351&"; 
        break;
      case 'me':
      default:
        api_url = "users/self/feed?"; 
        break;
    }
    api_url = insta.prefs.apiEndpoint + api_url + 'access_token=' + insta.prefs.token;
    
    // Layout
    switch(insta.prefs.layout){
      case 'grid':
        insta.get(api_url, insta.grid, 2);
        break;
      case 'stack':
        insta.get(api_url, insta.prepStack, 1);
        break;
      case 'fade':
        insta.get(api_url, insta.fade, 1);
        break;
    }
    insta.timeout = setTimeout(insta.cron, insta.prefs.updateInterval);
  },

  get : function(url, callback, page){
    var api = new XMLHttpRequest();
    var _this = this;

    api.open( 'GET', url, true );
    api.onreadystatechange=function(e){
      if(this.readyState===4){
        var feed = JSON.parse(this.response);
        callback(feed.data, page--);
        if(page>0){
          _this.get(feed.pagination.next_url, callback, false);
        }
      }
    }
    api.send(null);
  },

  message : function(e){
    var m = e.data;
    switch(m.action){
      case 'success':
        insta.prefs.token = m.access_token;
        insta.cron();
        break;
      case 'error':
        console.log('auth error');
        document.body.innerHTML = 'auth error';
        break;
    }
    // window.location.reload();
  },

  init : function(){
    insta.authDialog = insta.prefs.authEndpoint+
      '?client_id='+insta.prefs.clientId
      +'&redirect_uri='+insta.prefs.callback
      +'&response_type=token'
      +'&scope=basic+comments+relationships+likes';

    opera.extension.onmessage = insta.message;

    if(typeof(insta.prefs.token)=='undefined' || insta.prefs.token==''){
      opera.contexts.speeddial.title="Click to Login";
      opera.contexts.speeddial.url = insta.authDialog;
      return false;
    }

    // Set Loading text
    insta.cron();
  }
}
window.addEventListener("load", insta.init, false);