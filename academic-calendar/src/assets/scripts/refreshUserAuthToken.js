import axios from 'axios';
import { useUserAuthInfoStore } from '@/stores/userAuthInfo.js'
import logoutUser from './logoutUser.js'

/**
 * Try tro refresh the user's authentication token. If 401 is returned from the API, the user is logged out. 
 * If the token is successfully refreshed, a callback function is called.
 * 
 * @param {function} callback - A function to be called when the token is refreshed.
 * @param {[]} callbackArgs - An array of params to be passed to the callback function.
 * @return {void}
 */
function refreshUserAuthToken(callback, callbackArgs = []) {
    const store = useUserAuthInfoStore()

    if(store.refreshToken == null || store.refreshToken == "") {
        logoutUser()
    }
    else {
        axios.post('/api/auth/jwt_token/refresh', {
            refresh: store.refreshToken
        }).then(response  => {
            store.setAuthToken(response.data.access)
            callback(...callbackArgs)

        }).catch( error => {
                logoutUser()
        })
    }
    
}

export default refreshUserAuthToken;