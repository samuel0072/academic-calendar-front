import WeekDaysSummary from "./weekDaysSummary"

class CampusSchoolDaysSummary {
    constructor({ id, name, school_days_count, school_week_days }) {
        this.id = id
        this.name = name
        this.schoolDaysCount = school_days_count
        this.schoolWeekDays = new WeekDaysSummary(school_week_days)
    }
}

export default CampusSchoolDaysSummary