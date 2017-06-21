const guard = Symbol('EmptyRecord');
const values = Symbol('CustomValues');
const defaults = Symbol('DefaultValues');
const empty = () => void 0;

export default class Record {
  constructor(custom = {}) {
    if (custom === guard) return this;

    if (!this.constructor[defaults]) {
      const emptyRecord = new this.constructor(guard);
      Object.defineProperty(this.constructor, defaults, {
        enumerable: false,
        get() { return emptyRecord }
      });
    }

    const base = this.constructor[defaults];

    for (const key in base) {
      const getter = key in custom
        ? () => custom[key]
        : () => base[key];

      Object.defineProperty(this, key, {
        enumerable: true,
        get: getter,
        set: empty
      });
    }

    Object.defineProperty(this, values, {
      enumerable: false,
      get() { return custom }
    });
  }

  copy(patch) {
    const values = Object.assign({}, this[values], patch);
    return new this.constructor(values);
  }

  equals(record) {
    const a = this[values];
    const b = record[values];

    for (const key in a) {
      if (a[key] !== b[key]) return false;
    }

    return true;
  }
}
