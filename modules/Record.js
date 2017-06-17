const guard = Symbol('I need empty record');
const empty = () => void 0;

export default class Record {
  constructor(custom) {
    if (custom === guard) return this;

    if (!this.constructor.defaults) {
      this.constructor.defaults = new this.constructor(guard);
    }

    const defaults = this.constructor.defaults;

    for (const key in defaults) {
      Object.defineProperty(this, key, {
        enumerable: true,
        get: ((key) => {
          return key in custom
            ? () => custom[key]
            : () => defaults[key]
        })(key),
        set: empty
      });
    }

    Object.defineProperty(this, '@@values', {
      enumerable: false,
      get() { return custom }
    });
  }

  copy(patch) {
    const values = Object.assign({}, this['@@values'], patch);
    return new this.constructor(values);
  }

  equals(record) {
    const a = this['@@values'];
    const b = record['@@values'];

    for (const key in a) {
      if (a[key] !== b[key]) return false;
    }

    return true;
  }
}
