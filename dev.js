const budo = require('budo')
const babelify = require('babelify')

budo('./src/index', {
  live: true,
  port: 9000,
  browserify: {
    transform: babelify.configure({
      presets: [
        [
          'env',
          {
            targets: {
              chrome: 58,
            },
          },
        ],
      ],
    }),
  },
})
  .on('connect', event => {
    console.log('Client running on %s', event.uri)
  })
  .on('update', buffer => {
    console.log('bundle - %d bytes', buffer.length)
  })
