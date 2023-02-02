export const getKeyString = (
  parent: string,
  key: string,
  index: number | null
) =>
  parent
    ? index !== null
      ? `${parent}[${index}][${key}]`
      : `${parent}[${key}]`
    : key;
