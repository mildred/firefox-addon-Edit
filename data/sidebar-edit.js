event.on('breadcrumb', setBreadcrumb);
event.emit('get-breadcrumb');

var breadcrumb = document.querySelector("div.breadcrumb");
function setBreadcrumb(bc) {
  breadcrumb.innerHTML = "";
  var prefix = [];
  for(var i = 0; i < bc.length; ++i) {
    var tag = bc[i];
    var section = document.createElement("section");
    var includeSection = false;

    prefix.push(tag);
    var ul = makeUL(prefix);
    section.appendChild(ul);

    section.classList.add((i >= bc.length - 2) ? "opened" : "closed");
    ul.addEventListener("click", function(){
      this.parentElement.classList.toggle("opened");
      this.parentElement.classList.toggle("closed");
    });

    if(typeof tag !== 'string' && tag.replacement) {
      var repl = document.createElement("ul");
      repl.classList.add("style");
      for(var j = 0; j < tag.replacement.length; ++j) {
        var r = tag.replacement[j];
        var li = document.createElement('li');
        li.classList.add("style");
        if(r.tagName == tag.tagName || (!r.tagName && !tag.tagName))
          li.classList.add("selected");
        var sample = document.createElement('div');
        sample.classList.add("sample");
        var shadow = sample.createShadowRoot();
        shadow.innerHTML = r.sample;
        var name = document.createElement('div');
        name.classList.add("name");
        name.textContent = r.name;
        var tagName = document.createElement('div');
        tagName.classList.add("tagName");
        tagName.textContent = r.tagName;
        li.appendChild(sample);
        li.appendChild(name);
        li.appendChild(tagName);
        repl.appendChild(li);
        includeSection = true;

        li.addEventListener("click", function(i, rid){
          event.emit("set-breadcrumb-element-type", i, rid);
        }.bind(this, i, r.id));
      }
      section.appendChild(repl);
    }

    if(includeSection) {
      prefix = [];
      breadcrumb.appendChild(section);
    }
  }

  function makeUL(bc){
    var ul = document.createElement("ul");
    ul.classList.add("breadcrumb");
    ul.classList.add("header");
    if(bc) for(var i = bc.length-1; i >= 0; --i) {
      ul.insertBefore(makeLI(bc[i]), ul.firstChild);
    }
    return ul;
  }

  function makeLI(text){
    if(typeof text !== "string") text = text.tagName || "Text";
    var li = document.createElement("li");
    li.textContent = text;
    return li;
  }
}
