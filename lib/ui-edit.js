const {Cc, Ci}         = require("chrome");
const { ToggleButton } = require('sdk/ui/button/toggle');
var tabs = require("sdk/tabs");
var self = require("sdk/self");

ToggleButton({
  id: "edit-button",
  label: "Edit",
  icon: "./document-edit.svg",
  checked: false,
  onClick: function() {
    // delete the automatic window state
    this.state('window', null);
    var tab = tabs.activeTab;
    var nextState = ! this.state(tab).checked;

    if(nextState) setEditable(tab);
    else          setReadOnly(tab);

    // set manually the tab state
    this.state(tab, {checked: nextState})
  }
});

var allTabWorkers = {};

function setEditable(tab) {
  if(allTabWorkers[tab.id]) return;
  var worker = tab.attach({
    contentScriptFile: [
      "./selectionchange-polyfill/selectionchange.js"
      "./contenteditable.js"
    ]
  });

  allTabWorkers[tab.id] = worker;
  tab.on("close", function(){
    worker.destroy();
    allTabWorkers[tab.id] = undefined;
  });
}

function setReadOnly(tab) {
  if(!allTabWorkers[tab.id]) return;
  allTabWorkers[tab.id].destroy();
  allTabWorkers[tab.id] = undefined;
}