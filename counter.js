import { defineStore } from "./src/core/state";

const store = defineStore("counter", {
  state: {
    value: 0,
  },
  getters: {
    double({ value }) {
      return value * 2;
    },
    currentColorItem({ value }) {
      return value > 2 ? "orange" : "white";
    },
  },
  watch: {
    value(value, oldValue) {},
  },
});

export function setupCounter(element) {
  store.render(() => {
    element.style.color = store.getters.currentColorItem;
    element.innerHTML = `Total de items | ${store.state.value}`;
  });

  element.addEventListener("click", () => {
    store.state.value++;
  });
}
