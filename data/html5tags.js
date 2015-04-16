Tag({
  tagName: "body",
  children: function(node){
    node.
  }
});

Tag({
  tagName: "hgroup",
  children: function(node){
    return ["h1", "h2", "h3", "h4", "h5", "h6", "template"];
  }
});



// https://html.spec.whatwg.org/multipage/dom.html#kinds-of-content
var html5tags = (function(){
  // :parent(...)
  // :not(...)
  // #text
  // #text that is not inter-element whitespace
  // #transparent
  var metadata_content = ["base", "link", "meta", "noscript", "script", "style",
    "template", "title"];
  var flow_content = ["a", "abbr", "address", "area:parent(map,template)",
    "article", "aside", "audio", "b", "bdi", "bdo", "blockquote", "br",
    "button", "canvas", "cite", "code", "data", "datalist", "del", "details",
    "dfn", "dialog", "div", "dl", "emembed", "fieldset", "figure", "footer",
    "form", "h1", "h2", "h3", "h4", "h5", "h6", "header", "hgroup", "hr", "i",
    "iframe", "img", "input", "ins", "kbd", "keygen", "label", "link[itemprop]",
    "main", "map", "mark", "math", "menu", "meta[itemprop]", "meter", "nav",
    "noscript", "object", "ol", "output", "p", "pre", "progress", "q", "ruby",
    "s", "samp", "script", "section", "select", "small", "span", "strong",
    "style[scoped]", "sub", "sup", "svg", "table", "template", "textarea",
    "time", "u", "ul", "var", "video", "wbr", "#text"];
  var sectioning_content = ["article", "aside", "nav", "section"];
  var heading_content = ["h1", "h2", "h3", "h4", "h5", "h6", "hgroup"];
  var phrasing_content = ["a", "abbr", "area:parent(map,template)", "audio",
    "b", "bdi", "bdo", "br", "button", "canvas", "cite", "code", "data",
    "datalist", "del", "dfn", "em", "embed", "i", "iframe", "img", "input",
    "ins", "kbd", "keygen", "label", "link[itemprop]", "map", "mark", "math",
    "meta[itemprop]", "meter", "noscript", "object", "output", "progress", "q",
    "ruby", "s", "samp", "script", "select", "small", "span", "strong", "sub",
    "sup", "svg", "template", "textare", "a", "time", "u", "var", "video",
    "wbr", "#text"];
  var embedded_content = ["audio", "canvas", "embed", "iframe", "img", "math",
    "object", "svg", "video"];
  var interactive_content = ["a", "audio[controls]", "button", "details",
    "embed", "iframe", "img[usemap]", "input[type!=hidden]", "keygen", "label",
    "object[usemap", "select", "textarea", "sorting interface th elements",
    "video[controls]", "*[tabindex]"];
  var palpable_content = ["a", "abbr", "address", "article", "aside",
    "audio[controls]", "b", "bdi", "bdo", "blockquote", "button", "canvas",
    "cite", "code", "data", "details", "dfn", "div",
    "dl (if the element's children include at least one name-value group)",
    "emembed", "fieldset", "figure", "footer", "form", "h1", "h2", "h3", "h4",
    "h5", "h6", "header", "hgroup", "i", "iframe", "img", "input[type!=hidden]",
    "ins", "kbd", "keygen", "label", "main", "map", "mark", "math",
    "menu[type=toolbar]", "meter", "nav", "object", "ol>li", "output", "p",
    "pre", "progress", "q", "ruby", "s", "samp", "section", "select", "small",
    "span", "strong", "sub", "sup", "svg", "table", "textarea", "time", "u",
    "ul>li", "var", "video", "#text that is not inter-element whitespace"];
  var script_supporting_elements = ["script", "template"];
  return {
    "html": ["head", "body"],
    "head": "$metadata",
    "body": "$flow",
    "map":  "#transparent",
    "article": "$flow",
    "section": "$flow",
    "nav": "$flow:not(main)",
    "aside": "$flow:not(main)",
    "h1": "$phrasing", "h2": "$phrasing", "h3": "$phrasing",
    "h4": "$phrasing", "h5": "$phrasing", "h6": "$phrasing",
    "hgroup": ["h1", "h2", "h3", "h4", "h5", "h6", "template"],
    "header": "$flow:not(header,footer,main)",
    "footer": "$flow:not(header,footer,main)",
    "address": "$flow:not($heading,$sectioning,header,footer,address)",
    "p": "$phrasing",
    "hr": false,
    "pre": "$phrasing",
    "blockquote": "$flow",
    "ol": ["li", "$script"],
    "ul": ["li", "$script"],
    "li": "$flow",
    "dl": ["dd", "dt", "$script"],
    "dt": "$flow:not(header,footer,$sectioning,$heading)",
    "dd": "$flow",
    "figure": ["$flow", "figcaption" /* beginning or end */],
    "figcaption": "$flow",
    "a":    "#transparent:not($interactive)",
    "$metadata":    metadata_content,
    "$flow":        flow_content,
    "$sectioning":  sectioning_content,
    "$heading":     heading_content,
    "$phrasing":    phrasing_content,
    "$embedded":    embedded_content,
    "$interactive": interactive_content,
    "$palpable":    palpable_content,
    "$script":      script_supporting_elements
  };
})();

Tags

Tag({
  tagName: "a",
  children: function(parent, attrs){
    return parent().map(function(e){
      if(e.interactive)
    });
  }
});