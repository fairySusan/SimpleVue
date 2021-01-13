#### npm install


#### 核心思路
* 初始化（解析html，解析指令：v-model、{{}}....,初始化标签里的文本值）每一个指令都会实例化一个watcher，初始化模板时会读取绑定在模板上的响应式属性，这样就触发getter函数<br>getter函数里通过dep.addSub(watcher)；来订阅实例化里的watcher

* 给data里的数据重新赋值，触发set方法，更新数据的值，发布者(dep.notify())发通知给订阅者调用订阅者的update方法(watcher.update())。
* watcher.update()里又去调用更新视图的方法modelUpdater(),或者textUpdater()
* 当你把一个普通的 JavaScript 对象传入 Vue 实例作为 data 选项，Vue 将遍历此对象所有的属性，并使用 Object.defineProperty 把这些属性全部转为 getter/setter。
* 当读取响应式属性时，比如在模板上绑定属性，会触发它的getter函数，getter函数里有dep.addSub(watcher),添加watcher
* 当给响应式属性赋值的时候，会触发它的setter函数，setter函数里调用dep.notify()；通知watcher去更新视图（watcher.update())
* Observe类主要给响应式对象的属性添加getter/setter用于依赖收集和派发更新
* Dep类用于收集当前响应式对象的依赖关系
* Watcher类是观察者，实例分为渲染watcher、计算属性watcher、侦听器watcher三种