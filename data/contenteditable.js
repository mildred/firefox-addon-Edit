var oldContentEditable = document.documentElement.contentEditable;
document.documentElement.contentEditable = "true";

self.port.on('detach', function(){
  document.documentElement.contentEditable = oldContentEditable;
});

selectionchange.start();

