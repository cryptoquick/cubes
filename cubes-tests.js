Template.occlusion.onRendered(function () {
  var start = +new Date;
  this.cubes = new Cubes(this.find('canvas'), {
    x: 8,
    y: 8,
    z: 8
  });

  for (var z = 0, zz = 8; z < zz; z++) {
    for (var y = 0, yy = 8; y < yy; y++) {
      for (var x = 0, xx = 8; x < xx; x++) {
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
    test.equal(count, 8 * 8 + 8 * 7 + 7 * 7);
  });

  var end = +new Date;

  console.log(count, 'objects rendered in', end - start, 'ms');
});
