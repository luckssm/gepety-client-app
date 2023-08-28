import { useEffect, useState } from 'react'
import { StyleSheet, View, ScrollView, Text, Image } from 'react-native'
import { Stack, useRouter } from 'expo-router'
import { useSelector, useDispatch } from 'react-redux'

import Colors from '../../../src/themes/colors'
import Images from '../../../src/themes/images'

import API from '../../../src/services/api/index'
import { openWhatsapp } from '../../../src/services/helpers/generalHelpers'
import { selectUserInformations } from '../../../src/redux/slices/userReducer'
import {
  getPetshop,
  getPetNameInPetshop,
  getScheduledTitle
} from '../../../src/services/helpers/servicesHelpers'
import { centsToText } from '../../../src/services/helpers/money'

import CustomHeader from '../../../src/components/CustomHeader'
import ArrowBackSubHeader from '../../../src/components/ArrowBackSubHeader'
import Skeleton from '../../../src/components/Skeleton'
import RoundedPrimaryButton from '../../../src/components/Buttons/RoundedPrimaryButton'
import InformationsCard from '../../../src/components/Cards/InformationsCard'
import CheckboxInput from '../../../src/components/Inputs/CheckboxInput'

const styles = StyleSheet.create({
  pageContainer: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    backgroundColor: Colors.lighterBlue
  },
  scrollViewContainerStyle: {
    paddingVertical: 24,
    paddingHorizontal: 32,
    width: '100%'
  },
  whatsappIconStyle: {
    height: 16,
    width: 16
  },
  divisionLineStyle: {
    backgroundColor: Colors.lightGray,
    height: 1,
    marginBottom: 16
  },
  emptyItemsTextStyle: {
    color: Colors.darkBlue,
    fontSize: 16,
    textAlign: 'center'
  }
})

export default function ServicesHistory () {
  const router = useRouter()
  const userData = useSelector(selectUserInformations)

  // Flags if the API call to get the scheduled services list is running
  const [isServicesHistoryLoading, setIsServicesHistoryLoading] = useState(
    false
  )

  // The list of the services history, already transformed to fit InformationsCard component
  const [servicesHistoryList, setServicesHistoryList] = useState([])

  // Controls the previous services filter
  const [showPreviousServicesFilter, setShowPreviousServicesFilter] = useState(
    true
  )

  // Controls the next services filter
  const [showNextServicesFilter, setShowNextServicesFilter] = useState(true)

  // Transforms a scheduled service into a object we can use to display information in the InformationsCard component
  const transformServicesHistoryObject = servicesHistory => {
    let transformedArray = []
    servicesHistory.forEach(serviceHistory => {
      const petshop = getPetshop(userData, serviceHistory.petshopId)
      const petshopName = petshop?.petshopInfo?.name
      const petshopNumber = petshop?.petshopInfo?.phoneNumber
      const petName = getPetNameInPetshop(serviceHistory.petId, petshop)

      transformedArray.push({
        id: serviceHistory.id,
        title: getScheduledTitle(
          serviceHistory.selectedDay,
          serviceHistory.startTime,
          serviceHistory.endTime
        ),
        selectedDay: serviceHistory.selectedDay,
        itemsList: [
          { label: 'Pet', content: petName ? petName : 'Nome não encontrado.' },
          {
            label: 'Serviço',
            content: (
              <Text>
                {serviceHistory.serviceName}
                {serviceHistory.deliveryValue !== null && (
                  <Text style={{ fontWeight: '600' }}> com leva e traz</Text>
                )}
                .
              </Text>
            )
          },
          {
            label: 'Observações do Serviço',
            content: serviceHistory.notes
              ? serviceHistory.notes
              : 'Sem observações.',
            showOnlyWhenExpanded: true
          },
          {
            label: 'Petshop',
            content: petshopName ? petshopName : 'Nome não encontrado.',
            actionText: `(${petshopNumber})`,
            actionTextOnPress: () =>
              openWhatsapp({ phone: petshopNumber, phoneCountryCode: '+55' }),
            icon: <WhatsappIcon />,
            showOnlyWhenExpanded: true
          },
          {
            label: 'Valor Total',
            content: centsToText(
              serviceHistory.totalValue ? serviceHistory.totalValue : 0
            )
          },
          serviceHistory?.cancellationMessage && {
            label: 'Atendimento Cancelado',
            content: `"${serviceHistory?.cancellationMessage}"`
          }
        ]
      })
    })

    return transformedArray
  }

  // Gets the services history from API when page is loaded
  useEffect(() => {
    const queryString = `allServices=true`
    const getServicesHistory = async () =>
      API.getScheduledServicesList(queryString)
        .then(res => {
          if (res.data) {
            const transformedServices = transformServicesHistoryObject(res.data)
            setServicesHistoryList(transformedServices)
          }
        })
        .finally(() => setIsServicesHistoryLoading(false))

    setIsServicesHistoryLoading(true)
    getServicesHistory()
  }, [])

  // Calculates if there is any scheduled services
  const hasServicesHistory = servicesHistoryList.length > 0

  // Checks if the service history should be showed depending on the selected filter
  const checkIfShouldShowServiceHistory = serviceHistory => {
    if (showPreviousServicesFilter && showNextServicesFilter) {
      return true
    }

    const today = new Date()
    today.setUTCHours(0, 0, 0, 0)

    const selectedDayDate = new Date(serviceHistory.selectedDay)
    selectedDayDate.setUTCHours(0, 0, 1, 0)

    if (
      showPreviousServicesFilter &&
      today.getTime() >= selectedDayDate.getTime()
    ) {
      return true
    }

    if (showNextServicesFilter && today.getTime() < selectedDayDate.getTime()) {
      return true
    }

    return false
  }

  // Gets the amount of services in the specified filter (previous or next)
  const getServicesHistoryAmountInFilter = filter => {
    const today = new Date()
    today.setUTCHours(0, 0, 0, 0)

    const todayTime = today.getTime()

    if (filter === 'previous') {
      const filteredServices = servicesHistoryList.filter(serviceHistory => {
        const selectedDayDate = new Date(serviceHistory.selectedDay)
        selectedDayDate.setUTCHours(0, 0, 1, 0)
        if (todayTime >= selectedDayDate.getTime()) {
          return true
        }
      })
      return filteredServices.length
    } else {
      const filteredServices = servicesHistoryList.filter(serviceHistory => {
        const selectedDayDate = new Date(serviceHistory.selectedDay)
        selectedDayDate.setUTCHours(0, 0, 1, 0)
        if (todayTime < selectedDayDate.getTime()) {
          return true
        }
      })
      return filteredServices.length
    }
  }

  // The amount of services to be showed in the filters labels
  const previousServicesHistoryAmount = getServicesHistoryAmountInFilter(
    'previous'
  )
  const nextServicesHistoryAmount = getServicesHistoryAmountInFilter('next')

  // checks if there is any service history to show based on the selected filters
  const hasServicesHistoryToShow = () => {
    const previousServicesShowedAmount = showPreviousServicesFilter
      ? previousServicesHistoryAmount
      : 0
    const nextServicesShowedAmount = showNextServicesFilter
      ? nextServicesHistoryAmount
      : 0
    const totalServicesShowedAmount =
      previousServicesShowedAmount + nextServicesShowedAmount
    if (totalServicesShowedAmount > 0) {
      return true
    }
    return false
  }

  const WhatsappIcon = ({ style }) => {
    return (
      <Image
        source={Images.whatsappIconGreen}
        style={[styles.whatsappIconStyle, style]}
      />
    )
  }

  // Renders all the appointment cards of the client's scheduled services
  const renderServicesHistoryCards = () => {
    return servicesHistoryList.map((serviceHistory, index) => {
      const showServiceHistory = checkIfShouldShowServiceHistory(serviceHistory)
      return (
        showServiceHistory && (
          <View key={index} style={{ marginBottom: 16 }}>
            <InformationsCard
              titleText={serviceHistory.title}
              itemsList={serviceHistory.itemsList}
              actionButtonText={serviceHistory.actionButtonText}
              actionButtonOnPress={serviceHistory.actionButtonOnPress}
              hasExpansion={true}
            />
          </View>
        )
      )
    })
  }

  const renderSkeleton = () => {
    return (
      <>
        <Skeleton
          style={{
            width: '100%',
            height: 32,
            borderRadius: 24,
            marginBottom: 12
          }}
        />
        <Skeleton
          style={{
            width: '100%',
            height: 48,
            borderRadius: 24,
            marginBottom: 24
          }}
        />
        <Skeleton
          style={{
            width: '100%',
            height: 128,
            borderRadius: 16,
            marginBottom: 24
          }}
        />
        <Skeleton
          style={{
            width: '100%',
            height: 128,
            borderRadius: 16,
            marginBottom: 24
          }}
        />
        <Skeleton
          style={{
            width: '100%',
            height: 128,
            borderRadius: 16,
            marginBottom: 24
          }}
        />
      </>
    )
  }

  return (
    <>
      <Stack.Screen
        options={{
          header: props => <CustomHeader />
        }}
      />
      <View style={styles.pageContainer}>
        <ScrollView contentContainerStyle={styles.scrollViewContainerStyle}>
          <View style={{ marginBottom: 24 }}>
            <ArrowBackSubHeader
              goBack={() => router.back()}
              titleText={'Histórico de Serviços'}
            />
          </View>
          {isServicesHistoryLoading ? (
            renderSkeleton()
          ) : (
            <>
              <View style={{ marginBottom: 16 }}>
                <Text
                  style={{
                    color: Colors.darkBlue,
                    fontSize: 18,
                    textAlign: 'center'
                  }}
                >
                  Clique em um serviço para expandir e ver os detalhes.
                </Text>
              </View>
              <View style={styles.divisionLineStyle} />

              {hasServicesHistory ? (
                <>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginBottom: 24
                    }}
                  >
                    <CheckboxInput
                      isSelected={showPreviousServicesFilter}
                      setSelected={() =>
                        setShowPreviousServicesFilter(
                          !showPreviousServicesFilter
                        )
                      }
                      label={`Passados (${previousServicesHistoryAmount})`}
                      labelTextStyle={{ color: Colors.darkBlue }}
                    />
                    <CheckboxInput
                      isSelected={showNextServicesFilter}
                      setSelected={() =>
                        setShowNextServicesFilter(!showNextServicesFilter)
                      }
                      label={`Próximos (${nextServicesHistoryAmount})`}
                      labelTextStyle={{ color: Colors.darkBlue }}
                    />
                  </View>
                  {!hasServicesHistoryToShow() && (
                    <>
                      <Text style={styles.emptyItemsTextStyle}>
                        Sem serviços para serem exibidos com os filtros
                        selecionados.
                      </Text>
                    </>
                  )}
                  {renderServicesHistoryCards()}
                </>
              ) : (
                <>
                  <View style={{ marginBottom: 24 }}>
                    <Text style={styles.emptyItemsTextStyle}>
                      Você não tem atendimentos.
                    </Text>
                  </View>

                  <View
                    style={{ marginBottom: 12, marginTop: 8, width: '100%' }}
                  >
                    <RoundedPrimaryButton
                      onPress={() => router.push('/services/schedule')}
                      buttonText={'Agendar um Atendimento'}
                    />
                  </View>
                </>
              )}
            </>
          )}
        </ScrollView>
      </View>
    </>
  )
}
