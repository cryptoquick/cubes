const root2 = Math.sqrt(2)
const root6 = Math.sqrt(6)
const scale = 13
const offsetY = 25

export const position = (x, y, z, {canvas: {width, height}}) => [
  width / 2 + scale * (x - z) / root2,
  offsetY + scale * (x + 2 * y + z) / root6,
]
