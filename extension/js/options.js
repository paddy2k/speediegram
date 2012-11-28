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
          case 'feeds':
            document.getElementsByTagName('output')[0].value = document.getElementById('timer').value;
            break;
        }
      }
    }

    var timer = document.getElementById('timer');
    timer.name = widget.preferences.layout + 'Interval';
    timer.max = widget.preferences.layout == 'grid' ? 600 : 30 ;
    timer.value = widget.preferences[timer.name];

    // Update Output
    document.getElementById('timerOutput').value = widget.preferences[timer.name];

    var inputs = document.querySelectorAll('#feeds input');
    for(var i=0; inputs.length>i;i++){
      // Add onchange event
      inputs[i].onchange=function(){
        widget.preferences[this.name] = this.value;
        if(this.name=='layout'){
          var timer = document.getElementById('timer');
          timer.name = this.value + 'Interval';
          timer.max = this.value == 'grid' ? 600 : 30 ;
          timer.value = widget.preferences[timer.name];

          // Update Output
          document.getElementById('timerOutput').value = widget.preferences[timer.name];
        }
        insta.main();
      }

      var currentValue = widget.preferences[inputs[i].name];
      if(inputs[i].type=='radio'){
        if(inputs[i].id==currentValue){
          inputs[i].checked="checked";
        }
      }
      else{
        inputs[i].value = widget.preferences[inputs[i].name];
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