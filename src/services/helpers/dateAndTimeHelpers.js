// Gets the previous sunday of the "date" week
export const getSunday = date => {
  d = new Date(date)
  d.setUTCHours(0, 0, 0, 0)

  const day = d.getUTCDay()
  const diff = d.getDate() - day
  return new Date(d.setDate(diff))
}

// Gets the next saturday of the selected sunday
export const getNextSaturday = sunday => {
  d = new Date(sunday)
  d.setUTCHours(0, 0, 0, 0)

  const day = d.getDate()
  const daysToAdd = day + 6
  return new Date(d.setDate(daysToAdd))
}

// Adds days to a date
export const addDaysToDate = (date, daysToAdd) => {
  d = new Date(date)
  d.setUTCHours(0, 0, 0, 0)

  const day = date.getDate()
  const addedDays = day + daysToAdd
  return new Date(d.setDate(addedDays))
}

// Converts a date to a string format
// Allowed formats:
// - 'DD/MM'
// - 'DD/MM/YYYY'
export const convertDateToString = (inputDate, format) => {
  const padToTwo = number => {
    return number > 9 ? number : '0' + number
  }

  if (format === 'DD/MM') {
    const month = inputDate.getUTCMonth() + 1
    const day = inputDate.getUTCDate()

    const dayString = '' + padToTwo(day) + '/' + padToTwo(month)
    return dayString
  }

  if (format === 'DD/MM/YYYY') {
    const month = inputDate.getUTCMonth() + 1
    const day = inputDate.getUTCDate()
    const year = inputDate.getUTCFullYear()

    const dayString = '' + padToTwo(day) + '/' + padToTwo(month) + '/' + year
    return dayString
  }
}

// Returns an array with the created next weeks, with sunday as the start of the week and saturday as the end. We have the formats DD/MM and Full date
// for each of these days. The numberOfWeeks variable will define the number of weeks created
export const createNextWeeks = (currentDay, numberOfWeeks) => {
  const sunday = getSunday(currentDay)
  const saturday = getNextSaturday(sunday)

  let weeks = []
  for (let i = 0; i < numberOfWeeks; i++) {
    const nextSunday = addDaysToDate(sunday, i * 7)
    const nextSaturday = addDaysToDate(saturday, i * 7)
    weeks.push({
      startOfWeek: convertDateToString(nextSunday, 'DD/MM'),
      startOfWeekFull: nextSunday,
      endOfWeek: convertDateToString(nextSaturday, 'DD/MM'),
      endOfWeekFull: nextSaturday
    })
  }

  return weeks
}

export const weekDays = [
  {
    weekDay: 1,
    name: 'Domingo',
    abbreviation: 'Dom'
  },
  {
    weekDay: 2,
    name: 'Segunda',
    abbreviation: 'Seg'
  },
  {
    weekDay: 3,
    name: 'Terça',
    abbreviation: 'Ter'
  },
  {
    weekDay: 4,
    name: 'Quarta',
    abbreviation: 'Qua'
  },
  {
    weekDay: 5,
    name: 'Quinta',
    abbreviation: 'Qui'
  },
  {
    weekDay: 6,
    name: 'Sexta',
    abbreviation: 'Sex'
  },
  {
    weekDay: 7,
    name: 'Sábado',
    abbreviation: 'Sáb'
  }
]

// Returns the week day name to display for user. In our system, weekDay 1 is Sunday and weekDay 7 is Saturday
export const getWeekDayName = weekDay => {
  return weekDays.find(day => day.weekDay === weekDay)?.name
}

// Returns the week day name to display for user. In our system, weekDay 1 is Sunday and weekDay 7 is Saturday
export const getMonthName = monthIndex => {
  const months = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro'
  ]

  return months[monthIndex]
}

// Gets a date day
export const getDateDay = date => {
  const d = new Date(date)
  return d.getUTCDate()
}

// Checks if a date is in a specified month
export const checkDateInSelectedMonth = (date, month) => {
  const d = new Date(date)
  if (d.getUTCMonth() === month) {
    return true
  }
  return false
}

// Checks if two dates are in the same day
export const isInSameDay = (date1, date2) => {
  const d1 = new Date(date1)
  d1.setUTCHours(0, 0, 0, 0)
  const d2 = new Date(date2)
  d2.setUTCHours(0, 0, 0, 0)

  if (d1.getTime() === d2.getTime()) {
    return true
  }
  return false
}
