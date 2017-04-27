import test from 'ava'

import {indexToCoors} from './util'

test(t => {
  const result = indexToCoors(20, 3)

  t.deepEqual(result, {
    x: 1,
    y: 1,
    z: 1,
  })
}, 'indexToSide')
