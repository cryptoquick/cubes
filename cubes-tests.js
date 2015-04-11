var cubeSize = 32;

Template.occlusion.onRendered(function () {
  var start = +new Date;
  this.cubes = new Cubes(this.find('canvas'), {
    x: cubeSize,
    y: cubeSize,
    z: cubeSize
  });

  for (var z = 0, zz = cubeSize; z < zz; z++) {
    for (var y = 0, yy = cubeSize; y < yy; y++) {
      for (var x = 0, xx = cubeSize; x < xx; x++) {
        this.cubes.insert({
          x: x,
          y: y,
          z: z,
          color: this.cubes.randomColor().toHex()
        });
      }
    }
  }

  var count = this.cubes.renderScene()

  Tinytest.add('occlusion', function (test) {
    test.equal(count, cubeSize * cubeSize + cubeSize * (cubeSize - 1) + (cubeSize - 1) * (cubeSize - 1));
  });

  var end = +new Date;

  console.log(count, 'cubes rendered in', end - start, 'ms');
});

Template.reverse.onRendered(function () {
  var start = +new Date;
  this.cubes = new Cubes(this.find('canvas'), {
    x: cubeSize,
    y: cubeSize,
    z: cubeSize
  });

  for (var z = cubeSize - 1, zz = 0; z >= zz; z--) {
    for (var y = cubeSize - 1, yy = 0; y >= yy; y--) {
      for (var x = cubeSize - 1, xx = 0; x >= xx; x--) {
        this.cubes.insert({
          x: x,
          y: y,
          z: z,
          color: this.cubes.randomColor().toHex()
        });
      }
    }
  }

  var count = this.cubes.renderScene()

  Tinytest.add('reverse', function (test) {
    test.equal(count, cubeSize * cubeSize + cubeSize * (cubeSize - 1) + (cubeSize - 1) * (cubeSize - 1));
  });

  var end = +new Date;

  console.log(count, 'cubes rendered in', end - start, 'ms');
});
