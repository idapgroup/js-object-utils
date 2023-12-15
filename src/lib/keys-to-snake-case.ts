export const keysToSnakeCase = <T extends Record<string, any>>(
  obj: T
): Record<string, any> => {
  if (obj === null || obj === undefined) {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map((v) => keysToSnakeCase(v));
  }
  if (typeof obj === 'object') {
    return Object.entries(obj).reduce((acc, [k, v]) => {
      return Object.assign(Object.assign({}, acc), {
        [k.replace(/([A-Z])/g, '_$1').toLowerCase()]: keysToSnakeCase(v),
      });
    }, {});
  }
  return obj;
};
