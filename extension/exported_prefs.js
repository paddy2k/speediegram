opera.isReady(function(){
if (!widget.preferences.getItem("_OPERA_INTERNAL_defaultPrefsSet")){
widget.preferences.setItem("feedUrl", "http://api.irishrail.ie/realtime/realtime.asmx/getStationDataByCodeXML?StationCode=");
widget.preferences.setItem("count", "6");
widget.preferences.setItem("direction", "");
widget.preferences.setItem("interval", "60");
widget.preferences.setItem("stationCode", "");
}
widget.preferences.setItem("_OPERA_INTERNAL_defaultPrefsSet", true);

});
