// 框架/组件/插件----------------------------------------------------------------------------
import AbDV from 'amber-design-vue'
import Antd from 'ant-design-vue'
import ElementUI from 'element-ui'
import ObjTree from 'xml-objtree'
import { notification } from 'ant-design-vue'
import VueAnimateNumber from 'vue-animate-number'
export default {
  install(Vue: any) {
    Vue.use(Antd)
    Vue.use(AbDV)
    Vue.use(ElementUI)
    Vue.use(VueAnimateNumber)
    Vue.prototype.$objTree = new ObjTree()
    Vue.prototype.$notification = notification
  },
}
