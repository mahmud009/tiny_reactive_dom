class SideEffect {
  constructor() {
    this.counter = 0;
  }
  createEffect = (callback) => {
    if (this.counter === 0) callback();
    this.counter++;
  };
}

export const sideEffect = new SideEffect();
