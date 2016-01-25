function StatReciver(callback){
  var prevVidByteSend = 0;
  var prevAudByteSend = 0;
  chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
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
/*works only for same dimentional arrays*/
function zip(x,y){
  return x.map(function(element, index){
    return [element, y[index]];
  })
}

$(document).ready(function(){
  var bitrate = document.getElementById("bitrate");
  var x_axis = [0,1,2,3,4];
  var y_axis = [0,0,0,0,0];
  var count = 0;
  var plot = $.plot("#bitrate",[zip(x_axis,y_axis)], {
			series: {
				shadowSize: 0	// Drawing is faster without shadows
			},
			yaxis: {
				min: 0,
				max: 1000
			},
			xaxis: {
				show: false
			}
		});
  StatReciver(function(stat){
     var videoBitRate  = Math.abs(stat.video.bandWidth)/(1024*8);
     y_axis.shift();
     y_axis.push(videoBitRate)
     console.log(y_axis)
     plot.setData([zip(x_axis,y_axis)]);
     plot.draw();
  });
})
