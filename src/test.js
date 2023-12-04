class VNode {
  constructor({ type, children = [], className, style, text = "", ...rest }) {
    this.type = type;
    this.children = children;
    let attrs = {};
    if (className) attrs.class = className;
    if (style) attrs.style = objectToStyleString(style);
    attrs = { ...rest, ...attrs };
    this.attrs = attrs;
    this.text = text;
  }

  appendChild(childVNode) {
    this.children = this.children.filter((vNode) => vNode !== childVNode);
    return childVNode;
  }

  removeChild(childVNode) {
    this.children = this.children.filter((vNode) => vNode !== childVNode);
    return childVNode;
  }

  replaceChild(newVNode, oldVNode) {
    this.children = this.children.map((vNode) => {
      if (vNode == oldVNode) return newVNode;
      return vNode;
    });
    return oldVNode;
  }
}
