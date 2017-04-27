export const coorsToIndex = (x, y, z, {settings: {size}} = {}) =>
  size * size * z + size * y + x
