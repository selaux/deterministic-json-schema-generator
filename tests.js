const detGenerator = require('./index.js');
const glob = require('glob');
const path = require('path');
const R = require('ramda');
const tv4 = require('tv4');
const randomJs = require('random-js');
const engine = randomJs.engines.nativeMath;

const schemas = R.pipe(
    R.sortBy(R.identity),
    R.map((file) => require(path.resolve(file))),
    R.flatten,
    R.map(R.prop("schema"))
)(glob.sync('./node_modules/json-schema-test-suite/tests/draft4/*.json'));

const seed = randomJs.integer(0, 1000000000000000)(engine);
console.log(`seed: ${seed}`);

let total = schemas.length;
let passed = 0;
let failed = 0;

schemas.forEach((schema, it) => {
    const instanceGen = detGenerator(schema, seed+it);

    try {
        const instances = R.range(0, 10000).map(() => instanceGen.next().value);
        const results = instances.map((i) => tv4.validate(i, schema));

        if (R.all(R.identity, results)) {
            passed += 1;
        } else {
            failed += 1;
        }
    } catch (e) {
        failed += 1;
    }
});

console.log(`total: ${total}, passed: ${passed}, failed: ${failed}`);
