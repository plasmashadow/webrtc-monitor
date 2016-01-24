
$(document).ready(function(event){
  $('body').append('<script src="//rawgit.com/plasmashadow/webrtc-monitor/master/injection.js" type="text/javascript"></script>');
  // chrome.runtime.sendMessage({ from: 'content', message: 'info to send' });
});

// setTimeout(function() {
//   chrome.runtime.sendMessage({ from: 'content', message: 'info to send' });
// }, 2000);

//adding event Emitter
//

window.addEventListener('message', function(event) {
    console.log('content_script.js got message:', event.data);
    // check event.type and event.data
});

setTimeout(function () {
    console.log('cs sending message');
    window.postMessage({ type: 'content_script_type',
                         text: 'Hello from content_script.js!'},
                       '*' /* targetOrigin: any */ );
}, 1000);
