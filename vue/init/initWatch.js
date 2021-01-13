import Watcher from '../watcher'
function initWatch(_this) {
  for (let key in _this.watch) {
    const useDef = _this.watch[key];
    const cb = typeof useDef === 'function' ? useDef : null;
    new Watcher(_this, key, cb);
  }
}

export default initWatch