import './public-path'
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import _get from 'lodash/get'

// css----------------------------------------------------------------------------
// 引入框架css
import 'ant-design-vue/dist/antd.css'
import 'element-ui/lib/theme-chalk/index.css'
// 公司框架css, 带入icon 和字体 ,比如放在最后, 优先级高
import 'amber-design-vue/dist/abd.css'
import './assets/styles/index.less'
import './assets/font/iconfont2/iconfont.css'

// js----------------------------------------------------------------------------
import directives from './common/directives'
import filters from './common/filters'
import components from './components'
import plugins from './plugins'
import mixins from './mixin'
import { routerReload } from './router'

//引入自定义组件
Vue.use(components)
//引入自定义插件
Vue.use(plugins)

//全局注册的mixin
Vue.use(mixins)

Vue.config.productionTip = false
Object.keys(directives).forEach((k) => Vue.directive(k, directives[k] as any))
Object.keys(filters).forEach((k) => Vue.filter(k, (filters as { [key: string]: any })[k]))

window.EventBus = new Vue()
Vue.prototype.$eventBus = window.EventBus
Vue.prototype._get = _get // 链式调用必要函数
/**
 * 初始化
 */

if (!(window as any)?.__POWERED_BY_QIANKUN__) {
  render()
}

let instance: any = null //微应用变量
let newRouter = null
function render(props?: any) {
  newRouter = routerReload()
  if ((window as any).__POWERED_BY_QIANKUN__ && (window as any).__CACHE_INSTANCE_BY_QIAN_KUN_FOR_VUE__) {
    // 页面缓存有创建，进行缓存实例化
    const cachedInstance = (window as any).__CACHE_INSTANCE_BY_QIAN_KUN_FOR_VUE__

    // 从最初的Vue实例上获得_vnode
    const cachedNode = cachedInstance._vnode

    // 让当前路由在最初的Vue实例上可用
    ;(newRouter as any).apps.push(...cachedInstance.catchRoute.apps)

    instance = new Vue({
      router: newRouter,
      store,
      render: () => cachedNode,
    })

    // 缓存最初的Vue实例
    instance.cachedInstance = cachedInstance

    router.onReady(() => {
      const { path } = router.currentRoute
      const { path: oldPath } = cachedInstance.$router.currentRoute
      // 当前路由和上一次卸载时不一致，则切换至新路由
      if (path !== oldPath) {
        cachedInstance.$router.push(path)
      }
    })
    instance.$mount(props?.container ? props?.container.querySelector('#app') : '#app') //qiankun 微应用配置;
  } else {
    instance = new Vue({
      router,
      store,
      render: (h) => h(App),
    }).$mount(props?.container ? props?.container.querySelector('#app') : '#app') //qiankun 微应用配置
  }
}

/**
 * 用于不同标签页面之间的通信
 */
export const channel = new BroadcastChannel('administrative-channel') //是一个用于在不同窗口或标签页之间进行通信的 Web API。通过 BroadcastChannel，不同的浏览器上下文（比如同一域名下的不同窗口、标签页或 iframe）可以进行实时的消息广播和接收。

// 微应用 相关逻辑------------------------------------------------------------------------------------------------------
export async function bootstrap() {
  //TODO
  console.log('[vue] vue app bootstraped')
}
/**
 * 创建基座与子应用全局通信接口说明
 */
export interface IMicroRootState {
  unitCode: string // 全宗切换-单位code
  pathname: string // 应用路径
  appName: string // 应用名称
  // menuItem: object; // 菜单项
  rootContainer: {
    height: number // 容器高度
    tabEnable: boolean // 页签是否开启
    tabHeight: number // 页签高度
    headerHeight: number // 头部高度
    navigationEnable: boolean // 导航是否开启
    [keys: string]: any
  } // 基座容器信息
  microContainer: {
    collapsed: boolean // 是否折叠
    collapsedWidth: number // 导航展开宽度
    notCollapsedWidth: number // 导航展开宽度
    menuItem?: {
      path: string
      name: string
      icon: string
      manual: 'add' | 'delete' | 'update' // 手动编辑页签 增加｜删除｜更新
      [keys: string]: any
    } // 页签创建规则数据源
    [keys: string]: any
  } // 子应用容器信息
  [keys: string]: any
}

/**
 * 创建基座与子应用通信方法
 * @param props
 */
export async function mount(props: IMicroRootState) {
  // 注册appStore(props)
  Vue.prototype.$microMount = props

  // 注册应用间通讯事件
  Vue.prototype.$onGlobalStateChange = props.onGlobalStateChange
  Vue.prototype.$setGlobalState = props.setGlobalState

  //TODO 启用微应用
  // window.sessionStorage.setItem('__qiankun_app_props__',JSON.stringify(props));
  // console.log('[vue] props from main framework ==》', props);
  const excludePageList: string[] = ['/administrative/preview']
  props.setGlobalState({
    rootContainer: {
      ...props.rootContainer,
      excludePageList: props.rootContainer?.excludePageList?.concat(excludePageList) || [],
    },
  })
  props.onGlobalStateChange((...args: any) => {
    // state: 变更后的状态; prev 变更前的状态
    // 注：切换单位后再点击进入本应用的话 state和prev值相等
    const [state, prev] = args
    console.log('onGlobalStateChange', state, prev)
    //判断是否切换多全宗单位，如果state和prev值不相等,说明当前系统切换了，需要手动刷新
    if (state.unitCode != prev.unitCode) {
      window.location.reload()
    }
    if (state.rootContainer.handler === 'changeRoutersMap') {
      window.EventBus.$emit('qian_kun_global_event', ...args)
    }
  }, true)
  console.log('mount', props)

  render(props)
}

export async function unmount() {
  const cachedInstance = instance.cachedInstance || instance
  /**
   * 1. 本地缓存cachedInstance._vnode
   * 2. 测试activated && deactivated生命周期
   */
  if (!cachedInstance._vnode.data.keepAlive) cachedInstance._vnode.data.keepAlive = true
  cachedInstance.catchRoute = {
    apps: [...instance.$router.apps],
  }
  ;(window as any).__CACHE_INSTANCE_BY_QIAN_KUN_FOR_VUE__ = cachedInstance
  instance.$destroy()
  newRouter = null
  instance.$router.apps = []
}
