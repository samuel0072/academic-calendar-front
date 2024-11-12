import HTTPService from "./httpService"
import Organization from "@/models/organization.js"

class OrganizationService extends HTTPService{
    async getOrgInfo() {
        const orgInfo = await this.apiClient.get("/org/info")
        return new Organization(orgInfo.data)
    }

    async updateMinInfo(organization) {
        const orgInfo = await this.apiClient.put("/org/update_minutes", {
            minutes_per_lesson: organization.minutesPerLesson,
            min_minutes_per_day:  organization.minMinutesPerDay
        })

        return new Organization(orgInfo.data)
    }
}

export default OrganizationService