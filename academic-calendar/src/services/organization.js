import HTTPService from "./httpService"
import Organization from "@/models/Organization"

class OrganizationService extends HTTPService{
    async getOrgInfo() {
        const orgInfo = await this.apiClient.get("/org/info")
        return new Organization(orgInfo.data)
    }
}

export default OrganizationService