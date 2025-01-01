import { cloneDeep } from 'lodash-es'
export default {
  data() {
    return {
      unwatchRoute: null,
      nowPath: '', //存一个当前路由的链接只有query变的时候才进行queryParamsChange
      oldQuery: {},
    }
  },

  mounted() {
    if (!window.__POWERED_BY_QIANKUN__ || this.IS_FIRST_LOAD) {
      this.unwatchRoute = this.$watch(
        '$route',
        (route) => {
          // 当组件激活时，处理路由变化
          this.queryParamsChange(route.query)
          this.nowPath = route.path
          this.oldQuery = cloneDeep(route.query)
        },
        { immediate: true, deep: true }
      )
    }
  },
  activated() {
    if (!this.IS_FIRST_LOAD) {
      this.unwatchRoute = this.$watch(
        '$route',
        (route) => {
          // 当组件激活时，处理路由变化
          this.onQueryParamsChange(route)
        },
        { immediate: true, deep: true }
      )
    }
  },
  deactivated() {
    this.unwatchRoute() // 当组件停用时，取消路由监听
    this.unwatchRoute = null
  },
  methods: {
    onQueryParamsChange(route) {
      const { path, query } = route
      const getEquality = (obj1, obj2) => {
        const keys1 = Object.keys(obj1)
        const keys2 = Object.keys(obj2)
        if (keys1.length !== keys2.length) return true
        for (let key of keys1) {
          if (obj1[key] !== obj2[key]) return true
        }
        return false
      }
      if ((this.nowPath === path && getEquality(this.oldQuery, query)) || (!this.nowPath && path)) {
        this.queryParamsChange(query)
        this.nowPath = path
        this.oldQuery = cloneDeep(query)
      }
    },
    queryParamsChange(query) {
      console.error('请复写queryParamsChange方法', query)
    },
  },
}
