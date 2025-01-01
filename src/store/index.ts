import Vue from 'vue'
import Vuex from 'vuex'
import { cloneDeep } from 'lodash-es'
// import fileWorkFrameworkInfoUrlApi from '@/api/basicUnitInformation/fileWorkFramework.api'
Vue.use(Vuex)

interface StateIntel {
  [keys: string]: any
}
/**
 *
 */
const stateData: StateIntel = {
  loadingShow: false,
  logoUrl: '',
  notify: false,
  cacheList: [],

  droppedItems: [], // 存放拖拽后的控件
  selectedItem: null, // 当前选中的控件
  regionList: [],
  unitUserList: [],
  currentNode: {}, // 表彰详情左侧树节点
  userInfo: {}, //用户信息
}

/**
 *
 */
const getters = {
  getLoadingShow: (state: any) => state.loadingShow,
  getSelectedItem: (state: any) => state.selectedItem, // 获取当前选中的控件
  getControlList: (state: any) => state.controlList, // 获取控件列表
  getCurrentNode: (state: any) => state.currentNode,
}

/**
 *
 */
const mutations = {
  setLoading(state: any, flag: any) {
    state.loadingShow = flag
  },
  saveLogo(state: any, logoUrl: string) {
    state.logoUrl = logoUrl
  },
  setNotify(state: any, notify: boolean) {
    state.notify = notify
  },
  setCacheList: (state: any, cacheList: []) => {
    state.cacheList = cacheList
  },
  saveRegion(state: any, regionList: any) {
    state.regionList = regionList
  },
  saveUnitUser(state: any, unitUserList: any) {
    state.unitUserList = unitUserList
  },
  // 拖拽和控件操作相关
  addDroppedItem(state: any, newItem: any) {
    state.droppedItems.push(newItem)
  },
  updateDroppedItems(state: any, droppedItems: any) {
    state.droppedItems = droppedItems
  },
  setSelectedItem(state: any, selectedItem: any) {
    state.selectedItem = selectedItem
  },
  updateItemTitle(state: any, { index, newTitle }: { index: number; newTitle: string }) {
    if (state.droppedItems[index]) {
      state.droppedItems[index].title = newTitle
    }
  },
  setCurrentNode(state: any, node: any) {
    state.currentNode = node
  },
  setUserInfo(state: any, userInfo: any) {
    state.userInfo = userInfo
  },
}
const actions = {
  saveSystemLogo({ commit }: any, newString: any) {
    // actions中可以编写异步代码
    return new Promise((resolve) => {
      setTimeout(() => {
        commit('saveLogo', newString)
        resolve('更新完成')
      }, 2000)
    })
  },
  setNotify({ commit }: any, notify: any) {
    commit('setNotify', notify)
  },
  // // 获取省市区数据
  // saveRegion({ commit }: any) {
  //   return new Promise((resolve, reject) => {
  //     fileWorkFrameworkInfoUrlApi
  //       .getRegionLevelList()
  //       ?.then((res:any) => {
  //         const regionList = res.result
  //         const mapRegionTree = (list: any) => {
  //           list.forEach((item: any) => {
  //             if (item.children && item.children.length > 0) {
  //               mapRegionTree(item.children)
  //             }
  //             item.label = item.name
  //             item.value = item.code
  //           })
  //           return list
  //         }
  //         const mapRegionList = mapRegionTree(regionList)
  //         commit('saveRegion', mapRegionList)
  //         resolve(mapRegionList)
  //       })
  //       .catch((err:any) => {
  //         reject(err)
  //       })
  //   })
  // },
  // 获取领导数据
  // saveUnitUser({ commit }: any) {
  //   return new Promise((resolve, reject) => {
  //     fileWorkFrameworkInfoUrlApi
  //       .getAllUserOfUnit(JSON.parse(window.sessionStorage.getItem('administrativeUserInfo') as any)?.unitDTO?.code)
  //       ?.then((res:any) => {
  //         const unitUserList = res.result
  //         commit('saveUnitUser', unitUserList)
  //         resolve(unitUserList)
  //       })
  //       .catch((err:any) => {
  //         reject(err)
  //       })
  //   })
  // },
  // 拖拽和控件操作相关
  addDroppedItem({ commit }: any, newItem: any) {
    commit('addDroppedItem', newItem)
  },
  updateDroppedItems({ commit }: any, droppedItems: any) {
    commit('updateDroppedItems', droppedItems)
  },
  setSelectedItem({ commit }: any, selectedItem: any) {
    commit('setSelectedItem', selectedItem)
  },
  updateItemTitle({ commit }: any, payload: { index: number; newTitle: string }) {
    commit('updateItemTitle', payload)
  },
  setCurrentNode({ commit }: any, node: any) {
    commit('setCurrentNode', node)
  },
}

export default new Vuex.Store({
  state: stateData,
  getters,
  mutations,
  actions,
  modules: {},
})
