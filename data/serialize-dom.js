//const {Cc, Ci}         = require("chrome");
//var domSerializer = Cc["@mozilla.org/xmlextras/xmlserializer;1"].createInstance(Ci.nsIDOMSerializer);

var xmlSerializer = new XMLSerializer();

self.port.on("serialize", function(){
  var oldContentEditable = document.documentElement.contentEditable;
  document.documentElement.contentEditable = false;
  var data = "";
  if (document instanceof XMLDocument) {
    data = xmlSerializer.serializeToString(document);
  } else for (var n = document.firstChild; n; n = n.nextSibling) {
    if (n.outerHTML) data += n.outerHTML;
    else data += xmlSerializer.serializeToString(n); // approximate for HTML
  }
  self.port.emit("serialized", data);
  document.documentElement.contentEditable = oldContentEditable;
});
