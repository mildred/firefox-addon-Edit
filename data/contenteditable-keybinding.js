// Handle Enter key

document.addEventListener('keydown', function(ev){
  if(ev.key !== 'Enter') return;

  // Run this for each range in the selection
  var sel = this.getSelection();
  for(var i = 0; i < sel.rangeCount; ++i){
    var range = sel.getRangeAt(i);

    // Delete selected content, collapses the range
    range.deleteContents();

    // Find where we are and detect white space policy according to CSS
    var whiteSpace = getComputedStyle(range.commonAncestorContainer).whiteSpace;
    var ancestor = range.commonAncestorContainer;
    if(!ancestor.tagName) ancestor = ancestor.parentElement
    /*while(ancestor && getComputedStyle(ancestor).display === 'inline') {
      ancestor = ancestor.parentElement
    }*/

    if(ev.shiftKey
       || ancestor === document.body
       || ancestor === document.documentElement)
    {
      // Shift key pressed or we are at the root of the page. Insert line break
      if(whiteSpace.substr(0, 3) === 'pre') {
        range.insertNode(this.createTextNode("\n"));
      } else {
        range.insertNode(this.createElement("br"));
      }

      // Deselect inserted node by collapsing the range
      range.setStart(range.endContainer, range.endOffset);

    } else {
      ancestor = range.commonAncestorContainer;
      range.setEnd(ancestor.parentNode, ancestor.parentNode.childNodes.length);
      var extracted = range.extractContents();
      var newNode;
      if(extracted.firstElementChild instanceof Element && extracted.childNodes.length === 1) {
        newNode = extracted.firstChild;
      } else {
        ancestor = ancestor.parentElement;
        newNode = ancestor.cloneNode(false);
        var n = extracted.firstChild;
        while(n) {
          var next = n.nextSibling;
          newNode.appendChild(n);
          n = next;
        }
      }
      newNode.removeAttribute('id');
      ancestor.parentNode.insertBefore(newNode, ancestor.nextSibling);
      range.setStart(newNode, 0);
      range.setEnd(newNode, 0);
    }
    /*} else {
      // Duplicate the ancestor node:
      // Extract the content from the caret to the end of the ancestor
      range.setEnd(ancestor, ancestor.childNodes.length);
      var extracted = range.extractContents();
      console.log("Extracted: " + extracted.outerHTML);

      // Shallow clone the node that contains the range and do some cleaning
      var newNode = ancestor.cloneNode(false);
      newNode.removeAttribute('id');

      // Link extracted content to new node, and new node to DOM
      newNode.appendChild(extracted);
      ancestor.parentNode.insertBefore(newNode, ancestor.nextSibling);

      // Reset selection and give focus
      range.setStart(newNode, 0);
      range.setEnd(newNode, 0);
      newNode.focus();
    }*/
  }
  ev.preventDefault();
}, true);
