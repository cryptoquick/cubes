import {cube} from '../2d/cube'
import {bbox} from '../2d/coors'

export const render = scene => {
  let box = [Infinity, Infinity, -Infinity, -Infinity]
  for (let i = 0, ii = scene.picture.length; i < ii; i += 6) {
    const [x, y, r, g, b, id] = scene.picture.slice(i, i + 6)
    box = bbox(box, cube(x, y, r, g, b, id, scene))
  }
  // TODO: bbox optimization
  scene.canvas.ctx.putImageData(scene.bitmap, 0, 0)
}
