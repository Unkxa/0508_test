import { MenuMapIC } from '@/layout/HomeComp/common/menu.map'
import { cloneDeep } from 'lodash-es'
import permissionService from '../permission/permission.service'

const permissionFilter = (value: any) => {
  if (typeof value === 'string') {
    return permissionService.check(value)
  }
  //处理动态按钮数组
  const checkedList: any = []
  value.options.forEach((item: any) => {
    if (!item.code || permissionService.check(item.code)) {
      checkedList.push(item)
    }
  })
  //阻止filter死循环
  if (checkedList.length !== value.options.length) {
    value.options = checkedList
  }

  return value
}

const permissionMenuFilter = (menuList: MenuMapIC[]) => {
  //深拷贝阻止filter死循环
  menuList = cloneDeep(menuList)
  if (!menuList.length) {
    return menuList
  }
  
  //处理menu
  const checkedList: any = []
  menuList.forEach((menuItem: MenuMapIC) => {
    if (!menuItem.menuCode || permissionService.check(menuItem.menuCode)) {
      if (menuItem.children) {
        const childrenList = permissionMenuFilter(menuItem.children)
        menuItem.children = childrenList.length ? childrenList : []
      }
      checkedList.push(menuItem)
    }
  })
  return checkedList
}

const defaults: Record<string, unknown> = {
  permissionFilter,
  permissionMenuFilter,
}
export default defaults
