export function capitalize(str = "") {
  str = String(str);
  return str.charAt(0).toUpperCase() + str.substring(1);
}
