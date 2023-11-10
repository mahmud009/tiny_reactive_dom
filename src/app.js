import "./style.scss";
import { div, h4, p, button, render, img } from "./lib/vdom";
import { sampleProducts } from "./utils";
import { State } from "./lib/state";

const store = new State();
store.setState({ products: sampleProducts });

const ProductCard = (props) => {
  const border = `1px solid ${props.isAddedToCart ? "#005b41" : "#292929"}`;
  const buttonText = props.isAddedToCart ? "Remove From Cart" : "Add To Cart";

  return div({
    className: "product-card",
    style: { border },
    onclick: (ev) => {
      const products = store.getState().products;
      const updated = products.map((itm) => {
        if (itm.id === props.id) itm.isAddedToCart = !itm.isAddedToCart;
        return itm;
      });
      store.setState({ products: updated });
    },

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
      div({
        className: "product-card__footer",
        style: { outline: border },
        children: [button({ children: [buttonText] })],
      }),
    ],
  });
};

const App = () => {
  const { products = [] } = store.getState();

  return div({
    className: "app",
    children: [
      div({
        className: "product-container",
        children: products.map((itm) => {
          return ProductCard({
            id: itm.id,
            image: itm.image,
            title: itm.title,
            description: itm.description,
            isAddedToCart: itm.isAddedToCart,
            // onclick: () => console.log(itm),
          });
        }),
      }),
    ],
  });
};

store.subscribe(() => {
  const appRoot = document.querySelector("#app");
  appRoot.innerHTML = "";
  appRoot.appendChild(render(App()));
});
document.querySelector("#app")?.appendChild(render(App()));
