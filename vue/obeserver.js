import Dep from './dep'

class Observer {
	constructor(data) {
		this.data = data;
		this.walk();
	}

	walk() {
		Object.keys(this.data).forEach(key => {
			this.defineReactive(this.data, key, this.data[key]);
		});
	}

	defineReactive(data, key, value) {
		const dep = new Dep();
		// 深度监听data对象的属性
		if ( value && typeof value === 'object' ) {
			new Observer(value);
		}

		Object.defineProperty(data, key, {
			enumerable: true,
			configurable: true,
			get() {
				if (Dep.target) {
					dep.addSub(Dep.target); // 重点： 这是Observer这个类最重要的作用
				}
				return value;
			},
			set(newVal) {
				if (newVal === value) {
					return false;
				}
				value = newVal;
				dep.notify(); // 重点：这是Observer这个类最重要的作用。数据改变，发布消息通知跟这个响应式属性关联的视图变化
			}
		});
	}
}

export default Observer