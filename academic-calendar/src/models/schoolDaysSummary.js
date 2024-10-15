import SemesterSchoolDaysSummary from "./semesterSDSmmary"

class SchoolDaysSummary {
    constructor({ saturdays, semesters, sundays, total_days }) {
        this.saturdays = saturdays
        this.sundays = sundays
        this.totalDays = total_days

        this.semesters = []

        semesters.forEach((semester) => {
            this.semesters.push( new SemesterSchoolDaysSummary(semester) )
        })
    }
}

export default SchoolDaysSummary