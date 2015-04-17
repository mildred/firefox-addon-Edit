event.on('breadcrumb', setBreadcrumb);
event.emit('get-breadcrumb');

document.querySelector("section.breadcrumb > :first-child.header").addEventListener('click', function(){
    this.parentElement.classList.toggle("opened");
    this.parentElement.classList.toggle("closed");
});

var breadcrumb = document.querySelector("section.breadcrumb > :not(.header)");
function setBreadcrumb(bc) {
  breadcrumb.innerHTML = "";
  for(var i = 0; i < bc.length; ++i) {
    var tag = bc[i];

    if(typeof tag === 'string') {
      tag = {
        tagName: tag,
        replacement: [{tagName: tag}]
      };
    } else if(!tag.replacement || tag.replacement.length === 0) {
      tag.replacement = [{tagName: tag.tagName}];
    }

    var repl = document.createElement("ul");
    repl.classList.add("style");
    repl.classList.add("closed");
    repl.addEventListener("click", toggleOpenClose);
    if(tag.replacement.length <= 1) repl.classList.add("empty");

    for(var j = 0; j < tag.replacement.length; ++j) {
      var r = tag.replacement[j];
      var li = document.createElement('li');
      var selected = r.tagName == tag.tagName || (!r.tagName && !tag.tagName);
      li.classList.add("style");
      var sample = document.createElement('div');
      sample.classList.add("sample");
      var focus = document.createElement('div');
      focus.classList.add("focus");
      var shadow = sample.createShadowRoot();
      shadow.innerHTML = r.sample || "<" + r.tagName + ">Aa</" + r.tagName + ">";
      var name = document.createElement('div');
      name.classList.add("name");
      name.textContent = r.name || "<" + r.tagName.toLowerCase() + "/>";
      var tagName = document.createElement('div');
      tagName.classList.add("tagName");
      tagName.textContent = r.tagName;
      li.appendChild(sample);
      li.appendChild(focus);
      li.appendChild(name);
      li.appendChild(tagName);
      if(selected) {
        repl.insertBefore(li, repl.firstChild);
        li.classList.add("selected");
      } else {
        repl.appendChild(li);

        if(typeof r.id === 'number') {
          li.addEventListener("click", function(i, rid, rbreak){
            event.emit("set-breadcrumb-element-type", i, rid, rbreak);
            event.emit('focus');
          }.bind(this, i, r.id, r.break));
        }
      }

    }
    breadcrumb.appendChild(repl);
  }

  function toggleOpenClose(){
    this.classList.toggle("opened");
    this.classList.toggle("closed");
  }
}
