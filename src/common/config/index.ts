// const { name } = require('../../package.json');

const ENV = {
  managepreviewUrl: `http://${window.location.host}`,
  serverAddress: '',
  enableCSRF: false, // 是否打开Crsf校验
  enableVerifyPass: true,
  useTokenAuthentication: false,
  verticalLayout: true, // 当前页面的导航是横板还是竖版
  marqueeSwitch: false, // 是否展示跑马灯组件
  cookieName: 'administrative',
  authenticationSwitch: process.env.NODE_ENV == 'production' ? false : true, // 权限控制按钮,是否强制开放所有权限
  // authenticationSwitch: true, // 权限控制按钮,是否强制开放所有权限
  //  previewUrl: `http://${window.location.host}/docview/`,
  previewUrl:
    process.env.NODE_ENV == 'production' ? `//${window.location.host}/docview/` : `//qawyy.amberdata.cn/docview/`, //预览域名部分
  flowApiUrl: '/flowapi', //API请求代理标识
  administrativeApiUrl: '/administrativeapi', //API请求代理标识
  tripleApiUrl: '/tripleapi', //三合一API请求代理标识
  adminUrl: '/adminapi',
  searchApiUrl: '/searchapi',
  assetsUrl: process.env.NODE_ENV == 'production' ? 'http://frontend.amberdata.cn:30080/administrative/' : '',
  baseUrl:
    process.env.NODE_ENV == 'production'
      ? `//${window.location.host}/administrativeapi/index/`
      : `//localhost:${window.location.port}/micro/administrative/`,
  devLoginUrl: '//localhost:4200/?goto=' + encodeURIComponent(window.location.href), //重新登录的完整地址
  proLoginUrl: `${window.location.origin}/adminapi/pub/userNotLogin.html?goto=${encodeURIComponent(
    window.location.href
  )}`, //重新登录的完整地址
  dataArchivesApiUrl: '/dataarchivesapi',
  dataArchivesUrl: `//${window.location.host}/dataarchivesapi/index`,
  metadataUrl: `//${window.location.host}/metadata`,
  validatorUrl: `//${window.location.host}/validator/#/`,
  searchUrl:
    process.env.NODE_ENV == 'production'
      ? `//${window.location.host}/administrativeapi/index/#/searching`
      : `//localhost:${window.location.port}/#/searching`,
}

export default ENV
