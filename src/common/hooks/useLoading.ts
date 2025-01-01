import { ref } from 'vue'
export const useLoading = () => {
  const loading = ref(false)
  const show = () => {
    loading.value = true
  }
  const hidden = () => {
    loading.value = false
  }

  return {
    loading,
    hidden,
    show,
  }
}
