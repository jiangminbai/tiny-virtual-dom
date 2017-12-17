const REMOVE = 0;  // 删除dom自身
const INSERT = 1;  // 向dom子节点列表最后插入元素
const REPLACE = 2; // 用新node替换当前dom
const ORDER = 3;  // 对dom子节点列表(key)进行排序，包括删除、插入
const PROPS = 4;  // 编辑dom自身的props
const TEXT = 5;  // 编辑文本节点自身

function patch(rootNode, patches) {
  const domIndex = domIndces(rootNode, patches);
  const indexList = patchIndcesList(patches);
  console.log(domIndex);

  for(let i = 0; i < indexList.length; i++) {
    let key = indexList[i];
    applyPatch(domIndex[key], patches[key]);
  }
}

function applyPatch(domNode, vpatch) {
  for (let i = 0; i < vpatch.length; i++) {
    let patch = vpatch[i];
    let type = patch.type;
    switch(type) {
      case REMOVE:
        removeDOM(domNode);
        break;
      case INSERT:
        insertDOM(domNode, patch.node);
        break;
      case REPLACE:
        replaceDOM(domNode, patch.node);
        break;
      case ORDER:
        orderDOM(domNode, patch.moves);
        break;
      case PROPS:
        setProps(domNode, patch.props);
        break;
      case TEXT:
        setText(domNode, patch.content);
        break;
      default:
        throw new Error(`unknown patch type: ${type}`);
    }
  }
}

function removeDOM(node) {
  console.log(node);
  let parentNode = node.parentNode;
  if (parentNode) parentNode.removeChild(node);
}

function insertDOM(node, newVNode) {
  node.appendChild(newVNode.render());
}

function replaceDOM(node, newVNode) {
  let parentNode = node.parentNode;
  if (parentNode) parentNode(newVNode.render(), node);
}

function orderDOM(node, moves) {
  let childNodes = node.childNodes;
  let keys = moves.keys, removes = moves.removes, ismove = moves.ismove;
  const keyMap = {};

  [].slice.call(childNodes).forEach(item => {
    const key = item.getAttribute('key');
    keyMap[key] = item;
  });

  // 删除多余节点
  removes.forEach(item => {
    node.removeChild(childNodes[item.from]);
  });

  // 移动节点
  if (!ismove) return;
  let len = keys.length;
  let rightNode = null;
  while(len--) {
    let leftNode = keyMap[keys[len]];
    node.insertBefore(leftNode, rightNode);
    rightNode = leftNode;
  }
}

function setProps(node, props) {
  for (let key in props) {
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
  const domNodes = {}, domIndex = {index: 0};
  DFSNode(rootNode, domNodes, patch, domIndex);

  return domNodes;
}

function DFSNode(node, domNodes, patch, domIndex) {
  if (patch.hasOwnProperty(domIndex.index)) domNodes[domIndex.index] = node;

  const child = node.childNodes;
  for(let i = 0; i < child.length; i++) {
    domIndex.index++
    DFSNode(child[i], domNodes, patch, domIndex);
  }
}

// 获取patches的索引值，形成一个升序的数组
function patchIndcesList(patches) {
  const indces = [];
  for (let key in patches) {
    indces.push(key);
  }

  // 升序
  indces.sort((a, b) => a - b);

  return indces;
}

patch.REMOVE = REMOVE;
patch.INSERT = INSERT;
patch.REPLACE = REPLACE;
patch.ORDER = ORDER;
patch.PROPS = PROPS;
patch.TEXT = TEXT;

export default patch;