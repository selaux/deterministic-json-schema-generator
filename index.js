const randomJs = require('random-js');

function getEngine(seed) {
    return randomJs.engines.mt19937().seed(seed);
}



module.exports = function *generateSchema(schema, seed) {
    var rng = getEngine(seed);

    while (true) {
        if (schema.type === "number") {
            yield randomJs.real(0, 10000)(rng);
        } else {
            yield randomJs.picker([ 'asd', 123, { my: 'obj' }, [ 'an', 12 ], true, null ])(rng);
        }
    }
};