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
  input,
  reconcileDom2,
} from "./lib/vdom";
import { getApiData, sampleProducts } from "./utils";
import { State } from "./lib/state";
import { span } from "./lib/vdom";
import "./test";
import { Preloader, ProductCard } from "./components/components";
import { store } from "./lib/state";
import { sideEffect } from "./lib/sideEffect";
import { StateCounter } from "./components/StateCounter";

function App(props = {}) {
  const {
    products = [],
    shouldUpdateLayout = false,
    isLoading = true,
    inputValue = 10,
  } = store.getState();

  // const stateCounter1 = new StateCounter({});
  // const stateCounter2 = new StateCounter({});

  // return div({
  //   className: "state-counter-parent",
  //   children: [stateCounter1, stateCounter2],
  // });

  sideEffect.createEffect(async () => {
    const products = await getApiData();
    store.setState({ products, isLoading: false });
  });

  return isLoading
    ? Preloader()
    : div({
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

// const appRoot = document.querySelector("#app");
// let historyDomTree = render(App());
// appRoot.appendChild(historyDomTree);

// store.subscribe(function () {
//   const newDomTree = render(App());
//   reconcileDom2(appRoot, historyDomTree, newDomTree);
// });
