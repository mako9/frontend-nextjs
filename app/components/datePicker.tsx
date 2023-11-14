import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

export default function CustomDatePicker({ selectedDate, setSelectedDate }) {
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
        />
    )
}
