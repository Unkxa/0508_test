import ENV from '@/common/config'
import request from '@/common/network/request'
import { downApiUrl } from './download.api.url'

class downloadApi {
  /**
   * 上传文件
   * @param data
   * @returns
   */
  uploadFile = (data: FormData) =>
    request.post(ENV.administrativeApiUrl + downApiUrl.uploadFile, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
      responseType: 'application/json',
    })
  /**
   * 下载
   * @param data
   * @returns
   */
  resourceDownload = (path: string) =>
    request.get(ENV.administrativeApiUrl + downApiUrl.resourceDownload, { params: { path }, responseType: 'blob' })
  /**
   * 下载2  文件名
   * @param data
   * @returns
   */
  resourceDownload2 = (data: any) =>
    request.get(ENV.administrativeApiUrl + downApiUrl.resourceDownload2, { params: data, responseType: 'blob' })

  /**
   * 下载3  文件名
   * @param data
   * @returns
   */
  resourceDownload3 = (data: any) =>
    request.get(ENV.administrativeApiUrl + downApiUrl.resourceDownload3, { params: data, responseType: 'blob' })

  /**
   * 批量下载文件并打包成压缩包
   * @param data
   * @returns
   */
  resourceGetBatchDownloadToZip = (data: any) =>
    request.post(ENV.administrativeApiUrl + downApiUrl.resourceGetBatchDownloadToZip, data, {
      responseType: 'blob',
    })

  /**
   * 根据文件路径和类型_解析并保存excel数据
   * @param data
   * @returns
   */
  excelMultiImportAnalysisSaveData = (data: any) =>
    request.post(ENV.administrativeApiUrl + downApiUrl.excelMultiImportAnalysisSaveData, data)
  /**
   * 获取文件base64
   * @param path string
   */
  getBase64 = (path: string) => request.get(ENV.administrativeApiUrl + downApiUrl.getBase64, { params: { path } })

  /**
  根据类型下载相应文件   
   * @param data
   * @returns
   */
  excelMultiImportDownFileByType = (data: any) =>
    request.post(ENV.administrativeApiUrl + downApiUrl.excelMultiImportDownFileByType, data, {
      responseType: 'blob',
    })
  /**
  根据类型下载相应文件(新模板接口)   
   * @param type
   * @returns
   */
  excelMultiImportDownloadTemplate = (type: any) =>
    request.post(
      ENV.administrativeApiUrl + downApiUrl.excelMultiImportDownloadTemplate,
      {},
      {
        params: { type },
        responseType: 'blob',
      }
    )
  getViewToken = (url: string) => request.get(ENV.administrativeApiUrl + downApiUrl.getViewToken, { params: { url } })
}
export default new downloadApi()
