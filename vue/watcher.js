import Dep from './dep'
// 订阅者， vm是组件实例， exp是某个响应式属性
class Watcher {
	constructor(vm, exp, cb, user, getter) {
		this.cb = cb; // 订阅者的回调函数，对应指令模板的更新函数
		this.getter = getter;
		this.vm = vm;//vue实例
		this.exp = exp;//data里的变量名
		this.user = user; // 是否是用户自己定义的getter
		// 将自己添加到订阅器的操作
		this.value = this.getValue();
	}

	update() {
		let value = '';
		if (this.user) {
			value = this.getter.call(this.vm);
		} else {
			value = this.vm.data[this.exp];
		}
		const oldValue = this.value;
		this.value = value;
		if (value !== oldValue) {
			this.cb.call(this.vm, value, oldValue);
		}
	}

	getValue() {
		Dep.target = this;
		let value = null;
		if (this.user) {
			value = this.getter.call(this.vm);
		} else {
			value = this.vm.data[this.exp];
		}
		Dep.target = null;
		return value;
	}
}
export default Watcher