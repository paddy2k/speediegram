var options = {
  init : function(){
    var _this = this;
    opera.extension.onmessage = function(e){
      _this.message(e);
    };
    this.runtime = chrome.runtime.connect();
    var inputs = document.querySelectorAll('nav input');
    for(var i=0; inputs.length>i;i++){
      inputs[i].onclick=function(){
        document.getElementById('inner').className=this.id;
        switch(this.id){
          case 'photo':
            _this.runtime.postMessage({
              "action": "currentPhoto"
            });
            break;
          case 'feeds':
            document.getElementsByTagName('output')[0].value = document.getElementById('timer').value;
            document.getElementById('feedOptions').className=widget.preferences.getItem('feed');
            options.loadMap();
            break;
        }
      }
    }

    var timer = document.getElementById('timer');
    timer.name = widget.preferences.getItem('layout') + 'Interval';
    timer.max = widget.preferences.getItem('layout') == 'grid' ? 600 : 30 ;
    timer.value = widget.preferences.getItem(timer.name);

    // Update Output
    document.getElementById('timerOutput').value = widget.preferences.getItem(timer.name);

    var inputs = document.querySelectorAll('#feeds input');
    for(var i=0; inputs.length>i;i++){
      // Add onchange event
      inputs[i].onchange=function(){
        widget.preferences.setItem(this.name, this.value);
        if(this.name=='layout'){
          var timer = document.getElementById('timer');
          timer.name = this.value + 'Interval';
          timer.max = this.value == 'grid' ? 600 : 30 ;
          timer.value = widget.preferences[timer.name];

          // Update Output
          document.getElementById('timerOutput').value = widget.preferences.getItem(timer.name);
        }
        document.getElementById('feedOptions').className=widget.preferences.getItem('feed');
        options.loadMap();
        _this.runtime.postMessage({"action": "reload"});
      }

      var currentValue = widget.preferences.getItem(inputs[i].name);
      if(inputs[i].type=='radio'){
        console.log(inputs[i].id +'_'+currentValue);
        if(inputs[i].id==currentValue){
          inputs[i].checked="checked";
        }
      }
      else{
        inputs[i].value = widget.preferences.getItem(inputs[i].name);
      }
      console.log(inputs[i]);
    }

    var selects = document.querySelectorAll('#inner select, #inner input[id=searchTag]');
    for(var i=0; selects.length>i;i++){
      selects[i].value = widget.preferences.getItem(selects[i].id);
      selects[i].onchange=function(){
        widget.preferences.setItem(this.id, this.value);
        _this.runtime.postMessage({"action": "reload"});
      }
    }

    document.getElementsByTagName('output')[0].value = document.getElementById('timer').value;
    document.getElementById('feedOptions').className=widget.preferences.getItem('feed');
    options.loadMap();
  },

  loadMap : function() {
    var _this = this;
    if(widget.preferences.getItem('feed') != 'geo'){
      return false;
    }

    var pinLatlng = new google.maps.LatLng(parseFloat(widget.preferences.getItem('geoLat')), parseFloat(widget.preferences.getItem('geoLng')));
    var mapOptions = {
      zoom: 15,
      center: pinLatlng,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    
    var image = new google.maps.MarkerImage("/assets/Instagram-logo-32.png",
       new google.maps.Size(32, 44),
       new google.maps.Point(0,0),
       new google.maps.Point(13, 44));
    window.map = new google.maps.Map(document.getElementById('geoOptions'), mapOptions);
    window.marker = new google.maps.Marker({
        position : pinLatlng,
        map : map,
        icon: image,
        draggable : true
    });

    google.maps.event.addListener(marker, "dragend", function(e, f, g) {
        var latLng = e.latLng.toUrlValue().split(',');
        widget.preferences.setItem("geoLat" , latLng[0]);
        widget.preferences.setItem("geoLng" , latLng[1]);
        map.panTo(e.latLng);
        _this.runtime.postMessage({"action": "reload"});
    });
  },

  loadPhoto : function(photoData){    
    var photo = JSON.parse(photoData);
    document.getElementById('currentPhoto').src = photo.images.low_resolution.url;
    document.getElementById('currentUser').innerText = photo.user.username;
    document.getElementById('currentName').innerText = photo.user.full_name;
    document.getElementById('currentLikesValue').innerText = photo.likes.count;
    document.getElementById('currentCommentsValue').innerText = photo.comments.count;
    document.getElementById('quote').innerText = photo.caption ? photo.caption.text : '';
  },

  message : function(e){
    var m = e.data;
    switch(m.action){
      case 'loadPhoto':
        this.loadPhoto(m.data);
        break;
    }
  }
}

opera.isReady(function(){
  options.init()
});