Bridge = {
  dispatchTable : {},
  nextCallbackId : 0,
  ready : false,
  queue: [],
  init : function(url, origin) {
    //sample origin: https://api.example.com
    Bridge.origin = origin;
    Bridge.iframe = document.createElement('iframe');
    Bridge.iframe.onload = Bridge.set_ready;
    if (Bridge.iframe.attachEvent) {
      Bridge.iframe.attachEvent("onload",Bridge.set_ready);        
    }
    Bridge.iframe.setAttribute('src', url);
    document.body.appendChild(Bridge.iframe);
  },
  ajax : function(args) {
    if(!Bridge.ready) {Bridge.queue.push(args);return;}
    // add args to callback table
    var callbackId = Bridge.nextCallbackId++;
    Bridge.dispatchTable[callbackId] = {
      success: args.success,
      error: args.error
    }
    var message = {
      args:       args,
      callbackId: callbackId
    };
    Bridge.iframe.contentWindow.postMessage(
      JSON.stringify(message), Bridge.origin);
  },
  set_ready: function() {
    Bridge.ready = true;
    for (var q = 0;q < Bridge.queue.length;q++) {
      Bridge.ajax(Bridge.queue[q])
    }
  },
  receive : function(event) {
    message = JSON.parse(event.data)
    func_to_call =
      Bridge.dispatchTable[message.callbackId][message.successOrFail];
    // TODO: error check here
    func_to_call(message.response);
  }
}

window.addEventListener('message', Bridge.receive, false);
