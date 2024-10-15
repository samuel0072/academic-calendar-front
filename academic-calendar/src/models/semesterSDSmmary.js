import CampusSchoolDaysSummary from "./campusSDSummary";

class SemesterSchoolDaysSummary {
    constructor({ campi_school_days_count, description }) {
        this.description = description
        this.campiSummary = []

        campi_school_days_count.forEach((campusSum) => {
            this.campiSummary.push( new CampusSchoolDaysSummary(campusSum) )
        })
    }
}

export default SemesterSchoolDaysSummary;