<template>
  <div class="head-top">
    <div class="unitinfo flex-x-end-center">
      <a-dropdown :trigger="['click']" :overlay-class-name="'custom-dropdown'">
        <span class="r-user">
          <span>暂无数据</span>
          <i
            class="iconfont"
            :class="{ FCxiala: !passwordVisible, FCshangla: passwordVisible }"
            @click="passwordVisible = !passwordVisible"
          ></i>
        </span>
        <a-menu slot="overlay" @click="onLogin">
          <a-menu-item class="menu-item" key="logout">退出登录</a-menu-item>
        </a-menu>
      </a-dropdown>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutation, mapMutations } from 'vuex'

import ENV from '@/common/config'
import { getCurrentLoginConfig } from '@/api/common/common.api'
import { menuMap } from '../../common/menu.map.ts'
import adminApi from '@/api/admin/admin.api'
import store from '@/common/toolFun/initStore'
import { cookiesUtils } from '@/common/toolFun/cookies'
import messageApi from '@/api/message/message.api'
import SetCurrentUnit from '../../modal/SetCurrentUnit'
import SetPassword from '../../modal/SetPassword'
import Notify from '../../modal/Notify'

import person_3x from '@/assets/images/head/person_3x.png'

export default {
  name: 'headBar',
  components: {
    SetCurrentUnit,
    SetPassword,
    Notify,
  },
  data() {
    return {
      logoSrc: { height: 30, title: '区域一体化平台', src: null },
      menu: {
        props: {
          meauColumn: [],
          theme: 'light',
          mode: 'horizontal',
        },
      },
      userInfo: {
        // avatar:sjtHeadLogo,
        src: person_3x,
        toolbar: [
          {
            name: '修改密码',
            icon: 'FCmima',
            click: () => {
              this.updatePassword()
            },
          },
        ],
      },
      user: {},
      unitsVisible: false,
      passwordVisible: false,
      notifyVisible: false,
      adminUrl: ENV.adminUrl,
      flowUrl: ENV.flowApiUrl,
      validatorUrl: ENV.validatorUrl,
      edasUrl: ENV.dataArchivesUrl,
      metadataUrl: ENV.metadataUrl,
      massageNumber: 0,
      toDoTaskTotal: 0,
      showMassagePopover: true,
    }
  },
  props: {
    showMenu: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    meauColumn() {
      const map = menuMap
      return map
    },
  },
  created() {
    // this.initLogo()
    // this.initUserInfo()
    // this.initMenu()
    // this.setMassagePopover()
    // this.getToDoTaskTotal()
  },
  methods: {
    ...mapActions(['saveSystemLogo']),
    // 初始化函数----------------------------------
    async initLogo() {
      // 微应用不加载图标
      let res = await getCurrentLoginConfig()
      let logo
      res.data.forEach((c) => {
        if (c.name == '企业图标') {
          this.logoSrc = {
            src: logo,
            ...this.logoSrc,
          }
          logo = window.location.origin + '/adminapi' + c.contentUrl
        }
      })

      this.saveSystemLogo(logo)
    },
    initUserInfo() {
      const info = Object.assign(this.userInfo, store.getFolderInfoByKey(['user', 'unit', 'grade']))
      this.userInfo = {
        ...info,
        title: info.user.loginName,
        role: info.user.displayName,
      }
    },
    // 初始化menu
    initMenu() {
      this.menu.props.meauColumn = this.showMenu
        ? [...(this.$options?.filters?.permissionMenuFilter(this.meauColumn) || [])]
        : []
    },
    // 事件函数----------------------------------
    run2Search(
      parameter = {
        key: 'keywords',
        value: '',
      }
    ) {
      const path = store.getFolderInfoByKey('archiveFile')
      const displayNameList = store.getFolderInfoByKey('user').roleDTOList
      const unit_code = store.getFolderInfoByKey('unit').code
      const search_window = window.open('')
      /**
       * 兜底查档专员拥有全部权限
       */
      const isChaDanger = displayNameList.find((c) => c.displayName.includes('兜底查档专员'))
      const s_object_path = isChaDanger ? `*${path.path.slice(path.path.indexOf('/', 1))}` : path.path

      const condition = {
        s_object_path: s_object_path,
        unit_code: isChaDanger ? '' : unit_code,
      }

      let searchCondition = JSON.stringify(condition)
      searchCondition = encodeURI(searchCondition)
      const { key, value } = parameter

      search_window.location.href = `${ENV.searchUrl}?${key}=${value}&searchCondition=${searchCondition}`
    },
    clickMenu(e) {
      console.log('e', e)
      this.$router.push({
        path: e.key,
      })
    },
    // 点击显示全宗
    changeUnit() {
      if (this.userInfo && this.userInfo.unit) {
        this.unitsVisible = true
      }
    },
    // 修改密码
    updatePassword() {
      this.passwordVisible = !this.passwordVisible
    },
    // 重新登录
    async onLogin() {
      localStorage.clear()
      sessionStorage.clear()
      cookiesUtils.delCookie('accessToken')
      if (process.env.NODE_ENV !== 'production') {
        location.reload()
        window.location.href = ENV.devLoginUrl
      } else {
        await adminApi.loginOut()
        window.location.href = ENV.proLoginUrl
      }
    },
    //跳转到回收站
    gotoRecycled() {
      this.$router.push('/recycled')
    },
    /**
     * @description 跳转代办任务列表
     */
    gotoToDoList() {
      this.$router.push('/missionCenter')
    },
    //通知
    openNotify() {
      this.notifyVisible = true
    },
    /**
     * @description 设置未读消息数量
     * @returns
     */
    async setMassagePopover() {
      const res = await messageApi.getMassageNum('02')
      const messageCount = Number(res.result)
      if (messageCount <= 0) return
      this.massageNumber = messageCount
      this.showMassagePopover = true
    },
    /**
     * @description 获取代办任务数量统计
     */
    async getToDoTaskTotal() {
      const res = await messageApi.getTaskTodoCount()
      console.log(res)
      const toDoTaskTotal = Number(res.result)
      if (toDoTaskTotal <= 0) return
      this.toDoTaskTotal = toDoTaskTotal
      this.showMassagePopover = true
    },
  },
}
</script>
<style lang="less" scoped src="./HeadBar.less"></style>
