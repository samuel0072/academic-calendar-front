import { defineStore } from 'pinia'

export const useUserAuthInfoStore = defineStore({
    id: 'userAuthInfo',
    state: () => ({
        token: null, refreshToken: null, isAuthenticated: false
    }),
    actions: {
        changeAuthenticateState(newState) {
            this.isAuthenticated = newState
        },
        setAuthToken(newToken) {
            //mudar para setar o token no localstorage
            localStorage.setItem("authToken", newToken)
            this.token = newToken
        },
        setRefreshToken(newRefreshToken) {
            localStorage.setItem("refreshToken", newRefreshToken)
            this.refreshToken = newRefreshToken
        }
    }
})