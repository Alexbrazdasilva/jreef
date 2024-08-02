import { capitalize } from "@/utils/string";

export const STATE = Object.freeze({
  KEY: "$__key__",
  LEVEL: "$__level__",
  DEEP: "$__deep__",
  HANDLER: "handler",
  LAZY: "lazy",
  WATCHER_STOP: (key) => `stop${capitalize(key)}`,
});
