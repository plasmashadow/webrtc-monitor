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

  function sendMessage(title, data) {
    window.postMessage({
      title: title,
      data: data
    })
  }


  function _getStats(peer) {
    return new Promise(function(resolve, reject) {
      peer.getStats(function(res) {
        var items = [];
        res.result().forEach(function(result) {
          var item = {};
          result.names().forEach(function(name) {
            item[name] = result.stat(name);
          });
          item.id = result.id;
          item.type = result.type;
          item.timestamp = result.timestamp;
          items.push(item);
        });
        resolve(items);
      });
    });
  }

  function getPeerStat(peer) {
    return new Promise(function(resolve, reject) {
      _getStats(peer).then(function(result) {
        var _res = {
          audio: {},
          video: {}
        };
        for (var i = 0; i < result.length; i++) {
          var res = result[i];
          if (res.googCodecName == 'opus' && res.bytesSent) {
            _res.audio['byteSent'] = parseInt(res.bytesSent);
            _res.audio['packetsLost'] = parseInt(res.packetsLost);
            _res.audio['packetsSent'] = parseInt(res.packetsSent);
            _res.audio['rtt'] = parseInt(res.googRtt);
          }
          if (res.googCodecName == 'VP8' && res.bytesSent) {
            _res.video['byteSent'] = parseInt(res.bytesSent);
            _res.video['packetsLost'] = parseInt(res.packetsLost);
            _res.video['packetsSent'] = parseInt(res.packetsSent);
            _res.video['rtt'] = parseInt(res.googRtt);
          }
        }
        resolve(_res);
      })
    });
  }

  function getAllStats() {
    var result = window._connections.map(function(peer) {
      return getPeerStat(peer);
    });
    return Promise.all(result);
  }

  function mergeAll(items) {
    var _defaults = {
      'video': {
        'byteSent': 0,
        'packetsLost': 0,
        'packetsSent': 0,
        'rtt': 0
      },
      'audio': {
        'byteSent': 0,
        'packetsLost': 0,
        'packetsSent': 0,
        'rtt': 0
      }
    }
    var videoMapped = items.reduce(function(a, b) {
      return {
        'byteSent': a.video.byteSent + b.video.byteSent,
        'packetsLost': a.video.packetsLost + b.video.packetsLost,
        'packetsSent': a.video.packetsSent + b.video.packetsSent,
        'rtt': (a.video.rtt + b.video.rtt) / 2
      }
    }, _defaults);
    var audioMapped = items.reduce(function(a, b) {
      return {
        'byteSent': a.audio.byteSent + b.audio.byteSent,
        'packetsLost': a.audio.packetsLost + b.audio.packetsLost,
        'packetsSent': a.audio.packetsSent + b.audio.packetsSent,
        'rtt': (a.audio.rtt + b.audio.rtt) / 2
      }
    }, _defaults);
    console.log(audioMapped),
      console.log(videoMapped)
    return {
      audio: audioMapped,
      video: videoMapped
    }
  }

  function StatEmitter(callback, interval) {
    var interval = interval || 1000;
    var audiobyterate = 0;
    var videobyterate = 0;
    setInterval(function() {
      getAllStats().then(function(items) {
        console.log(items);
        callback(mergeAll(items));
      }).catch(function(err) {
        throw err;
      });
    }, interval);
  }

});
