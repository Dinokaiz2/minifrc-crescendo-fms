module.exports = {
  env: {
    node: true,
    es6: true
  },
  parser: '@babel/eslint-parser',
  parserOptions: {
    babelOptions: {
      configFile: './.babelrc'
    },
    ecmaVersion: 2018 // needed to support spread in objects
  },
  plugins: ['@babel']
}
