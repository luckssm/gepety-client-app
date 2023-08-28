import { useState, useEffect } from 'react'
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native'

import Colors from '../themes/colors'
import Images from '../themes/images'

import {
  getMonthName,
  weekDays,
  getDateDay,
  checkDateInSelectedMonth,
  isInSameDay
} from '../services/helpers/dateAndTimeHelpers'

import BasicCard from './Cards/BasicCard'

const styles = StyleSheet.create({
  monthsNavigationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24
  },
  monthsNavigationTextStyle: {
    fontSize: 20,
    color: Colors.lightBlack
  },
  arrowButtonStyle: {
    width: 26,
    height: 26
  },
  weekDaysTextStyle: {
    fontSize: 18,
    color: Colors.lightBlack,
    textAlign: 'center'
  },
  daysCurrentMonthTextStyle: {
    color: Colors.lightBlack,
    fontSize: 16
  },
  daysNotCurrentMonthTextStyle: {
    color: Colors.lightGray,
    fontSize: 16
  },
  divisionLineStyle: {
    backgroundColor: Colors.lightGray,
    height: 1,
    marginBottom: 8
  },
  scheduledDayContainerStyle: {
    backgroundColor: Colors.lightOrange,
    borderRadius: 8
  }
})

export default function Calendar ({ scheduledDates }) {
  // Sets the information to create the initial calendar state
  const today = new Date()
  today.setUTCHours(0, 0, 0, 0)
  const initialMonth = today.getMonth()
  const initialYear = today.getFullYear()

  const [currentMonth, setCurrentMonth] = useState(initialMonth)
  const [currentYear, setCurrentYear] = useState(initialYear)

  // The max month - for now it is current month + 3
  const maxMonth = (initialMonth + 3) % 12

  // Creates all the days of the current month
  const createMonthDaysArray = () => {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1)
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0)
    const lastDayOfMonthDay = lastDayOfMonth.getDate()

    let monthDaysArray = []

    // We get the first week day of the first day of the month and use it to get the last days of the last month and push it to the array
    const firstDayOfMonthWeekDay = firstDayOfMonth.getDay()
    for (let i = firstDayOfMonthWeekDay; i > 0; i--) {
      const date = new Date(firstDayOfMonth)
      // This is to set the hour without timezone. If we set (0,0,0,0), it will consider as the day before, so we have to set (0,0,1,0)
      // - could be any time in the day
      date.setUTCHours(0, 0, 1, 0)
      const day = new Date(date.setUTCDate(-i + 1))
      monthDaysArray.push(day)
    }

    // Then we get the days of the current month and push it to the array
    for (let i = 1; i < lastDayOfMonthDay + 1; i++) {
      const date = new Date(firstDayOfMonth)
      date.setUTCHours(0, 0, 1, 0)
      const day = new Date(date.setUTCDate(i))
      monthDaysArray.push(day)
    }

    // And lastly we get the last week day of the last day of the month and use it to get the first days of the next month and push it to the array
    const lastDayOfMonthWeekDay = lastDayOfMonth.getDay()
    for (let i = 1; i < 6 - lastDayOfMonthWeekDay + 1; i++) {
      const date = new Date(firstDayOfMonth)
      date.setUTCHours(0, 0, 1, 0)
      const day = new Date(date.setUTCDate(lastDayOfMonthDay + i))
      monthDaysArray.push(day)
    }

    return monthDaysArray
  }

  // The current days of the month + days of the last and next months when the first or last day of the month are not in the start of end of the week
  const [currentMonthDaysArray, setCurrentMonthDaysArray] = useState(
    createMonthDaysArray()
  )

  const ArrowIcon = ({ style }) => {
    return (
      <Image
        source={Images.arrowButtonIconBlue}
        style={[styles.arrowButtonStyle, style]}
      />
    )
  }

  const setNextMonth = () => {
    if (currentMonth === 11 && maxMonth > 0) {
      setCurrentMonth(0)
      setCurrentYear(currentYear + 1)
    } else if (currentMonth + 1 < maxMonth) {
      setCurrentMonth(currentMonth + 1)
    }
  }

  const setPreviousMonth = () => {
    if (currentMonth === 0 && initialMonth < 11) {
      setCurrentMonth(11)
      setCurrentYear(currentYear - 1)
    } else if (currentMonth > initialMonth) {
      setCurrentMonth(currentMonth - 1)
    }
  }

  // We set the month days to be displayed when the current month changes
  useEffect(() => {
    setCurrentMonthDaysArray(createMonthDaysArray())
  }, [currentMonth])

  // Renders the month navigation - Month name + navigation arrows
  const renderMonthsNavigation = () => {
    return (
      <View style={styles.monthsNavigationContainer}>
        <TouchableOpacity onPress={() => setPreviousMonth()}>
          <ArrowIcon style={{ marginRight: 18 }} />
        </TouchableOpacity>
        <Text style={styles.monthsNavigationTextStyle}>
          {getMonthName(currentMonth)} {currentYear}
        </Text>
        <TouchableOpacity onPress={() => setNextMonth()}>
          <ArrowIcon
            style={{ marginLeft: 18, transform: [{ rotate: '180deg' }] }}
          />
        </TouchableOpacity>
      </View>
    )
  }

  // Renders the week days labels
  const renderWeekDays = () => {
    return (
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        {weekDays.map((weekDay, index) => {
          return (
            <View key={index} style={{ width: '14%' }}>
              <Text style={styles.weekDaysTextStyle}>
                {weekDay.abbreviation}
              </Text>
            </View>
          )
        })}
      </View>
    )
  }

  // Renders the days displayed in the calendar for the selected month
  const renderDays = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          flexWrap: 'wrap'
        }}
      >
        {currentMonthDaysArray.map((day, index) => {
          const isDayInCurrentMonth = checkDateInSelectedMonth(
            day,
            currentMonth
          )
          const isDayScheduled = scheduledDates.find(scheduledDate =>
            isInSameDay(scheduledDate.date, day)
          )
          return (
            <View
              key={index}
              style={[
                { width: '14%', paddingVertical: 8 },
                isDayScheduled && styles.scheduledDayContainerStyle
              ]}
            >
              <Text
                style={[
                  { textAlign: 'center' },
                  isDayInCurrentMonth
                    ? styles.daysCurrentMonthTextStyle
                    : styles.daysNotCurrentMonthTextStyle
                ]}
              >
                {getDateDay(day)}
              </Text>
            </View>
          )
        })}
      </View>
    )
  }

  return (
    <>
      <BasicCard>
        <View>{renderMonthsNavigation()}</View>
        <View style={{ marginBottom: 16 }}>{renderWeekDays()}</View>
        <View style={styles.divisionLineStyle} />
        <View>{renderDays()}</View>
      </BasicCard>
    </>
  )
}
