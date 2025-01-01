import request from '@/common/network/request'
import { ApiUrl } from './app.url'
import ENV from '@/common/config'
class AppApi {
  [x: string]: any
  /**
   * 获取业务系统
   */
  list = (data: any, tenantId: string) => request.post(ENV.adminUrl + ApiUrl.list, data, { params: { tenantId } })
  /**
   * 创建业务系统
   * @param data
   */
  create = (data: any) => request.post(ENV.adminUrl + ApiUrl.create, data)
  /**
   * 获取应用下的权限树
   * @param appId
   * @returns
   */
  permissions = (appId: string) => request.post(ENV.adminUrl + ApiUrl.permissions, null, { params: { appId } })
}
const AppApiObj = new AppApi()
export default AppApiObj
