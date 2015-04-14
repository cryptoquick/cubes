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
    originX: (config.originX || null),
    originY: (config.originY || this.gridSizeZ * 2 * 10),
    lightPosition: new this.Isomer.Vector(
      config.lightX || 3,
      config.lightY || -5,
      config.lightZ || 1
    )
  });

  this.clickDetection = config.clickDetection || false;

  if (this.clickDetection) {
    // this.clickBuffer = new Int16Array(this.iso.canvas.width * this.iso.canvas.height);
    this.clickBuffer = {};
  }

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
    if (this.clickDetection) {
      this.render(renderQueue, this._renderClickBuffer);
    }
    else {
      this.render(renderQueue);
    }
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

Cubes.prototype._renderClickBuffer = function (that, shapeQueue) {
  var width = that.iso.canvas.width;
  var height = that.iso.canvas.height;
  var shape = null;
  var quad = null;
  var point = null;
  var id = null;
  var points = null;

  for (var sh = 0, shh = shapeQueue.length; sh < shh; sh += 2) {
    shape = shapeQueue[sh];
    id = shapeQueue[sh + 1];

    for (var q = 0, qq = shape.length; q < qq; q++) {
      quad = shape[q];
      var points = [];

      for (var p = 0, pp = quad.length; p < pp; p++) {
        point = quad[p];
        points.push(point.x, point.y);
      }

      that._fillQuad(that, points, id);
    }
  }
}

Cubes.prototype._fillQuad = function (that, points, id) {
  that._rasterTri(that, {
    x: points[0],
    y: points[1]
  }, {
    x: points[2],
    y: points[3]
  }, {
    x: points[4],
    y: points[5]
  }, id);

  that._rasterTri(that, {
    x: points[4],
    y: points[5]
  }, {
    x: points[6],
    y: points[7]
  }, {
    x: points[0],
    y: points[1]
  }, id);
}

// http://www.sunshine2k.de/coding/java/TriangleRasterization/TriangleRasterization.html
Cubes.prototype._rasterTri = function (that, vt1, vt2, vt3, id) {
  var maxX = Math.max(vt1.x, Math.max(vt2.x, vt3.x));
  var minX = Math.min(vt1.x, Math.min(vt2.x, vt3.x));
  var maxY = Math.max(vt1.y, Math.max(vt2.y, vt3.y));
  var minY = Math.min(vt1.y, Math.min(vt2.y, vt3.y));

  var vs1 = {
    x: vt2.x - vt1.x,
    y: vt2.y - vt1.y
  };

  var vs2 = {
    x: vt3.x - vt1.x,
    y: vt3.y - vt1.y
  };

  for (var x = minX; x <= maxX; x++) {
    for (var y = minY; y <= maxY; y++) {
      var q = {
        x: x - vt1.x,
        y: y - vt1.y
      };

      var s = that._crossProduct(q, vs2) / that._crossProduct(vs1, vs2);
      var t = that._crossProduct(vs1, q) / that._crossProduct(vs1, vs2);

      if ((s >= 0) && (t >= 0) && (s + t <= 1)) {
        that._drawPixel(that, x, y, id);
      }
    }
  }
}

Cubes.prototype._crossProduct = function (a, b) {
  return a.x * b.y - a.y * b.x;
}

Cubes.prototype._drawPixel = function (that, x, y, id) {
  var index = that._indexCanvas(Math.floor(x), Math.floor(y), that);
  that.clickBuffer[index] = id;
}

Cubes.prototype.render = function (rq, cb) {
  setTimeout(function (that, rq, cb) {
    var cube = null;
    var shape = null;
    var result = null;
    if (cb) var shapeQueue = [];
    for (var j = 0, jj = rq.length; j < jj; j++) {
      cube = rq[j];

      shape = that.Shape.Prism(
        new that.Point(cube.x, cube.y, cube.z)
      );

      result = that.iso.add(
        shape,
        cube.color ? that.isoColor(cube.color) : null
        // , true
      );

      if (cb) shapeQueue.push(result, cube.index);
    }
    if (cb) {
      cb(that, shapeQueue);
    };
  }, 0, this, rq, cb);
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

  var index = this._index(cube.x, cube.y, cube.z);
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

  if (dist <= this.faceDistances[faceIndex]) {
    this.faceIndices[faceIndex] = index;
    this.faceDistances[faceIndex] = dist;
  }

  cube.index = index;

  this.sceneData[index] = cube;
  this.sceneDataLength++;
}

Cubes.prototype.click = function (x, y) {
  var canvasIndex = this._indexCanvas(x, y);
  var index = this.clickBuffer[canvasIndex];
  return this.sceneData[index];
}

Cubes.prototype._index = function (x, y, z) {
  return this.gridSizeZ * this.gridSizeZ * z + this.gridSizeY * y + x + 1;
}

Cubes.prototype._indexCanvas = function (x, y, that) {
  that = this || that;
  return that.iso.canvas.height * y + x;
}

if (Cubes.commonJS) {
  module.exports = Cubes;
}
