import { castArray, cloneDeep } from 'lodash-es'
import { PERMISSION_MAPPER } from './permission.mapper/permission.mapper'
import { PERMISSION_CODE, PERMISSION_PARAMS } from './permission.code.enum.module'
//
import { Menu, RouteDataParams, RouteState } from '../types/permission.interface'
import { menuMap } from '@/layout/HomeComp/common/menu.map'
import { TreeUtils } from './permission.treeUtil'

import runTesting from './permission.mapper.testing'
import ENV from '@/common/config'

class PermissionService {
  private isPass: boolean = ['localhost'].includes(location.hostname) || ENV.authenticationSwitch
  /**
   * 当前激活路由状态
   */
  private currentRouteState: RouteState | null = null
  /**
   * 路由表
   */
  private routeStateList: RouteState[] = []
  /**
   *  权限编码表
   */
  private permissionCodeList: any[] = []

  /**
   * 设置权限编码集合
   * @param permissionCodeList
   */
  setPermissionCodeList(permissionCodeList = []) {
    console.log('开始判断PERMISSION_CODE 和 PERMISSION_MAPPER匹配情况--')
    runTesting()
    console.log('判断结束--')
    this.permissionCodeList = permissionCodeList
  }

  /**
   * 获取所有权限编码集合
   * @returns
   */
  getPermissionCodeList() {
    return this.permissionCodeList || []
  }

  getCurrentRouteState(): RouteState {
    return this.currentRouteState || ({ data: {} } as RouteState)
  }

  setCurrentRouteState(state: RouteState | null) {
    this.currentRouteState = state
  }

  /**
   * 通过key获取激活路由中data配置
   * @param key
   * @returns
   */
  getDataValue<T extends keyof RouteDataParams>(key: T): RouteDataParams[T] {
    return this.getCurrentRouteState().data[key]
  }

  /**
   * 初始化路由地址列表
   */
  initRouteStateList() {
    const getPath = (node: any, isParent = false) => {
      if (isParent) {
        node = node._parentNode
      }
      return node?.key || ''
    }
    TreeUtils.depthFirstSearch<Menu>(
      //过滤首页
      cloneDeep(menuMap),
      (node) => {
        // 将所有为路由链接的菜单放入路由集合
        const [isBlocked, permissionNames] = this.isBlocked(node)
        this.routeStateList.push({
          routeName: node.name,
          isBlocked,
          permissionNames,
          path: getPath(node),
          parentPath: getPath(node, true),
          hasChild: Boolean(node.children && node.children.filter((item) => item.isAutoRedirect !== false).length > 0),
          isInMenuShow: !node.hidden,
          queryParams: node.queryParams || {},
          data: (node.data || {}) as RouteDataParams,
          isAutoRedirect: node.isAutoRedirect,
          parentNode: this.routeStateList.find((item) => item.path === getPath(node, true)),
        })
      },
      {
        isAddParentNode: true,
      }
    )
    //查出所有含有子路由的路由  根据子路由的状态重设父路由状态 反转数组 从最底层子路由开始重置
    const resetStateRoutes = this.getRouteStateList()
      .filter((item) => item.hasChild)
      .reverse()
    resetStateRoutes.forEach((resetStateRoute) => {
      //查找当前重设路由的所有子路由
      const childRoute = this.getRouteStateList(true).filter((item) => item.parentPath === resetStateRoute.path)
      //如果所有子路由都无权限  那么关闭父路由的权限
      if (childRoute.every((item) => item.isBlocked)) {
        resetStateRoute.isBlocked = true
      }
    })

    window.EventBus.$emit('路由表初始化成功')
  }

  /**
   * 子路由是否有权限
   * @returns [true 无  false 有,权限名称集合]
   */
  private isBlocked(route: Menu | undefined): [boolean, PERMISSION_PARAMS] {
    const permissionNameSet: any = []
    while (route) {
      permissionNameSet.push(route.menuCode)
      route = route._parentNode
    }
    return [permissionNameSet.some((permissionName: any) => !this.check(permissionName)), permissionNameSet]
  }

  /**
   * 获取路由表
   * @returns
   */
  getRouteStateList(isDiscardNotAutoRedirect = false) {
    return this.routeStateList.filter((item) => (isDiscardNotAutoRedirect ? item.isAutoRedirect !== false : true))
  }

  /**
   * 清空路由表
   */
  clearRouteStateList() {
    this.routeStateList = []
  }

  /**
   * 检查当前是否有权限
   * @param { PERMISSION_PARAMS } permissionCodeOrNames 权限 名称 编 集合 或者单个权限名称 编码
   * @param { string } currentRoute 保留老的权限系统的判断逻辑（根据传入的route判断使用哪个权限码）减少对项目的修改
   * @returns { boolean }
   */
  check(permissionCodeOrNames: any, currentRoute?: string) {
    if (this.isPass) {
      return true
    }
    //转换为数组  过滤掉空值
    permissionCodeOrNames = castArray(permissionCodeOrNames).filter(Boolean)

    //权限名称集合为空 无权限
    if (permissionCodeOrNames.length === 0) {
      return false
    }
    //根据权限编码前缀过滤出剩余code
    const permissionCodes = permissionCodeOrNames.reduce((acc: any[], permissionNameOrCode: any) => {
      //系统中定义编码 通过映射关系转换后校验
      const permissionCode = this.permissionNameConvertPermissionCode(permissionNameOrCode)
      acc.push(permissionCode)
      return acc
    }, [])

    //权限编码集合中有放行权限
    if (permissionCodes.includes(PERMISSION_CODE.pass)) {
      return true
    }
    //保留老的权限系统的判断逻辑（根据传入的route判断使用哪个权限码）减少对项目的修改
    let checkedPermissionCodes: any = []
    if (currentRoute) {
      permissionCodes.forEach((id: any) => {
        if (id.indexOf(currentRoute) != -1) {
          checkedPermissionCodes.push(id)
        }
      })
    } else {
      checkedPermissionCodes = permissionCodes
    }
    //判断权限编码code中是否包含系统权限编码
    return this.getPermissionCodeList().some((item: any) => item.code.includes(checkedPermissionCodes))
  }

  /**
   * 权限名称转换为权限编码
   * @param permissionName 权限名称
   * @returns 权限编码
   */
  permissionNameConvertPermissionCode = (permissionName: string) => {
    if (PERMISSION_CODE[permissionName]) {
      return permissionName
        .split('_')

        .map((node: string) => (PERMISSION_MAPPER as any)[node] || '')
        .join(':')
    }
    return permissionName
  }
}

// 实例化
const permissionService = new PermissionService()
export default permissionService
