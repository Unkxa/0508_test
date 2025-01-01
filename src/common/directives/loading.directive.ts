import Loading from '@/components/loading/loading.vue'
import Vue from 'vue'
const loading = {
  inserted(el: any, binding: any) {
    const loading = Vue.extend(Loading)
    el.instance = new loading({
      el: document.createElement('div'),
    })
    if (binding.value) append(el)
  },
  update(el: any, binding: any) {
    if (binding.value !== binding.oldValue) binding.value ? append(el) : remove(el)
  },
}

function append(el: any) {
  const style = getComputedStyle(el)
  if (!['absolute', 'relative', 'fixed'].includes(style.position)) el.style.position = 'relative'
  el.appendChild(el.instance.$el)
}

function remove(el: any) {
  el.style.position = ''
  el.removeChild(el.instance.$el)
}
const defaults: Record<string, unknown> = {
  loading,
}
export default defaults
