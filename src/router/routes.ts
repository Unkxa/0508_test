import { RouteConfig } from 'vue-router'

const layout = () => import('@/layout/HomeComp/Home.vue')

/**
 *
 * 基础信息库模块路由
 */
// const unitAgency = () => import('@/views/basicInfoBase/unitAgency/unitAgency.vue')

/**
 *
 * @returns
 * 预览页面路由
 */
const PreviewFile = () => import('@/components/PreviewFile/index.vue')

type CustomRouteConfig = RouteConfig & {
  noInit?: boolean
}
export const routes: Array<CustomRouteConfig> = [
  {
    path: '/',
    name: 'home',
    component: layout,
    meta: { keepLive: false },
    redirect: '/overview',
    children: [
      {
        path:"/overview",
        name:'应用总览',
        meta: { indentSidebar: false, title: '应用总览', keepLive: true, pageName: 'overview' }, //页面左侧栏是否缩进
        component: () => import('@/views/overview/index.vue'),
      },
      {
        path: '/basicInfoBase',
        name: '单位基础信息维护',
        meta: { indentSidebar: true, title: '单位基础信息维护', keepLive: true, pageName: 'basicInfoBase' }, //页面左侧栏是否缩进
        // component: () => import('@/views/basicInfoBase/index.vue'),
        children: [
          {
            path: '/basicInfoBase/unitAgency',
            name: '应用总览',
            meta: {
              title: '应用总览',
              keepLive: true,
              pageName: 'unitAgency',
            },
            // component: unitAgency,
          },
        ],
      },
    ],
  },
  {
    path: '/preview',
    name: '预览文件',
    component: PreviewFile,
  },
  //权限create页面 请放在最后
  {
    path: '/permission/create',
    name: 'permissionCreate',
    component: () => import('@/views/createPermission/index.vue'),
    noInit: true,
  },
]
