const {Cc,Ci,Cu} = require("chrome");
const {OS,TextEncoder} = Cu.import("resource://gre/modules/osfile.jsm", {});
const {viewFor} = require("sdk/view/core");
const {ToggleButton} = require('sdk/ui/button/toggle');
const {Request} = require('sdk/request');
const panels = require("sdk/panel");
const tabs = require("sdk/tabs");
const self = require("sdk/self");

var allPanels = {};

ToggleButton({
  id: "save-button",
  label: "Save",
  icon: "./document-save.svg",
  onChange: function(state) {
    if (state.checked) {
      var tab = tabs.activeTab;
      if(!allPanels[tab.id]) allPanels[tab.id] = createPanel(this, tabs.activeTab);
      allPanels[tab.id].show({ position: this });
    }
  }
});

function createPanel(button, tab){

  var opened = false;

  var panel = panels.Panel({
    contentURL: self.data.url("save-panel.html"),
    contentScriptFile: "./save-panel.js",
    onHide: function() {
      button.state('window', {checked: false});
      opened = false;
    },
    onShow: function(){
      opened = true;
      button.state('window', {checked: true});
      this.port.emit("query-size");
    }
  });

  panel.port.emit("setURL", tab.url);

  tab.on("ready", function(){
    panel.port.emit("setURL", tab.url);
  });

  tab.on("activate", function(){
    if(!opened) return;
    panel.show({ position: button });
  });

  tab.on("deactivate", function(){
    panel.hide();
  });

  tab.on("close", function(){
    delete allPanels[tab.id];
    panel.destroy();
  });

  panel.port.on("saveDisk", function(){
    getDOM(tab, panel, saveDisk.bind(this, tabs.activeTab.url));
  });

  panel.port.on("saveWeb", function(url){
    getDOM(tab, panel, saveWeb.bind(this, url));
  });

  panel.port.on("size", function(width, height){
    panel.height = height;
  });

  return panel;
}

function getDOM(tab, panel, cb){
  var worker = tab.attach({
    contentScriptFile: "./serialize-dom.js"
  });
  worker.port.on("serialized", function(data){
    worker.destroy();
    cb(data, tab, panel);
  });
  worker.port.emit("serialize");
}

function saveDisk(url, content, tab, panel){
  panel.hide();
  var fp = Cc["@mozilla.org/filepicker;1"].createInstance(Ci.nsIFilePicker);
  fp.init(viewFor(tab.window), "Save on Disk", Ci.nsIFilePicker.modeSave);
  fp.defaultString = OS.Path.basename(url);
  fp.defaultExtension = "html";
  if(fp.show() != Ci.nsIFilePicker.returnCancel) {
    OS.File.writeAtomic(fp.file.path, content,
      { flush: true,
        encoding: "utf-8",
        tmpPath: fp.file.path + ".tmp"})
    .then(function(){
      console.log("Written to " + fp.file.path);
      panel.port.emit("success-hidden");
    }, function(e){
      panel.show({ position: button });
      console.log("Written to " + fp.file.path + " failed: " + e);
      panel.port.emit("error", "" + e);
    });
  }
}

function saveWeb(url, content, tab, panel){
  var req = Request({
    url: url,
    contentType: tab.contentType,
    content: content,
    onComplete: function (response) {
      if (response.status == 200 || response.status == 201 || response.status == 204) {
        console.log("Save Web (" + url + "): " + response.status + " " + response.statusText);
        panel.hide();
      } else if(response.status < 400) {
        panel.port.emit('error', "Unexpected response from the server: " + response.status + " " + response.statusText);
      } else if(response.status < 500) {
        panel.port.emit('error', "Error: " + response.status + " " + response.statusText);
      } else if(response.status < 600) {
        panel.port.emit('error', "Server Error: " + response.status + " " + response.statusText);
      } else {
        panel.port.emit('error', "Unexpected response from the server: " + response.status + " " + response.statusText);
      }
    }
  }).put();
}
