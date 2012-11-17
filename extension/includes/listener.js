// ==UserScript==
// @include http://paddy2k.github.com/speediegram/*
// ==/UserScript==
var token = window.location.hash.substr(1).split('=');
if(token[0]==="access_token"){
  opera.extension.postMessage(token[1]);
}
window.location.href="opera:speeddial";