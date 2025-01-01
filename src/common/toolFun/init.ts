/*
项目显示之前的初始化函数
*/
import permissionService from '../permission/permission.service'
// import { getUserInfo, getPermission } from '@/api/administrativeUser/administrativeUser.api'
// import { getCurrentUser } from '@/api/common/common.api'
import { getCurrentUserPermission } from '@/api/user/user.api'
import store from '@/store'

const getInit = () => {
  console.log('非首次渲染的必要函数')
}
// 获取用户信息 / admin 用户信息和权限信息
// 以上三个接口都会返回 set cookie 字段, 作为鉴权令牌!!!!!!!!!!!!!!!!!!!!!
const setToken = async () => {
  // -----------admin的 用户信息
  // const res: any = await getCurrentUser()
  // -----------admin的 权限信息
  // const permissionList: any = await getCurrentUserPermission(res.result.id || '')
  // -----------智治门户的 用户信息
  // const res: any = await getUserInfo()
  // window.sessionStorage.setItem('administrativeUserInfo', JSON.stringify(res.result))
  // store.commit('setUserInfo', res.result)
  // ---------智治门户的 权限信息
  // const permissionList: any = await getPermission()
  // permissionService.setPermissionCodeList(permissionList.result)
  permissionService.initRouteStateList()
  console.log('success init')
  // sessionStorage.setItem('admPermissionList', JSON.stringify(permissionList.result)) // 单纯为了排除线上问题保留, 无业务需求
}

export default () => {
  getInit()
  return Promise.all([setToken()])
}
