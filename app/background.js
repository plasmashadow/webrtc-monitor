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
  var bitrate = document.getElementById("bitrate");
  var datset = [[0,0],[1,0],[2,0],[3,0],[4,0]]
  var count = 5;
  var plot = $.plot("#bitrate", [datset], {
			series: {
				shadowSize: 0	// Drawing is faster without shadows
			},
			yaxis: {
				min: 0,
				max: 100
			},
			xaxis: {
				show: false
			}
		});
  plot.draw();
  StatReciver(function(stat){
     var videoBitRate  = Math.abs(stat.video.bandWidth)/(1024*8);
     datset.push([count++, videoBitRate])
     datset.shift();
     plot.setData(datset);
     console.log(datset);
     plot.draw();
  });
})
