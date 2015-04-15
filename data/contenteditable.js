var oldContentEditable = document.documentElement.contentEditable;
document.documentElement.contentEditable = "true";

self.port.on('detach', function(){
  document.documentElement.contentEditable = oldContentEditable;
});

document.documentElement.addEventListener('focus', function(){
  console.log("focus " + this + " " + this.tagName);
  console.log(this);
});