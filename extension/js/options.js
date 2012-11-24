var options = {
  init : function(){
    window.insta = opera.extension.bgProcess.insta;
    var inputs = document.querySelectorAll('nav input[type=radio]');
    for(var i=0; inputs.length>i;i++){
      inputs[i].onclick=function(){
        document.getElementById('inner').className=this.id;
        switch(this.id){
          case 'photo':
            options.loadPhoto();
            break;
          case 'prefs':
            break;
        }
      }
    }

    var inputs = document.querySelectorAll('#inner input');
    for(var i=0; inputs.length>i;i++){
      inputs[i].value = widget.preferences[inputs[i].id];
      inputs[i].onchange=function(){
        widget.preferences[this.id] = this.value;
      }
    }

    var selects = document.querySelectorAll('#inner select, #inner input[id=searchTag]');
    for(var i=0; selects.length>i;i++){
      selects[i].value = widget.preferences[selects[i].id];
      selects[i].onchange=function(){
        widget.preferences[this.id] = this.value;
        insta.cron();
      }
    }
    options.loadPhoto();
  },

  loadPhoto : function(){
    document.getElementById('currentPhoto').src = insta.photos[0].images.low_resolution.url;
    document.getElementById('currentUser').innerText = insta.photos[0].user.username;
    document.getElementById('currentName').innerText = insta.photos[0].user.full_name;
    document.getElementById('currentLikesValue').innerText = insta.photos[0].likes.count;
    document.getElementById('currentCommentsValue').innerText = insta.photos[0].comments.count;
    document.getElementById('quote').innerText = insta.photos[0].caption ? insta.photos[0].caption.text : '';
  }
}
window.addEventListener("load", options.init, false);