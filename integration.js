var cubeSize = 32

chai.should()

describe('occlusion', function() {
  it('should render without error', function() {
    var start = +new Date()
    this.cubes = new Cubes(document.querySelector('#occlusion'), {
      x: cubeSize,
      y: cubeSize,
      z: cubeSize,
      slow: 10,
    })

    for (var z = 0, zz = cubeSize; z < zz; z++) {
      for (var y = 0, yy = cubeSize; y < yy; y++) {
        for (var x = 0, xx = cubeSize; x < xx; x++) {
          this.cubes.insert({
            x: x,
            y: y,
            z: z,
            color: this.cubes.randomColor().toHex(),
          })
        }
      }
    }

    var count = this.cubes.renderScene()

    count.should.equal(
      cubeSize * cubeSize +
        cubeSize * (cubeSize - 1) +
        (cubeSize - 1) * (cubeSize - 1)
    )

    var end = +new Date()

    console.log(count, 'cubes rendered in', end - start, 'ms')
  })
})

// reverse
describe('reverse occlusion', function() {
  it('should render without occlusion no matter which direction cubes are added', function() {
    var start = +new Date()
    this.cubes = new Cubes(document.querySelector('#reverse'), {
      x: cubeSize,
      y: cubeSize,
      z: cubeSize,
    })

    for (var z = cubeSize - 1, zz = 0; z >= zz; z--) {
      for (var y = cubeSize - 1, yy = 0; y >= yy; y--) {
        for (var x = cubeSize - 1, xx = 0; x >= xx; x--) {
          this.cubes.insert({
            x: x,
            y: y,
            z: z,
            color: this.cubes.randomColor().toHex(),
          })
        }
      }
    }

    var count = this.cubes.renderScene()

    count.should.equal(
      count,
      cubeSize * cubeSize +
        cubeSize * (cubeSize - 1) +
        (cubeSize - 1) * (cubeSize - 1)
    )

    var end = +new Date()

    console.log(count, 'cubes rendered in', end - start, 'ms')
  })
})

// model
describe('models', function() {
  var swatch = []
  var current = 0

  // The following implements a great deal of legacy code from nb07 in order to create a color swatch to match color indices from model strings.
  for (var z = 0; z < 32; z++) {
    for (var y = 0; y < 32; y++) {
      for (var x = 32 - 1; x >= 0; x--) {
        const color = {
          r: z * 8,
          g: y * 8,
          b: 255 - x * 8,
        }

        swatch.push(color)
      }
    }
  }

  models.forEach(function({name, model: json}, index) {
    it(`should render the ${name} model without error`, function() {
      var start = +new Date()
      var cubes = new Cubes(document.querySelector(`#models-${index}`), {
        x: cubeSize,
        y: cubeSize,
        z: cubeSize,
      })

      const model = JSON.parse(json)

      for (var i = 0, ii = model.length; i < ii; i++) {
        var cube = model[i]
        var color = swatch[cube[3]]
        cubes.insert({
          x: cube[0],
          y: cube[1],
          z: cube[2],
          color: cubes.rgbToHex(color.r, color.g, color.b),
        })
      }

      var count = cubes.renderScene()

      count.should.be.below(model.length)

      var end = +new Date()

      console.log(
        count,
        'cubes rendered in',
        end - start,
        'ms, with',
        model.length - count,
        'cubes not rendered'
      )
    })
  })
})

// click
describe('click', function() {
  describe('should properly identify clicked item', function() {
    var clickCube = 32
    var start = +new Date()
    var cubes = (this.cubes = new Cubes(document.querySelector('#click'), {
      x: clickCube,
      y: clickCube,
      z: clickCube,
      clickDetection: true,
    }))

    for (var z = 0, zz = clickCube; z < zz; z++) {
      for (var y = 0, yy = clickCube; y < yy; y++) {
        for (var x = 0, xx = clickCube; x < xx; x++) {
          this.cubes.insert({
            x: x,
            y: y,
            z: z,
            color: this.cubes.randomColor().toHex(),
          })
        }
      }
    }

    var count = this.cubes.renderScene()

    // Values based on 32x32x32 cube at 800x800.
    it('should click - top', function() {
      var cube = cubes.click(400, 6)
      cube.x.should.equal(31)
      cube.y.should.equal(31)
      cube.z.should.equal(31)
    })

    it('should click - bottom', function() {
      var cube = cubes.click(400, 635)
      cube.x.should.equal(0)
      cube.y.should.equal(0)
      cube.z.should.equal(0)
    })

    it('should click - upper left', function() {
      var cube = cubes.click(128, 165)
      cube.x.should.equal(0)
      cube.y.should.equal(31)
      cube.z.should.equal(31)
    })

    it('should click - upper right', function() {
      var cube = cubes.click(675, 165)
      cube.x.should.equal(31)
      cube.y.should.equal(0)
      cube.z.should.equal(31)
    })

    it('should click - lower left', function() {
      var cube = cubes.click(128, 480)
      cube.x.should.equal(0)
      cube.y.should.equal(31)
      cube.z.should.equal(0)
    })

    it('should click - lower right', function() {
      var cube = cubes.click(675, 480)
      cube.x.should.equal(31)
      cube.y.should.equal(0)
      cube.z.should.equal(0)
    })

    var end = +new Date()

    console.log(count, 'cubes rendered in', end - start, 'ms')

    document.querySelector('#click').addEventListener('click', function(evt) {
      console.log('px', evt.offsetX, 'py', evt.offsetY)
      var cube = cubes.click(evt.offsetX, evt.offsetY)
      console.log('x', cube.x, 'y', cube.y, 'z', cube.z)
    })
  })
})
