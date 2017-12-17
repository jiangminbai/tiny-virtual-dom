/**
 * list-diff
 * author: https://github.com/jan-wong (复读机)
 */

function listDiff(oldList, newList) {
  let newKeys = keyIndex(newList);
  let newKeyIndex = newKeys.keys;
  let newKeyList = newKeys.keyList;
  let newFree = newKeys.free;

  let oldKeys = keyIndex(oldList);
  let oldKeyIndex = oldKeys.keys;
  let oldFree = oldKeys.free;

  // 如果newList || oldList 含有非key，则返回
  if (newFree.length > 0 || oldFree.length > 0) {
    return {
      children: newList,
      moves: null
    }
  }

  let newChildren = [];

  // 遍历oldList 逐个匹配newList的条目
  oldList.forEach(item => {
    if (item.key) {
      if (newKeyIndex.hasOwnProperty(item.key)) {
        let index = newKeyIndex[item.key];
        newChildren.push(newList[index]);
      } else {
        newChildren.push(null);
      }
    }
  });

  // 遍历newList 添加新增的条目
  newList.forEach(item => {
    if (item.key) {
      if (!oldKeyIndex.hasOwnProperty(item.key)) {
        newChildren.push(item);
      }
    }
  });

  // var simulate  = [{id: "a"}, {id: "b"}, {id: "c"}, {id: "e"}, {id: "f"}]
  // var bChildren = [{id: "c"}, {id: "e"}, {id: "a"}, {id: "b"}, {id: "f"}]
  const simulateList = newChildren.slice();
  const removes = [];

  // 删除null项
  simulateList.forEach((item, index) => {
    if (!item) remove(index), removeSimulate(index);
  });
  
  function remove(from) {
    removes.push({from});
  }

  function removeSimulate(index) {
    simulateList.splice(index, 1);
  }

  const simulateKeys = keyIndex(simulateList);
  const simulateKeyList = simulateKeys.keyList;
  let ismove = simulateKeyList.some((item, index) => item !== newKeyList[index]);

  return {
    moves: { removes, keys: newKeyList, ismove },
    children: newChildren
  }
}

function keyIndex(arr) {
  const keys = {};
  const free = [];
  const keyList = [];

  arr.forEach((child, i) => {
    if (child.key) {
      keys[child.key] = i;
      keyList.push(child.key);
    } else {
      free.push(i);
    }
  })

  return {
    keys, // key值映射到index的hash列表
    keyList, // 包含key值的数组
    free  // 无key值的索引数组,
  }
}

export default listDiff;