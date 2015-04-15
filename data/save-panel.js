var defaultURL = " ";
var edit = document.querySelector("a.edit");
var ok   = document.querySelector("a.ok");
var tt   = document.querySelector("tt");
var err  = document.querySelector("p.error");
var save_disk = document.querySelector("button.save-disk");
var save_internet = document.querySelector("button.save-internet");

tt.spellcheck = false;
edit.addEventListener("click", editURL);
ok.addEventListener("click", validURL);
save_disk.addEventListener("click", function(){
  self.port.emit("saveDisk");
});
save_internet.addEventListener("click", function(){
  self.port.emit("saveWeb", tt.textContent);
});

function editURL(ev){
  ok.classList.remove('hidden');
  edit.classList.add('hidden');
  tt.contentEditable = "true";
  window.getSelection().selectAllChildren(tt);
  tt.focus();
  ev.preventDefault();
}

function validURL(ev){
  ok.classList.add('hidden');
  edit.classList.remove('hidden');
  tt.contentEditable = "false";
  window.getSelection().collapse(tt, 0);
  if(!tt.textContent) tt.textContent = defaultURL;
  edit.focus();
  ev.preventDefault();
}

function sendSizeNow(){
  self.port.emit("size", document.documentElement.clientWidth, document.documentElement.clientHeight);
}

function sendSize(){
  setTimeout(sendSizeNow, 0);
}

self.port.on("setURL", function(url){
  tt.textContent = url;
  err.classList.remove('hidden');
  err.classList.add('hidden');
  defaultURL = url;
  sendSize();
});

tt.addEventListener('keypress', function(ev){
  if(ev.key == 'Enter') {
    if(tt.isContentEditable) {
      validURL(ev);
    } else {
      editURL(ev);
    }
  }
  sendSize();
});

self.port.on("query-size", function(e){
  sendSize();
});

self.port.on("error", function(e){
  err.textContent = e;
  err.classList.remove('hidden');
  if(!e) err.classList.add('hidden');
  sendSize();
});

self.port.on("success-hidden", function(){
  err.classList.remove('hidden');
  err.classList.add('hidden');
  sendSize();
});
