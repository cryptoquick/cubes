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

  this.sceneData = {}; // Hash stores additional data about cubes in scene

  // Four trees, indexed from different directions
  this.sceneTrees = [
    [], // 0
    [], // 90
    [], // 180
    []  // 270
  ];

  this.renderQueue = [];

  this.iso = new Isomer(canvasNode, {
    scale: (config.scale || 10.0),
    originY: canvasNode.height / 2 // TODO: Solve for scene height
  });

  this.planeXY = true;
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

  var cube = null;
  for (var i = 0, ii = this.renderQueue.length; i < ii; i++) {
    cube = this.sceneData[this.renderQueue[i]];
    this.iso.add(
      this.Shape.Prism(
        new this.Point(cube.x, cube.y, cube.z)
      ),
      this.isoColor(cube.color)
      // , true
    );
  }

  // this.iso.canvas.clear();
  // this.iso.draw();

  return ii;
}

Cubes.prototype.insert = function (cube) {
  var len = this.renderQueue.length;
  this.renderQueue.push(len); // TODO
  this.sceneTrees[0];
  this.sceneData[len] = cube;
}
