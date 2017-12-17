/**
 * virtual-dom节点的实现
 * author: Jan<543050768@qq.com>
 * description:
 */

import utils from './utils.js';

// 定义virtual-dom的节点 参数为标签名、属性对象、子节点列表
const VNode = function (tag, props, children) {
  // 通过直接调用VNode就可以实例化
  if (!(this instanceof VNode)) return new VNode(tag, props, children);

  // 只有tag,children
  if (utils.isArray(props)) {
    children = props;
    props = {};
  }
  // 只有tag
  if (utils.isString(props) || typeof props === 'number') {
    props = {};
    children = [];
  }
  // 只有tag,props
  if (utils.isString(children) || typeof children === 'number') {
    children = [];
  }

  this.tag = tag;
  this.props = props || {};
  this.children = children || [];
  this.key = props.key ? String(props.key) : undefined;
  
  let count = 0;
  this.children.forEach(child => {
    if (child instanceof VNode) {
      count += child.count;
    }
    count++;
  })
  this.count = count; // 表示子节点的数量
}

// 把虚拟dom渲染为真正的dom树的方法
VNode.prototype.render = function () {
  // 创建指定标签的对象
  let el = document.createElement(this.tag);

  // 设置属性列表
  Object.keys(this.props).forEach(key => {
    const value = this.props[key];
    el.setAttribute(key, value);
  });

  // 遍历子节点列表（深度优先遍历）
  this.children.forEach(child => {
    let childNode = (child instanceof VNode) ? child.render() : document.createTextNode(child);
    el.appendChild(childNode);
  });

  return el;
}

export default VNode;