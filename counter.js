import { defineStore } from "./src/core/state";

const store = defineStore("counter", {
  state: {
    value: 0,
  },
  getters: {
    double({ value }) {
      return value * 2;
    },
    sumValue({ value }) {
      return (current) => current + this.double({ value });
    },
  },
});

export function setupCounter(element) {
  store.state.value = 0;
  const setCounter = () => {
    store.state.value++;

    const finalValue = store.getters.sumValue(store.state.value);
    element.innerHTML = `
    count is ${store.state.value} | ${store.getters.double} | ${finalValue}
    `;
  };

  element.addEventListener("click", () => setCounter());
  setCounter(0);
}
