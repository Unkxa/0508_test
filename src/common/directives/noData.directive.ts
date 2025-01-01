import NoData from '@/components/noData/noData.vue'
import Vue from 'vue'
const noData = {
  inserted(el: any, binding: any) {
    console.log('-----------------', binding)
    const noData = Vue.extend(NoData)
    el.instance = new noData({
      el: document.createElement('div'),
      propsData: {
        // 绑定属性
        config: binding.value.config,
      },
      // 绑定方法
      methods: binding.value.methods,
    })
    if (!binding.value.data.length) append(el)
  },
  update(el: any, binding: any) {
    if (binding.value !== binding.oldValue) binding.value.data.length ? remove(el) : append(el)
  },
}

function append(el: any) {
  const style = getComputedStyle(el)
  if (!['absolute', 'relative', 'fixed'].includes(style.position)) el.style.position = 'relative'
  el.appendChild(el.instance.$el)
}

function remove(el: any) {
  if (el.contains(el.instance.$el)) {
    el.style.position = ''
    el?.removeChild(el.instance.$el)
  }
}
const defaults: Record<string, unknown> = {
  noData,
}
export default defaults
