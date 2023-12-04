import { button, div, reconcileDom2, textNode } from "../lib/vdom";

export class StateCounter {
  constructor(props) {
    this.props = props;
    this.state = { count: 0 };
    // this.nodes = this.render();
    this.rendered = this.render();
    return this.rendered;
  }

  setState(newValue) {
    this.state = newValue;
    const childDomRef = this.rendered.domRef;
    if (childDomRef) {
      const parent = childDomRef.parentNode;
      reconcileDom2(parent, this.rendered, this.render());
    }
  }

  handleChange(isInc) {
    if (isInc) this.setState({ count: this.state.count + 1 });
    else this.setState({ count: this.state.count - 1 });
  }

  render() {
    console.log("rendered");

    return div({
      className: "counter",
      children: [
        button({
          onClick: (event) => {
            event.stopPropagation();
            this.handleChange(false);
          },
          className: "counter__button dec",
          children: [textNode("-")],
        }),
        div({
          className: "counter__value",
          children: [textNode(this.state.count)],
        }),
        button({
          onClick: (event) => {
            event.stopPropagation();
            this.handleChange(true);
          },
          className: "counter__button inc",
          children: [textNode("+")],
        }),
      ],
    });
  }
}
