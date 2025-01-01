import Vue from 'vue'
import { Dictionary } from 'vue-router/types/router'

export interface OpenMicroTabOptions {
  name?: string | null
  path: string
  icon?: string
  query: Dictionary<string | (string | null)[]>
  queryString?: string
  manual?: 'add' | 'update' | 'delete'
  jumpAppName?: string
  [keys: string]: any
}

export const excludeMicroTabList: string[] = []

//表格中点击跳转路由页面自定义页签名称的路由
const jumpTabNameRoutes = ['/jobIndexEvaluation/indexRegisterPage/fillTask']
export class MicroUtils {
  static joinPath(options: OpenMicroTabOptions) {
    const { jumpAppName = 'administrative', queryString = '', query, path } = options
    if (queryString) {
      return `/${jumpAppName}${path}?${queryString}`
    } else if (query) {
      //
    }
    return `/${jumpAppName}${path}`
  }

  static openMicroTab(options: OpenMicroTabOptions) {
    const { name, manual = 'add', jumpAppName = 'administrative', icon, path, query } = options
    const microMount = Vue.prototype.$microMount
    const setGlobalState = Vue.prototype.$setGlobalState
    if (!microMount) {
      return
    }
    const { microContainer } = microMount

    let tabName: any = name
    if (jumpTabNameRoutes.filter((item) => item === path).length > 0) {
      tabName = query.tabName
    }
    if ((window as any).__POWERED_BY_QIANKUN__) {
      console.log('------------------OpenMicroTabOptions--------------', options)
    }
    setGlobalState({
      microContainer: {
        ...microContainer,
        menuItem: {
          ...microContainer?.menuItem,
          manual,
          path: this.joinPath(options),
          name: tabName,
          icon,
        },
      },
    })
    if (jumpAppName !== 'administrative') {
      window.location.href = `${window.location.origin}/micro${this.joinPath(options)}`
    }
  }
}
