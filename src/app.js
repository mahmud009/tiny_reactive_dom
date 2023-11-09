import "./style.scss";
import { div, h4, p, button, render } from "./lib/vdom";

const productsState = Array.from({ length: 500 }).map((itm, idx) => {
  return {
    id: `tp-${idx + 1}`,
    title: `Mock Title ${idx + 1}`,
    description: `mock product description lorem ipsum it is a long established fact that a reader will be distracted by the readable content ${
      idx + 1
    }`,
    isAddedToCart: false,
  };
});

const ProductCard = (props) => {
  return div({
    className: "product-card",
    onclick: props.onclick,
    style: { border: `1px solid #292929` },
    children: [
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
        style: { outline: `1px solid #292929` },
        children: [button({ children: ["Add To Cart"] })],
      }),
    ],
  });
};

const App = div({
  className: "app",
  children: [
    div({
      className: "product-container",
      children: productsState.map((itm) => {
        return ProductCard({
          title: itm.title,
          description: itm.description,
          onclick: () => console.log(itm),
        });
      }),
    }),
  ],
});

document.querySelector("#app")?.appendChild(render(App));
