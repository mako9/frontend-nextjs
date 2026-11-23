import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

/**
 * `excludeDateIntervals` is how the item's already-booked days reach the calendar: a neighbour who can
 * pick a day someone else already has gets a booking that only the approval step can catch.
 */
export default function CustomDatePicker({
    selectedDate,
    setSelectedDate,
    excludeDateIntervals,
}: {
    selectedDate: Date
    setSelectedDate: (date: Date) => void
    excludeDateIntervals?: Array<{ start: Date; end: Date }>
}) {
    return (
        <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            showTimeSelect
            showIcon
            timeFormat="HH:mm"
            timeIntervals={15}
            timeCaption="Time"
            dateFormat="MMMM d, yyyy h:mm aa"
            className="form-control"
            excludeDateIntervals={excludeDateIntervals}
        />
    )
}
