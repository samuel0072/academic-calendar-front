import axios from 'axios';
import { useOrganizationInfoStore } from "@/stores/organizationInfo"
import { useUserAuthInfoStore } from '@/stores/userAuthInfo.js'
import refreshUserAuthToken from '@/assets/scripts/refreshUserAuthToken.js'

function getOrgCampi() {
    var orgStore = useOrganizationInfoStore()
    var authStore = useUserAuthInfoStore()

    axios.get('/api/academic-calendar/campus/list', {
        headers: {
            Authorization: "Bearer " + authStore.token
        }
    })
    .then((response) => {
        orgStore.$patch({ campi: response.data })
    })
    .catch((error) => {
        if(error.response) {
            if(error.request.status === 401) {
                refreshUserAuthToken(getOrgCampi)
            }
        }
        console.log(error)
    })
}

export default getOrgCampi