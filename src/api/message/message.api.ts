import request from '@/common/network/request'
import ENV from '@/common/config'
import { MessageUrl } from './message.url'

class MessageApi {
  /**
   * 获取消息通知
   * @returns
   */
  getMassageList = (data: any) => request.post(ENV.administrativeApiUrl + MessageUrl.getMassageList, data)
  /**
   * 清空消息通知
   */
  clearAll = () => request.get(ENV.administrativeApiUrl + MessageUrl.clearAll)
  /**
   * 标记已读
   */
  readAll = () => request.get(ENV.administrativeApiUrl + MessageUrl.readAll)
  /**
   * 标记已读
   */
  updateMassage = (id: string) => request.get(ENV.administrativeApiUrl + MessageUrl.updateMassage, { params: { id } })
  getMassageNum = (readState: string) =>
    request.get(ENV.administrativeApiUrl + MessageUrl.getMassageNum, { params: { readState } })
  getTaskTodoCount = () => request.post(ENV.administrativeApiUrl + MessageUrl.getTaskTodoCount)
}
const messageApi = new MessageApi()
export default messageApi
