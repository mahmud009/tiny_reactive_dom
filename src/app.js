import "./style.scss";
import {
  div,
  h4,
  p,
  button,
  render,
  img,
  reconcileDom,
  icon,
  textNode,
} from "./lib/vdom";
import { sampleProducts } from "./utils";
import { State } from "./lib/state";
import { span } from "./lib/vdom";

const store = new State();

const Counter = (props) => {
  return div({
    className: "counter",
    children: [
      button({
        onclick: (event) => {
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
        onclick: (event) => {
          event.stopPropagation();
          props.onChange(true);
        },
        className: "counter__button inc",
        children: [textNode("+")],
      }),
    ],
  });
};

const ProductAddToCartButton = (props) => {
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

const ProductCard = (props) => {
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

class SideEffect {
  constructor() {
    this.counter = 0;
  }
  createEffect = (callback) => {
    if (this.counter === 0) callback();
    this.counter++;
  };
}
const sideEffect = new SideEffect();

async function getApiData() {
  return new Promise((resolve, reject) => {
    let timeout = setTimeout(() => {
      resolve(sampleProducts);
      clearTimeout(timeout);
    }, 1000);
  });
}

function App(props = {}) {
  const {
    products = [],
    isProductsLoading = true,
    shouldUpdateLayout = false,
  } = store.getState();

  sideEffect.createEffect(async () => {
    const products = await getApiData();
    store.setState({ products, isProductsLoading: false });
  });

  if (isProductsLoading) {
    return div({
      className: "preloader",
      children: [
        textNode("hello"),
        span({
          className: "preloader__spinner",
          children: [textNode("...loading")],
        }),
      ],
    });
  }

  let productCards = products.map((itm) => {
    return ProductCard({
      id: itm.id,
      image: itm.image,
      title: itm.title,
      description: itm.description,
      maxQuantity: itm.maxQuantity,
      selectedQuantity: itm.selectedQuantity,
      isAddedToCart: itm.isAddedToCart,
    });
  });

  return div({
    className: "product-container",
    children: shouldUpdateLayout
      ? productCards
      : [
          textNode("hello"),
          button({
            className: "button-default primary",
            onclick: () => {
              store.setState({ ...store.getState(), shouldUpdateLayout: true });
            },
            children: [textNode("Click me")],
          }),
          div({
            className: "secondary-container",
            children: [
              ...products.map((itm) => {
                return ProductCard({
                  id: itm.id,
                  image: itm.image,
                  title: itm.title,
                  description: itm.description,
                  maxQuantity: itm.maxQuantity,
                  selectedQuantity: itm.selectedQuantity,
                  isAddedToCart: itm.isAddedToCart,
                });
              }),
            ],
          }),
        ],
  });
}

const appRoot = document.querySelector("#app");
let historyVtree = App();
appRoot.appendChild(render(appRoot, historyVtree));

store.subscribe(function () {
  const newVtree = App();
  reconcileDom(appRoot, historyVtree, newVtree);
  historyVtree = newVtree;
  console.log(historyVtree);
});

console.log(historyVtree);
