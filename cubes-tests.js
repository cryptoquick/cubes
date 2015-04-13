var cubeSize = 5;

Template.occlusion.onRendered(function () {
  var start = +new Date;
  this.cubes = new Cubes(this.find('canvas'), {
    x: cubeSize,
    y: cubeSize,
    z: cubeSize,
    slow: 100
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

var swatch = [];
var current = 0;

// The following implements a great deal of legacy code from nb07 in order to create a color swatch to match color indices from model strings.
for (var z = 0; z < 32; z++) {
  for (var y = 0; y < 32; y++) {
    for (var x = 0; x < 32; x++) {
      color = {
        r: (z + 1) * 8,
        g: (y + 1) * 8,
        b: (x + 1) * 8
      };

      swatch.push(color);
    }
  }
}

Template.models.helpers({
  models: function () {
    return models;
  }
});

Template.model.onRendered(function () {
  var model = JSON.parse(this.data.model);

  var start = +new Date;
  var cubes = new Cubes(this.find('canvas'), {
    x: cubeSize,
    y: cubeSize,
    z: cubeSize
  });

  for (var i = 0, ii = model.length; i < ii; i++) {
    var cube = model[i];
    var color = swatch[cube[3]];
    cubes.insert({
      x: cube[0],
      y: cube[1],
      z: cube[2],
      color: cubes.rgbToHex(color.r, color.g, color.b)
    });
  }

  var count = cubes.renderScene()

  // Tinytest.add('occlusion', function (test) {
  //   test.equal(count, cubeSize * cubeSize + cubeSize * (cubeSize - 1) + (cubeSize - 1) * (cubeSize - 1));
  // });

  var end = +new Date;

  console.log(count, 'cubes rendered in', end - start, 'ms');

  return '';
});

var randomByte = function () {
  return Math.random() * 256 | 0;
};

Template.experiment.onRendered(function () {
  var iso = new Isomer(this.find('canvas'), {
    scale: 35,
    originY: 400
  });

  var add = function (x, y, z, i) {
    setTimeout(function (x, y, z, iso) {
      iso.add(
        Isomer.Shape.Prism(
          new Isomer.Point(x, y, z)
        ),
        new Isomer.Color(randomByte(), randomByte(), randomByte())
      );
    }, i * 100, x, y, z, iso);
  }

  add(0, 0, 0, 2);
  add(0, 0, 1, 4);
  add(0, 0, 2, 6);
});
