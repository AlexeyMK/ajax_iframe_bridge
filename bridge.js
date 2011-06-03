Bridge = {
  dispatchTable : {},
  nextCallbackId : 0,
  init : function(url, origin) {
    //sample origin: https://api.example.com
    Bridge.origin = origin;
    Bridge.iframe = document.createElement('iframe');
    Bridge.iframe.setAttribute('src', url);
    document.body.appendChild(Bridge.iframe);
  },
  ajax : function(args) {
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
  receive : function(event) {
    message = JSON.parse(event.data)
    func_to_call = 
      Bridge.dispatchTable[message.callbackId][message.successOrFail];
    // TODO: error check here
    func_to_call(message.response);
  }
}

window.addEventListener('message', Bridge.receive, false);
