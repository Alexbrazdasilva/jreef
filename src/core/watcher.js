import { STATE } from "@/core/constants";
import { types } from "@/utils/types";

export function defineWatcher(watchers) {
  function watch(_options) {
    const { watcherName, value, oldValue, deep } = _options;

    if (!watchers.has(watcherName)) return;

    const watcherFn = watchers.get(watcherName);

    if (types.isObj(watcherFn)) {
      const handler = Reflect.get(watcherFn, STATE.HANDLER);

      handler && handler(value, oldValue);
      return;
    }

    watcherFn && watcherFn(value, oldValue);
  }

  return { watch };
}
