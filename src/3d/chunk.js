import {coorsToIndex} from '../3d/coors'
import {position} from '../3d/geom'

export const length = 6

const log = (...items) => {
  console.log(...items)
  return items[0]
}

export const cubeSorter = arr =>
  arr.sort((a, b) => {
    if (a.x > b.x) return -1
    if (a.x < b.x) return 1
    if (a.y > b.y) return -1
    if (a.y < b.y) return 1
    if (a.z < b.z) return -1
    if (a.z > b.z) return 1
    return 0
  })

export const insert = (data = [], scene) => {
  for (let i = 0, ii = data.length; i < ii; i += length) {
    const [x, y, z, r, g, b] = data.slice(i, i + length)
    if (x <= 0 || y <= 0 || z <= 0) {
      throw Error('currently, coordinates cannot be zero or below')
    }
    const {settings: {size}} = scene
    const dist = Math.min(x, y, z)

    const fx = x - dist
    const fy = y - dist
    const fz = z - dist

    // console.log(x, y, z)
    // console.log(fx, fy, fz)

    const id = coorsToIndex(x, y, z, scene)
    const index = coorsToIndex(fx, fy, fz, scene)
    const [u, v] = position(x, y, z, scene)

    scene.chunk.push({x, y, z, r, g, b, u, v, id, dist, index})

    if (!scene.depths[index]) {
      scene.depths[index] = Infinity
    }

    if (dist < scene.depths[index]) {
      // scene.indices[index] = index
      scene.depths[index] = dist
    }

    // scene.picture.push(..., id)

    // console.log(index, depthIndex)

    // if (!scene.picture[depthIndex]) {
    //   scene.distances[depthIndex] = Infinity
    //   scene.picture.push({
    //     x: fx,
    //     y: fy,
    //     z: fz,
    //     index: depthIndex,
    //   })
    // }
    //
    // // If the cube is closer, add to depth buffer
    // if (dist <= scene.distances[depthIndex]) {
    //   scene.picture[depthIndex] = index
    //   scene.distances[depthIndex] = dist
    // }
  }

  scene.chunk = cubeSorter(scene.chunk)

  scene.chunk
    .filter(({dist, index}) => dist === scene.depths[index])
    .forEach(({u, v, r, g, b, id}) => scene.picture.push(u, v, r, g, b, id))

  scene.stats.cubecount += data.length
  scene.stats.rendered = scene.picture.length / 6
}
