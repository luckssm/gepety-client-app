import { useEffect, useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native'

import Colors from '../themes/colors'
import Images from '../themes/images'

import AppConfig from '../config/appConfig'
import {
  createNextWeeks,
  getWeekDayName,
  convertDateToString
} from '../services/helpers/dateAndTimeHelpers'
import { groupPeriodsByField } from '../services/helpers/servicesHelpers'

import BasicCard from './Cards/BasicCard'

const styles = StyleSheet.create({
  weeksNavigationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24
  },
  weeksNavigationTextStyle: {
    fontSize: 16,
    color: Colors.lightBlack
  },
  periodSelectionInformationTextStyle: {
    fontSize: 16,
    color: Colors.darkBlue,
    textAlign: 'center'
  },
  singleDayCardWeekDayStyle: {
    color: Colors.lightBlack,
    fontSize: 18
  },
  dayAvailablePeriodsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 6,
    paddingTop: 8
  },
  availablePeriodButtonContainer: {
    paddingVertical: 4,
    paddingHorizontal: 14,
    marginRight: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.mediumOrange,
    marginBottom: 16
  },
  arrowButtonStyle: {
    width: 26,
    height: 26
  }
})

export default function SelectServicePeriod ({
  style,
  availablePeriods,
  selectedPeriod,
  setSelectedPeriod,
  isEditPeriod
}) {
  const maxNumberOfWeeks = AppConfig.maxNumberOfScheduleWeeks

  // All the weeks from the current day untill maxNumberOfWeeks
  const [weeks, setWeeks] = useState(
    createNextWeeks(new Date(), maxNumberOfWeeks)
  )

  // Calculates the current week, which can be different than 0, if we have a period in another week and we want to edit its selection
  const calculateCurrentWeek = () => {
    // If it is the period first addition, will always be the first week
    if (!isEditPeriod) {
      return 0
    }

    // If for some reason we don't have the period or the selectedDay of the period, we render the first week
    if (!selectedPeriod || !selectedPeriod.selectedDay) {
      return 0
    }

    // If it is a edition of period and we have the selectedDay, we find the week where the period is for the first render
    const period = new Date(selectedPeriod.selectedDay)
    const periodTime = period.getTime()
    let foundWeekIndex = 0
    weeks.forEach((week, index) => {
      const startOfWeek = new Date(week.startOfWeekFull)
      const endOfWeek = new Date(week.endOfWeekFull)
      if (
        startOfWeek.getTime() <= periodTime &&
        endOfWeek.getTime() >= periodTime
      ) {
        foundWeekIndex = index
      }
    })
    return foundWeekIndex
  }

  // The current week displayed to the user
  const [currentWeek, setCurrentWeek] = useState(calculateCurrentWeek())

  const setNextWeek = () => {
    if (currentWeek < maxNumberOfWeeks - 1) {
      setCurrentWeek(currentWeek + 1)
    }
  }

  const setPreviousWeek = () => {
    if (currentWeek > 0) {
      setCurrentWeek(currentWeek - 1)
    }
  }

  const ArrowIcon = ({ style }) => {
    return (
      <Image
        source={Images.arrowButtonIconBlue}
        style={[styles.arrowButtonStyle, style]}
      />
    )
  }

  // Renders the current week and allows the user to navigate through all of the created weeks
  const renderWeeksNavigation = () => {
    return (
      <View style={styles.weeksNavigationContainer}>
        <TouchableOpacity onPress={() => setPreviousWeek()}>
          <ArrowIcon style={{ marginRight: 16 }} />
        </TouchableOpacity>
        <Text style={styles.weeksNavigationTextStyle}>
          Semana {weeks[currentWeek].startOfWeek} -{' '}
          {weeks[currentWeek].endOfWeek}
        </Text>
        <TouchableOpacity onPress={() => setNextWeek()}>
          <ArrowIcon
            style={{ marginLeft: 16, transform: [{ rotate: '180deg' }] }}
          />
        </TouchableOpacity>
      </View>
    )
  }

  // Returns the available periods of the current week displayed to the user
  const filterPeriodsForTheWeek = () => {
    const startOfWeekDay = new Date(weeks[currentWeek].startOfWeekFull)
    const startOfWeekDayTime = startOfWeekDay.getTime()
    const endOfWeekDay = new Date(weeks[currentWeek].endOfWeekFull)
    const endOfWeekDayTime = endOfWeekDay.getTime()

    const filteredPeriods = availablePeriods.filter(availablePeriod => {
      const selectedDay = new Date(availablePeriod.selectedDay)
      const selectedDayTime = selectedDay.getTime()
      return (
        selectedDayTime >= startOfWeekDayTime &&
        selectedDayTime <= endOfWeekDayTime
      )
    })

    return filteredPeriods
  }

  // Group the periods of the current week by day
  const groupCurrentWeekPeriodsByDay = () => {
    const weekPeriods = filterPeriodsForTheWeek()
    // Function to check more than one schedule available at the same time
    const scheduleAlreadyExists = (schedules, schedule) =>
      schedules.some(
        item =>
          item.selectedDay === schedule.selectedDay &&
          item.periodStart === schedule.periodStart
      )

    // returns the times without repetition
    const uniqueScheduleTimes = weekPeriods.filter((schedule, index, self) => {
      return !scheduleAlreadyExists(self.slice(index + 1), schedule)
    })

    const groupedPeriods = groupPeriodsByField(uniqueScheduleTimes, 'weekDay')

    // helper function to sort the groupedPeriods
    const compareArraysWeekDay = (arr1, arr2) => {
      if (arr1[0].weekDay < arr2[0].weekDay) {
        return -1
      }
      if (arr1[0].weekDay > arr2[0].weekDay) {
        return 1
      }
      return 0
    }
    // once you have an array composed of arrays grouped by weekDay
    // sort arrays based on weekDay to ensure they are displayed in the correct order
    return groupedPeriods.sort(compareArraysWeekDay)
  }

  // All the periods of the current displayed week grouped by day
  const [currentWeekPeriodsByDay, setCurrentWeekPeriodsByDay] = useState(
    groupCurrentWeekPeriodsByDay()
  )

  // Every time the current week changes, we have to group the periods of the new week by day to show to the user
  useEffect(() => {
    const groupedWeekPeriodsByDay = groupCurrentWeekPeriodsByDay()
    setCurrentWeekPeriodsByDay(groupedWeekPeriodsByDay)
  }, [currentWeek])

  // Renders the single available period container, allowing the user to select it
  const renderAvailablePeriod = dayPeriod => {
    const isPeriodSelected =
      selectedPeriod.selectedDay === dayPeriod.selectedDay &&
      selectedPeriod.periodStart === dayPeriod.periodStart &&
      selectedPeriod.workerId === dayPeriod.workerId
    return (
      <TouchableOpacity
        onPress={() => setSelectedPeriod(dayPeriod)}
        style={[
          styles.availablePeriodButtonContainer,
          isPeriodSelected && { backgroundColor: Colors.mediumOrange }
        ]}
      >
        <Text>{dayPeriod.periodStart}</Text>
      </TouchableOpacity>
    )
  }

  // Renders the card of a single day. We will show only the days which have available periods
  const renderSingleDayCard = dayPeriods => {
    const weekDay = dayPeriods[0].weekDay
    const weekDayName = getWeekDayName(weekDay)
    const weekDayDate = new Date(dayPeriods[0].selectedDay)
    const weekDayDisplayDate = convertDateToString(weekDayDate, 'DD/MM')

    const orderedDayPeriods = dayPeriods.sort((a, b) => {
      return a.periodStart < b.periodStart
        ? -1
        : a.periodStart > b.periodStart
        ? 1
        : 0
    })

    return (
      <BasicCard>
        <View style={{ marginBottom: 8 }}>
          <Text style={styles.singleDayCardWeekDayStyle}>
            {weekDayName} - {weekDayDisplayDate}
          </Text>
        </View>
        <View style={styles.dayAvailablePeriodsContainer}>
          {orderedDayPeriods.map((dayPeriod, index) => {
            return <View key={index}>{renderAvailablePeriod(dayPeriod)}</View>
          })}
        </View>
      </BasicCard>
    )
  }

  // Renders all the cards of the days with available periods in the current week
  const renderDayCards = () => {
    return currentWeekPeriodsByDay.map((dayPeriods, index) => {
      return (
        <View style={{ marginBottom: 22 }} key={index}>
          {renderSingleDayCard(dayPeriods)}
        </View>
      )
    })
  }

  return (
    <View>
      <View>{renderWeeksNavigation()}</View>
      <View style={{ marginBottom: 24 }}>
        <Text style={styles.periodSelectionInformationTextStyle}>
          {currentWeekPeriodsByDay && currentWeekPeriodsByDay.length === 0
            ? 'Sem horários disponíveis nessa semana para o serviço selecionado.\n\nTente nas próximas semanas ou nas anteriores, ou mude o serviço.\n\nSe necessário, contate o petshop!'
            : 'Clique em um horário para selecionar'}
        </Text>
      </View>
      <View>{renderDayCards()}</View>
    </View>
  )
}
