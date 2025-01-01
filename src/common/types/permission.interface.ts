import { PERMISSION_CODE, PERMISSION_PARAMS } from '../permission/permission.code.enum.module'

export type RouteDataParams = {
  /** 是否在面包屑中渲染 */
  isRenderNameInBreadcrumb?: boolean
  /** 面包屑是否可点击 */
  breadcrumbCanClick?: boolean
  侧栏权限修改?: PERMISSION_PARAMS
  data_form_print?: PERMISSION_PARAMS
  data_form_create?: PERMISSION_PARAMS
  data_form_import?: PERMISSION_PARAMS
  data_form_export?: PERMISSION_PARAMS
  data_form_delete?: PERMISSION_PARAMS
  data_form_template_download?: PERMISSION_PARAMS
  资料库著录?: PERMISSION_PARAMS
  资料库删除?: PERMISSION_PARAMS
}

export interface ChildNodes {
  state?: string
  name: string
  menuCode?: string
  queryParams?: any
  nodes?: ChildNodes[]
  children?: ChildNodes[]
  type?: 'link' | 'drawer' | 'other_sys_link'
  /**
   * 是否在菜单中显示  值为false渲染菜单时会被过滤掉
   */
  hidden?: boolean
  /**
   * 当前菜单的父菜单
   */
  _parentNode?: Menu
  /**
   * 路由数据携带
   */
  data?: RouteDataParams
  /**
   * 是否自动重定向
   */
  isAutoRedirect?: boolean
}

interface MenuBase {
  state: string
  name: string
  params?: any
  menuCode?: string
  showMenu?: boolean
  children?: ChildNodes[]
  queryParams?: any
  /**
   * 是否在菜单中显示  值为false渲染菜单时会被过滤掉
   */
  hidden?: boolean
  /**
   * 当前菜单的父菜单
   */
  _parentNode?: Menu
  /**
   * 路由数据携带
   */
  data?: RouteDataParams
  /**
   * 是否自动重定向
   */
  isAutoRedirect?: boolean
}

interface LinkMenu {
  type: 'link' | 'drawer' | 'other_sys_link'
  notOpenInNewWin?: boolean
}
interface DrawerMenu {
  type: 'link' | 'drawer' | 'other_sys_link'
  children: ChildNodes[]
}

export type Menu = MenuBase & (LinkMenu | DrawerMenu)

export interface CheckPermissionOptions {
  prefixName?: PERMISSION_CODE
  emptyIsPass?: boolean
}

/**
 * 路由状态
 */
export interface RouteState {
  /**
   * 路由名称
   */
  routeName: string

  /**
   * 路由是否被禁止访问
   */
  isBlocked: boolean

  /**
   * 权限名称集合
   */
  permissionNames: PERMISSION_PARAMS

  /**
   * 路由地址
   */
  path: string

  /**
   * 父节点路由地址
   */
  parentPath: string

  /**
   * 路由查询参数
   */
  queryParams?: { [key: string]: any }

  /**
   * 是否拥有子节点
   */
  hasChild: boolean

  /**
   * 是否在菜单中显示
   */
  isInMenuShow: boolean

  /**
   * 路由数据携带
   */
  data: RouteDataParams

  /**
   * 是否自动重定向
   */
  isAutoRedirect?: boolean

  /**
   * 当前路由的父路由
   */
  parentNode: RouteState | undefined
}
