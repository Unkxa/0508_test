//自定义组件----------------------------------------------------------------------------
import ImportFileModal from './importFileModal/index.vue'
import { prompt } from './prompt/prompt'
import EmptyData from './emptyData/emptyData.vue'
export default {
  install(Vue: any) {
    Vue.component('ImportFileModal', ImportFileModal)
    Vue.component('EmptyData', EmptyData)
    Vue.prototype.$customPrompt = prompt
  },
}
