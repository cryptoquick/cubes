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

  // Four trees, indexed from different directions
  this.sceneData = [
    {
      count: 0
    }, // 0
    {
      count: 0
    }, // 90
    {
      count: 0
    }, // 180
    {
      count: 0
    }  // 270
  ];

  this.iso = new this.Isomer(canvasNode, {
    scale: (config.scale || 10.0),
    originY: (config.originY || this.gridSizeZ * 2 * 10)
  });

  this.planeXY = config.planeXY || true;

  this._adds = 0;

  this._newTree();
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

  this.iso.scene = [];

  if (this.planeXY) {
    this.iso.add(
      this.Shape.Prism(
        new this.Point(0, 0, -1),
        gridX,
        gridY,
        1
      ),
      new this.Color(200, 200, 200),
      true
    );
  }

  var renderQueue = [];

  // Breadth-first search
  var ts = +new Date;
  var queue = [this._index(gridX - 1, gridY - 1, 0)];

  var arr = null;
  var index = null;
  while (queue.length) {
    index = queue.shift();
    arr = this.sceneData[0][index];

    if (arr && arr[0].ts !== ts) {

      var len = 0;

      if (arr[0]) len++;
      if (arr[1] >= 0) len++;
      if (arr[2] >= 0) len++;
      if (arr[3] >= 0) len++;

      // renderQueue.push(arr[0]);
      if (len === 3 || len === 2 || len === 1) renderQueue.push(arr[0]);

      this.sceneData[0][index][0].ts = ts;

      if (arr[1]) queue.push(arr[1]);
      if (arr[2]) queue.push(arr[2]);
      if (arr[3]) queue.push(arr[3]);
    }
  }

  // Render cubes in queue
  setTimeout(this.render, 0, this, renderQueue);

  // For next-generation Isomer.
  // this.iso.canvas.clear();
  // this.iso.draw();

  return renderQueue.length;
}

Cubes.prototype.render = function (that, rq) {
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
}

Cubes.prototype.insert = function (cube) {
  var index = this._index(cube.x, cube.y, cube.z);
  this.sceneData[0][index] = this.sceneData[0][index] || [{ts: 0}];
  this.sceneData[0][index][0] = cube;
  this.sceneData[0].count++;
}

// Private Methods
Cubes.prototype._index = function (x, y, z) {
  return this.gridSizeZ * this.gridSizeZ * z + this.gridSizeY * y + x + 1;
}

Cubes.prototype._addNode = function (parent, i, x, y, z) {
  this._adds++;
  var index = this._index(x, y, z);
  this.sceneData[0][index] = this.sceneData[0][index] || [{ts: 0}];
  this.sceneData[0][index][i] = parent;
}

Cubes.prototype._newTree = function () {
  // Add additional nodes to scene tree
  var index = null;

  for (var z = 0, zz = this.gridSizeZ; z < zz; z++) {
    for (var y = this.gridSizeY - 1, yy = 0; y >= yy; y--) {
      for (var x = this.gridSizeX - 1, xx = 0; x >= xx; x--) {
        index = this._index(x, y, z);
        if (x + 1 < this.gridSizeX) this._addNode(index, 1, x + 1, y, z);
        if (y + 1 < this.gridSizeY) this._addNode(index, 2, x, y + 1, z);
        if (z - 1 >= 0) this._addNode(index, 3, x, y, z - 1);
      }
    }
  }
}

if (Cubes.commonJS) {
  module.exports = Cubes;
}
