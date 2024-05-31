import axios from 'axios';

async function refreshUserAuthToken(authToken, refreshToken) {
    return axios.post('api/auth/jwt_token/refresh', {
        access: authToken,
        refresh: refreshToken
    }).then(response  => {
        localStorage.setItem("authToken", response.data.access)
    }).catch(error => {
        throw new Error("Could not refresh the provided token", {
            cause: 'APIError'
        })
    })
}

export default refreshUserAuthToken;