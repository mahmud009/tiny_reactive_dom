// --------------utils----------------
function objectToStyleString(obj) {
  let entries = Object.entries(obj);
  return entries.map(([key, value]) => `${key}:${value}`).join(";");
}

function createVNode(type, props, ...children) {
  return {
    type,
    props: props || {},
    children,
  };
}

// -----------------------------------

// ------------virtual dom element templates-----------
function vElementBase(type) {
  return function ({ children = [], ...rest }) {
    if (rest.className) {
      rest.class = rest.className;
      delete rest.className;
    }
    if (rest.style) {
      rest.style = objectToStyleString(rest.style);
    }
    return createVNode(type, rest, ...children);
  };
}
export const script = vElementBase("script");
export const div = vElementBase("div");
export const span = vElementBase("span");
export const img = vElementBase("img");
export const a = vElementBase("a");
export const p = vElementBase("p");
export const h1 = vElementBase("h1");
export const h2 = vElementBase("h2");
export const h3 = vElementBase("h3");
export const h4 = vElementBase("h4");
export const h5 = vElementBase("h5");
export const h6 = vElementBase("h6");
export const button = vElementBase("button");
// -----------------------------------------------------

export function render(vnode) {
  if (typeof vnode === "string" || typeof vnode === "number") {
    return document.createTextNode(vnode);
  }
  const domNode = document.createElement(vnode.type);
  for (let key in vnode.props) {
    if (key.startsWith("on")) {
      domNode[key] = vnode.props[key];
    } else {
      domNode.setAttribute(key, vnode.props[key]);
    }
  }
  for (let child of vnode.children) {
    domNode.append(render(child));
  }
  return domNode;
}

export function reconstructDomTree(domParent, oldVNode, newVNode, index = 0) {
  // new additions
  if (!oldVNode && newVNode) {
    domParent.appendChild(render(newVNode));
    return;
  }

  // removals
  if (oldVNode && !newVNode) {
    domParent.removeChild(domParent.childNodes[index]);
    return;
  }

  // TODO : add fine grain heuristics
  // heuristics for comparing nodes
  if (isNodeChanged(oldVNode, newVNode)) {
    domParent.replaceChild(render(newVNode), domParent.childNodes[index]);
  }

  // Recursively update children
  if (newVNode.type && oldVNode.type) {
    const newLength = newVNode.children.length;
    const oldLength = oldVNode?.children?.length;
    for (let i = 0; i < newLength || i < oldLength; i++) {
      reconstructDomTree(
        domParent.childNodes[index],
        oldVNode.children[i],
        newVNode.children[i],
        i
      );
    }
  }
}

function isNodeChanged(node1, node2) {
  return (
    typeof node1 !== typeof node2 ||
    (typeof node1 === "string" && node1 !== node2) ||
    node1.type !== node2.type ||
    !isObjectEqual(node1.props, node2.props)
  );
}

function isObjectEqual(objA, objB) {
  if (!objA || !objB) {
    return false;
  }

  if (Object.keys(objA).length !== Object.keys(objB).length) {
    return false;
  }
  for (let key in objA) {
    if (objA[key] !== objB[key]) {
      return false;
    }
  }
  return true;
}
