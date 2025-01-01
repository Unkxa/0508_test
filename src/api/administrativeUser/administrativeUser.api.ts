import request from '@/common/network/request'
import { ApiUrl } from './administrativeUser.url'
import ENV from '@/common/config'
/**
 * 创建用户
 * @param info
 *
 * @returns
 */
export const getUserListByPromise = (
  info: { keywords: any; currentPage: any; pageSize: any },
  searchName?: string,
  value?: string
) =>
  request.post(ENV.administrativeApiUrl + ApiUrl.getUserListByKeyWords, {
    columns: [
      {
        name: searchName,
        filterConditionCode: 5,
        value,
        type: 'string',
      },
      {
        name: 'da_display_name',
        filterConditionCode: 6,
        value: info.keywords,
        type: 'string',
      },
    ],
    pagingSort: {
      currentPage: info.currentPage,
      pageSize: info.pageSize,
    },
    sortList: [],
  })

export const getRoleList = (id: any) =>
  request.post(ENV.administrativeApiUrl + ApiUrl.getUnitRoleList, {
    columns: [
      {
        name: 'da_unit_id',
        filterConditionCode: 5,
        value: id,
        type: 'string',
      },
    ],
    pagingSort: {
      currentPage: '1',
      pageSize: 50,
    },
    sortList: [],
  })

export const getGroupList = (id: any) =>
  request.post(ENV.administrativeApiUrl + ApiUrl.getGroupList, {
    columns: [
      {
        name: 'da_unit_id',
        filterConditionCode: 5,
        value: id,
        type: 'string',
      },
    ],
    pagingSort: {
      currentPage: '1',
      pageSize: 50,
    },
    sortList: [],
  })

export const getUserByRole = (roleId: any) =>
  request.post(`${ENV.administrativeApiUrl + ApiUrl.getUserByRole}/${roleId}`, {})

export const getUserInfo = () => request.get(ENV.administrativeApiUrl + ApiUrl.getUserInfo)

export const getPermission = () => request.get(ENV.administrativeApiUrl + ApiUrl.getPermission)
