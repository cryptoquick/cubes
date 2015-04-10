Cubes = function (canvasNode, config) {
  this.Shape = Isomer.Shape;
  this.Point = Isomer.Point;
  this.Color = Isomer.Color;

  this.gridSizeX = new ReactiveVar(config.x || 32);
  this.gridSizeY = new ReactiveVar(config.y || 32);
  this.gridSizeZ = new ReactiveVar(config.z || 32);

  this.sliceX = new ReactiveVar(0);
  this.sliceY = new ReactiveVar(0);
  this.sliceZ = new ReactiveVar(0);

  this.rotationIndex = new ReactiveVar(0);

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
  var sliceZ = this.sliceZ.get();
  var gridX = this.gridSizeX.get();
  var gridY = this.gridSizeY.get();

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

  var renderQueue = [];

  // Depth-first search
  var ts = +new Date;
  var stack = [this._index(gridX - 1, gridY - 1, 0)];
  var arr = null;
  var index = null;
var beaps = 0;
  while (stack.length) {
    index = stack.pop();
    arr = this.sceneData[0][index];

    // console.log(arr);

    if (arr && arr[0].ts !== ts) {
      renderQueue.push(arr[0]);
      this.sceneData[0][index][0].ts = ts;
      for (var i = 1, ii = arr.length; i < ii; i++) {
        stack.push(arr[i]);
      }
    }
    else {
      if (arr === undefined) beaps++;
    }
  }

  console.log(beaps);

  // Render cubes in queue
  var cube = null;
  for (var j = 0, jj = renderQueue.length; j < jj; j++) {
    cube = renderQueue[j];
    this.iso.add(
      this.Shape.Prism(
        new this.Point(cube.x, cube.y, cube.z)
      ),
      this.isoColor(cube.color)
      // , true
    );
  }

  // For next-generation Isomer.
  // this.iso.canvas.clear();
  // this.iso.draw();

  return jj;
}

Cubes.prototype.insert = function (cube) {
  var gridX = this.gridSizeX.get();
  var gridY = this.gridSizeY.get();
  var gridZ = 0;

  var x = cube.x;
  var y = cube.y;
  var z = cube.z;

  // Add data to scene
  var index = this._index(cube.x, cube.y, cube.z);
  this.sceneData[0][index] = this.sceneData[0][index] || [];
  this.sceneData[0][index][0] = cube;
  this.sceneData[0].count++;

  // Add additional nodes to scene tree.
  while (x < gridX && y < gridY && z >= gridZ) {
    if (x < gridX) this._addNode(index, 1, x + 1, y, z);
    if (y < gridY) this._addNode(index, 2, x, y + 1, z);
    if (z - 1 >= gridZ) this._addNode(index, 3, x, y, z - 1);
    x++;
    y++;
    z--;
  }
}

// Private Methods
Cubes.prototype._index = function (x, y, z) {
  return this.gridSizeZ.get() * this.gridSizeZ.get() * z + this.gridSizeY.get() * y + x;
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
