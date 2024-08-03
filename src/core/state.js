import { defineGetters } from "@/core/getters";
import { defineRenders } from "@/core/renders";
import { defineNotifier } from "@/core/subscribers";
import { defineWatcher } from "@/core/watcher";

import { STATE, WATCH } from "@/core/constants";
import { types } from "@/utils/types";

function Store() {
  const SUBSCRIBERS = new Set();
  const WATCHERS = new Map();
  const propDeepLevel = new Set();
  const deepKeys = new Map();

  const { notify } = defineNotifier(SUBSCRIBERS);
  const { render } = defineRenders(SUBSCRIBERS);
  const { watch } = defineWatcher(WATCHERS);

  const handler = {
    get(target, prop, receiver) {
      if (prop === "_isProxy") return true;
      if (!Reflect.has(target, prop)) return undefined;

      if (types.isArr(target[prop]) || types.isObj(target[prop])) {
        Reflect.set(handler, STATE.KEY, prop);
        Reflect.set(handler, STATE.LEVEL, propDeepLevel.size);

        propDeepLevel.add(propDeepLevel.size + 1);

        return new Proxy(Reflect.get(...arguments), handler);
      }

      return Reflect.get(...arguments);
    },
    set(target, name, value) {
      const oldValue = Reflect.get(target, name);
      const result = Reflect.set(target, name, value);
      const currentValue = Reflect.get(target, name);

      notify(target);

      const payload = {
        value: currentValue,
        oldValue,
        name,
        target,
      };

      if (types.isArr(target) || types.isObj(target)) {
        if (name === "length") return result;

        Reflect.set(payload, WATCH.DEEP, handler[STATE.LEVEL]);
        Reflect.set(payload, WATCH.WATCHER_NAME, handler[STATE.KEY]);

        if (!handler[STATE.KEY]) {
          const nestedKeyState = [handler[STATE.KEY], name]
            .filter(Boolean)
            .join(".");

          const isDeepState = handler[STATE.LEVEL] > 1;

          const watcherName = isDeepState ? nestedKeyState : name;

          Reflect.set(payload, WATCH.WATCHER_NAME, watcherName);
        }
      }

      watch(payload);

      return result;
    },
    [STATE.KEY]: null,
    [STATE.LEVEL]: propDeepLevel.size,
    [STATE.DEEP]: "",
  };

  return {
    handler,
    getters: defineGetters,
    watch(states, _watchers = {}) {
      const _watcher = {};

      Reflect.ownKeys(_watchers).forEach((key) => {
        const watcher = Reflect.get(_watchers, key);

        if (types.isObj(watcher)) {
          deepKeys.set(key, handler[STATE.LEVEL]);
        }

        WATCHERS.set(key, watcher);

        Reflect.defineProperty(_watcher, STATE.WATCHER_STOP(key), {
          value: (lastCallBack) => {
            lastCallBack && lastCallBack(Reflect.get(states, key));
            WATCHERS.delete(key);
          },
          writable: false,
          configurable: false,
        });
      });

      return _watcher;
    },
    hydrate: notify,
    render,
  };
}

export function defineStore(name, options) {
  const _store = Store(name);
  const state = new Proxy(options.state, _store.handler);

  return {
    state,
    getters: _store.getters(state, options.getters),
    watch: _store.watch(state, options.watch),
    render: (cb) => _store.render(state, cb),
    hydrate: () => _store.hydrate(state),
  };
}
