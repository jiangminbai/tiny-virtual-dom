# tiny-virtual-dom

## 前言

此项目主要受到[virtual-dom](https://github.com/Matt-Esch/virtual-dom)的启发，是一个简版虚拟dom的实现。它的特点在于对list-diff的处理上，也就是求解两个数组的编辑距离问题上，没有采用最小编辑距离算法(O(n2))，也没有使用virtual-dom原项目实现方式(O(n))，virtual-dom原项目的实现方式相对于最小编辑距离算法本质上是降低了算法的时间复杂，但是增加了操作dom的操作次数，通过删除和插入dom两个操作来实现移动dom节点。此项目是根据原生Dom的insertBefore方法的特性，进行真正的移动节点操作，算法的时间复杂度依然为(O(n)),但是逻辑更简单易懂！

## 接口

### 调用 

```html
<script src="./dist/virtual-dom.js"></script>
```

### 使用

```javascript
var h = virtualDOM.vnode;
var diff = virtualDOM.diff;
var patch = virtualDOM.patch;

const tree = h('ul', [
    h('li', {key: 'a'}, ['a']),
    h('li', {key: 'b'}, ['b']),
    h('li', {key: 'c'}, ['c']),
    h('li', {key: 'd'}, ['d']),
    h('li', {key: 'e'}, ['e']),
])

var rootNode = tree.render();
document.body.appendChild(rootNode);

const newTree = h('ul', [
    h('li', {key: 'c'}, ['c']),
    h('li', {key: 'e'}, ['e']),
    h('li', {key: 'a'}, ['a']),
    h('li', {key: 'b'}, ['b']),
    h('li', {key: 'f'}, ['f']),
])

var patches = diff(tree, newTree);

setTimeout(() => {
  patch(rootNode, patches);
}, 1000);
```

