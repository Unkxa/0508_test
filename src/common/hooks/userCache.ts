// 暂且保留一下，还不能用
import { useInstance } from './useInstance'
import { cloneDeep } from 'lodash-es'
import { ref, onMounted, onActivated, onDeactivated } from 'vue'
export const userCache = () => {
  const { instance } = useInstance()
  const unwatchRoute: any = ref(null)
  const nowPath = ref('')
  const oldQuery = ref({})

  onMounted(() => {
    if (!(window as any).__POWERED_BY_QIANKUN__ || instance.IS_FIRST_LOAD) {
      unwatchRoute.value = instance.$watch(
        '$route',
        (route: any) => {
          // 当组件激活时，处理路由变化
          queryParamsChange(route.query)
          nowPath.value = route.path
          oldQuery.value = cloneDeep(route.query)
        },
        { immediate: true, deep: true }
      )
    }
  })

  onActivated(() => {
    if (!instance.IS_FIRST_LOAD) {
      unwatchRoute.value = instance.$watch(
        '$route',
        (route: any) => {
          // 当组件激活时，处理路由变化
          onQueryParamsChange(route)
        },
        { immediate: true, deep: true }
      )
    }
  })

  onDeactivated(() => {
    unwatchRoute() // 当组件停用时，取消路由监听
    unwatchRoute.value = null
  })

  function onQueryParamsChange(route: any) {
    const { path, query } = route
    const getEquality = (obj1: any, obj2: any) => {
      const keys1 = Object.keys(obj1)
      const keys2 = Object.keys(obj2)
      if (keys1.length !== keys2.length) return true
      for (let key of keys1) {
        if (obj1[key] !== obj2[key]) return true
      }
      return false
    }
    if ((nowPath.value === path && getEquality(oldQuery, query)) || (!nowPath && path)) {
      queryParamsChange(query)
      nowPath.value = path
      oldQuery.value = cloneDeep(query)
    }
  }
  function queryParamsChange(query: any) {
    console.error('请复写queryParamsChange方法', query)
  }
  return {
    queryParamsChange,
  }
}
