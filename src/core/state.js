function Store() {
  const subscribers = new Set();

  return {
    handler: {
      get(target, prop, receiver) {
        if (!Reflect.has(target, prop)) return null;

        if (!subscribers.has(prop)) subscribers.add(prop);

        return Reflect.get(...arguments);
      },
      set(target, prop, value) {
        const result = Reflect.set(target, prop, value);
        return result;
      },
    },
    getters(states, getters = {}) {
      const source = {};

      Object.keys(getters).forEach((key) =>
        Reflect.defineProperty(source, key, {
          get: () => getters[key](states),
          configurable: false,
        })
      );

      return Object.freeze(source);
    },
  };
}

/**
 * @template {Object.<string, unknown>} T
 * @param {string} name
 * @param {{ state: T, getters: Object.<string,(states: T) => unknown> }} options
 * @returns {{ state: T, getters: Object.<string, unknown> }}
 */
export function defineStore(name, options) {
  const _store = Store(name);
  const states = new Proxy(options.state, _store.handler);

  return {
    state: states,
    getters: _store.getters(states, options.getters),
  };
}
