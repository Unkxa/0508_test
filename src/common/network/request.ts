/**
 * @name 统一接口请求封装--专门针对权限控制业务代码
 */

import axios, { AxiosInstance, AxiosPromise, AxiosRequestConfig } from 'axios'
import { message, Modal } from 'ant-design-vue'
import { MessageOptions } from 'ant-design-vue/types/message'
import ENV from '@/common/config'
import { logOut } from '@/api/common/common.api'
import { AxiosReturnTypes } from '@/common/types/common'
import LoadingManager from './requestLoading'
import { Notification } from 'amber-design-vue'
// cookiesUtils.setCookie('language', language)
/**
 * header 配置
 */
const contentType = 'application/json;charset=UTF-8'

let loadingInstance: any

/**
 * error message list
 */
const errMsg: any = {
  400: '错误请求',
  401: '未授权，请重新登录',
  403: '拒绝访问',
  404: '请求错误,未找到该资源',
  405: '请求方法未允许',
  408: '请求超时',
  500: '服务器端出错',
  501: '网络未实现',
  502: '网络错误',
  503: '服务不可用',
  504: '网络超时',
  505: 'http版本不支持该请求',
}

/**
 * @name 接口约束
 */
export interface AxiosRequestConfigIntl extends AxiosRequestConfig {
  message?: {
    /**
     * 是否显示消息窗，默认不显示，
     * @default false
     * @type boolean
     */
    noShow?: boolean
    /**
     * 自定义消息，
     * @default {}
     * @type MessageOptions
     */
    options?: MessageOptions // 自定义消息体,
  }
  noLoading?: boolean
  nocode?: boolean
}

/**
 * @name 主体控制
 */
class Request<T = AxiosReturnTypes> {
  axiosInstance: AxiosInstance
  public requestData: any = null

  constructor() {
    //创建axios实例
    this.axiosInstance = axios.create({
      baseURL: location.origin, // 公共接口-本地
      timeout: 1000 * 1000, // 超时时间单位是ms
      withCredentials: true, // 身份验证
      headers: {
        'Content-Type': contentType,
        'X-Requested-With': 'XMLHttpRequest',
      },
    })

    //配置message窗口仅有一个
    message.config({
      maxCount: 1,
    })

    // 请求拦截器
    this.axiosInstance.interceptors.request.use(
      (config: AxiosRequestConfigIntl) => {
        if (!(config.noLoading === true)) {
          LoadingManager.increase(config?.url)
        }

        // 执行form-data序列化
        if (config.headers['Content-Type'] === 'multipart/form-data') {
          if (config.data instanceof FormData) {
            config.data
          } else {
            config.data = this.getFormData()
          }
        } else if (!(config.data instanceof Blob)) {
          //发请求前做的一些处理，数据转化，配置请求头，设置token,设置loading等，根据需求去添加
          config.data = JSON.stringify(config.data) //数据转化,也可以使用qs转换
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    // 响应拦截器
    this.axiosInstance.interceptors.response.use(
      (response): AxiosPromise<AxiosReturnTypes> => {
        const { data, config, headers } = response
        if (!((config as any)?.noLoading === true)) {
          LoadingManager.decrease(config?.url) //
        }
        // 如果是没有状态码的响应
        if (config.responseType == 'blob') {
          const fileReader = new FileReader()
          fileReader.readAsText(data)
          fileReader.onload = (result) => {
            try {
              const jsonData = JSON.parse(result.target?.result as any) // 说明是普通对象数据，后台转换失败
              if (jsonData.code) {
                Notification.open({
                  type: 'error',
                  message: '操作失败',
                  description: jsonData.msg || jsonData.message,
                })
                return
              }
            } catch (err) {
              // 解析成对象失败，说明是正常的文件流
              return data
            }
          }
        }
        /**
         * TODo :4月24号再处理
         */
        if (config.responseType == 'blob') {
          return Promise.resolve({ ...data.data, headers: headers, data: data })
        }
        // 如果有响应的状态码
        // 返回码不是200
        if (data.code && +data.code !== 200) {
          switch (data.code) {
            case 302: //登录失效code
              message.warn('登录失效')
              break
            // case '401': //无权限code
            //   router().push({
            //     path: '/404',
            //   })
            //   break
            case '000000':
              this.onLogout() //!!!!
              break
            case 13:
              break
            case 14:
              break
            default:
              if (data.data === 302) {
                Modal.confirm({
                  title: '登录过期',
                  content: '登录状态已过期，是否重新登录？',
                  onOk: () => {
                    /** */
                  },
                  onCancel: () => {
                    /** */
                  },
                })
              } else {
                Notification.open({
                  type: 'error',
                  message: '操作失败',
                  description: data.msg || data.message,
                })
              }
              break
          }

          return Promise.reject(
            'okr请求异常拦截:' +
              JSON.stringify({
                url: config.url,
                code: data.code,
                data: data.data,
                msg: data.msg,
              }) || 'Error'
          )
        } else {
          // 返回体改造，保持结构一致 -_-后端返回体不统一就该怼
          if (data.data?.list) {
            return Promise.resolve({
              ...data.data,
              result: data?.data?.list,
              totalCount: +data?.data?.total || +data?.data?.totalCount,
            })
          }
          // 返回体改造，保持结构一致-_-后端返回体不统一就该怼
          if (data.data?.data) {
            return Promise.resolve({
              ...data.data,
              result: data?.data?.data,
              totalCount: +data?.data?.total || +data?.data?.totalCount,
            })
          }
          if (typeof data.data === 'string') {
            return Promise.resolve({ result: data?.data }) as any
          }
          return Promise.resolve({ ...data.data, result: data?.data, message: data.message || '' })
        }
      },
      (error) => {
        if (!(error.config.noLoading === true)) {
          LoadingManager.decrease(error.config.url)
        }
        if (error && error.response) {
          error.message = errMsg[error.response.status] || `连接错误${error.response.status}`
        } else {
          // 超时处理
          if (JSON.stringify(error).includes('timeout')) {
            //
            message.error((h) =>
              h('span', [
                h('span', '服务器响应超时，请刷新当前页，或'),
                h(
                  'a',
                  {
                    style: 'margin-left:4px', // 样式内容
                    on: {
                      click: this.onLogout, // 点击事件
                    },
                  },
                  '重新登陆'
                ),
                h('span', { style: 'margin-left:4px' }, '试试!'),
              ])
            )
          } else {
            message.error(`连接服务器失败:${error.message}`)
          }
        }

        return Promise.reject(error)
      }
    )
  }

  /*==========================================初始化函数==========================================*/

  /**
   * @name 对参数进行formData处理
   * @param params
   * @returns
   */
  getFormData() {
    let formData = new FormData()
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const $this = this
    if ($this.requestData) {
      formData = Object.keys($this.requestData).reduce((arr, item, index) => {
        //二进制流文件 FormData处理
        if ($this.isFile($this.requestData[item])) {
          arr.append('file', $this.requestData[item])
          return arr
        } else if ($this.isFile($this.requestData[item]?.originFileObj)) {
          arr.append('file', $this.requestData[item].originFileObj)
          return arr
        }

        arr.append(item, $this.requestData[item])
        return arr
      }, formData)
    }
    return formData
  }
  /**
   * @name 判断是否是file object
   */
  isFile(params: object) {
    return Object.prototype.toString.call(params) === '[object File]'
  }

  /**
   * @name 注销
   */
  public async onLogout() {
    await logOut()
    if (process.env.NODE_ENV !== 'production') {
      return (window.location.href = ENV.devLoginUrl)
    } else {
      return (window.location.href = ENV.proLoginUrl)
    }
  }

  /*==========================================请求函数==========================================*/
  /**
   * @name get请求
   */
  get(url: string, config?: AxiosRequestConfigIntl): Promise<T> | undefined {
    let result

    new Promise((resolve) => {
      result = this.axiosInstance.get(url, config)
      return resolve(result)
    }).then((res) => {
      this.message({ config, res })
    })
    return result
  }

  /**
   * @name post请求
   */
  post(url: string, data?: any, config?: AxiosRequestConfigIntl): Promise<T> | undefined {
    let result: any
    new Promise((resolve) => {
      result = this.axiosInstance.post(url, data, config)
      this.requestData = data
      return resolve(result)
    }).then((res) => {
      this.message({ config, res })
    })
    return result
  }

  /**
   * @name put请求
   */
  put(url: string, data?: any, config?: AxiosRequestConfigIntl): Promise<T> | undefined {
    let result
    new Promise((resolve) => {
      result = this.axiosInstance.put(url, data, config)
      this.requestData = data
      return resolve(result)
    }).then((res) => {
      this.message({ config, res })
    })
    return result
  }

  /**
   * @name patch请求
   */
  patch(url: string, data?: any, config?: AxiosRequestConfigIntl): Promise<T> | undefined {
    let result
    new Promise((resolve) => {
      result = this.axiosInstance.post(url, data, config)
      this.requestData = data
      return resolve(result)
    }).then((res) => {
      this.message({ config, res })
    })
    return result
  }

  /**
   * @name delete请求
   */
  delete(url: string, config?: AxiosRequestConfigIntl): Promise<T> | undefined {
    let result
    new Promise((resolve) => {
      result = this.axiosInstance.delete(url, config)
      return resolve(result)
    }).then((res) => {
      this.message({ config, res })
    })
    return result
  }

  /**
   * @name 消息
   * @param data
   * @returns
   */
  message(data: { config: any; res: any }) {
    if (data?.config?.message?.noShow) return
    // 系统消息
    if (data?.res?.message) {
      return Notification.open({
        type: 'success',
        message: '操作成功',
        description: data.res.message,
      })
    }
  }
}
// 实例化
const request = new Request()
export default request
