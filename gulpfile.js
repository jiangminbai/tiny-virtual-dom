const gulp = require('gulp');
const rollup = require('rollup');
const commonjs = require('rollup-plugin-commonjs');
const resolve = require('rollup-plugin-node-resolve');
const babel = require('rollup-plugin-babel');

gulp.task('build', async function() {
  // const inputOptions = function(filename) {
  //   return {
  //     entry: `./lib/${filename}.js`,
  //     plugins: [
  //       commonjs(),
  //       resolve(),
  //       babel({
  //         exclude: 'node_modules/**' // 只编译我们的源代码
  //       })
  //     ]
  //   }
  // }

  // const outputOptions = function(filename, modulename) {
  //   const moduleName = modulename || filename;
  //   return {
  //     dest: `./dist/${filename}.js`,
  //     format: 'umd',
  //     moduleName,
  //   }
  // }

  // const vnodeBundle = await rollup.rollup(inputOptions('vnode'));
  // await vnodeBundle.write(outputOptions('vnode', 'VNode'));

  // const listDiffBundle = await rollup.rollup(inputOptions('diff'));
  // await listDiffBundle.write(outputOptions('diff'));

  // const virtualDOM = await rollup.rollup(inputOptions('virtual-dom'));
  // await virtualDOM.write(outputOptions('virtual-dom', 'vd'));

  const index = await rollup.rollup({
    entry: `./index.js`,
    plugins: [
      commonjs(),
      resolve(),
      babel({
        exclude: 'node_modules/**' // 只编译我们的源代码
      })
    ]
  })

  await index.write({
    dest: `./dist/virtual-dom.js`,
    format: 'umd',
    moduleName: 'virtualDOM',
  })
});