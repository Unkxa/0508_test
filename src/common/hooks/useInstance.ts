import { getCurrentInstance } from 'vue'
export const useInstance = () => {
  const instance = getCurrentInstance()?.proxy as any
  const girdParentInstance = instance?.$parent?.$parent?.$parent as any
  return {
    instance,
    girdParentInstance,
  }
}
