/**
 *  @ 菜单配置项
 */

export interface MenuMapIC {
  key: string
  name: string
  path: string
  grade: string[]
  isLeaf: boolean
  activePath?: string
  icon?: string
  code?: string
  children?: MenuMapIC[]
  menuCode?: string
}

export const menuMap = <MenuMapIC[]>[
  {
    //应用总览 英文
    key: '/overview',
    name: '应用总览',
    icon: 'FCdatabase',
    isLeaf: true,
    menuCode: 'S_单位基础信息维护',
  },
  {
    key: '/basicInfoBase/unitAgency',
    name: '单位基础信息维护',
    icon: 'FCgallery-view-2',
    isLeaf: true,
    menuCode: 'S_单位基础信息维护',
  },
]
