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
  getScheduledTitle,
  getPetshopAddressString
} from '../../../src/services/helpers/servicesHelpers'

import CustomHeader from '../../../src/components/CustomHeader'
import ArrowBackSubHeader from '../../../src/components/ArrowBackSubHeader'
import Skeleton from '../../../src/components/Skeleton'
import RoundedPrimaryButton from '../../../src/components/Buttons/RoundedPrimaryButton'
import Calendar from '../../../src/components/Calendar'
import InformationsCard from '../../../src/components/Cards/InformationsCard'
import AddressRouteSelectionModal from '../../../src/components/Modals/AddressRouteSelectionModal'

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
  }
})

export default function Appointments () {
  const router = useRouter()
  const userData = useSelector(selectUserInformations)

  // Flags if the API call to get the scheduled services list is running
  const [isScheduledServicesLoading, setIsScheduledServicesLoading] = useState(
    false
  )

  // The list of the next scheduled services, already transformed to fit InformationsCard component
  const [nextScheduledServices, setNextScheduledServices] = useState([])

  // Only the dates of the scheduled services, to show the highlighted day on the calendar
  const [scheduledDates, setScheduledDates] = useState([])

  // Controls whether the modal to select route calculation apps is displayed
  const [showRouteSelectionModal, setShowRouteSelectionModal] = useState(false)

  // The address selected by the client to calculate the route
  const [selectedRouteAddress, setSelectedRouteAddress] = useState('')

  // Returns the array with the scheduled dates of the services only, to show the highlighted day on the calendar
  const getScheduledDates = scheduledServices => {
    let dates = []
    scheduledServices.forEach(scheduledService => {
      dates.push({
        date: scheduledService.selectedDay,
        id: scheduledService.id
      })
    })
    return dates
  }

  // Transforms a scheduled service into a object we can use to display information in the InformationsCard component
  const transformScheduledServicesObject = scheduledServices => {
    let transformedArray = []
    scheduledServices.forEach(scheduledService => {
      const petshop = getPetshop(userData, scheduledService.petshopId)
      const petshopName = petshop?.petshopInfo?.name
      const petshopNumber = petshop?.petshopInfo?.phoneNumber
      const petshopAddress = getPetshopAddressString(
        petshop?.petshopInfo?.address
      )
      const petName = getPetNameInPetshop(scheduledService.petId, petshop)

      transformedArray.push({
        id: scheduledService.id,
        title: getScheduledTitle(
          scheduledService.selectedDay,
          scheduledService.startTime,
          scheduledService.endTime
        ),
        selectedDay: scheduledService.selectedDay,
        itemsList: [
          { label: 'Pet', content: petName ? petName : 'Nome não encontrado.' },
          {
            label: 'Serviço',
            content: (
              <Text>
                {scheduledService.serviceName}
                {scheduledService.deliveryValue !== null && (
                  <Text style={{ fontWeight: '600' }}> com leva e traz</Text>
                )}
                .
              </Text>
            )
          },
          {
            label: 'Petshop',
            content: petshopName ? petshopName : 'Nome não encontrado.',
            actionText: `(${petshopNumber})`,
            actionTextOnPress: () =>
              openWhatsapp({ phone: petshopNumber, phoneCountryCode: '+55' }),
            icon: <WhatsappIcon />
          },
          {
            label: 'Endereço',
            content: petshopAddress,
            actionText: petshopAddress && 'Clique aqui para calcular rota',
            actionTextOnPress: () => {
              setSelectedRouteAddress(petshopAddress)
              setShowRouteSelectionModal(true)
            }
          },
          scheduledService?.cancellationMessage && {
            label: 'Atendimento Cancelado',
            content: `"${scheduledService?.cancellationMessage}"`
          }
        ]
      })
    })

    return transformedArray
  }

  // Gets the scheduled services from API when page is loaded
  useEffect(() => {
    const getScheduledServices = async () =>
      API.getScheduledServicesList()
        .then(res => {
          if (res.data) {
            const transformedServices = transformScheduledServicesObject(
              res.data
            )
            setNextScheduledServices(transformedServices)
            const servicesDates = getScheduledDates(transformedServices)
            setScheduledDates(servicesDates)
          }
        })
        .finally(() => setIsScheduledServicesLoading(false))

    setIsScheduledServicesLoading(true)
    getScheduledServices()
  }, [])

  // Calculates if there is any scheduled services
  const hasScheduledServices = nextScheduledServices.length > 0

  const WhatsappIcon = ({ style }) => {
    return (
      <Image
        source={Images.whatsappIconGreen}
        style={[styles.whatsappIconStyle, style]}
      />
    )
  }

  const renderSkeleton = () => {
    return (
      <>
        <Skeleton
          style={{
            width: '100%',
            height: 256,
            borderRadius: 24,
            marginBottom: 24
          }}
        />
        <Skeleton
          style={{
            width: '100%',
            height: 180,
            borderRadius: 24,
            marginBottom: 24
          }}
        />
        <Skeleton
          style={{
            width: '100%',
            height: 180,
            borderRadius: 16,
            marginBottom: 24
          }}
        />
      </>
    )
  }

  // Renders all the appointment cards of the client's scheduled services
  const renderAppointmentCards = () => {
    return nextScheduledServices.map((scheduledService, index) => {
      return (
        <View key={index} style={{ marginBottom: 16 }}>
          <InformationsCard
            titleText={scheduledService.title}
            itemsList={scheduledService.itemsList}
            actionButtonText={scheduledService.actionButtonText}
            actionButtonOnPress={scheduledService.actionButtonOnPress}
          />
        </View>
      )
    })
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
          <View style={{ marginBottom: 36 }}>
            <ArrowBackSubHeader
              goBack={() => router.back()}
              titleText={'Próximos Atendimentos'}
            />
          </View>
          {isScheduledServicesLoading ? (
            renderSkeleton()
          ) : (
            <>
              <View style={{ marginBottom: 24 }}>
                <Calendar scheduledDates={scheduledDates} />
              </View>
              {hasScheduledServices ? (
                renderAppointmentCards()
              ) : (
                <>
                  <View style={{ marginBottom: 24 }}>
                    <Text
                      style={{
                        color: Colors.darkBlue,
                        fontSize: 16,
                        textAlign: 'center'
                      }}
                    >
                      Você não tem atendimentos agendados.
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
        <AddressRouteSelectionModal
          isVisible={showRouteSelectionModal}
          setIsVisible={setShowRouteSelectionModal}
          closeModalAction={() => setShowRouteSelectionModal(false)}
          address={selectedRouteAddress}
        />
      </View>
    </>
  )
}
