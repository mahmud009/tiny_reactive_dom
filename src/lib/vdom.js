// --------------utils----------------
function objectToStyleString(obj) {
  if (!obj) return "";
  let entries = Object.entries(obj);
  return entries.map(([key, value]) => `${key}:${value}`).join(";");
}

function createVElement(type) {
  return ({ children = [], className, style, text = "", ...rest }) => {
    let attrs = {};
    if (className) attrs.class = className;
    if (style) attrs.style = objectToStyleString(style);
    attrs = { ...rest, ...attrs };
    return { type, attrs, children, text };
  };
}
// -----------------------------------

// ------------virtual dom element templates-----------
export const script = createVElement("script");
export const div = createVElement("div");
export const span = createVElement("span");
export const img = createVElement("img");
export const a = createVElement("a");
export const p = createVElement("p");
export const h1 = createVElement("h1");
export const h2 = createVElement("h2");
export const h3 = createVElement("h3");
export const h4 = createVElement("h4");
export const h5 = createVElement("h5");
export const h6 = createVElement("h6");
export const button = createVElement("button");
export const icon = createVElement("i");
export const textNode = (text) => createVElement("text").call(null, { text });
// -----------------------------------------------------

export function render(vNode) {
  let domNode;

  if (vNode?.type == "text") {
    domNode = document.createTextNode(vNode.text);
  } else {
    domNode = document.createElement(vNode.type);

    for (let key in vNode.attrs) {
      if (key.startsWith("on")) {
        domNode[key.toLowerCase()] = vNode.attrs[key];
      } else {
        domNode.setAttribute(key, vNode.attrs[key]);
      }
    }

    for (let child of vNode.children) {
      domNode.append(render(child));
    }
  }

  vNode.domRef = domNode;
  return domNode;
}

export function reconcileDom(domParent, oldVNode, newVNode, idx = 0) {
  const domChild = domParent.childNodes[idx];
  const newVChildLen = newVNode?.children.length;
  const oldVChildLen = oldVNode?.children.length;

  // removals
  if (oldVNode && !newVNode) {
    return domParent.removeChild(domChild);
  }

  // additions
  if (!oldVNode && newVNode) {
    return domParent.appendChild(render(newVNode));
  }

  // node definition changed or children length change
  if (isNodeChanged(oldVNode, newVNode) || newVChildLen !== oldVChildLen) {
    return domParent.replaceChild(render(newVNode), domChild);
  }

  if (isClassChanged(oldVNode, newVNode)) {
    domChild.setAttribute("class", newVNode?.attrs?.class);
  }

  if (isStyleChnaged(oldVNode, newVNode)) {
    domChild.setAttribute("style", newVNode?.attrs?.style);
  }

  for (let i = 0; i < newVChildLen || i < oldVChildLen; i++) {
    reconcileDom(domChild, oldVNode?.children[i], newVNode?.children[i], i);
  }
}

function isNodeChanged(oldVNode, newVNode) {
  return oldVNode?.text !== newVNode?.text || oldVNode?.type !== newVNode?.type;
}

function isStyleChnaged(oldVNode, newVNode) {
  const oldStyle = oldVNode?.attrs?.style;
  const newStyle = newVNode?.attrs?.style;
  return oldStyle !== newStyle;
}

function isClassChanged(oldVNode, newVNode) {
  const oldClass = oldVNode?.attrs?.class;
  const newClass = newVNode?.attrs?.class;
  return oldClass !== newClass;
}
