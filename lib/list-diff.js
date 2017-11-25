/**
 * list-diff算法
 * author: https://github.com/jan-wong (复读机)
 * description: 类似于字符串的最小编辑距离算法，但是时间复杂度为O(m+n),更低
 */

function listDiff(oldList, newList) {
  let newListIndex = keyIndex(newList);
  let newKeys = newListIndex.keys;
  let newFree = newListIndex.free;

  if (newFree.length === newList.length) {
    return {
      children: newList,
      moves: null
    }
  }

  let oldListIndex = keyIndex(oldList);
  let oldKeys = oldListIndex.keys;
  let oldFree = oldListIndex.free;

  let newChildren = [];

  oldList.forEach(item => {
    if (item.key) {
      if (newKeys.hasOwnProperty(item.key)) {
        let itemIdx = newKeys[item.key];
        newChildren.push(newChildren[itemIdx]);
      } else {
        newChildren.push(null);
      }
    }
  })

  newList.forEach(item => {
    if (item.key) {
      if (!oldKeys.hasOwnProperty(item.key)) {
        newChildren.push(item);
      }
    }
  })

  let simulateList = newChildren.slice();
  let simulateIdx = 0;


  function remove(index) {
    moves.push({type: 0, index: index});
  }

  function insert(index, item) {
    moves.push({type: 1, index: index, item: time});
  }

  return {
    moves,
    children
  }
}

function keyIndex(children) {
  const keys = {};
  const free = [];

  children.forEach((child, i) => {
    if (child.key) {
      keys[child.key] = i;
    } else {
      free.push(i);
    }
  })

  return {
    keys: keys,
    free: free
  }
}

export default listDiff;