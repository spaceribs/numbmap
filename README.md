# NumbMap
**A map extension that leverages number based keys for multidimensional value storage.**

## Usage
To initialize a NumbMap, you'll need to pass in the bit's you want to define
for each index. They must add up to 31:
```js
const map = new NumbMap(10,10,10,1);
```

Once initialized, the setter value is always the last element:
```js
map.set(50, 50, 50, 0, "value");
return map.get(50, 50, 50, 0);      // returns "value"
```

Rules to follow:
1. Make sure to not pass in a value that cannot be stored in the specified
number of bits, calculated by `Math.pow(2, bitsInColumn) - 1`.
2. Do not pass in anything other than a non-negative integer for keys.

Values can be any type.

## Implementation Details
Say you want to store vectors in a flat map, in ES5, you might do something
like the following:

```js
var test = {};                      // initialize
test[x + "-" + y] = "entity";       // set value
return test[x + "-" + y];           // get value
```

This is fine, but it's not optimal. Matching against strings is expensive.
In ES6, we can leverage Map, which is substantially faster:

```js
const test = new Map();             // initialize
test.set(x + "-" + y, "entity");    // set value
test.get(x + "-" + y);              // get value
```

We're still using strings as keys, but the Map implementation is much faster.
Maps have some special abilities though, [one of which is the following](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map):

> The keys of an Object are Strings and Symbols, whereas they can be any value for a Map, including 
functions, objects, and any primitive.

Based on the above, you would think that maybe the following would work:

```js
const test = new Map();             // initialize
test.set([x, y], "entity");         // set value
test.get([x, y]);                   // get value (fails)
```

Unfortunately, the `Map` getter is based on `===` equality, so getting the those coordinates would 
require you to have a reference to the array you set. In this case, the getter would fail.

What other choices do we have which would allow for equality which are not string types?
Well, we also have numbers, maybe we can split a number into an array of numbers?

All numbers are STORED at 64 bits, but bitwise operations run at 32 signed bits. Signed means the 
32nd bit is used to determine if we're dealing with a negative or a positive number. That means we
have 31 bits to store our array of values, lets go over how this will look:

```js
const splits = [9, 10, 12];  // These are the bit slices I'd like to store the values in
const values = [1, 3, 5];    // These are the actual values we'll store

const firstSplit = "000000001"       // This is 1 in binary, stored in 9 bits;
const secondSplit = "0000000011"     // This is 3 in binary, stored in 10 bits;
const thirdSplit = "000000000101"    // This is 5 in binary, stored in 12 bits;

const packedNumber = parseInt(thirdSplit + secondSplit + firstSplit, 2);
// packedNumber is 2622977
```

This is still some expensive string concatenation here, so lets use a bitwise equivalent:

```js
const packedNumber = 1 | (3 << 9) | (5 << 19);
```

By shifting in zeroes from the right and then OR'ing it with the other values, the values never
comingle unless the are too large.

```js
const test = new Map();                         // initialize
const packedNumber = 1 | (3 << 9) | (5 << 19);  // generate coordinates
test.set(packedNumber, "entity");               // set value
test.get(packedNumber);                         // get value
```

This is the core of how NumbMap works, with validation and abstraction to make the pattern
much more usable:

```js
const test = new NumbMap(9, 10, 12);       // initialize with columns
test.set(1, 3, 5, "entity");               // set value
test.get(1, 3, 5);                         // get value
```

At this point you might be asking "Why not use multidimensional arrays?" and in most cases you'd 
be right, but remember that initializing large arrays has memory implications which maps do
not. **Use your best judgement to determine if a NumbMap is the correct approach for your use case**.

## Benchmarks

[Benchmark Suite](./benchmark.js)

| Name        | Results           |
| ------------- |:-------------:|
| SetGet#ObjLit | 2,461,171 ops/sec ±0.75% (89 runs sampled) |
| SetGet#Map | 5,926,323 ops/sec ±1.01% (89 runs sampled) |
| SetGet#NumbMap | 6,983,521 ops/sec ±0.73% (89 runs sampled) |

---

This project follows the [all-contributors](https://github.com/kentcdodds/all-contributors) specification. Contributions of any kind are welcome!
