var breadcrumb = [];
var breadcrumb_ui = [];
var lastFocusElement;

function clone(o){
  var res = {};
  for(k in o) res[k] = o[k];
  return res;
}

function getReplacement(parentElement, element) {
  // Elements that match the actual DOM node
  var sameElements = elements
    .filter(e =>
              element &&
              (e.same ? e.same(element) : e.tagName === element.tagName));

  // Elements that match the parent DOM node
  var parentElements = elements
    .filter(e =>
              parentElement &&
              (e.same ? e.same(parentElement) :
                        e.tagName === parentElement.tagName));

  // Allowed elements according to parent element
  var allowed = Array.prototype.concat.apply([], parentElements
    .map(e => elements.filter(e.include || (e => false))));

  // Concatenate allowed elements, sort and uniq them
  var replacements = sameElements.concat(allowed)
    .sort((a, b) => a.id > b.id)
    .filter((e, i, a) => i === 0 || a[i-1].id !== e.id);

  // If we can't find the nor format value (tagName empty to delete the element)
  // we get the replacements of the parent element and break one level of markup
  if(!replacements.find(e => e.tagName === "") && parentElement) {
    replacements = replacements.concat(
      getReplacement(parentElement.parentElement, parentElement)
        .filter(e => !replacements.find(ee => ee.id === e.id))
        .map(e => { e=clone(e); e.break = (e.break || 0) + 1; return e; }));
  }

  // Only allow replacements that would fit all child nodes
  /*var children = Array.prototype.concat.apply([],
    Array.prototype.map.call(element.childNodes,
      n => elements.filter(e => e.same ? e.same(n) : e.tagName === n.tagName)));
  replacements = replacements
    .filter(r => r.include && !children.find(c => !r.include(c)));*/

  return replacements;
}

function computeBreadcrumb(force){
  var sel = this.getSelection();
  var range = sel.getRangeAt(0);
  var focusNode = range ? range.commonAncestorContainer : sel.focusNode;
  var focusElement = focusNode.tagName ? focusNode : focusNode.parentElement;

  if(!force && lastFocusElement === focusElement) return false;
  lastFocusElement = focusElement;
  breadcrumb    = [];
  breadcrumb_ui = [];
  if(focusNode === focusElement && !range.collapsed){
    breadcrumb_ui = [{replacement: getReplacement(focusElement)}];
  }

  for(var n = focusNode; n; n = n.parentElement) {
    breadcrumb.unshift(n);
    breadcrumb_ui.unshift({
      tagName: n.tagName,
      style:   (n instanceof Element) ? getComputedStyle(n) : {},
      replacement: getReplacement(n.parentElement, n)
    });
  }
  event.emit("breadcrumb", breadcrumb_ui);
  return true;
}

function setBreadcrumbElementType(level, elemid, breaknum){
  var elem = elements[elemid];
  var node = breadcrumb[level];
  var parent = node ? node.parentNode : breadcrumb[level-1];

  // Save selection before operation
  var sel = document.getSelection();
  var range = sel.getRangeAt(0);
  var savedRange = {
    startContainer: range.startContainer,
    startOffset:    range.startOffset,
    endContainer:   range.endContainer,
    endOffset:      range.endOffset
  };

  // Break parent elements if necessary <breaknum> times
  if(node && node.tagName && breaknum) {
    while(breaknum > 0 && node.parentElement && node.parentElement.parentElement) {
      var parent = node.parentElement;
      var grandparent = node.parentElement.parentElement;
      if(parent.firstChild === node) {
        grandparent.insertBefore(node, parent);
      } else if(parent.lastChild === node) {
        grandparent.insertBefore(node, parent.nextSibling);
      } else {
        // Split parent in two
        var parent2 = parent.cloneNode(false);
        grandparent.insertBefore(parent2, parent.nextSibling);
        while(node.nextSibling) parent2.appendChild(node.nextSibling);
        grandparent.insertBefore(node, parent2);
      }
      breaknum--;
    }
    parent = node.parentNode;
  }

  // Change DOM
  if(elem.tagName) {
    var newElem = document.createElement(elem.tagName);
    function insertInNewNode(n) {
      if(!elem.child || !elem.child.tagName
         || (n.tagName && n.tagName === elem.child.tagName)) {
        newElem.appendChild(n);
        return n;
      } else {
        var e = document.createElement(elem.child.tagName);
        e.appendChild(n);
        newElem.appendChild(e);
        return e;
      }
    }

    if(!range.collapsed && (!node || !node.tagName)) {
      // Extract selection and insert in new node
      var contents = range.extractContents();
      //while(contents.firstChild) insertInNewNode(contents.firstChild);
      var newElemChild = insertInNewNode(contents);
      range.insertNode(newElem);
      range.selectNodeContents(newElemChild);
      savedRange = null;
    } else if(node && node.tagName) {
      // Copy all nodes to new element
      while(node.firstChild) {
        insertInNewNode(node.firstChild);
      }
      parent.replaceChild(newElem, node);
    } else if(node) {
      // Copy non element node to new node
      var nextElem = node.nextSibling;
      insertInNewNode(node);
      parent.insertBefore(newElem, nextElem);
    }
  } else if(node && node.tagName) {
    for(var i = 0; i < node.childNodes.length; ++i) {
      parent.insertBefore(node.childNodes[i], node);
    }
    parent.removeChild(node);
  }

  // Restore selection
  // FIXME: doesn't work if when removing a tag two text nodes are collapsing to
  // a single text node
  if(savedRange) {
    range.setStart(savedRange.startContainer, savedRange.startOffset);
    range.setEnd(savedRange.endContainer, savedRange.endOffset);
  }

  // Give focus back
  if(range.commonAncestorContainer.focus) range.commonAncestorContainer.focus();
  else range.commonAncestorContainer.parentElement.focus();

  // Recompute breadcrumb (force update because selected element hasn't changed
  // but hierarchy has)
  computeBreadcrumb(true);
}

function sendBreadcrumb(){
  if(!computeBreadcrumb())
    event.emit("breadcrumb", breadcrumb_ui);
}

event.on('set-breadcrumb-element-type', setBreadcrumbElementType);

document.addEventListener('selectionchange', computeBreadcrumb);
event.on("get-breadcrumb", sendBreadcrumb);

