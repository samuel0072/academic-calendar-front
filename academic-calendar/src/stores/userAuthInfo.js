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
        setAuthToken(newToken, writeStorage = true) {
            //mudar para setar o token no localstorage
            if(writeStorage) {
                localStorage.setItem("authToken", newToken)
            }
            this.token = newToken
        },
        setRefreshToken(newRefreshToken, writeStorage = true) {
            if(writeStorage) {
                localStorage.setItem("refreshToken", newRefreshToken)
            }
            this.refreshToken = newRefreshToken
        }
    }
})