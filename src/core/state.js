import { capitalize } from "@/utils/string";

function Store() {
  const subscribers = new Set();
  const watchers = new Map();

  function notifyAll(states) {
    subscribers.forEach((callBack) => callBack && callBack(states));
  }

  function watcher(value, oldValue, key) {
    const valueFn = watchers.get(key);
    valueFn && valueFn(value, oldValue);
  }

  return {
    handler: {
      get(target, prop, receiver) {
        if (!Reflect.has(target, prop)) return null;
        return Reflect.get(...arguments);
      },
      set(target, prop, value) {
        const oldValue = Reflect.get(target, prop);
        const result = Reflect.set(target, prop, value);
        const currentValue = Reflect.get(target, prop);

        notifyAll(target);
        watcher(currentValue, oldValue, prop);

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
    watch(states, _watchers = {}) {
      const _watcher = {};

      Object.keys(_watchers).forEach((key) => {
        watchers.set(key, Reflect.get(_watchers, key));

        const stopKeyWatcher = `stop${capitalize(key)}`;

        Reflect.defineProperty(_watcher, stopKeyWatcher, {
          value: (lastCallBack) => {
            lastCallBack && lastCallBack(Reflect.get(states, key));
            watchers.delete(key);
          },
        });
      });

      return _watcher;
    },
    render(states, callBack) {
      subscribers.add(callBack);
      callBack && callBack(states);

      return () => subscribers.delete(callBack);
    },
  };
}

/**
 * @template {Object.<string, unknown>} T
 * @param {string} name
 * @param {{ state: T, getters: Object.<string,(states: T) => unknown>, watch: Object.<string, unknown> }} options
 * @returns {{ state: T, getters: Object.<string, unknown>, watch: Object.<keyof T, () => void>, render: (states: readonly<T>) => void }}
 */
export function defineStore(name, options) {
  const _store = Store(name);
  const states = new Proxy(options.state, _store.handler);

  return {
    state: states,
    getters: _store.getters(states, options.getters),
    watch: _store.watch(states, options.watch),
    render: (cb) => _store.render(states, cb),
  };
}
