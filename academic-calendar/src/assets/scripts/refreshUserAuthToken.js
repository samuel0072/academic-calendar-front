import axios from 'axios';
import { useUserAuthInfoStore } from '@/stores/userAuthInfo.js'

async function refreshUserAuthToken(refreshToken) {
    return axios.post('api/auth/jwt_token/refresh', {
        refresh: refreshToken
    }).then(response  => {
        //mudar para setar o token na store
        const store = useUserAuthInfoStore()
        store.setAuthToken(response.data.access)
    }).catch(error => {
        throw new Error("Could not refresh the provided token", {
            cause: 'APIError'
        })
    })
}

export default refreshUserAuthToken;