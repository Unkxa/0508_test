import Vue from 'vue'
import VueRouter, { Route, RouteConfig } from 'vue-router'
import { routes } from './routes'
import permissionService from '@/common/permission/permission.service'
import { MicroUtils } from '@/common/toolFun/micro-utils'
import init from '@/common/toolFun/init'
Vue.use(VueRouter)

// 解决vue-router在3.0版本以上重复点菜单报错问题
const originalPush = VueRouter.prototype.push
const originalReplace = VueRouter.prototype.replace

VueRouter.prototype.push = function push(location) {
  return (originalPush.call(this, location) as any).catch((err: any) => err)
}
VueRouter.prototype.replace = function push(location) {
  return (originalReplace.call(this, location) as any).catch((err: any) => err)
}

/*
 document.querySelector('base')?.getAttribute('href') 逻辑可以问杨超
*/
const baseUrl = process.env.NODE_ENV == 'production' ? '/administrativeapi/index' : '/'
const baseMode = process.env.NODE_ENV == 'production' || (window as any).__POWERED_BY_QIANKUN__ ? 'history' : 'hash'
const router = new VueRouter({
  base: (window as any).__POWERED_BY_QIANKUN__ ? '/micro/administrative' : baseUrl,
  mode: baseMode,
  routes,
})
const beforeEach = async (to: Route, from: Route, next: any) => {
  try {
    if (to.path === '/permission/create') {
      next()
    } else if (permissionService.getRouteStateList().length > 0) {
      //检查鉴权路由表是否初始化完成
      checkPermission(to, from, next)
    } else {
      window.EventBus.$on('路由表初始化成功', () => {
        checkPermission(to, from, next)
      })
      await init()
    }
  } finally {
    Vue.prototype.$isLoad = true
    window.EventBus.$emit('stop_system_loading')
  }
}
// 路由守卫
router.beforeEach(beforeEach)

export const routerReload = () => {
  const router = new VueRouter({
    base: (window as any).__POWERED_BY_QIANKUN__ ? '/micro/administrative' : baseUrl,
    mode: baseMode,
    routes,
  })
  router.beforeEach(beforeEach)
  return router
}

const checkPermission = (route: Route, oldRoute: Route, next: any) => {
  //重置路由状态
  permissionService.setCurrentRouteState(null)

  if (route.fullPath !== oldRoute.fullPath) {
    console.log(`RoutingGuard->routePath:${route.fullPath}`)
  }
  //与路由表中的地址做匹配
  let routeState = permissionService.getRouteStateList().find((item) => item.path === route.fullPath)
  //查询不到就一层一层向上查询父权限
  let routePath = route.fullPath
  while (!routeState && routePath.includes('/')) {
    const endIndex = routePath.lastIndexOf('/')
    routePath = routePath.substring(0, endIndex)
    routeState = permissionService.getRouteStateList().find((item) => item.path === routePath)
  }
  console.log(`RoutingGuard->routeState:`, routeState)
  //如果匹配到 并且 该路由无权限
  if (routeState && routeState.isBlocked) {
    console.error('该路由无权限 执行跳转逻辑')
    //先查询同级有权限路由
    let firstCanActiveRoute = permissionService
      .getRouteStateList(true)
      .find((item) => !item.isBlocked && item.parentPath === routeState?.parentPath)
    if (!firstCanActiveRoute) {
      //无同级查询第一个有权限路由
      firstCanActiveRoute = permissionService.getRouteStateList(true).find((item) => !item.isBlocked)
    }
    //如果该路由有子路由 一向下查询有权限的子路由
    while (firstCanActiveRoute?.hasChild) {
      firstCanActiveRoute = permissionService
        .getRouteStateList(true)
        .find((item) => !item.isBlocked && firstCanActiveRoute?.path === item.parentPath)
    }
    //如果能查询到有权限路由 跳转
    const deleteTab = { ...route }
    if (firstCanActiveRoute) {
      next(firstCanActiveRoute.path)
    } else {
      //查询不到 跳转到无权限页面
      window.location.href = window.location.origin + '/micro/noPermission?from=' + 'administrative' + route.fullPath
    }
    MicroUtils.openMicroTab({ ...deleteTab, manual: 'delete' })
    return false
  }
  //记录路由状态
  if (routeState) {
    permissionService.setCurrentRouteState(routeState)
  }
  //路由表中无该路由则表示该路由不需要权限
  MicroUtils.openMicroTab(route)
  next()
}

export default router
