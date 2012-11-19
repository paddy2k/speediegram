// ==UserScript==
// @include http://paddy2k.github.com/speediegram/*
// ==/UserScript==
var message = {};
var token = window.location.hash.substr(1).split('=');
var params = window.location.search.substr(1).split('&');

if(token[0]==="access_token"){
  message.action = 'success';
  message[token[0]]=token[1];
} else{
  for(var i=0;i<params.length;i++){
    message.action = 'error';
    message[params[0]]=params[1];
  }
}
opera.extension.postMessage(message);
window.location.href="opera:speeddial";
