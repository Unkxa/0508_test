import request from '@/common/network/request'
import { PermissionUrl } from './permission.url'
import ENV from '@/common/config'
class AppApi {
  [x: string]: any
  /**
   * 新建权限
   */
  create = (data: {
    appId: string
    backendUris: string[]
    code: string
    controlType: 1 | 2
    name: string
    parentPermissionId: string
  }) => request.post(ENV.adminUrl + PermissionUrl.create, data)
  /**
   * 删除权限编码
   * @param id
   * @returns
   */
  delete = (id: string) => request.delete(ENV.adminUrl + PermissionUrl.delete, { params: { id } })
}
const PermissionApiObj = new AppApi()
export default PermissionApiObj
