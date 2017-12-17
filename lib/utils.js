/**
 * 一系列工具方法
 */

const utils = {};

utils.type = function (obj, type) {
  return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase() === type;
}

// 是否是数组
utils.isArray = function(obj) {
  return utils.type(obj, 'array');
}

// 是否是字符串
utils.isString = function(obj) {
  return utils.type(obj, 'string');
}

// 是否是对象
utils.isObject = function(obj) {
  return utils.type(obj, 'object');
}

export default utils;