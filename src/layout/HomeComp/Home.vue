<!-- 页面布局 组件 -->
<template>
  <div class="home-container" :class="isMicroApp ? 'micro-app-height' : ''">
    <div class="home-container-top" v-if="!isMicroApp">
      <headBar :showMenu="!verticalLayout"></headBar>
    </div>
    <div v-if="marqueeSwitch && items.length > 0" class="marquee">
      <marquee :list="items"></marquee>
    </div>
    <div class="home-container-content">
      <div class="home-container-content-left" v-if="verticalLayout">
        <!-- 需要左侧菜单的折叠放开即可 -->
        <!-- :bottomCollapsed="true" -->
        <ab-menu
          :meauColumn="meauColumn | permissionMenuFilter"
          :width="200"
          :defaultOpenKeys="defaultOpenKeys"
          :defaultSelectedKeys="defaultSelectedKeys"
          :selectedKeys="defaultSelectedKeys"
          :showCollapsed="true"
          :defaultCollapsed="openLeftBoolean"
          @click="clickMenu"
          @toggleCollapsed="toggleCollapsed"
          mode="inline"
        >
          <template v-slot:menuItem="{ item }">
            <!-- <ab-icon v-if="item.icon" :className="item.icon"></ab-icon> -->
            <span>{{ item.name }}</span>
            <a-badge :count="item.notEntryCount" showZero :overflow-count="9999999999"></a-badge>
          </template>
        </ab-menu>
      </div>
      <div class="home-container-content-right">
        <div
          class="home-container-content-right-breadcrumb"
          :style="{ height: isMicroApp ? rootTabHeight + 'px' : '38px' }"
        >
          <ab-breadcrumb
            v-if="!isMicroApp"
            :staticBreadcrumbsList="staticBreadcrumbsList"
            :dynamicBreadcrumbsList="dynamicBreadcrumbsList"
            @changeBreadcrumb="changeBreadcrumb"
          ></ab-breadcrumb>
        </div>
        <div class="home-container-content-right-router">
          <!-- <transition name="fade-transform" mode="out-in"> -->
          <keep-alive :include="$store.state.cacheList">
            <router-view ref="routerView" />
          </keep-alive>
          <!-- </transition> -->
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { menuMap } from './common/menu.map.ts'
import headBar from './components/HeadBar/HeadBar.vue'
import archiveManagementApi from '@/api/archivesManagement/archivesManagement.api'
import marquee from './components/marquee/marquee.vue'
import ENV from '@/common/config'
import * as _ from 'lodash-es'
import { TreeUtils } from '@/common/toolFun/tree-utils'

export default {
  name: 'home',
  components: {
    headBar,
    marquee,
  },
  data() {
    return {
      verticalLayout: ENV.verticalLayout,
      marqueeSwitch: ENV.marqueeSwitch,
      // 跑马灯
      items: ['文字1  ', '文字2  '],
      //  选择 menu
      defaultSelectedKeys: ['/supervisoryPlatform/registrationAndFiling'], //初始选中的菜单项 key 数组
      defaultOpenKeys: ['/supervisoryPlatform'], // 初始展开的 SubMenu 菜单项 key 数组
      openLeftBoolean: false,
      // 面包屑
      staticBreadcrumbsList: [], //不可点击
      dynamicBreadcrumbsList: [], //可以点击列表
      isMicroApp: false,

      rootTabHeight: 40,
      rootContainerHeight: window.innerHeight - 48, // 基座容器高度
      navigationEnable: true, // 导航栏是否启用
      tabEnable: false, // 标签页是否启用
    }
  },
  computed: {
    meauColumn() {
      return menuMap
    },
  },

  created() {
    this.isMicroApp = window.__POWERED_BY_QIANKUN__
  },
  watch: {
    $route: {
      handler(to) {
        const ids = to.query.ids
        if (to.meta.changePathByIds && ids) {
          this.getBreadCrumbsById({ name: to.meta.title }, ids)
        } else {
          this.staticBreadcrumbsList = [{ name: to.meta.title }]
          this.dynamicBreadcrumbsList = []
        }
        if (to.meta.indentSidebar) {
          console.log(this.openLeftBoolean)
          this.openLeftBoolean = true
        } else {
          this.openLeftBoolean = false
        }
        this.defaultOpenKeys = to.matched
          .map((i, idx) => {
            if (idx === 0) return ''
            return i.path
          })
          .filter(Boolean) //to.matched 是 $route 对象中的一个属性，它代表了当前路由匹配的所有嵌套路由记录
        console.log('defaultOpenKeys', this.defaultOpenKeys)
        const defaultSelectedKeys = this.defaultOpenKeys[this.defaultOpenKeys.length - 1]
        TreeUtils.depthFirstSearch(this.meauColumn, ({ key }) => {
          if (defaultSelectedKeys.startsWith(key)) {
            this.defaultSelectedKeys = [key]
          }
        })
        this.$forceUpdate()
      },
      deep: true, // 深度观察监听
      immediate: true, // 第一次初始化渲染就可以监听到
    },
  },
  mounted() {
    if (this.$microMount) {
      this.rootTabHeight = this.$microMount.rootContainer.tabHeight
      this.rootContainerHeight = this.$microMount.rootContainer.height
      this.navigationEnable = this.$microMount.rootContainer.navigationEnable
      this.tabEnable = this.$microMount.rootContainer.tabEnable
    }
  },
  methods: {
    clickMenu(e) {
      this.$router.push({
        path: e.key,
      })
    },
    toggleCollapsed(isCollapsed) {
      let menu = document.getElementsByClassName('r-nav-tabs')[0]
      let oldMenu = document.getElementsByClassName('home-container-content-right-breadcrumb')[0]
      if (isCollapsed && oldMenu && menu) {
        oldMenu.style.visibility = 'hidden'
        menu.classList.remove('micro-tab-menu')
        menu.classList.add('micro-tab-menu-collapse')
      } else if (menu) {
        menu.classList.remove('micro-tab-menu-collapse')
        menu.classList.add('micro-tab-menu')
      }
    },
    async getBreadCrumbsById(rootPath, ids) {
      const idsList = ids.split('*')
      _.remove(idsList, (item) => item.includes('subject_virtual_node'))
      const res = await archiveManagementApi.getBreadCrumbsById(idsList.join('*'))
      this.staticBreadcrumbsList = [rootPath]
      this.dynamicBreadcrumbsList = [...(res?.result || [])]
    },
    changeBreadcrumb(bread) {
      console.log('changeBreadcrumb--', bread)
      for (let i = 0; i < this.dynamicBreadcrumbsList.length; i++) {
        if (this.dynamicBreadcrumbsList[i].id == bread.id) {
          this.dynamicBreadcrumbsList.splice(i + 1, this.dynamicBreadcrumbsList.length - i)
          break
        }
      }
      const treeNodeIds = []
      for (let i = 0; i < this.dynamicBreadcrumbsList.length; i++) {
        treeNodeIds.push(this.dynamicBreadcrumbsList[i].id)
      }
      let ids = []
      ids = ids.concat(treeNodeIds)

      // 获取当前路由信息
      const currentRoute = this.$route

      const currentIds = currentRoute.query.ids
      console.log('changeBreadcrumb--', bread, currentIds, { ...currentRoute.query, ids: ids.join('*') })
      // 构造新的路由对象
      const newRoute = { path: currentRoute.path, query: { ...currentRoute.query, ids: ids.join('*') } }
      this.$router.replace(newRoute)
    },
  },
}
</script>
<style scoped>
::v-deep .ps__thumb-y {
  width: 8px !important;
  background-color: rgba(29, 33, 41, 0.35) !important;
}
.fade-transform-enter-active,
.fade-transform-leave-active {
  transition: all 0.5s cubic-bezier(0.42, 0, 0.58, 1);
}

.fade-transform-enter,
.fade-transform-leave-to {
  opacity: 0;
  transform: scale(0.8);
}
</style>
<style lang="less" scoped src="./style/home.less"></style>
