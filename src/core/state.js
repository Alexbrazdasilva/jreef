import { STATE } from "@/core/constants";
import { defineGetters } from "@/core/getters";
import { defineNotifier } from "@/core/subscribers";
import { defineWatcher } from "@/core/watcher";
import { types } from "@/utils/types";

const WATCH_KEYS = {
  KEY: "key",
  WATCHER_NAME: "watcherName",
  DEEP: "deep",
  HANDLER: "handler",
};

function Store() {
  const SUBSCRIBERS = new Set();
  const WATCHERS = new Map();
  const propDeepLevel = new Set();
  const deepKeys = new Map();

  const { notify } = defineNotifier(SUBSCRIBERS);

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
    set(target, prop, value) {
      const oldValue = Reflect.get(target, prop);
      const result = Reflect.set(target, prop, value);
      const currentValue = Reflect.get(target, prop);

      notify(target);

      const payload = {
        value: currentValue,
        oldValue,
        watcherName: prop,
        target,
      };

      if (types.isArr(target) || types.isObj(target)) {
        if (prop === "length") return result;

        Reflect.set(payload, WATCH_KEYS.DEEP, handler[STATE.LEVEL]);

        Reflect.set(payload, WATCH_KEYS.WATCHER_NAME, handler[STATE.KEY]);

        if (!handler[STATE.KEY]) {
          const nestedKeyState = [handler[STATE.KEY], prop]
            .filter(Boolean)
            .join(".");

          const isDeepState = handler[STATE.LEVEL] > 1;

          const watcherName = isDeepState ? nestedKeyState : prop;

          Reflect.set(payload, WATCH_KEYS.WATCHER_NAME, watcherName);
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
        });
      });

      return _watcher;
    },
    render(states, callBack) {
      SUBSCRIBERS.add(callBack);
      callBack && callBack(states);

      return () => SUBSCRIBERS.delete(callBack);
    },
    hydrate: notify,
  };
}

export function defineStore(name, options) {
  const _store = Store(name);
  const states = new Proxy(options.state, _store.handler);

  return {
    state: states,
    getters: _store.getters(states, options.getters),
    watch: _store.watch(states, options.watch),
    render: (cb) => _store.render(states, cb),
    hydrate: () => _store.hydrate(states),
  };
}
