import DateFormater from "@/helpers/dateFormater"
import { useOrganizationInfoStore } from "@/stores/organizationInfo"

class Organization {
    constructor({id, name, minutes_per_lesson, min_minutes_per_day}) {
        this.id = id
        this.name = name
        this.minutesPerLesson = minutes_per_lesson
        this.minMinutesPerDay = min_minutes_per_day

        var helper = new DateFormater()

        this.minutesPerLessonDisplay = helper.toHoursAndMinutes(this.minutesPerLesson)
        this.minMinutesPerDayDisplay = helper.toHoursAndMinutes(this.minMinutesPerDay)
    }

    static fromStore() {
        const store = useOrganizationInfoStore()

        return new Organization({
            id: store.id,
            name: store.name,
            minutes_per_lesson: store.minutesPerLesson,
            min_minutes_per_day: store.minMinutesPerDay
        })
    }
}

export default Organization