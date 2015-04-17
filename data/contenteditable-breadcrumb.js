var breadcrumb = [];
var breadcrumb_ui = [];
var lastFocusElement;

function getReplacement(parentElement, element) {
  return Array.prototype.concat.apply(
    elements
      .filter(e =>
                element &&
                (e.same ? e.same(element) : e.tagName === element.tagName)),
    elements
      .filter(e => parentElement && e.tagName == parentElement.tagName)
      .map(   e => elements.filter(e.include || (e => false))))
  .sort((a, b) => a.id > b.id)
  .filter((e, i, a) => i === 0 || a[i-1].id !== e.id)
  //.reduce(((a, b) => (!a.length || a[a.length-1].id !== b.id) ? a.concat([b]) : a),
  //        []);
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

function setBreadcrumbElementType(level, elemid){
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

  // Change DOM
  if(elem.tagName) {
    var newElem = document.createElement(elem.tagName);
    var newElemChild = newElem;
    if(elem.child.tagName) {
      newElemChild = document.createElement(elem.child.tagName);
      newElem.appendChild(newElemChild);
    }
    if(!range.collapsed && (!node || !node.tagName)) {
      newElemChild.appendChild(range.extractContents());
      range.insertNode(newElem);
      range.selectNodeContents(newElemChild);
      savedRange = null;
    } else if(node && node.tagName) {
      for(var i = 0; i < node.childNodes.length; ++i) {
        newElemChild.appendChild(node.childNodes[i]);
      }
      parent.replaceChild(newElem, node);
    } else if(node) {
      var nextElem = node.nextSibling;
      newElemChild.appendChild(node);
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

