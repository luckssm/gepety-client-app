import { useEffect, useState } from 'react'
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  Platform,
  KeyboardAvoidingView
} from 'react-native'
import { Stack, useRouter } from 'expo-router'
import { useSelector, useDispatch } from 'react-redux'

import Colors from '../../../src/themes/colors'

import {
  selectServiceCheckoutInformation,
  setServiceScheduledInformation
} from '../../../src/redux/slices/servicesReducer'
import { selectUserInformations } from '../../../src/redux/slices/userReducer'
import API from '../../../src/services/api/index'
import {
  getWeekDayName,
  convertDateToString
} from '../../../src/services/helpers/dateAndTimeHelpers'
import { centsToText } from '../../../src/services/helpers/money'
import {
  cpfValidator,
  normalizeCPF,
  clearCpfFormatation
} from '../../../src/services/helpers/userHelpers'

import CustomHeader from '../../../src/components/CustomHeader'
import ArrowBackSubHeader from '../../../src/components/ArrowBackSubHeader'
import AddItemsCard from '../../../src/components/Cards/AddItemsCard'
import SelectionInput from '../../../src/components/Inputs/SelectionInput'
import RoundedInput from '../../../src/components/Inputs/RoundedInput'
import RoundedSecondaryButton from '../../../src/components/Buttons/RoundedSecondaryButton'
import RadioInput from '../../../src/components/Inputs/RadioInput'
import Skeleton from '../../../src/components/Skeleton'
import BasicModal from '../../../src/components/Modals/BasicModal'
import SelectServicePeriod from '../../../src/components/SelectServicePeriod'
import RoundedPrimaryButton from '../../../src/components/Buttons/RoundedPrimaryButton'
import SimpleModal from '../../../src/components/Modals/SimpleModal'
import BasicCard from '../../../src/components/Cards/BasicCard'
import SelectionCard from '../../../src/components/Cards/SelectionCard'

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
  modalScrollViewContainerStyle: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    width: '100%'
  },
  addItemsCardContainer: {
    marginBottom: 16
  },
  labelContainer: {
    marginBottom: 8
  },
  labelStyle: {
    fontSize: 18,
    color: Colors.darkBlue
  },
  totalValueContainer: {
    marginBottom: 32,
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  totalValueTextStyle: {
    fontSize: 22,
    color: Colors.darkBlue,
    fontWeight: '600'
  },
  selectedPeriodContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 16
  },
  selectedPeriodTextStyle: {
    maxWidth: '70%',
    color: Colors.lightBlack
  },
  periodSelectionModalConfirmButtonStyle: {
    paddingHorizontal: 8,
    marginBottom: 12,
    marginTop: 8,
    width: '100%'
  }
})

export default function Checkout () {
  const router = useRouter()
  const dispatch = useDispatch()
  const scheduleServiceInfo = useSelector(selectServiceCheckoutInformation)
  const isIOS = Platform.OS === 'ios'

  // Flags if the API call to get the bundlle list is running
  const [isBundleLoading, setIsBundleLoading] = useState(false)
  // A list for select bundles. Made with the response of the API call
  const [bundleSelectionList, setBundleSelectionList] = useState([])
  // The selected bundle object from the bundleSelectionList. Has only the selection value (bundle id)
  const [selectedBundle, setSelectedBundle] = useState('')
  // Full information of the selectedBundle
  const [selectedBundleFullInfo, setSelectedBundleFullInfo] = useState({})

  // Checks if client is using credits
  const hasCredits =
    scheduleServiceInfo.clientServiceBundleId && scheduleServiceInfo.credits

  // Gets the amount of service credits the user has
  const creditServiceAmount =
    hasCredits &&
    scheduleServiceInfo.credits.serviceAmount -
      scheduleServiceInfo.credits.scheduledClientServices.length

  // Checks if user has delivery in his credits
  const hasCreditDelivery =
    hasCredits &&
    scheduleServiceInfo.credits.scheduledClientServices[0].deliveryValue > 0

  // Responsible for getting the bundle list from backend
  useEffect(() => {
    const petshopId = scheduleServiceInfo.petshopId

    const getPetshopBundles = async () =>
      API.getPetshopBundlesList(petshopId)
        .then(res => {
          if (res.data) {
            let bundleSelectionArrayList = []
            // sets each bundle in the most convenient form for us
            res.data.forEach(bundle => {
              bundleSelectionArrayList.push({
                value: bundle.id,
                label: `${bundle.serviceAmount} serviços`,
                serviceAmount: bundle.serviceAmount,
                discountPercentage: bundle.discountPercentage,
                maxInstallments: bundle.maxInstallments
              })
            })
            setBundleSelectionList(bundleSelectionArrayList)
          }
        })
        .finally(() => setIsBundleLoading(false))

    // Only gets bundles if it is not using credits, otherwise there is no need for getting this information
    if (!hasCredits) {
      setIsBundleLoading(true)
      getPetshopBundles()
    }
  }, [])

  // Flags if the API call to get the petshop configuration is running
  const [
    isPetshopConfigurationLoading,
    setIsPetshopConfigurationLoading
  ] = useState(false)
  // THe petshop configuration info
  const [petshopConfiguration, setPetshopConfiguration] = useState({})

  // Responsible for getting the petshop configuration from backend. We could get this in other screen, but for now this
  // screen looked like the most suited one to get the updated config info before making a schedule
  useEffect(() => {
    const petshopId = scheduleServiceInfo.petshopId

    const getPetshopConfigurationInfo = async () =>
      API.getPetshopConfiguration(petshopId)
        .then(res => {
          if (res.data) {
            setPetshopConfiguration(res.data)
          }
        })
        .finally(() => setIsPetshopConfigurationLoading(false))

    // Only gets petshop configuration if it is not using credits, otherwise there is no need for getting this information
    if (!hasCredits) {
      setIsPetshopConfigurationLoading(true)
      getPetshopConfigurationInfo()
    }
  }, [])

  // Responsible for setting full information of the selected bundle
  useEffect(() => {
    // If we have a bundle, we must find it and set its full object
    if (selectedBundle) {
      selectedBundleInfo = bundleSelectionList.find(
        bundle => bundle.value === selectedBundle
      )
      // If we change from a bundle with more items to a bundle with less, we have to clear the surplus (extra) selectedPeriods
      if (selectedBundleInfo.serviceAmount < selectedPeriods.length) {
        const periods = [...selectedPeriods]
        const leftPeriods = periods.slice(0, selectedBundleInfo.serviceAmount)
        setSelectedPeriods(leftPeriods)
      }
      setSelectedBundleFullInfo(selectedBundleInfo)
      // If we don't have a bundle, we must empty the bundle full info and the selectedPeriods, if we had more than one
    } else {
      const periods = [...selectedPeriods]
      setSelectedPeriods([periods[0]])
      setSelectedBundleFullInfo({})
    }
  }, [selectedBundle])

  const userData = useSelector(selectUserInformations)

  const userSelectedPetshop =
    userData &&
    userData.user &&
    userData.user.petshops &&
    userData.user.petshops.find(
      petshop => petshop.petshopInfo.id === scheduleServiceInfo.petshopId
    )

  const userHasCpf = userData?.user?.cpf
  const [userCpf, setUserCpf] = useState(userData?.user?.cpf)
  const [userCpfMaskedInput, setUserCpfMaskedInput] = useState(
    userData?.user?.cpf
  )

  // Formats the cpf to a masked format
  useEffect(() => {
    setUserCpfMaskedInput(normalizeCPF(userCpf))
  }, [userCpf])

  // The full object of a client address registered at the selected petshop
  const userAddressObjectAtSelectedPetshop =
    userSelectedPetshop && userSelectedPetshop.clientAddress

  // Returns the client address in a string format to be displayed for user.
  const getClientAddressForDeliveryString = () => {
    if (userAddressObjectAtSelectedPetshop) {
      const address = userAddressObjectAtSelectedPetshop
      let fullAddress = `${address.street}, ${address.streetNumber}, `
      if (address.complement && address.complement !== '') {
        fullAddress += `${address.complement}, `
      }
      fullAddress += `${address.city}, ${address.uf}`
      return fullAddress
    } else {
      return 'Endereço não cadastrado, portanto não será possível contratar o leva e traz.\n\nSe desejar, contate o petshop para habilitar este serviço.'
    }
  }

  const deliveryAddress = getClientAddressForDeliveryString()

  // The delivery value registered for the client at the selected petshop
  const serviceDeliveryValue =
    userAddressObjectAtSelectedPetshop &&
    userAddressObjectAtSelectedPetshop.deliveryValue
      ? userAddressObjectAtSelectedPetshop.deliveryValue
      : 0

  // Calculates the sum of the selected services values
  const getSelectedServicesValue = () => {
    const selectedServices = scheduleServiceInfo.selectedServices
    const selectedPetBodySize = scheduleServiceInfo.selectedPetFullInfo.bodySize
    const selectedPetFurSize = scheduleServiceInfo.selectedPetFullInfo.furSize

    let totalServicesValue = 0
    // We have to find the desired value based on bodySize and furSize
    if (!scheduleServiceInfo.clientServiceBundleId) {
      selectedServices.forEach(selectedService => {
        const selectedValue = selectedService.serviceValues.find(
          serviceValue =>
            serviceValue.bodySize === selectedPetBodySize &&
            serviceValue.furSize === selectedPetFurSize
        )
        if (selectedValue) {
          totalServicesValue += selectedValue.value
        }
      })
    }

    return totalServicesValue
  }

  const selectedServicesValue = getSelectedServicesValue()

  // The client can add notes to the scheduled service, if needed
  const [notes, setNotes] = useState('')

  // Selects the desired payment method
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(
    hasCredits ? 'BundleCredits' : ''
  )

  // States whether client whants delivery or not
  const [deliveryOption, setDeliveryOption] = useState(false)

  // The total value of the purchase
  const [totalPurchaseValue, setTotalPurchaseValue] = useState(
    selectedServicesValue
  )

  // Calculates the total value of the purchase considering delivery, bundle and bundle discount.
  useEffect(() => {
    const delivery = deliveryOption ? serviceDeliveryValue : 0

    let servicesValue = selectedServicesValue
    // If we have a bundle, we must multiply the service amount with the value of the services and remove the discount
    // percentage of that bundle and finally add the delivery value
    if (selectedBundleFullInfo && selectedBundleFullInfo.serviceAmount) {
      const servicesAmountValue =
        selectedBundleFullInfo.serviceAmount * servicesValue
      servicesValue = Math.round(
        servicesAmountValue -
          (servicesAmountValue * selectedBundleFullInfo.discountPercentage) /
            100 +
          delivery * selectedBundleFullInfo.serviceAmount
      )

      // If we don't have a bundle, just add the delivery value to the services value
    } else {
      servicesValue = selectedServicesValue + delivery
    }
    setTotalPurchaseValue(servicesValue)
  }, [deliveryOption, selectedBundleFullInfo])

  // A list of the periods selected by the client
  const [selectedPeriods, setSelectedPeriods] = useState([
    scheduleServiceInfo.selectedPeriod
  ])

  // Gets the period information in string format to be displayed to the client at the selected periods section
  // The format is: "NameOfDayOfTheWeek - DD/MM - HH:MM até HH:MM"
  const getPeriodDisplay = period => {
    const periodDate = new Date(period.selectedDay)
    return `${getWeekDayName(period.weekDay)} - ${convertDateToString(
      periodDate,
      'DD/MM'
    )} - ${period.periodStart} até ${period.periodEnd}`
  }

  // Gets the period left to be added string. If we have N services and (N - p) selected periods, we must show to the client a
  // message with the amount of period services left for adding.
  const getLeftPeriodsSelectionString = (serviceAmount, periodsLength) => {
    const periodsLeft = serviceAmount - periodsLength
    let responseString
    if (periodsLeft > 1) {
      responseString = `Horários ${periodsLength +
        1} a ${serviceAmount} - Não definidos`
    } else {
      responseString = `Horário ${periodsLength + 1} - Não definido`
    }
    return responseString
  }

  // Sorts the period selection based on the date of selectedDay + periodStart
  // Obs: because our period list is supposed to be small, all these conversions will probably not cause any performance problems.
  // We must be careful though if this list is expanded greatly, or this function used in another list with many elements.
  const sortPeriods = periods => {
    const sortedPeriods = periods.sort((a, b) => {
      // slice the periodStart, which is in HH:MM format
      const bStart = b.periodStart.slice(':')
      // converts the periodStart in time to be added
      const bTimeToAdd =
        parseInt(bStart[0]) * 60 * 60 * 1000 + parseInt(bStart[1]) * 60 * 1000
      const bDate = new Date(b.selectedDay)
      // sets a new time with the time added
      const bTime = bDate.setTime(bDate.getTime() + bTimeToAdd)

      // same as the above
      const aStart = a.periodStart.slice(':')
      const aTimeToAdd =
        parseInt(aStart[0]) * 60 * 60 * 1000 + parseInt(aStart[1]) * 60 * 1000
      const aDate = new Date(a.selectedDay)
      const aTime = aDate.setTime(aDate.getTime() + aTimeToAdd)

      return aTime - bTime
    })

    return sortedPeriods
  }

  // Controls whether the period selection modal is displayed to the user
  const [showPeriodSelectionModal, setshowPeriodSelectionModal] = useState(
    false
  )

  // Has the information of the current selected period, when we want to open the period selection modal, or after we select a period in it
  const [selectedPeriod, setSelectedPeriod] = useState({})
  // Has the index of the selectedPeriod in the selectedPeriods array
  const [selectedPeriodIndex, setSelectedPeriodIndex] = useState(null)

  // Has all the available periods information
  const [availablePeriods, setAvailablePeriods] = useState([])
  // Controls the loading of available periods for a service request
  const [isAvailablePeriodsLoading, setIsAvailablePeriodsLoading] = useState(
    false
  )

  // Every time we render the period selection modal, we have to get the available services from the backend
  // TODO (in future): use this callback to check if all previously selected periods are still valid and available,
  // or if an update is needed. In the latter case, we may show a warning for client to change that period
  useEffect(() => {
    if (showPeriodSelectionModal) {
      setIsAvailablePeriodsLoading(true)
      const selectedPetInfo = scheduleServiceInfo.selectedPetFullInfo
      const petBodySize = selectedPetInfo.bodySize
      const petFurSize = selectedPetInfo.furSize

      const queryString = `serviceId=${encodeURIComponent(
        scheduleServiceInfo.selectedServices[0].id
      )}&petshopId=${encodeURIComponent(
        scheduleServiceInfo.petshopId
      )}&bodySize=${encodeURIComponent(
        petBodySize
      )}&furSize=${encodeURIComponent(petFurSize)}&considerAllWorkers=${true}`

      const getPetshopServiceAvailablePeriods = async () =>
        API.getPetshopAvailablePeriodsForService({ query: queryString })
          .then(res => {
            setAvailablePeriods(res.data)
          })
          .finally(() => setIsAvailablePeriodsLoading(false))
      getPetshopServiceAvailablePeriods()
    }
  }, [showPeriodSelectionModal])

  // When we are adding more than one period to the selected periods list, we have to remove from the selection the periods already
  // added by the client. We may show a selected period only if this is the one period the client is editing at the moment.
  const calculateAvailablePeriodsLeft = periods => {
    // If there is no bundle, we have only one service, so just return the original periods array
    if (!selectedBundle) {
      return periods
    }

    // If the client is editing a period, we want to show it to him. So we will remove it from our selection periods temp, which will
    // later be used as a filter to leave all of the client's selected periods out of the available periods list.
    const selectedPeriodsTemp = [...selectedPeriods]
    if (selectedPeriodIndex || selectedPeriodIndex === 0) {
      selectedPeriodsTemp.splice(selectedPeriodIndex, 1)
    }

    // Here we filter the periods, by removing all selectedPeriodsTemp
    const filteredPeriodsArray = periods.filter(el => {
      return selectedPeriodsTemp.every(f => {
        return (
          f.selectedDay !== el.selectedDay || f.periodStart !== el.periodStart
        )
      })
    })

    return filteredPeriodsArray
  }

  // Controls if the data loss modal confirmation should be showed to the client
  const [showDataLossModal, setShowDataLossModal] = useState(false)

  // Controls if the modal with the schedule confirmation should be showed to the client
  const [showProceedToScheduleModal, setShowProceedToScheduleModal] = useState(
    false
  )

  // Checks if a payment method was selected to continue the schedule process
  const handleProceedToSchedule = () => {
    if (!selectedPaymentMethod) {
      toast.hideAll()
      toast.show('Selecione um método de pagamento para prosseguir!', {
        type: 'error'
      })
      return
    }

    // CPF is needed to create a Pix code
    if (selectedPaymentMethod === 'Pix' && !userHasCpf) {
      const validCpf = cpfValidator(userCpf)
      if (!validCpf) {
        toast.hideAll()
        toast.show('Insira um CPF válido!', {
          type: 'error'
        })
        return
      }
    }
    setShowProceedToScheduleModal(true)
  }

  // Flags if the API call to schedule the services is running
  const [isScheduleLoading, setIsScheduleLoading] = useState(false)

  // Gets cleaned selected periods in the correct format to send to backend
  const getCleanedSelectedPeriods = () => {
    let cleanedPeriods = []
    selectedPeriods.map(period => {
      cleanedPeriods.push({
        selectedDay: period.selectedDay,
        startTime: period.periodStart,
        endTime: period.periodEnd,
        workerId: period.workerId
      })
    })
    return cleanedPeriods
  }

  // Checks if a payment method was selected to continue the schedule process
  const handleFinishSchedule = () => {
    setIsScheduleLoading(true)
    const scheduleBody = {
      scheduleInfo: {
        serviceId: scheduleServiceInfo.selectedServices[0].id,
        petId: scheduleServiceInfo.selectedPet,
        petshopId: scheduleServiceInfo.petshopId,
        notes,
        bundleId: selectedBundle ? selectedBundle : null,
        paymentMethod: selectedPaymentMethod,
        deliveryValue: deliveryOption ? serviceDeliveryValue : null,
        clientServiceBundleId: scheduleServiceInfo.clientServiceBundleId
      },
      scheduleTimes: getCleanedSelectedPeriods()
    }

    // TODO: improve this condition solution
    if (selectedPaymentMethod !== 'Money' && !userHasCpf) {
      return API.updateCpf({ cpf: clearCpfFormatation(userCpf) })
        .then(() => {
          return API.scheduleServices(scheduleBody).then(res => {
            dispatch(setServiceScheduledInformation(res.data))
            router.push('/services/schedule/details')
          })
        })
        .finally(() => setIsScheduleLoading(false))
    } else {
      return API.scheduleServices(scheduleBody)
        .then(res => {
          dispatch(setServiceScheduledInformation(res.data))
          router.push('/services/schedule/details')
        })
        .finally(() => setIsScheduleLoading(false))
    }
  }

  // Renders the selected periods with buttons to change (if period already selected) or add (if bundle selected and
  // any period is still left for selection)
  const renderSelectedPeriods = () => {
    let hasServicesLeftToAdd = false
    if (selectedBundle && selectedBundleFullInfo) {
      hasServicesLeftToAdd =
        selectedBundleFullInfo.serviceAmount > selectedPeriods.length
    }

    if (scheduleServiceInfo.clientServiceBundleId) {
      hasServicesLeftToAdd = creditServiceAmount > selectedPeriods.length
    }

    return (
      <>
        {selectedPeriods.map((period, index) => {
          return (
            <View
              key={index}
              style={[
                styles.selectedPeriodContainer,
                {
                  marginBottom: 16
                }
              ]}
            >
              <Text style={styles.selectedPeriodTextStyle}>
                {getPeriodDisplay(period)}
              </Text>
              <RoundedSecondaryButton
                buttonText={'Alterar'}
                style={{ paddingHorizontal: 18, paddingVertical: 8 }}
                disabled={isAvailablePeriodsLoading}
                isLoading={
                  isAvailablePeriodsLoading && index === selectedPeriodIndex
                }
                onPress={() => {
                  setSelectedPeriod(period)
                  setSelectedPeriodIndex(index)
                  setshowPeriodSelectionModal(true)
                }}
              />
            </View>
          )
        })}
        {hasServicesLeftToAdd && (
          <View
            style={[
              styles.selectedPeriodContainer,
              {
                marginTop: 16,
                marginBottom: 8
              }
            ]}
          >
            <Text style={styles.selectedPeriodTextStyle}>
              {getLeftPeriodsSelectionString(
                hasCredits
                  ? creditServiceAmount
                  : selectedBundleFullInfo.serviceAmount,
                selectedPeriods.length
              )}
            </Text>
            <RoundedSecondaryButton
              buttonText={'Adicionar'}
              disabled={isAvailablePeriodsLoading}
              isLoading={
                isAvailablePeriodsLoading &&
                !selectedPeriodIndex &&
                selectedPeriodIndex !== 0
              }
              style={{ paddingHorizontal: 18, paddingVertical: 8 }}
              onPress={() => {
                setshowPeriodSelectionModal(true)
              }}
            />
          </View>
        )}
      </>
    )
  }

  // Renders the period selection modal, which is opened whenever a edit or add button is clicked in the selected periods section
  const renderPeriodSelectionModal = () => {
    return (
      <BasicModal
        isVisible={showPeriodSelectionModal}
        closeModalAction={() => {
          setSelectedPeriod({})
          setSelectedPeriodIndex(null)
          setshowPeriodSelectionModal(false)
        }}
      >
        <ScrollView
          contentContainerStyle={styles.modalScrollViewContainerStyle}
        >
          <SelectServicePeriod
            availablePeriods={calculateAvailablePeriodsLeft(availablePeriods)}
            selectedPeriod={selectedPeriod}
            setSelectedPeriod={setSelectedPeriod}
            isEditPeriod={true}
          />
        </ScrollView>
        {selectedPeriod.periodStart && (
          <View style={styles.periodSelectionModalConfirmButtonStyle}>
            <RoundedPrimaryButton
              onPress={() => {
                let periodsList = [...selectedPeriods]
                if (!selectedPeriodIndex && selectedPeriodIndex !== 0) {
                  periodsList.push(selectedPeriod)
                } else {
                  const previousPeriod = selectedPeriods[selectedPeriodIndex]
                  if (
                    previousPeriod.selectedDay !== selectedPeriod.selectedDay ||
                    previousPeriod.periodStart !== selectedPeriod.periodStart
                  ) {
                    periodsList.splice(selectedPeriodIndex, 1)
                    periodsList.push(selectedPeriod)
                  }
                }
                const sortedPeriodsList = sortPeriods(periodsList)
                setSelectedPeriods(sortedPeriodsList)
                setSelectedPeriod({})
                setSelectedPeriodIndex(null)
                setshowPeriodSelectionModal(false)
              }}
              buttonText={'Confirmar Horário'}
            />
          </View>
        )}
      </BasicModal>
    )
  }

  const renderSkeleton = () => {
    return (
      <>
        <Skeleton
          style={{
            width: '100%',
            height: 100,
            borderRadius: 16,
            marginBottom: 24
          }}
        />
        <Skeleton
          style={{
            width: '100%',
            height: 54,
            borderRadius: 24,
            marginBottom: 24
          }}
        />
        <Skeleton
          style={{
            width: '100%',
            height: 54,
            borderRadius: 24,
            marginBottom: 24
          }}
        />
        <Skeleton
          style={{
            width: '100%',
            height: 54,
            borderRadius: 24,
            marginBottom: 24
          }}
        />
        <Skeleton
          style={{
            width: '100%',
            height: 54,
            borderRadius: 24,
            marginBottom: 24
          }}
        />
      </>
    )
  }

  // Renders the payment method card, with the payment options for user to select and finish the schedule
  const renderPaymentMethodCard = () => {
    const canPayOutsideApp =
      petshopConfiguration && !!petshopConfiguration.paymentOutsideApp
    const canPayThroughApp =
      petshopConfiguration && !!petshopConfiguration.paymentThroughApp

    return (
      <BasicCard style={{ paddingHorizontal: 16, marginBottom: 36 }}>
        <View style={{ marginBottom: 12 }}>
          <Text style={{ color: Colors.darkBlue, fontSize: 20 }}>
            Método de pagamento
          </Text>
        </View>
        {hasCredits ? (
          <View style={{ marginBottom: 18 }}>
            <SelectionCard
              isSelected={true}
              label={'Créditos'}
              onPress={() => {}}
              roundedSelectionIcon={true}
            />
          </View>
        ) : (
          <>
            <View style={{ marginBottom: 22 }}>
              <Text style={{ color: Colors.lightBlack }}>
                Selecione um método de pagamento:
              </Text>
            </View>
            {canPayThroughApp && (
              <>
                <View style={{ marginBottom: 18 }}>
                  <View>
                    <SelectionCard
                      isSelected={selectedPaymentMethod === 'Pix'}
                      label={'Pix pelo App'}
                      onPress={() => setSelectedPaymentMethod('Pix')}
                      roundedSelectionIcon={true}
                    />
                  </View>
                  {selectedPaymentMethod === 'Pix' && !userHasCpf && (
                    <View style={{ marginTop: 12 }}>
                      <View style={styles.labelContainer}>
                        <Text style={{ color: Colors.lightBlack }}>
                          Insira seu CPF para completar seu cadastro e gerar a
                          chave Pix:
                        </Text>
                      </View>
                      <View style={{ marginBottom: 12 }}>
                        <RoundedInput
                          keyboardType={'numeric'}
                          containerExtraStyle={{
                            borderColor: Colors.orange,
                            borderWidth: 1,
                            backgroundColor: Colors.white,
                            paddingHorizontal: 16
                          }}
                          placeholder='Insira o CPF'
                          onChangeText={setUserCpf}
                          defaultValue={userCpfMaskedInput}
                        />
                      </View>
                    </View>
                  )}
                </View>
                {/* <View style={{ marginBottom: 18 }}>
                  <SelectionCard
                    isSelected={selectedPaymentMethod === 'Boleto'}
                    label={'Boleto'}
                    onPress={() => setSelectedPaymentMethod('Boleto')}
                    roundedSelectionIcon={true}
                  />
                </View> */}
              </>
            )}
            {canPayOutsideApp && (
              <View style={{ marginBottom: 12 }}>
                <SelectionCard
                  isSelected={selectedPaymentMethod === 'Money'}
                  label={'Dinheiro'}
                  onPress={() => setSelectedPaymentMethod('Money')}
                  roundedSelectionIcon={true}
                />
              </View>
            )}
          </>
        )}
      </BasicCard>
    )
  }

  // Renders the content of the modal with the summary of the purchase, with other important informations
  const ProceedToScheduleModalContent = () => {
    let hasServicesLeftToAdd = false
    let servicesAmountLeft = 0
    if (selectedBundle && selectedBundleFullInfo) {
      hasServicesLeftToAdd =
        selectedBundleFullInfo.serviceAmount > selectedPeriods.length
      if (hasServicesLeftToAdd) {
        servicesAmountLeft =
          selectedBundleFullInfo.serviceAmount - selectedPeriods.length
      }
    }

    if (scheduleServiceInfo.clientServiceBundleId) {
      hasServicesLeftToAdd = creditServiceAmount > selectedPeriods.length
      if (hasServicesLeftToAdd) {
        servicesAmountLeft = creditServiceAmount - selectedPeriods.length
      }
    }

    const cancellationFee = petshopConfiguration.cancellationFee

    const getScheduleServicesString = () => {
      return scheduleServiceInfo.selectedServices.map(service => {
        // return `${service.name}${index < scheduleServiceInfo.selectedServices.length - 1 ? ', ' : '.'}`
        return `${service.name},`
      })
    }

    return (
      <View>
        <Text style={{ textAlign: 'center', color: Colors.lightBlack }}>
          {selectedPeriods.length > 1 ? (
            <>
              Você escolheu {selectedPeriods.length}{' '}
              {selectedPeriods.length > 1 ? 'horários ' : 'horário '}
              para {getScheduleServicesString()}{' '}
              {(deliveryOption || hasCreditDelivery) && 'com leva e traz,'}{' '}
              totalizando{' '}
              <Text style={{ fontWeight: '600' }}>
                {centsToText(totalPurchaseValue)}
              </Text>
              .
            </>
          ) : (
            <>
              Você escolheu 1 horário para {getScheduleServicesString()}{' '}
              {(deliveryOption || hasCreditDelivery) && 'com leva e traz,'}{' '}
              totalizando{' '}
              <Text style={{ fontWeight: '600' }}>
                {centsToText(totalPurchaseValue)}
              </Text>
              .
            </>
          )}
          {hasServicesLeftToAdd && (
            <>
              {'\n'}
              {servicesAmountLeft > 1
                ? `Os ${servicesAmountLeft} horários restantes ficarão `
                : 'O horário restante ficará '}
              como crédito no seu próximo agendamento{' '}
              <Text style={{ fontWeight: '600' }}>
                somente com este petshop, este pet e{' '}
                {scheduleServiceInfo.selectedServices.length > 1
                  ? 'estes serviços.'
                  : 'este serviço.'}
              </Text>
            </>
          )}

          {'\n\n'}
          {selectedPaymentMethod === 'Money' ? (
            <>
              Como você escolheu a opção de pagamento por dinheiro, o pagamento
              deve ser feito diretamente com o petshop no momento da realização
              do serviço.
            </>
          ) : selectedPaymentMethod === 'BundleCredits' ? (
            <>
              Como você está utilizando seus créditos, ao prosseguir, seu
              agendamento já estará confirmado!
            </>
          ) : (
            <>
              Como você escolheu a opção de pagamento por{' '}
              <Text style={{ fontWeight: '600' }}>
                {selectedPaymentMethod},{' '}
              </Text>
              ao finalizar sua compra, seu agendamento{' '}
              <Text style={{ fontWeight: '600' }}>não estará garantido. </Text>
              Para garantir seu agendamento,{' '}
              <Text style={{ fontWeight: '600' }}>
                realize o pagamento em até 48h antes do horário agendado,{' '}
              </Text>
              ou seu horário poderá ser{' '}
              <Text style={{ fontWeight: '600' }}>cancelado e liberado </Text>
              para outra pessoa.
            </>
          )}
          {cancellationFee > 0 && selectedPaymentMethod !== 'BundleCredits' && (
            <>
              {'\n\n'}O petshop selecionado possui uma taxa de cancelamento de{' '}
              <Text style={{ fontWeight: '600' }}>{cancellationFee}%. </Text>
              Se após realizar o pagamento, você precisar cancelar, o valor será
              devolvido,{' '}
              <Text style={{ fontWeight: '600' }}>
                porém esse percentual ficará para o petshop{' '}
              </Text>
              como compensação por eventuais prejuízos causados pela ocupação do
              horário.{' '}
            </>
          )}
        </Text>
      </View>
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
        <KeyboardAvoidingView
          behavior={isIOS ? 'padding' : null}
          enabled
          keyboardVerticalOffset={80}
        >
          <ScrollView contentContainerStyle={styles.scrollViewContainerStyle}>
            <View style={{ marginBottom: 36 }}>
              <ArrowBackSubHeader
                goBack={() => setShowDataLossModal(true)}
                titleText={'Escolher Pagamento'}
              />
            </View>
            {isBundleLoading || isPetshopConfigurationLoading ? (
              renderSkeleton()
            ) : (
              <>
                <View style={styles.addItemsCardContainer}>
                  <AddItemsCard
                    titleText={'Serviços'}
                    itemsList={scheduleServiceInfo.selectedServices}
                    isAddIcon={
                      scheduleServiceInfo.selectedServices.length === 0
                    }
                    iconButtonActionEnabled={false}
                    removeItemDisabled={true}
                  />
                </View>
                <View style={{ marginBottom: 16 }}>
                  <SelectionInput
                    inputLabel={'Petshop'}
                    selectionItems={scheduleServiceInfo.petshopList}
                    selectedItem={scheduleServiceInfo.petshopId}
                    enabled={false}
                    hideDropdown={true}
                  />
                </View>
                <View style={{ marginBottom: 16 }}>
                  <SelectionInput
                    inputLabel={'Pet'}
                    selectionItems={scheduleServiceInfo.petList}
                    selectedItem={scheduleServiceInfo.selectedPet}
                    enabled={false}
                    hideDropdown={true}
                  />
                </View>
                {scheduleServiceInfo.clientServiceBundleId ? (
                  <View style={{ marginBottom: 16 }}>
                    <Text style={styles.labelStyle}>Pacote</Text>
                    <View style={{ marginLeft: 16, marginTop: 8 }}>
                      <Text style={{ color: Colors.lightBlack }}>
                        Crédito - Pacote com{' '}
                        {creditServiceAmount > 1
                          ? `${creditServiceAmount} serviços restantes.`
                          : '1 serviço restante.'}
                      </Text>
                    </View>
                  </View>
                ) : (
                  bundleSelectionList &&
                  bundleSelectionList.length > 0 && (
                    <View style={{ marginBottom: 16 }}>
                      <SelectionInput
                        inputLabel={'Pacote'}
                        selectionItems={bundleSelectionList}
                        selectedItem={selectedBundle}
                        setSelectedItem={setSelectedBundle}
                        selectLabelText={'Nenhum - Serviço Unitário'}
                      />
                    </View>
                  )
                )}
                <View style={{ marginBottom: 16 }}>
                  <View style={styles.labelContainer}>
                    <Text style={styles.labelStyle}>
                      Observações do atendimento
                    </Text>
                  </View>
                  <RoundedInput
                    containerExtraStyle={{
                      borderColor: Colors.orange,
                      borderWidth: 1,
                      backgroundColor: Colors.white,
                      paddingHorizontal: 16
                    }}
                    inputExtraStyle={[
                      { color: Colors.lightBlack, fontSize: 16 },
                      isIOS && { minHeight: 90 }
                    ]}
                    placeholder='Obs'
                    onChangeText={setNotes}
                    defaultValue={notes}
                    multiline={true}
                    numberOfLines={5}
                    textAlignVertical={isIOS ? null : 'top'}
                    maxLength={512}
                  />
                </View>
                <View style={{ marginBottom: 0 }}>
                  <View style={styles.labelContainer}>
                    <Text style={styles.labelStyle}>Horário</Text>
                    {renderSelectedPeriods()}
                  </View>
                </View>
                <View style={{ marginBottom: 16 }}>
                  <View style={styles.labelContainer}>
                    <Text style={styles.labelStyle}>Leva e traz</Text>
                    <View style={{ marginLeft: 16, marginTop: 8 }}>
                      <Text style={{ color: Colors.lightBlack }}>
                        {deliveryAddress}
                      </Text>
                      {scheduleServiceInfo.clientServiceBundleId ? (
                        <Text style={{ color: Colors.lightBlack }}>
                          {'\n'}
                          {hasCreditDelivery
                            ? 'Sim - Crédito utilizado possui leva e traz.'
                            : 'Não - Crédito utilizado não possui leva e traz.'}
                        </Text>
                      ) : (
                        userAddressObjectAtSelectedPetshop && (
                          <View style={{ flexDirection: 'row', marginTop: 8 }}>
                            <View style={{ marginRight: 24 }}>
                              <RadioInput
                                label={'Não'}
                                setSelected={() => setDeliveryOption(false)}
                                isSelected={deliveryOption === false}
                              />
                            </View>
                            <RadioInput
                              label={`Sim - ${centsToText(
                                serviceDeliveryValue
                              )}`}
                              setSelected={() => setDeliveryOption(true)}
                              isSelected={deliveryOption === true}
                            />
                          </View>
                        )
                      )}
                    </View>
                  </View>
                </View>
                <View style={styles.totalValueContainer}>
                  <Text style={styles.totalValueTextStyle}>Valor Total:</Text>
                  <Text style={styles.totalValueTextStyle}>
                    {totalPurchaseValue === 0 &&
                    scheduleServiceInfo.clientServiceBundleId
                      ? 'Uso de Créditos'
                      : centsToText(totalPurchaseValue)}
                  </Text>
                </View>
                {renderPaymentMethodCard()}
                <RoundedPrimaryButton
                  onPress={() => handleProceedToSchedule()}
                  buttonText={'Realizar agendamento'}
                />
              </>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
        {showPeriodSelectionModal &&
          !isAvailablePeriodsLoading &&
          renderPeriodSelectionModal()}
        <SimpleModal
          isVisible={showDataLossModal}
          setIsVisible={setShowDataLossModal}
          title={'Tem certeza de que deseja prosseguir?'}
          bodyText={
            'Você vai perder as informações do agendamento atual se continuar.\n\nTem certeza de que deseja prosseguir?'
          }
          firstButtonText={'Prosseguir e perder os dados'}
          firstButtonAction={() => router.back()}
          secondButtonText={'Cancelar e continuar na tela'}
          secondButtonAction={() => setShowDataLossModal(false)}
          closeModalAction={() => setShowDataLossModal(false)}
        />
        <SimpleModal
          isVisible={showProceedToScheduleModal}
          setIsVisible={setShowProceedToScheduleModal}
          title={'Prosseguir com agendamento?'}
          bodyContent={<ProceedToScheduleModalContent />}
          firstButtonText={'Cancelar'}
          firstButtonAction={() => setShowProceedToScheduleModal(false)}
          secondButtonText={'Agendar'}
          secondButtonAction={() => handleFinishSchedule()}
          isModalLoading={isScheduleLoading}
          modalLoadingTitleText={'Realizando agendamento'}
          modalLoadingBodyText={
            'Aguarde enquanto o agendamento é finalizado. Isso pode demorar alguns segundos...'
          }
          closeModalAction={() => setShowProceedToScheduleModal(false)}
        />
      </View>
    </>
  )
}
