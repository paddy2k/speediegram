function receiveMessage(e){
  widget.token=e.data;
  var api = new XMLHttpRequest();
  var api_url = widget.endpoint + widget.feedPath + widget.token;
  api.open( 'GET', api_url, true );
  api.onreadystatechange=function(e){
    if( this.readyState!==4 ){
      return false;
    };

  document.body.innerHTML='';
    var feed = JSON.parse(this.response);
    for(var i=0;feed.data.length>i;i++){
      var url = feed.data[i].images.thumbnail.url;
      var img = document.createElement("IMG");
      img.style.float="left";
      img.style.width="25%";
      img.src = url;
      document.body.appendChild(img);
    }
  }
  api.send(null);
}
window.addEventListener("message", receiveMessage, false);
document.body.innerHTML="<iframe src='http://smallroomstudios.net/opera/instagram.html'/>";