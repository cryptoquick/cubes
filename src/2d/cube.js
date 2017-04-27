import {fillQuad} from '../2d/geom'

export const cube = (x, y, r, g, b, id, scene) => {
  const size = 20 //Math.round(scene.canvas.width / scene.settings.size) - 1
  const half = Math.round(size / 2)
  const quarter = Math.round(size / 4)
  // Top
  const top = [
    x + half,
    y,
    x + size,
    y + quarter,
    x + half,
    y + half,
    x,
    y + quarter,
  ]

  const left = [
    x,
    y + quarter,
    x,
    y + half + quarter,
    x + half,
    y + size,
    x + half,
    y + half,
  ]

  const right = [
    x + half,
    y + half,
    x + size,
    y + quarter,
    x + size,
    y + half + quarter,
    x + half,
    y + size,
  ]

  fillQuad(top, r, g, b, id, 0.8, scene)
  fillQuad(left, r, g, b, id, 0.9, scene)
  fillQuad(right, r, g, b, id, 1.0, scene)

  return [x, y, x + size, y + size]
}
