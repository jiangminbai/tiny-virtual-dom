(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.virtualDOM = factory());
}(this, (function () { 'use strict';

/**
 * 一系列工具方法
 */

var utils = {};

utils.type = function (obj, type) {
  return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase() === type;
};

// 是否是数组
utils.isArray = function (obj) {
  return utils.type(obj, 'array');
};

// 是否是字符串
utils.isString = function (obj) {
  return utils.type(obj, 'string');
};

// 是否是对象
utils.isObject = function (obj) {
  return utils.type(obj, 'object');
};

/**
 * virtual-dom节点的实现
 * author: Jan<543050768@qq.com>
 * description:
 */

// 定义virtual-dom的节点 参数为标签名、属性对象、子节点列表
var VNode = function VNode(tag, props, children) {
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

  var count = 0;
  this.children.forEach(function (child) {
    if (child instanceof VNode) {
      count += child.count;
    }
    count++;
  });
  this.count = count; // 表示子节点的数量
};

// 把虚拟dom渲染为真正的dom树的方法
VNode.prototype.render = function () {
  var _this = this;

  // 创建指定标签的对象
  var el = document.createElement(this.tag);

  // 设置属性列表
  Object.keys(this.props).forEach(function (key) {
    var value = _this.props[key];
    el.setAttribute(key, value);
  });

  // 遍历子节点列表（深度优先遍历）
  this.children.forEach(function (child) {
    var childNode = child instanceof VNode ? child.render() : document.createTextNode(child);
    el.appendChild(childNode);
  });

  return el;
};

var REMOVE = 0; // 删除dom自身
var INSERT = 1; // 向dom子节点列表最后插入元素
var REPLACE = 2; // 用新node替换当前dom
var ORDER = 3; // 对dom子节点列表(key)进行排序，包括删除、插入
var PROPS = 4; // 编辑dom自身的props
var TEXT = 5; // 编辑文本节点自身

function patch(rootNode, patches) {
  var domIndex = domIndces(rootNode, patches);
  var indexList = patchIndcesList(patches);
  console.log(domIndex);

  for (var i = 0; i < indexList.length; i++) {
    var key = indexList[i];
    applyPatch(domIndex[key], patches[key]);
  }
}

function applyPatch(domNode, vpatch) {
  for (var i = 0; i < vpatch.length; i++) {
    var _patch = vpatch[i];
    var type = _patch.type;
    switch (type) {
      case REMOVE:
        removeDOM(domNode);
        break;
      case INSERT:
        insertDOM(domNode, _patch.node);
        break;
      case REPLACE:
        replaceDOM(domNode, _patch.node);
        break;
      case ORDER:
        orderDOM(domNode, _patch.moves);
        break;
      case PROPS:
        setProps(domNode, _patch.props);
        break;
      case TEXT:
        setText(domNode, _patch.content);
        break;
      default:
        throw new Error('unknown patch type: ' + type);
    }
  }
}

function removeDOM(node) {
  console.log(node);
  var parentNode = node.parentNode;
  if (parentNode) parentNode.removeChild(node);
}

function insertDOM(node, newVNode) {
  node.appendChild(newVNode.render());
}

function replaceDOM(node, newVNode) {
  var parentNode = node.parentNode;
  if (parentNode) parentNode(newVNode.render(), node);
}

function orderDOM(node, moves) {
  var childNodes = node.childNodes;
  var keys = moves.keys,
      removes = moves.removes,
      ismove = moves.ismove;
  var keyMap = {};

  [].slice.call(childNodes).forEach(function (item) {
    var key = item.getAttribute('key');
    keyMap[key] = item;
  });

  // 删除多余节点
  removes.forEach(function (item) {
    node.removeChild(childNodes[item.from]);
  });

  // 移动节点
  if (!ismove) return;
  var len = keys.length;
  var rightNode = null;
  while (len--) {
    var leftNode = keyMap[keys[len]];
    node.insertBefore(leftNode, rightNode);
    rightNode = leftNode;
  }
}

function setProps(node, props) {
  for (var key in props) {
    if (!props[key]) {
      node.removeAttribute(key);
    } else {
      node.setAttribute(key, props[key]);
    }
  }
}

function setText(node, content) {
  node.textContent = content;
}

// 获取需要操作的dom节点列表
function domIndces(rootNode, patch) {
  var domNodes = {},
      domIndex = { index: 0 };
  DFSNode(rootNode, domNodes, patch, domIndex);

  return domNodes;
}

function DFSNode(node, domNodes, patch, domIndex) {
  if (patch.hasOwnProperty(domIndex.index)) domNodes[domIndex.index] = node;

  var child = node.childNodes;
  for (var i = 0; i < child.length; i++) {
    domIndex.index++;
    DFSNode(child[i], domNodes, patch, domIndex);
  }
}

// 获取patches的索引值，形成一个升序的数组
function patchIndcesList(patches) {
  var indces = [];
  for (var key in patches) {
    indces.push(key);
  }

  // 升序
  indces.sort(function (a, b) {
    return a - b;
  });

  return indces;
}

patch.REMOVE = REMOVE;
patch.INSERT = INSERT;
patch.REPLACE = REPLACE;
patch.ORDER = ORDER;
patch.PROPS = PROPS;
patch.TEXT = TEXT;

/**
 * list-diff
 * author: https://github.com/jan-wong (复读机)
 */

function listDiff(oldList, newList) {
  var newKeys = keyIndex(newList);
  var newKeyIndex = newKeys.keys;
  var newKeyList = newKeys.keyList;
  var newFree = newKeys.free;

  var oldKeys = keyIndex(oldList);
  var oldKeyIndex = oldKeys.keys;
  var oldFree = oldKeys.free;

  // 如果newList || oldList 含有非key，则返回
  if (newFree.length > 0 || oldFree.length > 0) {
    return {
      children: newList,
      moves: null
    };
  }

  var newChildren = [];

  // 遍历oldList 逐个匹配newList的条目
  oldList.forEach(function (item) {
    if (item.key) {
      if (newKeyIndex.hasOwnProperty(item.key)) {
        var index = newKeyIndex[item.key];
        newChildren.push(newList[index]);
      } else {
        newChildren.push(null);
      }
    }
  });

  // 遍历newList 添加新增的条目
  newList.forEach(function (item) {
    if (item.key) {
      if (!oldKeyIndex.hasOwnProperty(item.key)) {
        newChildren.push(item);
      }
    }
  });

  // var simulate  = [{id: "a"}, {id: "b"}, {id: "c"}, {id: "e"}, {id: "f"}]
  // var bChildren = [{id: "c"}, {id: "e"}, {id: "a"}, {id: "b"}, {id: "f"}]
  var simulateList = newChildren.slice();
  var removes = [];

  // 删除null项
  simulateList.forEach(function (item, index) {
    if (!item) remove(index), removeSimulate(index);
  });

  function remove(from) {
    removes.push({ from: from });
  }

  function removeSimulate(index) {
    simulateList.splice(index, 1);
  }

  var simulateKeys = keyIndex(simulateList);
  var simulateKeyList = simulateKeys.keyList;
  var ismove = simulateKeyList.some(function (item, index) {
    return item !== newKeyList[index];
  });

  return {
    moves: { removes: removes, keys: newKeyList, ismove: ismove },
    children: newChildren
  };
}

function keyIndex(arr) {
  var keys = {};
  var free = [];
  var keyList = [];

  arr.forEach(function (child, i) {
    if (child.key) {
      keys[child.key] = i;
      keyList.push(child.key);
    } else {
      free.push(i);
    }
  });

  return {
    keys: keys, // key值映射到index的hash列表
    keyList: keyList, // 包含key值的数组
    free: free // 无key值的索引数组,
  };
}

/**
 * diff算法
 * author: https://github.com/jan-wong (复读机)
 */

// diff算法-比较两个树，计算出差异
function diff(oldTree, newTree) {
  var index = 0;
  var patches = {};

  traverseDFS(oldTree, newTree, index, patches);
  return patches;
}

// 深度优先遍历节点
function traverseDFS(oldNode, newNode, index, patches) {
  var currentPatch = [];

  // 真实的dom将被删除
  if (newNode === null) {
    currentPatch.push({ type: patch.REMOVE });
    // 如果是文本节点且不同，则用新节点替换
  } else if (utils.isString(oldNode) & utils.isString(newNode)) {
    if (oldNode !== newNode) {
      currentPatch.push({ type: patch.TEXT, content: newNode });
    }
    // 如果标签名相同
  } else if (oldNode.tagName === newNode.tagName) {
    // 属性不同，替换/删除/新增属性
    var propsPatches = diffProps(oldNode, newNode);
    if (propsPatches) {
      currentPatch.push({ type: patch.PROPS, props: propsPatches });
    }
    // 继续检查children
    diffChildren(oldNode, newNode, index, patches, currentPatch);
    // 节点不同，直接替换
  } else {
    currentPatch.push({ type: patch.REPLACE, node: newNode });
  }

  if (currentPatch.length) {
    patches[index] = currentPatch;
  }
}

// 计算子节点列表的差异
function diffChildren(a, b, index, patches, currentPatch) {
  var aChildren = a.children;
  var orderedSet = listDiff(aChildren, b.children);
  var bChildren = orderedSet.children;
  console.log([].slice.call(bChildren));

  var aLen = aChildren.length;
  var bLen = bChildren.length;
  var len = aLen > bLen ? aLen : bLen;

  for (var i = 0; i < len; i++) {
    var leftNode = aChildren[i];
    var rightNode = bChildren[i];
    index++;

    if (!leftNode) {
      if (rightNode) {
        currentPatch.push({ type: patch.INSERT, node: rightNode });
      }
    } else {
      traverseDFS(leftNode, rightNode, index, patches);
    }

    if (leftNode instanceof VNode && leftNode.count) {
      index += leftNode.count;
    }
  }

  if (orderedSet.moves) {
    currentPatch.push({ type: patch.ORDER, moves: orderedSet.moves });
  }
}

// 计算属性差异
function diffProps(oldNode, newNode) {
  var count = 0;
  var oldProps = oldNode.props;
  var newProps = newNode.props;
  var propsPatches = {};

  // 找出节点（改变、删除）的属性，删除的属性表现为property:undefined
  Object.keys(oldProps).forEach(function (key) {
    if (oldProps[key] !== newProps[key]) {
      count++;
      propsPatches[key] = newProps[key];
    }
  });

  // 找出节点（新增）的属性
  Object.keys(newProps).forEach(function (key) {
    if (oldProps[key] !== newProps[key]) {
      count++;
      propsPatches[key] = newProps[key];
    }
  });

  // 如果没有属性改变则返回null
  if (count === 0) return null;
  return propsPatches;
}

var index = {
  vnode: VNode,
  diff: diff,
  patch: patch
};

return index;

})));
