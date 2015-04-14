Cubes = function (canvasNode, config) {
  if (typeof module !== 'undefined' && module.exports) {
    this.commonJS = true;
    this.Isomer = require('isomer');
  }
  else {
    this.Isomer = Isomer;
  }

  this.Shape = this.Isomer.Shape;
  this.Point = this.Isomer.Point;
  this.Color = this.Isomer.Color;

  this.gridSizeX = config.x || 32;
  this.gridSizeY = config.y || 32;
  this.gridSizeZ = config.z || 32;

  this.sliceX = 0;
  this.sliceY = 0;
  this.sliceZ = 0;

  this.rotationIndex = 0;
  this.slow = config.slow || 0;

  this.sceneData = [];
  this.sceneDataLength = 0;
  this.faceIndices = {};
  this.faceDistances = {};
  this.renderData = [];

  this.iso = new this.Isomer(canvasNode, {
    scale: (config.scale || 10.0),
    originY: (config.originY || this.gridSizeZ * 2 * 10),
    lightPosition: new this.Isomer.Vector(
      config.lightX || 3,
      config.lightY || -5,
      config.lightZ || 1
    )
  });

  this.iso.colorDifference = config.colorDifference || 0.10;

  this.planeXY = config.planeXY || true;

  this._adds = 0;
};

Cubes.prototype.hexToRgb = function (hex) {
  hex = hex.replace(/[^0-9A-F]/gi, '');
  var bigint = parseInt(hex, 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255
  };
}

Cubes.prototype.rgbToHex = function (r, g, b) {
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

Cubes.prototype.isoColor = function (hex) {
  var rgb = this.hexToRgb(hex);
  return new this.Color(rgb.r, rgb.g, rgb.b);
}

Cubes.prototype.randomByte = function () {
  return Math.random() * 256 | 0;
};

Cubes.prototype.randomColor = function () {
  return new this.Color(this.randomByte(), this.randomByte(), this.randomByte());
}

Cubes.prototype.renderScene = function () {
  var sliceZ = this.sliceZ;
  var gridX = this.gridSizeX;
  var gridY = this.gridSizeY;
  var gridZ = this.gridSizeZ;

  // this.iso.scene = [];

  if (this.planeXY) {
    this.iso.add(
      this.Shape.Prism(
        new this.Point(0, 0, -1),
        gridX,
        gridY,
        1
      ),
      new this.Color(200, 200, 200)
      // , true
    );
  }

  var renderQueue = [];

  // Pull only front-facing cubes from faceIndices
  for (var i = 0, ii = this.renderData.length; i < ii; i++) {
    var rd = this.renderData[i];
    renderQueue.push(this.sceneData[this.faceIndices[rd.index]]);
  }

  // Sort cubes so they render in the right order
  renderQueue.sort(this._cubeSorter);

  // Render cubes in queue, non-blocking
  if (this.slow) {
    this.slowRender(renderQueue, this.slow);
  }
  else {
    this.render(renderQueue);
  }

  // For next-generation Isomer.
  // this.iso.canvas.clear();
  // this.iso.draw();

  return renderQueue.length;
}

Cubes.prototype._cubeSorter = function (a, b) {
  if (a.x > b.x) return -1;
  if (a.x < b.x) return 1;
  if (a.y > b.y) return -1;
  if (a.y < b.y) return 1;
  if (a.z < b.z) return -1;
  if (a.z > b.z) return 1;
  return 0;
}

Cubes.prototype.render = function (rq) {
  setTimeout(function (that, rq) {
    var cube = null;
    for (var j = 0, jj = rq.length; j < jj; j++) {
      cube = rq[j];
      that.iso.add(
        that.Shape.Prism(
          new that.Point(cube.x, cube.y, cube.z)
        ),
        cube.color ? that.isoColor(cube.color) : null
        // , true
      );
    }
  }, 0, this, rq);
}

Cubes.prototype.slowRender = function (rq, speed) {
  var cube = null;
  for (var j = 0, jj = rq.length; j < jj; j++) {
    setTimeout(function (that, rq, j) {
      cube = rq[j];
      that.iso.add(
        that.Shape.Prism(
          new that.Point(cube.x, cube.y, cube.z)
        ),
        cube.color ? that.isoColor(cube.color) : null
        // , true
      );
    }, j * speed, this, rq, j);
  }
}

Cubes.prototype.insert = function (cube) {
  var dist = Math.min(cube.x, cube.y, this.gridSizeZ - cube.z);

  var fx = cube.x - dist;
  var fy = cube.y - dist;
  var fz = this.gridSizeZ - cube.z - dist;

  var faceIndex = this._index(fx, fy, fz);

  if (!this.faceIndices[faceIndex]) {
    this.faceDistances[faceIndex] = Infinity;
    this.renderData.push({
      x: fx,
      y: fy,
      z: fz,
      index: faceIndex
    });
  }

  var index = this._index(cube.x, cube.y, cube.z);

  if (dist <= this.faceDistances[faceIndex]) {
    this.faceIndices[faceIndex] = index;
    this.faceDistances[faceIndex] = dist;
  }

  cube.index = index;

  this.sceneData[index] = cube;
  this.sceneDataLength++;
}

Cubes.prototype._index = function (x, y, z) {
  return this.gridSizeZ * this.gridSizeZ * z + this.gridSizeY * y + x + 1;
}

if (Cubes.commonJS) {
  module.exports = Cubes;
}
