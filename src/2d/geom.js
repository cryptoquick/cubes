import {coorsToIndex} from '../2d/coors'
import {length as CHUNKLENGTH} from '../3d/chunk'

export const crossProduct = (ax, ay, bx, by) => ax * by - ay * bx

export const drawPixel = (x, y, r, g, b, id, brightness, scene) => {
  const {bitmap: {data: bitmap}, clickmap} = scene
  const index = coorsToIndex(Math.floor(x), Math.floor(y), scene)
  clickmap[index] = id
  bitmap[index * 4 + 0] = Math.floor(r * brightness)
  bitmap[index * 4 + 1] = Math.floor(g * brightness)
  bitmap[index * 4 + 2] = Math.floor(b * brightness)
  bitmap[index * 4 + 3] = 255
}

export const rasterTri = (points, r, g, b, id, brightness, scene) => {
  const [vt1x = 0, vt1y = 0, vt2x = 0, vt2y = 0, vt3x = 0, vt3y = 0] = points
  const maxX = Math.max(vt1x, vt2x, vt3x)
  const minX = Math.min(vt1x, vt2x, vt3x)
  const maxY = Math.max(vt1y, vt2y, vt3y)
  const minY = Math.min(vt1y, vt2y, vt3y)

  const vs1x = vt2x - vt1x
  const vs1y = vt2y - vt1y

  const vs2x = vt3x - vt1x
  const vs2y = vt3y - vt1y

  for (let x = minX; x <= maxX; x++) {
    for (let y = minY; y <= maxY; y++) {
      const qx = x - vt1x
      const qy = y - vt1y

      const s =
        crossProduct(qx, qy, vs2x, vs2y) / crossProduct(vs1x, vs1y, vs2x, vs2y)
      const t =
        crossProduct(vs1x, vs1y, qx, qy) / crossProduct(vs1x, vs1y, vs2x, vs2y)

      if (s >= 0 && t >= 0 && s + t <= 1) {
        drawPixel(x, y, r, g, b, id, brightness, scene)
      }
    }
  }
}

export const fillQuad = (points, r, g, b, id, brightness, scene) => {
  rasterTri(
    [points[0], points[1], points[2], points[3], points[4], points[5]],
    r,
    g,
    b,
    id,
    brightness,
    scene
  )

  rasterTri(
    [points[4], points[5], points[6], points[7], points[0], points[1]],
    r,
    g,
    b,
    id,
    brightness,
    scene
  )
}
