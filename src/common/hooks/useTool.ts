import Vue from 'vue'
export const useTool = () => {
  const customPrompt = Vue.prototype.$customPrompt
  const abNotification = Vue.prototype.$abNotification
  return {
    customPrompt,
    abNotification,
  }
}
