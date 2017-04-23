const budo = require('budo')
const babelify = require('babelify')

budo('./cubes-new', {
  live: true,
  port: 9000,
  browserify: {
    transform: babelify.configure({
      plugins: ['transform-es2015-modules-commonjs'],
    }),
  },
})
  .on('connect', event => {
    console.log('Client running on %s', event.uri)
    console.log('LiveReload running on port %s', event.livePort)
  })
  .on('update', buffer => {
    console.log('bundle - %d bytes', buffer.length)
  })
