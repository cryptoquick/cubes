import test from 'ava'

import {render} from './render'

test(t => {
  t.is(render(), true)
})
