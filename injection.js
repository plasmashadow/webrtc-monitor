$(document).ready(function() {

  Object.defineProperty(window, '_connections', {
    value: []
  });

  var RTC = window.RTCPeerConnection || window.webkitRTCPeerConnection;

  if (RTC) {
    console.log("patching RTCPeerConnection");
    window.RTCPeerConnection = function(pcConfig, pcConstrains) {
      var instance = new RTC(pcConfig, pcConstrains);
      window._connections.push(instance);
      return instance;
    }
  }




});
