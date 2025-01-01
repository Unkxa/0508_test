<template>
  <ab-config-provider :locale="locale">
    <div id="app">
      <a-spin class="administrative-init-loading" tip="正在加载..." :spinning="true" v-if="spinning"> </a-spin>
      <keep-alive v-else :include="$store.state.cacheList">
        <router-view ref="routerView"></router-view>
      </keep-alive>
    </div>
  </ab-config-provider>
</template>

<script>
import zh_CN from 'amber-design-vue/lib/locale/zh_CN.js'
import { TreeUtils } from '@/common/toolFun/tree-utils'
import { routes } from '@/router/routes'
export default {
  name: 'app',
  data() {
    return {
      loadingInstance: null,
      locale: zh_CN,
      spinning: false,
    }
  },
  created() {
    if (!this.$isLoad) {
      this.spinning = true
    }
  },
  activated() {
    this.getKeepCacheList()
  },
  mounted() {
    this.getKeepCacheList()
    this.$eventBus.$on('qian_kun_global_event', (cur) => {
      if (cur.rootContainer.routersMap) {
        this.getKeepCacheList(cur.rootContainer.routersMap)
      }
    })

    this.$eventBus.$on('stop_system_loading', () => {
      setTimeout(() => {
        this.spinning = false
      }, 1000)
    })
    if (this.$isLoad) {
      setTimeout(() => {
        this.spinning = false
      }, 200)
    }
    setTimeout(() => {
      this.spinning = false
    }, 10000)
  },
  methods: {
    getKeepCacheList(routersMap) {
      if (!routersMap) {
        const routersMapJson = localStorage.getItem('routersMap')
        routersMap = routersMapJson ? JSON.parse(routersMapJson) : []
      }
      const include = []
      const administrativeRouter = routersMap
        .filter((item) => item.path.startsWith('/administrative/'))
        .map((item) => item.path.replace('/administrative', '').split('/'))
      TreeUtils.breadthFirstSearch(routes, (route) => {
        if (route.meta?.keepLive && administrativeRouter.some((item) => !!~item.indexOf(route.meta?.pageName))) {
          include.push(route.meta.pageName)
        }
      })
      this.$store.commit('setCacheList', Array.from(new Set(include)))
    },
  },
}
</script>
<style lang="less">
#app {
  height: 100%;
  .administrative-init-loading {
    position: fixed;
    width: 100%;
    height: calc(100% - 48px);
    z-index: 999;
    left: 0;
    top: 48px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: #f0f2f5;
  }

  .ant-spin-nested-loading {
    width: 100%;
    height: 100%;
    overflow: hidden;
    > div {
      height: 100%;
    }
    .ant-spin-container {
      height: 100%;
      display: flex;
      overflow: hidden;
    }
    .ant-spin-spinning {
      max-height: 100%;
    }
  }
}
.ag-center-cols-container {
  min-width: 100%;
}
</style>
