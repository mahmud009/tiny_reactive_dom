// --------------utils----------------
function objectToStyleString(obj) {
  if (!obj) return "";
  let entries = Object.entries(obj);
  return entries.map(([key, value]) => `${key}:${value}`).join(";");
}

function createVNode(type) {
  return ({ children = [], className, style, text = "", ...rest }) => {
    let attrs = {};
    if (className) attrs.class = className;
    if (style) attrs.style = objectToStyleString(style);
    attrs = { ...rest, ...attrs };
    return {
      type,
      attrs,
      children,
      text,
    };
  };
}
// -----------------------------------

// ------------virtual dom element templates-----------
export const script = createVNode("script");
export const div = createVNode("div");
export const span = createVNode("span");
export const img = createVNode("img");
export const a = createVNode("a");
export const p = createVNode("p");
export const h1 = createVNode("h1");
export const h2 = createVNode("h2");
export const h3 = createVNode("h3");
export const h4 = createVNode("h4");
export const h5 = createVNode("h5");
export const h6 = createVNode("h6");
export const button = createVNode("button");
export const input = createVNode("input");
export const icon = createVNode("i");
export const textNode = (text) => createVNode("text").call(null, { text });
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

export function reconcileDom2(domParent, oldDomNode, newDomNode, idx = 0) {
  // removals
  if (oldDomNode && !newDomNode) {
    return domParent.removeChild(oldDomNode);
  }

  // additions
  if (!oldDomNode && newDomNode) {
    return domParent.appendChild(newDomNode);
  }

  // node definition changed
  if (isDomNodeChanged(oldDomNode, newDomNode)) {
    return domParent.replaceChild(newDomNode, domParent.childNodes[idx]);
  }

  const oldChildLen = oldDomNode?.childNodes.length;
  const newChildLen = newDomNode?.childNodes.length;

  for (let child of domParent.childNodes) {
    for (let i = 0; i < newChildLen || i < oldChildLen; i++) {
      reconcileDom2(
        child,
        oldDomNode.childNodes[i],
        newDomNode.childNodes[i],
        i
      );
    }
  }
}

function isDomNodeChanged(oldDomNode, newDomNode) {
  if (oldDomNode.tagName !== newDomNode.tagName) return true;

  let attrsA = Array.from(oldDomNode.attributes);
  let attrsB = Array.from(newDomNode.attributes);

  if (attrsA.length !== attrsB.length) return true;

  for (let attrA of attrsA) {
    if (attrA.value !== newDomNode.getAttribute(attrA.name)) {
      return true;
    }
  }
  return false;
}

let el1 = document.createElement("div");
el1.setAttribute("class", "foo");
el1.setAttribute("style", "bar");
let el2 = document.createElement("div");
el2.setAttribute("class", "foo");
el2.setAttribute("style", "bar");

console.log(isDomNodeChanged(el1, el2));

function isNodeChanged(oldVNode, newVNode) {
  return (
    oldVNode?.text !== newVNode?.text ||
    oldVNode?.type !== newVNode?.type ||
    oldVNode.childNodes.length !== newVNode.childNodes.length
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
