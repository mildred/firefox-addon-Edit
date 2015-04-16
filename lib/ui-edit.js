const {Cc, Ci}        = require("chrome");
const {ToggleButton } = require('sdk/ui/button/toggle');
const {Sidebar}       = require("sdk/ui/sidebar");
const tabs = require("sdk/tabs");
const self = require("sdk/self");

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

var allSidebarWorkers = {};
var allTabWorkers = {};

var sidebar = Sidebar({
  id:    "edit-sidebar",
  title: "Editing Tools",
  url:   "./sidebar-edit.html",
  onAttach: function(worker){
    var tab = tabs.activeTab;
    allSidebarWorkers[tab.window.id] = worker;

    worker.port.on('ui', function(name, args){
      //console.log("ui event from sidebar: " + name);
      //console.log(args);
      if(!allTabWorkers[tabs.activeTab.id]) return;
      allTabWorkers[tabs.activeTab.id].port.emit("ui", name, args);
    });
  },
  onDetach: function(worker){
    delete allSidebarWorkers[tabs.activeTab.window.id];
    worker.destroy();
  }
});


function setEditable(tab) {
  if(allTabWorkers[tab.id]) return;
  var worker = tab.attach({
    contentScriptFile: [
      "./selectionchange-polyfill/selectionchange.js",
      "./event-ui.js",
      "./contenteditable.js",
      "./contenteditable-breadcrumb.js"
    ]
  });

  allTabWorkers[tab.id] = worker;
  tab.on("close", function(){
    delete allTabWorkers[tab.id];
    worker.destroy();
  });

  worker.port.on('ui', function(name, args){
    //console.log("ui event from page: " + name);
    //console.log(args);
    if(tab.window.tabs.activeTab !== tab) return;
    allSidebarWorkers[tab.window.id].port.emit("ui", name, args);
  });

  showSidebar.bind(tab)();

  tab.on('activate', showSidebar);
  tab.on('deactivate', hideSidebar);
}

function setReadOnly(tab) {
  sidebar.hide(tab.window);
  tab.removeListener('activate', showSidebar);
  tab.removeListener('deactivate', hideSidebar);

  if(!allTabWorkers[tab.id]) return;
  allTabWorkers[tab.id].destroy();

  delete allTabWorkers[tab.id];
}

function showSidebar(){
  sidebar.show(this.window);
  var tabWorker = allTabWorkers[this.id];
  var sidebarWorker = allSidebarWorkers[this.window.id];
}

function hideSidebar(){
  sidebar.hide(this.window);
  var tabWorker = allTabWorkers[this.id];
  var sidebarWorker = allSidebarWorkers[this.window.id];
}