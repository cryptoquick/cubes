import 'babel-polyfill'

import {render} from './render'

if (window) {
  render()
}

export {render}
