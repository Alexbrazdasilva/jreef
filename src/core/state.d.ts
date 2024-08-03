import { AddPrefix, ValueOf } from "@/types/utils";

type TWatchHandler<T, K extends keyof T> = (
  value: T[K],
  oldValue: T[K]
) => void;

type TWatchOptions<T, K extends keyof T> = {
  handler: TWatchHandler<T, K>;
  lazy: boolean;
};

type TWatch<T, K extends keyof T> = TWatchHandler<T, K> | TWatchOptions<T, K>;

type TGetterResult<T> = { readonly value: T };

type TGetterDefinition<T, Keys extends keyof any> = {
  [K in Keys]: ($state: T) => TGetterResult<any>;
};

type TOptions<
  T extends object,
  TGetters extends TGetterDefinition<T, keyof TGetters>,
  K extends keyof T
> = {
  state: T;
  readonly getters: TGetters;
  readonly watch: { [P in K]: TWatch<T, P> };
};

interface TStore<
  T extends object,
  TGetters extends TGetterDefinition<T, keyof TGetters>
> {
  state: T;

  readonly getters: { [K in keyof TGetters]: ReturnType<TGetters[K]> };

  /** stop watch */
  readonly watch: AddPrefix<T, "stop">;
  /** render */
  render: ($reef: T) => void;
  /** force re-render */
  hydrate: () => void;
}

export function defineStore<
  TStates extends object,
  TGetters extends TGetterDefinition<TStates, keyof TGetters>,
  K extends keyof TStates
>(
  name: string,
  options: TOptions<TStates, TGetters, K>
): TStore<TStates, TGetters>;
