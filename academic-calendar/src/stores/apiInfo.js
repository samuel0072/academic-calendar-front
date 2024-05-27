import { defineStore } from 'pinia'

export const useAPIInfoStore = defineStore({
    id: 'api-info',
    state: () => ({
        apiUrl: import.meta.env.VITE_API_URL
    })
})