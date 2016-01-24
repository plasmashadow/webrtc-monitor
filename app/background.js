function StatReciver(callback){
  var prevVidByteSend = 0;
  var prevAudByteSend = 0;
  chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
     console.log(message)
     var request = message.message;
      if(message.for == 'stat'){
        if(prevVidByteSend == 0)
            prevVidByteSend = request.video.byteSent
        if(prevAudByteSend == 0)
            prevAudByteSend = request.audio.byteSent

          var result = {
            audio:{
              bandWidth: prevAudByteSend - request.audio.byteSent
            },
            video:{
              bandWidth: prevVidByteSend - request.video.byteSent
            }
          };
          prevAudByteSend = request.audio.byteSent;
          prevVidByteSend = request.video.byteSent;
        callback(result);
      }
  });
}

$(document).ready(function(){
  StatReciver(function(stat){
    console.log(stat);
  });
})
