import { defineStore } from 'pinia'

export const useUserAuthInfoStore = defineStore({
    id: 'user-auth-info',
    state: () => ({
        token: null, refreshToken: null, isAuthenticated: false
    }),
    actions: {
        changeAuthenticateState(newState) {
            this.isAuthenticated = newState
        },
        setAuthToken(newToken) {
            this.token = newToken
        },
        setRefreshToken(newRefreshToken) {
            this.refreshToken = newRefreshToken
        }
    }
})