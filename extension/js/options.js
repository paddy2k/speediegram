var options = {
  init : function(){
    window.insta = opera.extension.bgProcess.insta;
    var inputs = document.querySelectorAll('nav input');
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
        insta.main();
      }
    }
    options.loadPhoto();
  },

  loadPhoto : function(){
    var activePhoto = opera.extension.bgProcess.document.querySelector('#frames img.grid:first-child, #frames img.stack:last-child, #frames img.fade:last-child');
    var photo = JSON.parse(activePhoto.dataset.info);
    
    document.getElementById('currentPhoto').src = photo.images.low_resolution.url;
    document.getElementById('currentUser').innerText = photo.user.username;
    document.getElementById('currentName').innerText = photo.user.full_name;
    document.getElementById('currentLikesValue').innerText = photo.likes.count;
    document.getElementById('currentCommentsValue').innerText = photo.comments.count;
    document.getElementById('quote').innerText = photo.caption ? photo.caption.text : '';
  }
}
window.addEventListener("load", options.init, false);