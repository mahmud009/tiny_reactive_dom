class DomNode {
  constructor(type, children = []) {
    this.type = type;
    this.children = children;
  }

  appendChild(...nodes) {
    this.children.push(...nodes);
    return nodes;
  }

  removeChild(node) {
    this.children = this.children.filter((child) => child !== node);
    return node;
  }

  replaceChild(newNode, oldNode) {
    this.children = this.children.map((itm) => {
      return itm == oldNode ? newNode : oldNode;
    });
    return newNode;
  }
}

function createDomTree(parent, childCount, depth) {
  if (depth == 0) return;
  if (parent == null) parent = new DomNode("dom_root");
  for (let i = 1; i <= childCount; i++) {
    parent.appendChild(new DomNode(`dom_child_${i}`));
  }
  for (let i = 0; i < parent.children.length; i++) {
    createDomTree(parent.children[i], depth - 1);
  }
  return parent;
}

const domTree = createDomTree(null, 4, 2);

function traverseTree(node) {
  console.log(node.type);

  for (let i = 0; i < node.children.length; i++) {
    traverseTree(node.children[i]);
  }
}
