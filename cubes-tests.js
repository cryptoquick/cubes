var size = [8, 8, 8];

Template.occlusion.onRendered(function () {
  var start = +new Date;
  this.cubes = new Cubes(this.find('canvas'));

  for (var z = 0, zz = size[2]; z < zz; z++) {
    for (var y = 0, yy = size[1]; y < yy; y++) {
      for (var x = 0, xx = size[0]; x < xx; x++) {
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
    test.equal(count, 512);
  });

  var end = +new Date;

  console.log(count, 'objects rendered in', end - start, 'ms');
});
