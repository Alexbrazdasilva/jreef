import { describe, expect, it, vi } from "vitest";
import { defineStore } from "@/core/state";

describe("state", () => {
  it("should render store", () => {
    const store = defineStore("counter", {
      state: {
        person: {
          name: "Jhon Doe",
          age: 25,
        },
        counter: 0,
        list: [1, 2, 3],
      },
      getters: {
        double({ counter }) {
          return counter * 2;
        },
        firstMemberOfList({ list }) {
          return list.at(0);
        },
        formattedPerson({ person }) {
          return `${person.name} - ${person.age}`;
        },
      },
    });

    expect(store.getters.double).toBe(0);
    expect(store.getters.firstMemberOfList).toBe(1);
    expect(store.getters.formattedPerson).contains("Jhon Doe");
    expect(store.state.counter).toBe(0);
  });

  it("should return computed values after state changes", () => {
    const store = defineStore("counter", {
      state: {
        counter: 0,
      },
      getters: {
        double({ counter }) {
          return counter * 2;
        },
        multiply({ counter }) {
          return (value) => counter * value;
        },
        isTeenValue({ counter }) {
          return counter === 10;
        },
      },
    });

    store.state.counter = 10;

    expect(store.getters.multiply(3)).toBe(30);
    expect(store.getters.double).toBe(20);
    expect(store.getters.isTeenValue).toBe(true);
  });

  it("should re-render after state update", () => {
    const store = defineStore("counter", {
      state: {
        counter: 0,
      },
    });

    let renders = 0;

    store.render(() => renders++);

    store.state.counter = 1;

    expect(renders).toBe(2);
  });

  it("should cancel re-render call after stop tracker", () => {
    const store = defineStore("counter", {
      state: {
        counter: 0,
      },
      getters: {
        isTeenNumber({ counter }) {
          return counter > 3;
        },
      },
    });

    let renders = 0;

    const stop = store.render(() => {
      renders++;
    });

    store.state.counter++;
    store.state.counter++;
    stop();
    store.state.counter++;

    expect(renders).toBe(3); // render is called in first render state.counter = 0;
  });

  it("should call watch function on change state", () => {
    let calledCount = 0;

    const store = defineStore("counter", {
      state: {
        counter: 0,
        isBoolean: false,
      },
      watch: {
        counter(value, oldValue) {
          calledCount++;
        },
        isBoolean(value, oldValue) {},
      },
    });

    store.state.counter++;
    store.state.isBoolean = true;

    store.watch.stopCounter();

    store.state.counter++;
    store.state.counter++;

    expect(calledCount).toBe(1);
  });
});
