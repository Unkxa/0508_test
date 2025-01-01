// 全局mixin
import isFirstLoad from '@/mixin/isFirstLoad.mixin'

export default {
  install(Vue: any) {
    Vue.mixin(isFirstLoad)
  },
}
