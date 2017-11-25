'use strict';

/**
 * 一系列工具方法
 */

const utils = {};

// 是否是数组
utils.isArray = function (obj) {
  return Object.prototype.toString.call(obj).slice(8, -1) === "Array";
};

/**
 * virtual-dom 的实现
 * author: https://github.com/jan-wong (复读机)
 * description:
 */

// 定义virtual-dom的节点 参数为标签名、属性对象、子节点列表
const VNode = function (tag, props, children) {
  // 通过直接调用VNode就可以实例化
  if (!(this instanceof VNode)) return new VNode(tag, props, children);

  // 接受只有tag和children两个参数
  if (utils.isArray(props)) {
    children = props;
    props = {};
  }

  this.tag = tag;
  this.props = props || {};
  this.children = children || [];
};

// 把虚拟dom渲染为真正的dom树
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
    let childNode = child instanceof VNode ? child.render() : document.createTextNode(child);
    el.appendChild(childNode);
  });

  return el;
};

module.exports = VNode;
