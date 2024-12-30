const createCalendar = (year, month, selectedDates) => {
  let mon = month - 1 // months in JS are 0..11, not 1..12
  let d = new Date(year, mon)

  let table = ''

  // spaces for the first row
  // from Monday till the first day of the month
  // * * * 1  2  3  4
  for (let i = 0; i < getDay(d); i++) {
    table += '<td class="blank"></td>'
  }

  // <td> with actual dates
  while (d.getMonth() == mon) {
    table += `<td ${
      selectedDates.includes(d.getDate()) ? 'class="selected"' : ''
    } id="day-${d.getDate()}">${d.getDate()}</td>`

    if (getDay(d) % 7 == 6) {
      // sunday, last day of week - newline
      table += '</tr><tr>'
    }

    d.setDate(d.getDate() + 1)
  }

  // add spaces after last days of month for the last row
  // 29 30 31 * * * *
  if (getDay(d) != 0) {
    for (let i = getDay(d); i < 7; i++) {
      table += '<td class="blank"></td>'
    }
  }

  return table
}

const getDay = (date) => {
  // get day number from 0 (monday) to 6 (sunday)
  let day = date.getDay()
  if (day == 0) day = 7 // make Sunday (0) the last day
  return day - 1
}

export { createCalendar }
