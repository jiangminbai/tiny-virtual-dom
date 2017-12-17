/**
 * diff算法
 * author: https://github.com/jan-wong (复读机)
 */

import utils from './utils.js';
import VNode from './vnode.js';
import patch from './patch.js';
import listDiff from './list-diff.js';

// diff算法-比较两个树，计算出差异
function diff(oldTree, newTree) {
  let index = 0;
  const patches = {};

  traverseDFS(oldTree, newTree, index, patches);
  return patches;
}

// 深度优先遍历节点
function traverseDFS(oldNode, newNode, index, patches) {
  const currentPatch = [];

  // 真实的dom将被删除
  if (newNode === null) {
    currentPatch.push({type: patch.REMOVE});
  // 如果是文本节点且不同，则用新节点替换
  } else if (utils.isString(oldNode) & utils.isString(newNode)) {
    if (oldNode !== newNode) {
      currentPatch.push({type: patch.TEXT, content: newNode});
    }
  // 如果标签名相同
  } else if (oldNode.tagName === newNode.tagName) {
    // 属性不同，替换/删除/新增属性
    const propsPatches = diffProps(oldNode, newNode);
    if (propsPatches) {
      currentPatch.push({type: patch.PROPS, props: propsPatches});
    }
    // 继续检查children
    diffChildren(oldNode, newNode, index, patches, currentPatch);
  // 节点不同，直接替换
  } else {
    currentPatch.push({ type: patch.REPLACE, node: newNode});
  }

  if (currentPatch.length) {
    patches[index] = currentPatch;
  }
}

// 计算子节点列表的差异
function diffChildren(a, b, index, patches, currentPatch) {
  const aChildren = a.children;
  const orderedSet = listDiff(aChildren, b.children);
  const bChildren = orderedSet.children;
  console.log([].slice.call(bChildren));

  let aLen = aChildren.length;
  let bLen = bChildren.length;
  let len = aLen > bLen ? aLen : bLen;

  for (let i = 0; i < len; i++) {
    let leftNode = aChildren[i];
    let rightNode = bChildren[i];
    index++

    if (!leftNode) {
      if (rightNode) {
        currentPatch.push({type: patch.INSERT, node: rightNode});
      }
    } else {
      traverseDFS(leftNode, rightNode, index, patches);
    }

    if (leftNode instanceof VNode && leftNode.count) {
      index += leftNode.count;
    }
  }

  if (orderedSet.moves) {
    currentPatch.push({type: patch.ORDER, moves: orderedSet.moves});
  }
}

// 计算属性差异
function diffProps(oldNode, newNode) {
  let count = 0;
  const oldProps = oldNode.props;
  const newProps = newNode.props;
  const propsPatches = {};

  // 找出节点（改变、删除）的属性，删除的属性表现为property:undefined
  Object.keys(oldProps).forEach(key => {
    if (oldProps[key] !== newProps[key]) {
      count++;
      propsPatches[key] = newProps[key];
    }
  })

  // 找出节点（新增）的属性
  Object.keys(newProps).forEach(key => {
    if (oldProps[key] !== newProps[key]) {
      count++;
      propsPatches[key] = newProps[key];
    }
  })

  // 如果没有属性改变则返回null
  if (count === 0) return null;
  return propsPatches;
}

export default diff;