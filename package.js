Package.describe({
  name: 'cryptoquick:cubes',
  version: '0.0.1',
  summary: 'An isometric graphics-rendering library.',
  git: 'https://github.com/cryptoquick/cubes',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.use('cryptoquick:isomer@0.2.5');
  api.versionsFrom('1.1.0.2');
  api.addFiles('cubes.js');
  api.export('Cubes', 'client');
});

Package.onTest(function(api) {
  api.use('meteor-platform');
  api.use('tinytest');
  api.use('cryptoquick:cubes');
  api.addFiles('cubes-tests.html', 'client');
  api.addFiles('cubes-tests-models.js', 'client');
  api.addFiles('cubes-tests.js', 'client');
});
