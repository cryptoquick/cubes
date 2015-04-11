Cubes = function (canvasNode, config) {
  this.Shape = Isomer.Shape;
  this.Point = Isomer.Point;
  this.Color = Isomer.Color;

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

  this.iso = new Isomer(canvasNode, {
    scale: (config.scale || 10.0),
    originY: canvasNode.height / 2 // TODO: Solve for scene height
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

  console.log(this.sceneData[0], Object.keys(this.sceneData[0]).length, this._adds);

  renderQueue = [];

  // Depth-first search
  var ts = +new Date;
  var stack = [this._index(gridX - 1, gridY - 1, 0)];
  // var stack = [this._index(0, 0, gridZ - 1)];

  // var stack = [this._index(0, gridY - 1, gridZ - 1)]; //
  // var stack = [this._index(gridX - 1, 0, gridZ - 1)];
  // var stack = [this._index(gridX - 1, gridY - 1, gridZ - 1)];

  // var stack = [this._index(0, gridY - 1, 0)];
  // var stack = [this._index(gridX - 1, 0, 0)];
  // var stack = [this._index(gridX - 1, gridY - 1, 0)];
  // var stack = [this._index(0, 0, 0)];

  var arr = null;
  var index = null;
  var beaps = 0; // TODO remove
  while (stack.length) {
    index = stack.shift();
    arr = this.sceneData[0][index];

    console.log(arr); // TODO remove

    if (arr && arr[0].ts !== ts) {

      var len = 0;

      if (arr[0]) len++;
      if (arr[1] >= 0) len++;
      if (arr[2] >= 0) len++;
      if (arr[3] >= 0) len++;

      if (len === 3 || len === 2 || len === 1) renderQueue.push(arr[0]);
      // renderQueue.push(arr[0]);


      this.sceneData[0][index][0].ts = ts;
      // for (var i = 1, ii = arr.length; i < ii; i++) {
      // var order = [1, 2, 3];
      // for (var i = 0, ii = order.length; i > ii; i--) {
      //   stack.push(arr[i]);
      // }

      var t = 0;

      if (t === 0) {
        if (arr[1]) stack.push(arr[1]);
        if (arr[2]) stack.push(arr[2]);
        if (arr[3]) stack.push(arr[3]);
      }

      if (t === 1) {
        if (arr[3]) stack.push(arr[3]);
        if (arr[2]) stack.push(arr[2]);
        if (arr[1]) stack.push(arr[1]);
      }

      if (t === 2) {
        if (arr[2]) stack.push(arr[2]);
        if (arr[3]) stack.push(arr[3]);
        if (arr[1]) stack.push(arr[1]);
      }

      if (t === 3) {
        if (arr[1]) stack.push(arr[1]);
        if (arr[3]) stack.push(arr[3]);
        if (arr[2]) stack.push(arr[2]);
      }

      if (t === 4) {
        if (arr[3]) stack.push(arr[3]);
        if (arr[1]) stack.push(arr[1]);
        if (arr[2]) stack.push(arr[2]);
      }

      if (t === 5) {
        if (arr[2]) stack.push(arr[2]);
        if (arr[1]) stack.push(arr[1]);
        if (arr[3]) stack.push(arr[3]);
      }

    }
    else {
      if (arr === undefined) beaps++; // TODO remove
    }
  }

  console.log(beaps); // TODO remove

  // Render cubes in queue
  var cube = null;
  for (var j = 0, jj = renderQueue.length; j < jj; j++) {
    var that = this;
    setTimeout(function (jn) {
      cube = renderQueue[jn];
      that.iso.add(
        that.Shape.Prism(
          new that.Point(cube.x, cube.y, cube.z)
        ),
        that.isoColor(cube.color)
        // , true
      );
    }, j * 100, j);
  }

  // For next-generation Isomer.
  // this.iso.canvas.clear();
  // this.iso.draw();

  return jj;
}

Cubes.prototype.insert = function (cube) {
  var index = this._index(cube.x, cube.y, cube.z);
  this.sceneData[0][index] = this.sceneData[0][index] || [];
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
  this.sceneData[0][index] = this.sceneData[0][index] || [null];
  this.sceneData[0][index][i] = parent;

  // if (this.sceneData[0][index].indexOf(parent) === -1) {
  //   this.sceneData[0][index].push(parent);
  // }
}

Cubes.prototype._newTree = function () {
  // var gridX = 0;
  // var gridY = 0;
  // var gridZ = this.gridSizeZ;
  //
  // var x = this.gridSizeX;
  // var y = this.gridSizeY;
  // var z = 0;

  // Add additional nodes to scene tree
  var index = null;

  for (var z = 0, zz = this.gridSizeZ; z < zz; z++) {
  // for (var z = this.gridSizeZ - 1, zz = 0; z >= zz; z--) {
    // for (var y = 0, yy = this.gridSizeY; y < yy; y++) {
      // for (var x = 0, xx = this.gridSizeX; x < xx; x++) {
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
