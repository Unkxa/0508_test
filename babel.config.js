module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset',
    [
      '@babel/preset-env',
      {
        modules: false, // 保留 ES6 模块化语法，以便 webpack 进行 Tree Shaking
      },
    ],
  ],
}
