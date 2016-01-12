
$(document).ready(function(){

  Object.defineProperty(window, '_connections', {
    value: []
  });

  console.log("logging background");

  function doPolyFill() {
    console.log("proceeding pollyfill")
    console.log(window._connections);
    var RTC = window.RTCPeerConnection;
    if (window.RTCPeerConnection) {
      window.RTCPeerConnection = function(pcConfig, pcConstrains) {
        var instance = new RTC(pcConfig, pcConstrains);
        $.extend(this, instance);
        window._connections.push(this);
      }
    }
  }

  doPolyFill();

});
