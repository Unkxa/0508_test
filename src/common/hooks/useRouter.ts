import { useInstance } from './useInstance'
export const useRouter = () => {
  const { instance } = useInstance()
  const route = instance?.$route as any
  const router = instance?.$router as any

  return {
    route,
    router,
  }
}
