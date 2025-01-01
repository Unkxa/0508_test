// 修复 pablicpath 路径问题
if (process.env.NODE_ENV === 'production') {
  if (window['cdnUrl']) {
    //environment.assetUrl =
    // eslint-disable-next-line no-undef
    __webpack_public_path__ = window['cdnUrl'] + '/administrative/'
  } else {
    console.log('%c cdn地址获取异常', '!!!!!!')
    //environment.assetUrl =
    // eslint-disable-next-line no-undef
    __webpack_public_path__ = 'http://frontend.amberdata.cn:30080/administrative/'
  }
} else {
  if (window.__POWERED_BY_QIANKUN__) {
    // eslint-disable-next-line no-undef
    __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__
  }
}
// console.log(__webpack_public_path__)
