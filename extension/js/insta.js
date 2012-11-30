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
      img.dataset.info = JSON.stringify(photos[i]);
      document.getElementById('frames').appendChild(img);
      insta.photos.push(photos[i]);
    }

    document.body.removeAttribute('class');
    opera.contexts.speeddial.title="Speedie-gram";
    opera.contexts.speeddial.url=insta.photos[0].link;
    
    insta.timeout = setTimeout(insta.main, insta.prefs.gridInterval*1000);
  },

  fadeStack : function(){
    clearTimeout(insta.timeout);

    var type = insta.prefs.layout;
    var photo = insta.photos.shift();

    if(photo){   
      var url = photo.images.low_resolution.url;
      var img = document.createElement("IMG");
      img.className=type+" hidden";
      img.src = url;
      img.dataset.info = JSON.stringify(photo);

      if(type == 'stack'){
        var rotate  = (70*Math.random())-35;
        var tranX   = (50 *Math.random())-25;
        var tranY   = (10 *Math.random())-5;
        
        img.style.transform="scale(1.2, 1.2) rotate("+rotate+"deg) translate("+tranX+"%, "+tranY+"%)";
      }
      
      var image = document.getElementById('frames').appendChild(img);
      setTimeout(function(){
        image.classList.remove('hidden');
        opera.contexts.speeddial.title = photo.caption ? photo.caption.text : photo.user.username;
        opera.contexts.speeddial.url = photo.link;

        while(document.getElementById('frames').getElementsByClassName(type).length>16){
          document.getElementById('frames').removeChild(document.getElementById('frames').getElementsByClassName(type)[0]);
        }

        document.body.removeAttribute('class');
      }, 1000);

      if(insta.photos.length<=2){
        insta.main();
      }
    }
    insta.timeout = setTimeout(insta.fadeStack, insta.prefs[type+'Interval']*1000);
  },

  prepFS : function(photos, page){
    var type = insta.prefs.layout;
    if(page > 1){
      insta.photos=[];
    }

    for(var i=0;photos.length>i;i++){
      insta.photos.push(photos[i]);
    }

    while(document.querySelectorAll('#frames img:not(.'+type+')').length){
     document.getElementById('frames').removeChild(document.querySelectorAll('#frames img:not(.'+type+')')[0]);
    }

    insta.fadeStack();
  },

  main : function(){
    clearTimeout(insta.timeout);
    var api_url = '';

    // If no auth token returned default to popular feed.
    var feed = insta.prefs.token && insta.prefs.token.length ? insta.prefs.feed : 'popular';

    // Select Endpoint
    switch(feed){
      case 'tags':
        api_url = "tags/"+  insta.prefs.searchTag.replace('/\s/','') + "/media/recent?"; 
        break;
      case 'geo':
        api_url = "media/search?lat="+insta.prefs.geoLat+"&lng="+insta.prefs.geoLng+"&"; 
        break;
      case 'me':
        api_url = "users/self/feed?"; 
        break;
      default:
      case 'popular':
        api_url = "media/popular?";
        break;
    }
    api_url = insta.prefs.apiEndpoint + api_url + 'access_token=' + insta.prefs.token;

    // Layout
    switch(insta.prefs.layout){
      case 'grid':
        insta.get(api_url, insta.grid, 2);
        break;
      case 'stack':
      case 'fade':
        insta.get(api_url, insta.prepFS, 2);
        break;
    }
  },

  get : function(url, callback, page){
    var api = new XMLHttpRequest();
    var _this = this;

    api.open( 'GET', url, true );
    api.onreadystatechange=function(e){
      if(this.readyState===4){
        var feed = JSON.parse(this.response);
        callback(feed.data, page--);
        if(page>0 && feed.pagination){
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
        insta.main();
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
    insta.main();
  }
}
window.addEventListener("load", insta.init, false);