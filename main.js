import "./style.css";
import { defineStore } from "@/core/state";

const html = String.raw;

const store = defineStore("card", {
  state: {
    value: 0,
  },
  getters: {
    double({ value }) {
      return value * 2;
    },
    currentColorItem({ value }) {
      return value > 2 ? (value >= 10 ? "red" : "orange") : "white";
    },
    isZero({ value }) {
      return value === 0;
    },
  },
});

function incrementValue() {
  store.state.value++;
}

function decrementValue() {
  if (store.getters.isZero) return;
  store.state.value--;
}

store.render(() => {
  document.querySelector("#app").innerHTML = html`
    <div>
      <h1 style="color: ${store.getters.currentColorItem}">
        ${store.state.value}
      </h1>
      <div class="card">
        <button type="button" data-event="@incrementValue">Add Value +1</button>
        <button
          type="button"
          ${store.getters.isZero ? "disabled" : ""}
          data-event="@decrementValue"
        >
          Remove -1
        </button>
      </div>
    </div>
  `;

  document
    .querySelector("[data-event='@incrementValue']")
    .addEventListener("click", () => incrementValue()); // Re-binding on re-render

  document
    .querySelector("[data-event='@decrementValue']")
    .addEventListener("click", () => decrementValue()); // Re-binding on re-render
});
