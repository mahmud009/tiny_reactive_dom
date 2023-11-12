// --------------utils----------------
function objectToStyleString(obj) {
  if (!obj) return "";
  let entries = Object.entries(obj);
  return entries.map(([key, value]) => `${key}:${value}`).join(";");
}

function createVNode(type, attrs, ...children) {
  return {
    type,
    attrs: attrs || {},
    children,
  };
}

function createVElement(type) {
  return function ({ children = [], className, style, ...rest }) {
    let attrs = {};
    if (className) attrs.class = className;
    if (style) attrs.style = objectToStyleString(style);
    attrs = { ...rest, ...attrs };
    return createVNode(type, attrs, ...children);
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
// -----------------------------------------------------

export function render(vnode) {
  if (typeof vnode === "string" || typeof vnode === "number") {
    return document.createTextNode(vnode);
  }
  const domNode = document.createElement(vnode.type);

  for (let key in vnode.attrs) {
    if (key.startsWith("on")) {
      domNode[key] = vnode.attrs[key];
    } else {
      domNode.setAttribute(key, vnode.attrs[key]);
    }
  }

  for (let child of vnode.children) {
    domNode.append(render(child));
  }
  return domNode;
}

export function reconcileDom(domParent, oldVNode, newVNode, index = 0) {
  // new additions
  if (!oldVNode?.type && newVNode?.type) {
    domParent.appendChild(render(newVNode));
    return;
  }

  // removals
  if (oldVNode?.type && !newVNode?.type) {
    domParent.removeChild(domParent.childNodes[index]);
    return;
  }

  // changed
  if (isNodeChanged(oldVNode, newVNode)) {
    domParent.replaceChild(render(newVNode), domParent.childNodes[index]);
    return;
  }

  // heuristics for comparing nodes
  if (isStyleChnaged(oldVNode, newVNode)) {
    domParent.childNodes[index].setAttribute("style", newVNode.attrs.style);
  }
  if (isClassChanged(oldVNode, newVNode)) {
    domParent.childNodes[index].setAttribute("class", newVNode?.attrs?.class);
  }

  // Recursively update children
  if (newVNode.type && oldVNode.type) {
    const newLength = newVNode?.children.length;
    const oldLength = oldVNode?.children?.length;
    for (let i = 0; i < newLength || i < oldLength; i++) {
      reconcileDom(
        domParent.childNodes[index],
        oldVNode.children[i],
        newVNode.children[i],
        i
      );
    }
  }
}

function isNodeChanged(oldVNode, newVNode) {
  return (
    typeof oldVNode !== typeof newVNode ||
    (typeof oldVNode === "string" && oldVNode !== newVNode) ||
    (typeof oldVNode === "number" && oldVNode !== newVNode) ||
    oldVNode.type !== newVNode.type
  );
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
