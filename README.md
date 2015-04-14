# Cubes

Cubes is an isometric graphics management library. It uses [Isomer](https://github.com/jdan/isomer), but it's meant to offer higher level scene management.

## Current Support

- Meteor

## Planned Support

- Browserify
- Full source
- Minified distribution with sourcemap
- Pull requests for other package managers are welcomed

## Roadmap

- 0.0 - _Finished_
  - Experimental status
- 0.1 - _Finished_
  - Scene management
  - Depth sorting
  - Occlusion culling
- 0.2 - _Finished_
  - Click detection
  - Scene editing API
- 0.3 - __Future__
  - 3-axis slicing
  - 4-angle rotation
- 0.4
  - Isometric color picker partial
  - Basic editor partial
- 0.5
  - Backend rendering

## Configuration

An example configuration, taken from the defaults:

```javascript
  var canvas = document.getElementById('myCanvas');
  var cubes = new Cubes(canvas, {
    // This defines how much area is given to cube rendering and editing
    x: 32,
    y: 32,
    z: 32,

    // Slow mode provides a visual example of how models are rendered. The value provided indicates milliseconds between each successive render.
    slow: 10,

    // This determines how large the cubes and grid area are.
    scale: 10.0,

    // This determines the center from which all graphics are drawn. This should be set to a sensible value, but if it isn't, it can be overridden. It is measured in pixels.
    originX: null,

    // Also available is originY. It should also be set to a sensible default, but in case it isn't...
    originY: null,

    // Toggles click detection for this instance of Cubes.
    clickDetection: false,

    // Determines how different the sides of each cube of the same color are in lightness.
    colorDifference: 0.10,

    // This is the position of the light source for lighting the scene. It's a directional light, so a larger number indicates the light is further away, but it is not a point light.
    lightX: 3, lightY: -5, lightZ: 1,

    // Do you want a base plan upon which to build upon? No? Set it to false, then.
    planeXY: true
  });
```

## Scene Management

Current methods:

- insert()

This will return a special scene ID that's used internally by Cubes to keep track of cubes in a quickly accessible format. This will change if a different size cube area is specified. Please use x, y, & z format for storing and retrieving cube information.

Planned methods:

- remove()
- find()
- edit()
- export()
- load()

### Insert

A simple insert method in addition to color data.

```javascript
  cubes.insert({
    x: x,
    y: y,
    z: z,
    color: '#ff00ff'
  });
```

## Click Detection

Click detection must be enabled, using the `clickDetection` configuration property, as shown above.

`cubes.click(x, y);`

### Example

```javascript
  $('#myCanvas').on('click', function (evt) {
    cubes.click(evt.offsetX, evt.offsetY);
  });
```

## Utility Methods

Some additional useful utility methods are available.

### Random Colors

`cubes.randomColor().toHex()`

## Testing

Be sure to see what's being done in the `cubes-tests.js` file. Tests can be run with Meteor installed and running the `meteor test-packages ./` command.
