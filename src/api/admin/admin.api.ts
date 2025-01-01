import request from '@/common/network/request'
import { ApiUrl } from './admin.url'
import ENV from '@/common/config'
class AdminApi {
  [x: string]: any
  // 获取全部 单位
  allUnitOfUser = (data: any) => request.post(ENV.administrativeApiUrl + ApiUrl.allUnitOfUser, data)
  // 切换主单位
  updateDefaultUnit = (data: any) => request.post(ENV.administrativeApiUrl + ApiUrl.updateDefaultUnit, data)
  // 切换单位
  changeUnit = (data: any) => request.get(ENV.administrativeApiUrl + ApiUrl.changeUnit, { params: { unitCode: data } })
  // 切换密码
  getChangePassword = (body: any) => request.put(ENV.administrativeApiUrl + ApiUrl.getChangePassword, body)
  // 退出
  loginOut = () => request.get(ENV.administrativeApiUrl + ApiUrl.loginOut)

  // 操作日志
  getOperationLog = (id: any) =>
    request.get(ENV.administrativeApiUrl + ApiUrl.getOperationLog, { params: { operateObjectId: id } })
  // admin用户树
  userTreeFilter = (parentId: string) =>
    request.get(ENV.administrativeApiUrl + ApiUrl.userTreeFilter, { params: { parentId } })
  // admin通过用户id获取
  getUserById = (id: string) => request.get(ENV.administrativeApiUrl + ApiUrl.getUserById, { params: { id } })
}
const AdminApiObj = new AdminApi()
export default AdminApiObj
