import ENV from '@/common/config'

// ENV.administrativeApiUrl 可使用
export enum ApiUrl {
  createUser = '/adminapi/user/create', // 创建用户
  getUserDetail = '/adminapi/user', // 获取用户信息
  grantRole = '/adminapi/user/grant/role', //  授权给用户某个角色
  getUserListInDepartment = '/adminapi/user/list_in_department', //  部门下用户列表
  getUserListInRole = '/adminapi/user/list_in_role', //  部门下用户列表
  getUserListInTenant = '/adminapi/user/list_in_tenant', //  部门下用户列表
  getUserListInUnit = '/adminapi/user/list_in_unit', //  部门下用户列表
  getUserListNotInRole = '/adminapi/user/list_not_in_role', // 未在具体角色下的单位内的用户列表
  setPasswordReset = '/adminapi/user/password/reset', // 重置密码
  disableUser = '/adminapi/user/disable', //禁用用户
  enableUser = '/adminapi/user/enable', //启用用户
  updateUser = '/adminapi/user/update', // 更新用户
  revokeUser = '/adminapi/user/revoke/role', // 取消某个角色
  getCurrentUserPermission = '/adminapi/user/permissions',
  present = '/adminapi/user/present',
}
