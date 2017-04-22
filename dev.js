const budo = require('budo')

budo('./cubes', {
  live: true,
  port: 9000,
})
  .on('connect', event => {
    console.log('Client running on %s', event.uri)
    console.log('LiveReload running on port %s', event.livePort)
  })
  .on('update', buffer => {
    console.log('bundle - %d bytes', buffer.length)
  })
