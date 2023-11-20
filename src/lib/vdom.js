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

export function render(domParent, vNode) {
  if (!vNode) return vNode;

  if (vNode?.type == "text") {
    return document.createTextNode(vNode.text);
  }

  if (domParent) vNode.domParent = domParent;

  const domNode = document.createElement(vNode.type);

  for (let key in vNode.attrs) {
    if (key.startsWith("on")) {
      domNode[key] = vNode.attrs[key];
    } else {
      domNode.setAttribute(key, vNode.attrs[key]);
    }
  }

  for (let child of vNode.children) {
    domNode.append(render(domNode, child));
  }
  return domNode;
}

export function reconcileDom(domParent, oldVNode, newVNode, index = 0) {
  const domChild = domParent?.childNodes[index];
  newVNode.domParent = domChild?.parentNode;

  // new additions
  if (!oldVNode && newVNode && domParent) {
    domParent.appendChild(render(null, newVNode));
    return;
  }

  // removals
  if (oldVNode && !newVNode && domChild) {
    domParent.removeChild(domChild);
    return;
  }

  // changed
  if (isNodeChanged(oldVNode, newVNode)) {
    const rendered = render(null, newVNode);
    if (rendered && domChild) {
      domParent.replaceChild(rendered, domChild);
    }
  }

  // heuristics for comparing nodes
  if (isStyleChnaged(oldVNode, newVNode) && domChild) {
    domChild.setAttribute("style", newVNode?.attrs?.style);
  }
  if (isClassChanged(oldVNode, newVNode) && domChild) {
    domChild.setAttribute("class", newVNode?.attrs?.class);
  }

  // Recursively update children
  if (domParent?.childNodes.length > 0) {
    const newLength = newVNode?.children.length;
    const oldLength = oldVNode?.children?.length;

    for (let i = 0; i < newLength || i < oldLength; i++) {
      reconcileDom(
        newVNode.domParent,
        oldVNode.children[i],
        newVNode.children[i],
        i
      );
    }
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

function isDomParentChanged(domParent, oldVNode, newVNode) {
  return oldVNode?.domParent !== newVNode?.domParent && domParent && newVNode;
}
