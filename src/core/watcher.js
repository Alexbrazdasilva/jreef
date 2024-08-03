import { STATE } from "@/core/constants";
import { types } from "@/utils/types";

export function defineWatcher(watchers) {
  function watch(options) {
    const { name, value, oldValue, deep } = options;

    if (!watchers.has(name)) return;

    const watcherFn = watchers.get(name);

    if (types.isObj(watcherFn)) {
      const isLazy = Reflect.get(watcherFn, STATE.LAZY);

      if (isLazy) {
        Reflect.set(watcherFn, STATE.LAZY, !isLazy);
        return;
      }

      const handler = Reflect.get(watcherFn, STATE.HANDLER);

      handler && handler(value, oldValue);
      return;
    }

    watcherFn && watcherFn(value, oldValue);
  }

  return { watch };
}
