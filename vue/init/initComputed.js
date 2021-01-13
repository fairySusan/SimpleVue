import Dep from '../dep'
import Watcher from '../watcher'
function initComputed(_this) {
  const dep = new Dep();
  for (let key in _this.computed) {
    const useDef = _this.computed[key];
    const getter = typeof useDef === 'function' ? useDef : null;
    let watchers = _this._computedWatchers = Object.create(null);
    watchers = _this._computedWatchers[key] = new Watcher(_this, key, getter, true, getter);
    const sharedPropertyDefinition = {
      enumerable: true,
      configurable: true,
      get() {
        if (Dep.target) {
          dep.addSub(Dep.target);
        }
        return watchers.value;
      },
      set() {}
    }
    _this.proxyKeys(key);
    Object.defineProperty(_this.data, key, sharedPropertyDefinition);
  }
}

export default initComputed