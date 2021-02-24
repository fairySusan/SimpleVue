// 发布订阅模式
class Dep {
	constructor() {
		this.subs = [];
	}

	addSub(watcher) {
		this.subs.push(watcher);
	}

	notify() {
		console.log(this.subs);
		this.subs.forEach(watcher => {
			watcher.update();
		});
	}
}

Dep.target = null;

export default Dep