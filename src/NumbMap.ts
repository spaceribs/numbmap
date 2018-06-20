// Import here Polyfills if needed. Recommended core-js (npm i -D core-js)
import 'core-js/es6/map'

export default class NumbMap<T> extends Map<number, T> {
  readonly bits: number[]
  private columns: number[]
  private offsets: number[]
  private MAX_BITS = 31

  /**
   * A map which takes a set of numbers and stores them within
   * a 31 bit unsigned number.
   *
   * @param {...number} bits - Explicitly specify how the 31 bit number should be
   * broken up into smaller denominations, should follow these rules:
   *
   * - Must be at least one bit specified
   * - All bits must be non-negative integers
   * - All bits must add up exactly to 31
   */
  constructor(...bits: number[]) {
    super()

    if (bits.length < 1) {
      throw new RangeError('InvalidBits: Cannot have less than 1 bit.')
    }

    if (bits.length > this.MAX_BITS) {
      throw new RangeError(`InvalidBits: Cannot have more than ${this.MAX_BITS} bits.`)
    }

    const bitsTotal = bits.reduce((memo, bit) => {
      if (!Number.isInteger(bit)) {
        throw new TypeError(`InvalidBit: "${bit}" is not an integer.`)
      }

      if (bit < 1) {
        throw new RangeError(`InvalidBit: "${bit}" is less than 1 bit.`)
      }

      if (bit > this.MAX_BITS) {
        throw new RangeError(`InvalidBit: ${bit} is greater than ${this.MAX_BITS} bits.`)
      }

      memo += bit

      return memo
    }, 0)

    if (bitsTotal !== this.MAX_BITS) {
      throw new RangeError(
        `InvalidBits: bits do not add up to ${this.MAX_BITS} bits. Total is ${bitsTotal}.`
      )
    }

    this.bits = bits

    let offset = 0
    this.columns = []
    this.offsets = []

    for (let x = 0; x < bits.length; x++) {
      // Generate 2 to the power of the bit
      //     Math.pow(2, 3) -> 1000
      // Subtract 1, setting all bits representing the bit to 1:
      //     (1000 - 1) -> 111
      // Shift the bits to the right, to get into the right position:
      //     (111 << 6) -> 111000000
      this.columns.push((Math.pow(2, bits[x]) - 1) << offset)

      // Generate 2 to the power of the current offset
      //     Math.pow(2, 3) -> 1000
      this.offsets.push(Math.pow(2, offset))
      offset += bits[x]
    }
  }

  /**
   * Set a value to given keys.
   *
   * @params {...number[], T} args - Should be the keys you'd like to set
   * @returns {this}
   */
  set(...args: Array<any>): this {
    return super.set(this.toPackedNumber(args), args.pop() as T)
  }

  get(...rawKeys: number[]): T | undefined {
    return super.get(this.toPackedNumber(rawKeys))
  }

  has(...rawKeys: number[]): boolean {
    return super.has(this.toPackedNumber(rawKeys))
  }

  delete(...rawKeys: number[]): boolean {
    return super.delete(this.toPackedNumber(rawKeys))
  }

  /**
   * Pack the values into bits specified by the passed bit definition.
   * Not normally used directly.
   *
   * @param {number[]} values - The number values to pack, must follow these rules:
   *
   * - Must be a non-negative integer
   * - Must be less than the maximum number allowed in the specified bit
   * @param {number[]} bits - Bits used to specify how the values in
   * the array should be packed. **Must follow all the rules of the NumbMap constructor.**
   * @returns {number} - The packed number.
   */
  public toPackedNumber(values: number[]): number {
    let offset = 0
    let packed = 0

    // First we generate 2 to the power of offset to shift all our bits over if needed
    // Next we multiply in our values
    // finally we OR our offsetted value into the rest of the values
    for (let x = 0; x < this.bits.length; x++) {
      packed = packed | (this.offsets[x] * values[x])
      offset += this.bits[x]
    }

    return packed
  }

  /**
   * Takes a number packed with bits and converts them back to an array.
   * Not normally used directly.
   *
   * @param {number} rawValue - The packed number.
   * @param {number[]} bits - The bit definitions defining the
   * offsets within the packed number.
   * @returns {number[]} - the unpacked result.
   */
  public fromPackedNumber(rawValue: number): number[] {
    let offset = 0
    let values = []

    for (let x = 0; x < this.bits.length; x++) {
      // Then AND it into the raw value:
      //     (101000111 & 111000000) -> 101000000
      // Finally shift the offset back:
      //     (101000000 >> 6) -> 101
      values.push((rawValue & this.columns[x]) >> offset)
      offset += this.bits[x]
    }

    return values
  }
}
