import babel from 'rollup-plugin-babel';

export default {
  entry: './lib/vnode.js',
  dest: './dist/vnode.js',
  format: 'iife',
  moduleName: 'VNode', // iife 必须指定moduleName
  plugins: [babel()]
}