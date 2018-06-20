const Benchmark = require('benchmark');
const suite = new Benchmark.Suite;

const NumbMap = require('./dist/lib/NumbMap').default;
const numbMap = new NumbMap(10,10,11);

const map = new Map();

const lit = {};
var keys = {x: 1, y: 1, z: 1};

suite.add('SetGet#ObjLit', function() {
  lit[keys.x + '-' + keys.y + '-' + keys.z] = "value";
  return lit[keys.x + '-' + keys.y + '-' + keys.z];
}).add('SetGet#Map', function() {
  map.set(keys.x + '-' + keys.y + '-' + keys.z, "value");
  return map.get(keys.x + '-' + keys.y + '-' + keys.z);
}).add('SetGet#NumbMap', function() {
  numbMap.set(keys.x, keys.y, keys.z, "value");
  return numbMap.get(keys.x, keys.y, keys.z);
})

// add listeners
.on('cycle', function(event) {
  console.log(String(event.target))
})
.on('complete', function() {
  console.log('Fastest is ' + this.filter('fastest').map('name'))
})

// run async
.run({ 'async': true })
