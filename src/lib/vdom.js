// --------------utils----------------
function objectToStyleString(obj) {
  let entries = Object.entries(obj);
  return entries.map(([key, value]) => `${key}:${value}`).join(";");
}
// -----------------------------------

function createBinaryTree(depth, createNode) {
  const node = createNode();
  let children = [];
  if (depth > 0) {
    children.push(createBinaryTree(depth - 1, createNode));
    children.push(createBinaryTree(depth - 1, createNode));
  }
  node.children = children;
  return node;
}

function traverseTree(node, action) {
  action(node);
  for (let child of node.children) {
    traverseTree(child, action);
  }
}

function createVNode(type, props, ...children) {
  return {
    type,
    props: props || {},
    children,
  };
}

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
