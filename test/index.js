const vnode = require('../dist/vnode.cjs.js');

var vdom = vnode('div', { 'id': 'container' }, [
    vnode('h1', { style: 'color:red' }, ['simple virtual dom']),
    vnode('p', ['hello world']),
    vnode('ul', [vnode('li', ['item #1']), vnode('li', ['item #2'])]),
]);
console.log(JSON.stringify(vdom, null, 2));