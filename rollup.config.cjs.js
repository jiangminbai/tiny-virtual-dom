import babel from 'rollup-plugin-babel';

export default {
  entry: './lib/vnode.js',
  dest: './dist/vnode.cjs.js',
  format: 'cjs',
  moduleName: 'VNode', // iife 必须指定moduleName
  plugins: [babel()]
}