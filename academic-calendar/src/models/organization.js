class Organization {
    constructor({id, name, minutes_per_lesson, min_minutes_per_day}) {
        this.id = id
        this.name = name
        this.minutesPerLesson = minutes_per_lesson
        this.minMinutesPerDay = min_minutes_per_day
    }
}

export default Organization