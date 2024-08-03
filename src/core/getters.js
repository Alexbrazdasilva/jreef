export function defineGetters(states, getters = {}) {
  const source = {};

  Object.keys(getters).forEach((key) =>
    Reflect.defineProperty(source, key, {
      get: () => {
        const getterFn = Reflect.get(getters, key);
        const res = {};

        Reflect.defineProperty(res, "value", {
          value: getterFn(states),
          writable: false,
          configurable: false,
        });

        return res;
      },
      configurable: false,
    })
  );

  return Object.freeze(source);
}
