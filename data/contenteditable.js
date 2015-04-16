var oldContentEditable = document.documentElement.contentEditable;
document.documentElement.contentEditable = "true";

self.port.on('detach', function(){
  document.documentElement.contentEditable = oldContentEditable;
});

selectionchange.start();

// Handle Enter key

document.addEventListener('keydown', function(ev){
  if(ev.key !== 'Enter') return;
  /* for each range in selection
   * - delete content
   * - make sure range is collapsed
   * - shallow clone the node that contains the range (commonAncestorContainer)
   * - extract content from the caret to the end of the ancestor node
   * - put that fragment inside the cloned node
   * - insert the cloned node after the current node
   * 
   * do something different if shift is pressed (br element or \n depending on
   * css white-space property FIXME)
   */
  var sel = this.getSelection();
  for(var i = 0; i < sel.rangeCount; ++i){
    var range = sel.getRangeAt(i);
    range.deleteContents();
    if(ev.shiftKey) {
      range.insertNode(this.createElement("br"));
    } else {
      //console.log("range after delete: " + range.startContainer + range.startOffset + range.endContainer + range.endOffset);
      //range.setEndAfter(range.commonAncestorContainer);
      var ancestor = range.commonAncestorContainer;
      //console.log("range to extract: " + range.startContainer + range.startOffset + ancestor.parentNode + (ancestor.parentNode.childNodes.length));
      range.setEnd(ancestor.parentNode, ancestor.parentNode.childNodes.length);
      //console.log("range to extract: " + range.startContainer + range.startOffset + range.endContainer + range.endOffset);
      var extracted = range.extractContents();
      var newNode;
      //console.log("range after extract: " + range.startContainer + range.startOffset + range.endContainer + range.endOffset);
      //console.log("extracted: " + extracted + " " + extracted.childElementCount + " " + extracted.firstElementChild + " " + extracted.childNodes + " " + extracted.childNodes.length);
      //console.log(extracted);
      //console.log(extracted.innterHTML);
      if(extracted.firstElementChild instanceof Element && extracted.childNodes.length === 1) {
        //console.log("duplicate extracted")
        newNode = extracted.firstChild;
      } else {
        ancestor = ancestor.parentElement;
        //console.log("duplicate parent " + ancestor)
        newNode = ancestor.cloneNode(false);
        var n = extracted.firstChild;
        while(n) {
          var next = n.nextSibling;
          newNode.appendChild(n);
          n = next;
        }
      }
      newNode.removeAttribute('id');
      //console.log("new node: " + newNode + " " + newNode.textContent);
      ancestor.parentNode.insertBefore(newNode, ancestor.nextSibling);
      range.setStart(newNode, 0);
      range.setEnd(newNode, 0);
    }
  }
  ev.preventDefault();
});
