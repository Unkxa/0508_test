// 请求封装---专门针对 登录和 上传
import axios, { AxiosResponse, AxiosRequestConfig } from 'axios'
import store from '@/store/index'
// import env from '../config';
import { notification } from 'ant-design-vue'

import { message, Modal } from 'ant-design-vue'
export const axiosIns = axios.create({
  baseURL: '/adminapi/',
  timeout: 40000,
  withCredentials: true,
})

// 对接单点登录系统
;(axiosIns as any).adornURL = (actionName: any) => {
  // 非生产环境 && 开启代理, 接口前缀统一使用[/proxyApi/]前缀做代理拦截!
  return `/adminapi` + actionName
}

// 请求方法是post的时候，要求请求形式是form data， 并且传过去的数据格式要是【json】格式的 （需要通过qs插件将对象转为json字符串格式的）
axiosIns.interceptors.request.use((config: AxiosRequestConfig) => {
  store.commit('initiateRequest')
  return config
})
axiosIns.interceptors.response.use(
  (resp: AxiosResponse) => {
    showMsg(resp)
    store.commit('requestComplete')
    if (resp?.data?.message) {
      return Promise.reject(new Error(''))
    } else {
      return Promise.resolve(resp)
    }
  },
  (error) => {
    store.commit('requestComplete')
    Promise.reject(error)
  }
)

// 显示状态码对应的信息
const showMsg = (resp: AxiosResponse) => {
  const code = resp.status
  const statusCodeStartWith = resp.status.toString().substring(0, 1)
  const msg = resp.statusText

  switch (statusCodeStartWith) {
    case '1':
      // 服务器收到请求，需要请求者继续执行操作
      break
    case '2':
      // 系统消息
      if (resp?.data?.message) {
        message.open({
          content: resp.data.message,
          duration: 2,
          type: 'warning',
        })
      } else {
        // 成功，操作被成功接收并处理
        message.open({
          content: '操作成功',
          duration: 2,
          type: 'success',
        })
      }
      break
    case '3':
      // 重定向，需要进一步的操作已完成请求
      break
    case '4':
      // 客户端错误，请求中包含错误无法请求
      if (code == 403) {
        notification.warning({
          message: '无该资源的访问权限',
          description: '',
        })
      }
      if (code == 404) {
        notification.warning({
          message: '未找到该请求的资源',
          description: '',
        })
      }

      break
    case '5':
      // 服务端错误，服务端在处理请求时发生了错误
      notification.warning({
        message: '客户端错误',
        description: '',
      })
      break
    case '6':
      // if (resp.status === 600) {
      //   logout();
      // }
      break

    default:
      // (Message as any).error('未知状态码' + resp.status);
      break
  }
}
