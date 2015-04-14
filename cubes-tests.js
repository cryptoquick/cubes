var cubeSize = 32;

Template.occlusion.onRendered(function () {
  var start = +new Date;
  this.cubes = new Cubes(this.find('canvas'), {
    x: cubeSize,
    y: cubeSize,
    z: cubeSize,
    slow: 10
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
    for (var x = 32 - 1; x >= 0; x--) {
      color = {
        r: z * 8,
        g: y * 8,
        b: 255 - x * 8
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

  Tinytest.add('model: ' + this.data.name, function (test) {
    test.equal(count < model.length, true);
  });

  var end = +new Date;

  console.log(count, 'cubes rendered in', end - start, 'ms, with', model.length - count, 'cubes not rendered');

  return '';
});
