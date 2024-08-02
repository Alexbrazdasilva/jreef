import { AddPrefix, ValueOf } from "@/types/utils";

export function Store(): void;

type TWatchHandler<T, K extends keyof T> = (
  value: T[K],
  oldValue: T[K]
) => void;

type TWatchOptions<T, K extends keyof T> = {
  handler: TWatchHandler<T, K>;
  lazy: boolean;
};

type TWatch<T, K extends keyof T> = TWatchHandler<T, K> | TWatchOptions<T, K>;

type TOptions<T extends Object, K extends keyof T> = {
  state: T;
  readonly getters: Record<string, ($state: T) => void>;
  readonly watch: { [P in K]: TWatch<T, P> };
};

interface TStore<T extends object, K extends keyof T> {
  state: Record<K, ValueOf<T>>;

  readonly getters: Record<
    keyof T | string,
    Record<"value", ValueOf<T> | (() => void)>
  >;

  /** stop watch */
  readonly watch: AddPrefix<T, "stop">;
  /** render */
  render: ($reef: Readonly<T>) => void;
  /** force re-render */
  hydrate: () => void;
}

export function defineStore<T extends object, K extends keyof T>(
  name: string,
  options: TOptions<T, K>
): TStore<T, K>;
