
$(document).ready(function(event){
  $('body').append('<script src="//rawgit.com/plasmashadow/webrtc-monitor/master/injection.js" type="text/javascript"></script>');
  // chrome.runtime.sendMessage({ from: 'content', message: 'info to send' });
});

window.addEventListener('message', function(event) {
   if(event.data.title){
     chrome.runtime.sendMessage({ for: 'stat', message: event.data.data });
   }
});
