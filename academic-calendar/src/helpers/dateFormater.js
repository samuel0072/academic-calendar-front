class DateFormater {
    toHoursAndMinutes(totalMinutes) {
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;

        return minutes > 0? `${hours}h${minutes}min` :`${hours}h` ;
    }
}

export default DateFormater