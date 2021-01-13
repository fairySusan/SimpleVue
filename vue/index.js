import Observer from './obeserver'
import Compile from './compile'
import initComputed from './init/initComputed'
import initWatch from './init/initWatch'

class SimpleVue {
  constructor(options) {
    this.data = options.data;
		this.methods = options.methods;
		this.computed = options.computed;
    this.watch = options.watch;
    
    // 数据劫持
		Object.keys(this.data).forEach((key) => {
			this.proxyKeys(key);
    });

    // 数据观察 - 搜集依赖
		new Observer(this.data);
		// 初始化computed
		initComputed(this);
		// 初始化watch
		initWatch(this);
		// 编译模板 - 添加订阅者
		new Compile(options.el, this);
		// 所有事情处理好后执行 mounted 函数
		options.mounted.call(this);
  }
  // 把data对象的属性复制到vue实例对象里
  proxyKeys (key) {
    Object.defineProperty(this, key, {
      enumerable: false,
      configurable: true,
      get() {
        return this.data[key];
      },
      set(newVal) {
        this.data[key] = newVal;
      }
    });
  }
}
export default SimpleVue