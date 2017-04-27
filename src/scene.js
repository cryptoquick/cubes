import {length as CHUNKLENGTH} from './3d/chunk'
import {click} from './2d/coors'

export const initScene = (el, {size = 4} = {}) => {
  const ctx = el.getContext('2d')
  const {width, height} = el

  const length = Math.pow(size, 3) * CHUNKLENGTH

  const chunk = []
  const bitmap = ctx.createImageData(width, height)
  const clickmap = new Uint16Array(width * height)
  const picture = []
  const depths = []
  const indices = []

  const scene = {
    chunk, // sorted cube data
    bitmap,
    clickmap,
    picture, // coordinates of the visible cubes to be rendered
    depths, //
    indices,
    stats: {
      cubecount: 0,
      renderedcubes: 0,
      fps: 0,
    },
    settings: {
      size,
    },
    canvas: {
      ctx,
      el,
      width,
      height,
    },
  }

  el.addEventListener('click', ({offsetX, offsetY}) =>
    console.log(click(offsetX, offsetY, scene))
  )

  return scene
}
