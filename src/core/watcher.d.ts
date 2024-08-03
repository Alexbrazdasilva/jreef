type TWatcherHandler = () => void;

type TWatcher = Map<string, TWatcherHandler>;

type TOption<T> = {
  name: string;
  value: T;
  oldValue: T;
  deep: "";
};

type TCache = {
  index: Set<number>;
  log: Map<number, { [key: string]: any }>;
};

interface Watcher {
  watch<T extends object>(options: TOption<T>): void;
}

export function defineWatcher(watchers: TWatcher, cache: TCache): Watcher;

export const WATCH_KEYS: Readonly<{
  KEY: "key";
  WATCHER_NAME: "name";
  DEEP: "deep";
  HANDLER: "handler";
}>;
