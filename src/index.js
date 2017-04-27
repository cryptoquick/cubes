import 'babel-polyfill'

import {initScene} from './scene'
import {insert} from './3d/chunk'
import {render} from './2d/render'
import {time} from './util'

if (window) {
  let scene
  let cubes = []
  const size = 16
  time(() => {
    scene = initScene(document.querySelector('#test'))
  }, 'initScene')
  time(() => {
    const c = 256 / size
    // for (let x = 1, xx = size; x <= xx; x++) {
    //   for (let y = 1, yy = size; y <= yy; y++) {
    //     for (let z = 1, zz = size; z <= zz; z++) {
    //       cubes.push(x, y, z, x * c, y * c, z * c)
    //     }
    //   }
    // }

    for (let z = 1; z <= size; z++) {
      for (let y = 1; y <= size; y++) {
        for (let x = size; x >= 1; x--) {
          cubes.push(x, y, z, (z - 1) * c, (y - 1) * c, 255 - (x - 1) * c)
        }
      }
    }
  }, 'make test cubes')
  time(() => {
    insert(cubes, scene)
  }, 'initScene')
  time(() => {
    render(scene)
    console.log(scene)
  }, 'main render function')

  console.log(`${scene.chunk.length} inserted`)
  console.log(`${scene.stats.rendered} rendered`)
}

export {initScene, insert, render}
