import NumbMap from '../src/NumbMap'

describe('NumbMap', () => {
  describe('constructor()', () => {
    it('throws a range error if no numerators are specified.', () => {
      expect(() => {
        return new NumbMap()
      }).toThrowError(RangeError)
    })

    it('throws a range error if numerators outnumber the maximum allowed.', () => {
      expect(() => {
        return new NumbMap(
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9,
          10,
          11,
          12,
          13,
          14,
          15,
          16,
          17,
          18,
          19,
          20,
          21,
          22,
          23,
          24,
          25,
          26,
          27,
          28,
          29,
          30,
          31,
          32,
          33,
          34
        )
      }).toThrowError(RangeError)
    })

    it('throws a type error if a numerator is not an integer.', () => {
      expect(() => {
        return new NumbMap(1.1)
      }).toThrowError(TypeError)
    })

    it('throws a range error if a numerator is less than 1.', () => {
      expect(() => {
        return new NumbMap(-1)
      }).toThrowError(RangeError)
    })

    it('throws a range error if a numerator is greater than the maximum allowed.', () => {
      expect(() => {
        return new NumbMap(32)
      }).toThrowError(RangeError)
    })

    it('throws a range error if numerators do not add up to 30.', () => {
      expect(() => {
        return new NumbMap(16, 17)
      }).toThrowError(RangeError)
    })

    it('successfully constructs with 1 dimension.', () => {
      const map = new NumbMap(31)

      expect(map.numerators.length).toBe(1)
      expect(map.numerators[0]).toBe(31)
    })

    it('successfully constructs with 2 dimensions.', () => {
      const map = new NumbMap(15, 16)

      expect(map.numerators).toEqual([15, 16])
    })

    it('successfully constructs with 4 dimensions.', () => {
      const map = new NumbMap(10, 10, 10, 1)

      expect(map.numerators).toEqual([10, 10, 10, 1])
    })
  })

  describe('set()', () => {
    it('sets a value at the numerators specified.', () => {
      const map = new NumbMap(10, 10, 10, 1)
      const result = map.set(100, 100, 100, 1, 'test')
      expect(result).toBe(map)
    })
  })

  describe('get()', () => {
    it("returns undefined if a value hasn't been set.", () => {
      const map = new NumbMap(10, 10, 10, 1)
      const result = map.get(100, 100, 100, 1)
      expect(result).toBeUndefined()
    })

    it('gets a value at the numerators specified.', () => {
      const map = new NumbMap(10, 10, 10, 1)
      map.set(100, 100, 100, 1, 'test')
      const result = map.get(100, 100, 100, 1)
      expect(result).toBe('test')
    })
  })

  describe('has()', () => {
    it("returns false if a value hasn't been set.", () => {
      const map = new NumbMap(10, 10, 10, 1)
      const result = map.has(100, 100, 100, 1)
      expect(result).toBe(false)
    })

    it('checks if a value exists at the numerators specified.', () => {
      const map = new NumbMap(10, 10, 10, 1)
      map.set(100, 100, 100, 1, 'test')
      const result = map.has(100, 100, 100, 1)
      expect(result).toBe(true)
    })
  })

  describe('delete()', () => {
    it("returns false if a key to delete wasn't set.", () => {
      const map = new NumbMap(10, 10, 10, 1)
      const result = map.delete(100, 100, 100, 1)
      expect(result).toBe(false)
      expect(map.get(100, 100, 100, 1)).toBeUndefined()
    })

    it('checks if a value exists at the numerators specified.', () => {
      const map = new NumbMap(10, 10, 10, 1)
      map.set(100, 100, 100, 1, 'test')
      const result = map.delete(100, 100, 100, 1)
      expect(result).toBe(true)
      expect(map.get(100, 100, 100, 1)).toBeUndefined()
    })
  })

  describe('toPackedNumber()', () => {
    it('takes an array and splits it into a single key.', function() {
      const map = new NumbMap(9, 10, 12)
      const raw = map.toPackedNumber([1, 3, 5])
      expect(raw.toString(2)).toEqual('1010000000011000000001')
    })
  })

  describe('fromPackedNumber()', () => {
    it('converts a raw number back into an array', () => {
      const map = new NumbMap(9, 10, 12)
      const result = map.fromPackedNumber(parseInt('1010000000011000000001', 2))
      expect(result).toEqual([1, 3, 5])
    })
  })
})
