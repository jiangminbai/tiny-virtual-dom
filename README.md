# tiny-virtual-dom

## 前言

此项目主要受到[virtual-dom](https://github.com/Matt-Esch/virtual-dom)的启发，是一个简版虚拟dom的实现

## 接口

### 调用 

```html
<script src="../dist/virtual-dom.js"></script>
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

