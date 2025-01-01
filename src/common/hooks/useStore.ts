import { useInstance } from './useInstance'
export const useStore = () => {
  const { instance } = useInstance()
  const store = instance?.$store as any
  return {
    store,
  }
}
