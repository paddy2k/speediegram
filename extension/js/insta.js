var widgetInit =  widget.preferences.authEndpoint; // HACK 
var prefs = widget.preferences;
var authDialog = prefs.authEndpoint+
  '?client_id='+prefs.clientId
  +'&redirect_uri='+prefs.callback
  +'&response_type=token';

// Set Loading text
opera.contexts.speeddial.title="Loading...";
  
opera.contexts.speeddial.url = authDialog;

opera.extension.onmessage = function(e) {
  var m = e.data;
  switch(m.action){
    case 'success':
      widget.preferences.token = m.access_token;
      printGrams();
      break;
    case 'error':
      console.log('auth error');
      document.body.innerHTML = 'auth error';
      break;
  }
}

function printGrams(){
  if(prefs.token=='undefined' || prefs.token==''){
    return false;
  }

  var api = new XMLHttpRequest();
  var api_url = widget.preferences.apiEndpoint + widget.preferences.feedPath + widget.preferences.token;
  api.open( 'GET', api_url, true );
  api.onreadystatechange=function(e){
    if( this.readyState!==4 ){
      return false;
    };

    document.getElementById('frames').innerHTML='';
    var feed = JSON.parse(this.response);
    for(var i=0;feed.data.length>i;i++){
      var url = feed.data[i].images.thumbnail.url;
      var img = document.createElement("IMG");
      img.style.float="left";
      img.style.width="25%";
      img.src = url;
      document.getElementById('frames').appendChild(img);
    }
    document.body.className='';
    opera.contexts.speeddial.title="OMG Muffins @ Cafe Bliss";
  }
  api.send(null);
}
printGrams();
setInterval(printGrams, prefs.updateInterval);