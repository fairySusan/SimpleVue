import Watcher from './watcher'
// 解析模板，解析指令{{}}、v-model、v-on，初始化模板上的数据
class Compile {
	constructor(el, vm) {
		this.vm = vm;
		this.el = document.querySelector(el);
		this.fragment = null;
		this.init();
	}

	init() {
		if (this.el) {
			this.fragment = this.nodeToFragment();
			this.compileElement(this.fragment);
			this.el.appendChild(this.fragment);
		}
	}

	nodeToFragment() {
		const fragment = document.createDocumentFragment(); // 创建一个DOM片段
		let child = this.el.firstChild;

		while (child) {
			fragment.appendChild(child);
			child = this.el.firstChild;
		}
		return fragment;
	}

	compileElement(fragment) {
		const childNodes = fragment.childNodes;
		[].slice.call(childNodes).forEach((node) => {
			const reg = /\{\{(.*)\}\}/;
			const text = node.textContent;

			if (this.isElementNode(node)) {    // 解析自定义组件
				this.compile(node);

			} else if (this.isTextNode(node) && reg.test(text)) {  // 解析{{}}语法

				this.compileText(node, reg.exec(text)[1]);
			}

			if (node.childNodes && node.childNodes.length) {

				this.compileElement(node);
			}
		});
	}

	compile(node) {
		const nodeAttrs = node.attributes;
		Array.prototype.forEach.call(nodeAttrs, (attr) => {
			const attrName = attr.name;
			if (this.isDirective(attrName)) {
				const exp = attr.value;
				const dir = attrName.substring(2);
				if (this.isEventDirective(dir)) {
					// 事件指令
					this.compileEvent(node, this.vm, exp, dir);

				} else {

					// v-model 指令
					this.compileModel(node, this.vm, exp);
				}
				node.removeAttribute(attrName);
			}
		});
	}

	compileEvent (node, vm, exp, dir) {
		const eventType = dir.split(':')[1];
		const cb = vm.methods && vm.methods[exp];

		if (eventType && cb) {
			node.addEventListener(eventType, cb.bind(vm), false);
		}
	}

	compileModel (node, vm, exp) {
		let val = vm[exp];

		// 更新内容
		this.modelUpdater(node, val);

		// 添加订阅
		new Watcher(vm, exp, (value) => {
			// 数据改变时的回调函数
			this.modelUpdater(node, value);
		});

		// 事件监听
		node.addEventListener('input', (e) => {
			const newValue = e.target.value;
			if (val === newValue) {
				return false;
			}
			vm[exp] = newValue;
			val = newValue;
		});
	}
	// 解析{{}}语法， exp 是响应式属性
	compileText(node, exp) {
		const initText = this.vm[exp]; // 读取响应式属性的值，触发getter函数

		this.updateText(node, initText);
		if (exp in this.vm._computedWatchers) {
			const watcher = this.vm._computedWatchers[exp];
			new Watcher(this.vm, exp, (value) => {   // 对exp这个响应式属性实例了一个watcher
											this.updateText(node, value);
										}, true, watcher.cb);
		} else {
			new Watcher(this.vm, exp, (value) => {   // 对exp这个响应式属性实例了一个watcher
				this.updateText(node, value);
			});
		}
	}
    // {{}}的元素的文本值得更新
	updateText (node, value) {
		node.textContent = typeof value === 'undefined' ? '' : value;
	}
    // v-model的元素的value属性值更新
	modelUpdater(node, value) {
		node.value = typeof value === 'undefined' ? '' : value;
	}

	isDirective(attr) {
		return attr.indexOf('v-') === 0;
	}

	isEventDirective(dir) {
		return dir.indexOf('on:') === 0;
	}

	isElementNode (node) {
		return node.nodeType === 1;
	}

	isTextNode(node) {
		return node.nodeType === 3;
	}
}

export default Compile