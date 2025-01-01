import request from '@/common/network/request'
import { ApiUrl } from './user.url'
import ENV from '@/common/config'

/**
 * 创建用户
 * @param info
 *
 * @returns
 */
export const createUser = (info: any) =>
  request.post(ApiUrl.createUser, info, { message: { options: { content: '操作成功', type: 'success' } } })
/**
 * 授权给某个角色
 * @param info
 * @returns
 */
export const grantRole = (info: any) =>
  request.post(ApiUrl.grantRole, info, { message: { options: { content: '操作成功', type: 'success' } } })

/**
 * 获取用户信息
 * @param userId
 * @returns
 */
export const getUserDetail = (userId: any) => request.get(ApiUrl.getUserDetail, { params: { userId: userId } })

/**
 * 部门下用户列表
 * @param info
 * @returns
 */
export const getUserListInDepartment = (info: any, departmentId: any) =>
  request.post(ApiUrl.getUserListInDepartment, info, { params: { departmentId: departmentId } })
/**
 * 角色下用户列表
 * @param info
 * @returns
 */
export const getUserListInRole = (info: any, roleId: any) =>
  request.post(ApiUrl.getUserListInRole, info, { params: { roleId: roleId } })
/**
 * 租户下用户列表
 * @param info
 * @returns
 */
export const getUserListInTenant = (info: any, tenantId: any) =>
  request.post(ApiUrl.getUserListInTenant, info, { params: { tenantId: tenantId } })
/**
 * 单位下用户列表
 * @param info
 * @returns
 */
export const getUserListInUnit = (info: any, unitId: string) =>
  request.post(ApiUrl.getUserListInUnit, info, { params: { unitId: unitId } })
/**
 * 未在具体角色下的单位内的用户列表
 * @param info
 * @returns
 */
export const getUserListNotInRole = (info: any, unitId: any, roleId: any) =>
  request.post(ApiUrl.getUserListNotInRole, info, { params: { unitId: unitId, roleId: roleId } })

/**
 * 重置密码
 * @param info
 * {
 * password：""
 * userId:0
 * }
 *
 * @returns
 */
export const setPasswordReset = (info: string) =>
  request.put(ApiUrl.setPasswordReset, info, { message: { options: { content: '操作成功', type: 'success' } } })

/**
 * 禁用用户
 * @param info
 * @returns
 */
export const disableUser = (userId: string) =>
  request.put(
    ApiUrl.disableUser,
    {},
    { params: { userId: userId }, message: { options: { content: '操作成功', type: 'success' } } }
  )

/**
 * 启用用户
 * @param info
 * @returns
 */
export const enableUser = (userId: string) =>
  request.put(
    ApiUrl.enableUser,
    {},
    { params: { userId: userId }, message: { options: { content: '操作成功', type: 'success' } } }
  )

export const updateUser = (info: any) =>
  request.put(ApiUrl.updateUser, info, { message: { options: { content: '操作成功', type: 'success' } } })

// 移除用户的角色
export const revokeUser = (info: any) =>
  request.post(ApiUrl.revokeUser, info, { message: { options: { content: '操作成功', type: 'success' } } })

export const getCurrentUserPermission = (userId: any) =>
  request.get(ApiUrl.getCurrentUserPermission, { params: { userId: userId } })
export const present = () => request.get(ApiUrl.present)