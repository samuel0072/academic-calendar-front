import { useUserAuthInfoStore } from '@/stores/userAuthInfo.js'
import { useRouter } from '@/router'

function logoutUser() {
    const router = useRouter()
    const store = useUserAuthInfoStore()

    store.reset()

    router.push({ name: 'login'})
}

export default logoutUser;