export const coorsToIndex = (x, y, scene) => scene.canvas.height * y + x

export const click = (x, y, scene) => {
  var index = coorsToIndex(x, y, scene)
  var id = scene.clickmap[index]
  return scene.chunk[id]
}

export const bbox = ([x0, y0, x1, y1], [x2, y2, x3, y3]) => [
  Math.min(x0, x2),
  Math.min(y0, y2),
  Math.max(x1, x3),
  Math.max(y1, y3),
]
