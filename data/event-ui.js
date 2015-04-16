var event = (function(){
  var port;
  if     (typeof addon     !== 'undefined') port = addon.port;
  else if(typeof self.port !== 'undefined') port = self.port;
  else {
    console.error("Could not find port");
    port = {
      emit: function(ev, arg1, arg2){
        console.error("stub or port.emit(" + ev + ", " + arg1 + ", "+ arg2 +")");
        console.log(arg2);
      },
      on:   function(ev, cb){
        console.error("stub for port.on(" + ev + ", " + cb + ")");
      }
    };
  }

  var event = {
    _events: {},
    on:   function(evname, cb){
      if(!this._events[evname]) this._events[evname] = {};
      this._events[evname][cb] = {cb: cb, once: false};
    },
    off:  function(evname, cb){
      if(!this._events[evname]) return;
      delete this._events[evname][cb];
    },
    once: function(evname, cb){
      if(!this._events[evname]) this._events[evname] = {};
      this._events[evname][cb] = {cb: cb, once: true};
    },
    emit: function(evname){
      port.emit("ui", evname, Array.prototype.slice.call(arguments, 1));
    },
    dispatch: function(evname) {
      return this._dispatch(evname, Array.prototype.slice.call(arguments, 1));
    },
    _dispatch: function(evname, args) {
      if(!this._events[evname]) return;
      for(var i in this._events[evname]) {
        var cb = this._events[evname][i];
        cb.cb.apply(this, args);
        if(cb.once) delete this._events[evname][i];
      }
    }
  };

  port.on('ui', event._dispatch.bind(event));

  return event;
})();