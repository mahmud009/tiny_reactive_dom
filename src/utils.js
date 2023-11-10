export const sampleProducts = Array.from({ length: 50 }).map((itm, idx) => {
  return {
    id: `tp-${idx + 1}`,
    image: `https://picsum.photos/seed/${idx + 1}/400/250`,
    title: `Mock Title ${idx + 1}`,
    description: `mock product description lorem ipsum it is a long established fact that a reader will be distracted by the readable content ${
      idx + 1
    }`,
    isAddedToCart: false,
  };
});
