import Vue from 'vue'
import Prompt from './prompt.vue'

const PromptConstructor = Vue.extend(Prompt)

export const prompt = (config: any) => {
  return new Promise((resolve, reject) => {
    let instance: any = new PromptConstructor({ propsData: { config } })
    instance.confirm = () => {
      instance.visible = false
      resolve(true)
    }
    instance.cancel = () => {
      instance.visible = false
      reject('cancel')
    }
    instance.$mount()
    document.body.appendChild(instance.$el)
  })
}
