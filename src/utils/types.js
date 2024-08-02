/**
 * Extracts the type of the provided value.
 * This function utilizes duck typing to determine the type of the value.
 * @param {string} type - The value whose type is to be extracted.
 * @returns A string representing the type of the provided value.
 */
export function duckTypeExtract(type = "") {
  const rawType = Object.prototype.toString.call(type);

  return rawType
    .substring(7, rawType.length - 1)
    .toLowerCase()
    .trim();
}

export const types = {
  duck: duckTypeExtract,
  is: (value, duckType) => Object.is(duckTypeExtract(value), duckType),
  isObj: (value) => types.is(value, "object"),
  isArr: (value) => types.is(value, "array"),
};
