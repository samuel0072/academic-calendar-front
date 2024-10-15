import axios from 'axios'
import { useUserAuthInfoStore } from "@/stores/userAuthInfo"

class HTTPService {
    constructor() {
        var authStore = useUserAuthInfoStore()
        this.apiClient = axios.create({
            baseURL: "/api/academic-calendar/",
            headers: {
                Authorization: `Bearer ${authStore.token}`,
                'Content-Type': 'application/json'
            }
        })
    }
}

export default HTTPService