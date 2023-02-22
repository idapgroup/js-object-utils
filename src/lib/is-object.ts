export const isObject = (o: object): boolean =>
  Object.prototype.toString.call(o) === '[object Object]';
