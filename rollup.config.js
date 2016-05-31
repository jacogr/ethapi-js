import babel from 'rollup-plugin-babel';

export default {
  entry: 'lib/ethApi.js',
  dest: 'index.js',
  moduleName: 'EthApi',
  format: 'cjs',
  plugins: [babel({
    babelrc: false,
    presets: ['es2015-rollup', 'stage-0'],
    runtimeHelpers: true,
    retainLines: true
  })]
};
