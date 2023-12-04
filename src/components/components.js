import { button, div, h4, icon, img, p, textNode } from "../lib/vdom";
import { store } from "../lib/state";

export const Counter = (props) => {
  return div({
    className: "counter",
    children: [
      button({
        onClick: (event) => {
          event.stopPropagation();
          props.onChange(false);
        },
        className: "counter__button dec",
        children: [textNode("-")],
      }),
      div({
        className: "counter__value",
        children: [textNode(props.value)],
      }),
      button({
        onClick: (event) => {
          event.stopPropagation();
          props.onChange(true);
        },
        className: "counter__button inc",
        children: [textNode("+")],
      }),
    ],
  });
};

export const ProductAddToCartButton = (props) => {
  return button({
    onclick: props.onclick,
    className: `button-default ${
      props.isAddedToCart ? "secondary" : "primary"
    }`,
    children: [
      icon({
        className: `fa ${props?.isAddedToCart ? "fa-trash" : "fa-plus"}`,
      }),
      props.isAddedToCart
        ? textNode("Remove From Cart")
        : textNode("Add To Cart"),
    ],
  });
};

export const ProductCard = (props) => {
  // handling add to cart
  const handleAddToCart = (event) => {
    event.stopPropagation();
    const products = store.getState().products;
    const updated = products.map((itm) => {
      if (itm.id === props.id) itm.isAddedToCart = !itm.isAddedToCart;
      return itm;
    });
    store.setState({ products: updated });
  };

  // handling quantity change
  const handleChangeQuantity = (isInc) => {
    const products = store.getState().products;
    const updated = products.map((itm) => {
      if (itm.id == props.id) {
        let selectedQuantity = itm.selectedQuantity;
        if (isInc) selectedQuantity = itm.selectedQuantity + 1;
        if (!isInc) selectedQuantity = itm.selectedQuantity - 1;
        if (selectedQuantity > 0 && selectedQuantity <= itm.maxQuantity) {
          itm.selectedQuantity = selectedQuantity;
        }
      }
      return itm;
    });
    store.setState({ products: updated });
  };

  return div({
    className: "product-card",
    onclick: handleAddToCart,
    style: {
      border: `1px solid ${props.isAddedToCart ? "#005b41" : "#292929"}`,
    },
    children: [
      div({
        className: "product-card__body",
        children: [
          img({
            className: "product-card__image",
            src: props.image,
          }),
          div({
            className: "product-card__title",
            children: [h4({ children: [textNode(props.title)] })],
          }),
          div({
            className: "product-card__description",
            children: [p({ children: [textNode(props.description)] })],
          }),
        ],
      }),

      div({
        className: "product-card__footer",
        children: [
          Counter({
            value: props.selectedQuantity,
            onChange: handleChangeQuantity,
          }),
          ProductAddToCartButton({
            isAddedToCart: props.isAddedToCart,
            onclick: handleAddToCart,
          }),
        ],
      }),
    ],
  });
};

export const Preloader = () => {
  return div({
    className: "preloader",
    children: [
      icon({
        className: "fa-solid fa-circle-notch",
      }),
    ],
  });
};
