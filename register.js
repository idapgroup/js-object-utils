const tsNode = require('ts-node');
const testTSConfig = require('./test/tsconfig.spec.json');

tsNode.register({
  files: true,
  transpileOnly: true,
  project: './test/tsconfig.spec.json'
});
