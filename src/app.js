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
import { getApiData, sampleProducts } from "./utils";
import { State } from "./lib/state";
import { span } from "./lib/vdom";
import "./test";
import { Preloader, ProductCard } from "./components/components";
import { store } from "./lib/state";
import { sideEffect } from "./lib/sideEffect";

function App(props = {}) {
  const {
    products = [],
    shouldUpdateLayout = false,
    isLoading = true,
  } = store.getState();

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

const appRoot = document.querySelector("#app");
let historyVtree = App();
appRoot.appendChild(render(historyVtree));

store.subscribe(function () {
  const newVtree = App();
  reconcileDom(appRoot, historyVtree, newVtree);
  historyVtree = newVtree;
  // console.log(historyVtree);
});

console.log(historyVtree);
