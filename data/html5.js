var elements = (function(){
  var t = [
    { name: "No Format",
      phrasing: true,
      flow: true,
      tagName: "",
      sample: "Aa"
    },
    { name: "HTML Document",
      tagName: "HTML",
      include: e => e.tagName === "BODY" || e.tagName === "HEAD"
    },
    { name: "Body",
      tagName: "BODY",
      include: e => e.flow
    },
    { name: "Paragraph",
      flow: true,
      tagName: "P",
      include: e => e.phrasing,
      sample: '<p style="margin-top:0;margin-bottom:0">Aa</p>'
    },
    { name: "heading 1",
      flow: true,
      tagName: "H1",
      include: e => e.phrasing,
      sample: '<h1 style="margin-top:0;margin-bottom:0">Aa</h1>'
    },
    { name: "Heading 2",
      flow: true,
      tagName: "H2",
      include: e => e.phrasing,
      sample: '<h2 style="margin-top:0;margin-bottom:0">Aa</h2>'
    },
    { name: "Heading 3",
      flow: true,
      tagName: "H3",
      include: e => e.phrasing,
      sample: '<h3 style="margin-top:0;margin-bottom:0">Aa</h3>'
    },
    { name: "Heading 4",
      flow: true,
      tagName: "H4",
      include: e => e.phrasing,
      sample: '<h4 style="margin-top:0;margin-bottom:0">Aa</h4>'
    },
    { name: "Heading 5",
      flow: true,
      tagName: "H5",
      include: e => e.phrasing,
      sample: '<h5 style="margin-top:0;margin-bottom:0">Aa</h5>'
    },
    { name: "Heading 6",
      flow: true,
      tagName: "H6",
      include: e => e.phrasing,
      sample: '<h6 style="margin-top:0;margin-bottom:0">Aa</h6>'
    },
    { name: "Preformat",
      flow: true,
      tagName: "PRE",
      include: e => e.phrasing,
      sample: '<pre>Aa</pre>'
    },
    { name: "List",
      flow: true,
      tagName: "UL",
      child: {tagName: "LI"},
      include: e => e.tagName == "LI",
      sample: '<ul style="margin-top:0;margin-bottom:0"><li>Aa</li></ul>'
    },
    { name: "Ordered List",
      flow: true,
      tagName: "OL",
      child: {tagName: "LI"},
      include: e => e.tagName == "LI",
      sample: '<ol style="margin-top:0;margin-bottom:0"><li>Aa</li></ol>'
    },
    { name: "List Item",
      tagName: "LI",
      include: e => e.flow,
      sample: '<li>Aa</li>'
    },
    { name: "Block Layer",
      flow: true,
      tagName: "DIV",
      include: e => e.flow,
      sample: '<div>Aa</div>'
    },
    { name: "Strong",
      phrasing: true,
      flow: true,
      tagName: "STRONG",
      include: e => e.phrasing,
      sample: '<strong>Aa</strong>'
    },
    { name: "Bold",
      phrasing: true,
      flow: true,
      tagName: "B",
      include: e => e.phrasing,
      sample: '<b>Aa</b>'
    },
    { name: "Emphasis",
      phrasing: true,
      flow: true,
      tagName: "EM",
      include: e => e.phrasing,
      sample: '<em>Aa</em>'
    },
    { name: "Italic",
      phrasing: true,
      flow: true,
      tagName: "I",
      include: e => e.phrasing,
      sample: '<i>Aa</i>'
    },
    { name: "Underline",
      phrasing: true,
      flow: true,
      tagName: "U",
      include: e => e.phrasing,
      sample: '<u>Aa</u>'
    },
    { name: "Small",
      phrasing: true,
      flow: true,
      tagName: "SMALL",
      include: e => e.phrasing,
      sample: '<small>Aa</small>'
    },
    { name: "Marked",
      phrasing: true,
      flow: true,
      tagName: "MARK",
      include: e => e.phrasing,
      sample: '<mark>Aa</mark>'
    },
    { name: "Subscript",
      phrasing: true,
      flow: true,
      tagName: "SUB",
      include: e => e.phrasing,
      sample: 'A<sub>x</sub>'
    },
    { name: "Superscript",
      phrasing: true,
      flow: true,
      tagName: "SUP",
      include: e => e.phrasing,
      sample: 'A<sup>x</sup>'
    },
    { name: "Deleted",
      phrasing: true,
      flow: true,
      tagName: "DEL",
      include: e => e.phrasing,
      sample: '<del>Aa</del>'
    },
    { name: "Inserted",
      phrasing: true,
      flow: true,
      tagName: "INS",
      include: e => e.phrasing,
      sample: '<ins>Aa</ins>'
    },
    { name: "Inline Layer",
      phrasing: true,
      flow: true,
      tagName: "SPAN",
      include: e => e.phrasing,
      sample: '<span>Aa</span>'
    }
  ];
  for(var i = 0; i < t.length; ++i) {
    t[i].id = i;
  }
  return t;
})();