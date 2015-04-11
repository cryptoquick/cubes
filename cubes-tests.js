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

  Tinytest.add('example', function (test) {
    test.equal(count, cubeSize * cubeSize + cubeSize * (cubeSize - 1) + (cubeSize - 1) * (cubeSize - 1));
  });

  var end = +new Date;

  console.log(count, 'objects rendered in', end - start, 'ms');
});
