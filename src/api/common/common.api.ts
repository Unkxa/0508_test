import request from '@/common/network/request'
import { ApiUrl } from './common.url'
import { axiosIns } from '@/common/network/ajax'
import ENV from '@/common/config'
/**
 * 登出
 * @returns
 */
export const logOut = (): Promise<any> => {
  return (<any>axiosIns.get(`/login_out`))
    .then(() => {
      window.location.reload()
      localStorage.clear()
      sessionStorage.clear()
    })
    .catch(() => {
      window.location.reload()
    })
}

/**
 *  获取用户信息
 * @param data
 * @returns
 * grade:1 超级管理员 2 租户管理员 3 普通用户
 */
export const getCurrentUser = () => request.get(ApiUrl.getCurrentUser)
export const getCurrentLoginConfig = () =>
  request.post(ApiUrl.getCurrentLoginConfig, {
    columns: [],
    paging: {
      currentPage: 1,
      endIndex: 0,
      pageSize: 999,
      startIndex: 0,
      totalCount: 0,
    },
    sortList: [],
  })

/**
 *  查询全部区域层级（树结构）
 * @param data
 * @returns
 */
export const getRegionTreeNodes = () => request.get(ENV.administrativeApiUrl + ApiUrl.getRegionTreeNodes)
