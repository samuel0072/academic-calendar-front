import HTTPService from "./httpService"
import SchoolDaysSummary from "@/models/schoolDaysSummary"

class SchoolDaysSummaryService extends HTTPService {
    constructor(calendarId) {
        super()
        this.calendarId = calendarId
    }

    async getSummary() {
        const summaryData = await this.apiClient.get(`/${this.calendarId}/school_days_count`)
        return new SchoolDaysSummary(summaryData.data)
    }
}

export default SchoolDaysSummaryService