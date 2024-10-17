class DateFormater {
    toHoursAndMinutes(totalMinutes) {
        var hours = Math.floor(totalMinutes / 60);
        var minutes = totalMinutes % 60;
        
        minutes = String(minutes).padStart(2, '0')

        return`${hours}:${minutes}`;
    }
}

export default DateFormater