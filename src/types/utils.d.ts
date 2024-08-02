export type ValueOf<T> = T[keyof T];

export type AddPrefix<T, Prefix extends string> = {
  [K in keyof T as `${Prefix}${Capitalize<string & K>}`]: () => void;
};
