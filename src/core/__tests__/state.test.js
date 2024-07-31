import { describe, expect, it } from "vitest";
import { defineStore } from "@/core/state";

describe("test", () => {
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

  it("should return computed values on change states", () => {
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
      },
    });

    store.state.counter = 10;

    expect(store.getters.multiply(3)).toBe(30);
    expect(store.getters.double).toBe(20);
  });
});
