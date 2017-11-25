/**
 * 一系列工具方法
 */

const utils = {};

utils.type = function (obj, type) {
  return Object.prototype.toString.call(obj).slice(8, -1) === type;
}

// 是否是数组
utils.isArray = utils.type(obj, 'Array');
// 是否是字符串
utils.isString = utils.type(obj, 'String');
// 是否是对象
utils.isObject = utils.type(obj, 'Object');

export default utils;