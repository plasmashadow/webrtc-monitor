var jQuery = $;

(function(jQuery) {

  jQuery.eventEmitter = {
    _JQInit: function() {
      this._JQ = jQuery(this);
    },
    emit: function(evt, data) {
      !this._JQ && this._JQInit();
      this._JQ.trigger(evt, data);
    },
    once: function(evt, handler) {
      !this._JQ && this._JQInit();
      this._JQ.one(evt, handler);
    },
    on: function(evt, handler) {
      !this._JQ && this._JQInit();
      this._JQ.bind(evt, handler);
    },
    off: function(evt, handler) {
      !this._JQ && this._JQInit();
      this._JQ.unbind(evt, handler);
    }
  };

}(jQuery));

function MessageEvent(){
  $.extend(MessageListener.prototype, $.eventEmitter);
  this.bindListeners();
}

MessageEvent.prototype.bindListeners = function(){
  var self = this;
  chrome.runtime.onMessage.addListener(function(r, s ,send){
     self.emit(request.from, request.data);
  });
}
