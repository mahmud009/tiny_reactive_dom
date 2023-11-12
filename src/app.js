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
} from "./lib/vdom";
import { sampleProducts } from "./utils";
import { State } from "./lib/state";
import { span } from "./lib/vdom";

const store = new State();
// store.setState({ products: sampleProducts });

const ProductCounter = (props) => {
  return div({
    className: "counter",
    children: [
      button({
        onclick: (event) => {
          event.stopPropagation();
          props.onChange(false);
        },
        className: "counter__button dec",
        children: ["-"],
      }),
      div({
        className: "counter__value",
        children: [props.selectedQuantity],
      }),
      button({
        onclick: (event) => {
          event.stopPropagation();
          props.onChange(true);
        },
        className: "counter__button inc",
        children: ["+"],
      }),
    ],
  });
};

const ProductAddToCartButton = (props) => {
  return button({
    onclick: props.onclick,
    className: `product-card__cart-button ${
      props.isAddedToCart ? "remove" : "add"
    }`,
    children: [
      icon({
        className: `fa ${props?.isAddedToCart ? "fa-trash" : "fa-plus"}`,
      }),
      props.isAddedToCart ? "Remove From Cart" : "Add To Cart",
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
            children: [h4({ children: [props.title] })],
          }),
          div({
            className: "product-card__description",
            children: [p({ children: [props.description] })],
          }),
        ],
      }),

      div({
        className: "product-card__footer",
        children: [
          ProductCounter({
            selectedQuantity: props.selectedQuantity,
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
  createEffect(callback) {
    if (this.counter === 0) callback();
    this.counter++;
  }
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

function runOnce() {
  let hasRun = false;
  return function (callback) {
    if (!hasRun) {
      callback();
      hasRun = true;
    }
  };
}

let onceRunner = runOnce();
function sideEffectHandler() {
  let hasRun = false;
  let subscribers = [];
  let renderCount = 0;
  let effectCounter = {};

  function createEffect(cb) {
    onceRunner(() => renderCount++);
    let cbUniqId = Symbol();
    if (effectCounter[cbUniqId] === undefined) effectCounter[cbUniqId] = 0;
  }

  return createEffect;
}

// createEffect();
// createEffect();
const createEffect = sideEffectHandler();
function App() {
  const { products = [], isProductsLoading = true } = store.getState();

  sideEffect.createEffect(async () => {
    const products = await getApiData();
    store.setState({ products, isProductsLoading: false });
  });

  // TODO : fix inconsistent rendering
  if (isProductsLoading) {
    return div({
      className: "preloader",
      children: [
        span({
          className: "preloader__spinner",
          children: ["...loading"],
        }),
      ],
    });
  }

  return div({
    className: "product-container",
    children: products.map((itm) => {
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
  });
}

let historyVtree = App();
store.subscribe(() => {
  // console.log(historyVtree);
  const appRoot = document.querySelector("#app");
  // appRoot.innerHTML = "";
  // appRoot.append(render(App()));

  const newVtree = App();
  // console.log(newVtree);
  reconcileDom(appRoot, historyVtree, newVtree);
  historyVtree = newVtree;
});
document.querySelector("#app")?.appendChild(render(historyVtree));
