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
import * as Clipboard from 'expo-clipboard'

import Colors from '../../../src/themes/colors'

import { selectUserInformations } from '../../../src/redux/slices/userReducer'
import { selectServiceScheduledInformation } from '../../../src/redux/slices/servicesReducer'
import API from '../../../src/services/api/index'
import {
  getWeekDayName,
  convertDateToString
} from '../../../src/services/helpers/dateAndTimeHelpers'
import { centsToText } from '../../../src/services/helpers/money'

import CustomHeader from '../../../src/components/CustomHeader'
import Skeleton from '../../../src/components/Skeleton'
import AddItemsCard from '../../../src/components/Cards/AddItemsCard'
import RoundedInput from '../../../src/components/Inputs/RoundedInput'
import RoundedPrimaryButton from '../../../src/components/Buttons/RoundedPrimaryButton'
import RoundedPrimaryInvertedButton from '../../../src/components/Buttons/RoundedPrimaryInvertedButton'
import RoundedSecondaryButton from '../../../src/components/Buttons/RoundedSecondaryButton'

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
  confirmedScheduleTextStyle: {
    color: Colors.darkBlue,
    fontSize: 18,
    textAlign: 'center'
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
  informationTextStyle: {
    marginLeft: 16,
    color: Colors.lightBlack
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
    marginLeft: 16
  },
  selectedPeriodTextStyle: {
    color: Colors.lightBlack
  }
})

export default function Details () {
  const router = useRouter()
  const isIOS = Platform.OS === 'ios'

  const userData = useSelector(selectUserInformations)
  const scheduledServiceInfo = useSelector(selectServiceScheduledInformation)

  // The object of the scheduled services that we will use to get most of the informations here at the schedule details
  const scheduledServices =
    scheduledServiceInfo && scheduledServiceInfo.scheduledClientService

  // Gets the credits of the client, if there is any
  const credits = scheduledServiceInfo && scheduledServiceInfo.credits

  // Gets the amount of credits the client has
  const creditServiceAmount =
    credits && credits.serviceAmount - credits.scheduledClientServices.length

  // Gets only the remaining of credits the client has after the current scheduled services
  const remainingServicesAmount =
    creditServiceAmount && creditServiceAmount - scheduledServices.length

  const userSelectedPetshop =
    userData &&
    userData.user &&
    userData.user.petshops &&
    userData.user.petshops.find(
      petshop => petshop.petshopInfo.id === scheduledServices[0].petshopId
    )

  const userAddressObject =
    userSelectedPetshop && userSelectedPetshop.clientAddress

  // Returns the client address in a string format to be displayed for user.
  const getClientAddressForDeliveryString = () => {
    if (userAddressObject) {
      const address = userAddressObject
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

  // If a schedule service has a delivery value, all the services have delivery
  const hasDelivery =
    scheduledServices[0].deliveryValue &&
    scheduledServices[0].deliveryValue >= 0

  // The selected pet information
  const selectedPet =
    userSelectedPetshop &&
    userSelectedPetshop.pets.find(pet => pet.id === scheduledServices[0].petId)

  // Flags if the API call to get the purchased bundle is running
  const [isBundleLoading, setIsBundleLoading] = useState(false)

  // The complete information of the bundle. Can be empty if there is no bundle purchased.
  const [fullBundleInfo, setFullBundleInfo] = useState({})

  // The list of services. For now we only have one, but in the future it will probably be possible to have more.
  const servicesList = [
    {
      name: scheduledServices[0].serviceName
    }
  ]

  // The purchased client service bundle id
  const clientServiceBundleId = scheduledServices[0].clientServiceBundleId

  // In the future we will have a payment method, to know if it is boleto or pix
  const payThroughApp = scheduledServices[0].payThroughApp

  // Responsible for getting the purchased client service bundle from backend
  useEffect(() => {
    const getBundle = async () =>
      API.getServiceBundle(clientServiceBundleId)
        .then(res => {
          if (res.data) {
            setFullBundleInfo(res.data)
          }
        })
        .finally(() => setIsBundleLoading(false))
    if (clientServiceBundleId) {
      setIsBundleLoading(true)
      getBundle()
    }
  }, [])

  // Calculates the value of the scheduled services we have. This can be wrong if the client purchased a bundle but did not schedule
  // all the services. So we have to update it in this case, after we get the bundle info.
  const getScheduledServicesValue = () => {
    let servicesValue = 0
    if (!credits) {
      scheduledServices.forEach(scheduleService => {
        servicesValue += scheduleService.totalValue
      })
    }
    return servicesValue
  }

  // The total value of the purchase
  const [totalPurchaseValue, setTotalPurchaseValue] = useState(
    getScheduledServicesValue()
  )

  // useEffect(() => {
  //   const value = getScheduledServicesValue()
  //   setTotalPurchaseValue(value)
  // }, [getScheduledServicesValue])

  // If a bundle is set, we make the calculations of the total value again, but only if there is no credit and it is a bundle
  useEffect(() => {
    if (fullBundleInfo && !credits && clientServiceBundleId) {
      setTotalPurchaseValue(
        fullBundleInfo.serviceAmount * scheduledServices[0].totalValue
      )
    }
  }, [fullBundleInfo])

  // Determines if the pix code is loading
  const [isPixCodeLoading, setIsPixCodeLoading] = useState(false)

  // Stores the pix code
  const [pixCode, setPixCode] = useState(null)

  // Stores the pix code url, to display the qr code in the future
  const [pixCodeUrl, setPixCodeUrl] = useState(null)

  // Copies pix code to clipboard and shows a success toast
  const copyPixCodeToClipboard = async () => {
    await Clipboard.setStringAsync(pixCode)
    toast.hideAll()
    toast.show('Código copiado!', {
      type: 'success'
    })
  }

  // Gets the pix code from the backend (creates an order in an external payment gateway)
  const getPixCode = async () => {
    setIsPixCodeLoading(true)
    return API.getScheduledBillingPixCode({
      scheduledClientServiceId: scheduledServices[0].id
    })
      .then(res => {
        setPixCode(res.data.pixCode)
        setPixCodeUrl(res.data.pixCodeUrl)
      })
      .finally(() => setIsPixCodeLoading(false))
  }

  // Renders the pix code section with the code to be copied
  const renderPixCode = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        {pixCode ? (
          <>
            <Text
              style={[styles.informationTextStyle, { width: '70%' }]}
              selectable={true}
            >
              <Text style={{ fontWeight: 500 }}>Código Pix:</Text>
              {'\n\n'}
              {pixCode}
            </Text>
            <RoundedSecondaryButton
              onPress={copyPixCodeToClipboard}
              style={{ paddingHorizontal: 18, paddingVertical: 6 }}
              buttonText={'Copiar'}
            />
          </>
        ) : (
          <RoundedSecondaryButton
            isLoading={isPixCodeLoading}
            style={{ paddingHorizontal: 18, paddingVertical: 6, width: '100%' }}
            onPress={() => getPixCode()}
            buttonText={'Obter Código Pix'}
          />
        )}
      </View>
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

  // Gets the period left to be added string. If we have N services and (N - p) selected periods, we must show to the client a
  // message with the amount of period services left for credit.
  const getLeftPeriodsSelectionString = (serviceAmount, periodsLength) => {
    const periodsLeft = serviceAmount - periodsLength
    let responseString
    if (periodsLeft > 1) {
      responseString = `Horários ${periodsLength +
        1} a ${serviceAmount} - Não definidos. Ficam como crédito para esse petshop, pet e serviço.`
    } else {
      responseString = `Horário ${periodsLength +
        1} - Não definido. Fica como crédito para esse petshop, pet e serviço.`
    }
    return responseString
  }

  // Gets the period information in string format to be displayed to the client at the selected periods section
  // The format is: "NameOfDayOfTheWeek - DD/MM - HH:MM até HH:MM"
  const getPeriodDisplay = period => {
    const periodDate = new Date(period.selectedDay)
    const weekDay = periodDate.getDay() + 1
    return `${getWeekDayName(weekDay)} - ${convertDateToString(
      periodDate,
      'DD/MM'
    )} - ${period.startTime} até ${period.endTime}`
  }

  // Renders the scheduled services periods and t he ones left for credit, if there is any
  const renderScheduledPeriods = () => {
    let hasServicesLeftToAdd = false
    if (clientServiceBundleId && fullBundleInfo) {
      hasServicesLeftToAdd =
        fullBundleInfo.serviceAmount > scheduledServices.length
    }
    if (credits) {
      hasServicesLeftToAdd = remainingServicesAmount
    }

    return (
      <>
        {scheduledServices.map((scheduledService, index) => {
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
                {getPeriodDisplay(scheduledService)}
              </Text>
            </View>
          )
        })}
        {hasServicesLeftToAdd && (
          <View
            style={[
              styles.selectedPeriodContainer,
              {
                marginBottom: 8
              }
            ]}
          >
            <Text style={styles.selectedPeriodTextStyle}>
              {getLeftPeriodsSelectionString(
                credits ? creditServiceAmount : fullBundleInfo.serviceAmount,
                scheduledServices.length
              )}
            </Text>
          </View>
        )}
      </>
    )
  }

  // if it receives a value, it is passed to the centsToText function
  const renderPrice = price => {
    return centsToText(price ? price : 0)
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
          {isBundleLoading ? (
            renderSkeleton()
          ) : (
            <>
              <View style={{ marginBottom: 36 }}>
                <Text style={styles.confirmedScheduleTextStyle}>
                  {credits ? (
                    <>
                      Agendamento realizado! Como você está usando créditos de
                      compras passadas, seu horário já está garantido!
                    </>
                  ) : (
                    <>
                      {scheduledServices[0].payThroughApp
                        ? 'Agendamento realizado! Para garantir seu horário, faça o pagamento em até 48h antes do atendimento.'
                        : 'Agendamento realizado! Faça o pagamento diretamente com o petshop!'}
                    </>
                  )}
                </Text>
              </View>
              <View style={styles.addItemsCardContainer}>
                <AddItemsCard
                  titleText={'Serviços'}
                  itemsList={servicesList}
                  isAddIcon={false}
                  iconButtonActionEnabled={false}
                  removeItemDisabled={true}
                />
              </View>
              {clientServiceBundleId && (
                <View style={{ marginBottom: 16 }}>
                  <View style={styles.labelContainer}>
                    <Text style={styles.labelStyle}>Pacote</Text>
                  </View>
                  <Text style={styles.informationTextStyle}>
                    {credits ? (
                      <>
                        Crédito - Pacote com{' '}
                        {creditServiceAmount > 1
                          ? `${creditServiceAmount} serviços restantes.`
                          : '1 serviço restante.'}
                      </>
                    ) : (
                      <>
                        {fullBundleInfo.serviceAmount}{' '}
                        {fullBundleInfo.serviceAmount > 1
                          ? 'serviços'
                          : 'serviço'}
                      </>
                    )}
                  </Text>
                </View>
              )}
              <View style={{ marginBottom: 16 }}>
                <View style={styles.labelContainer}>
                  <Text style={styles.labelStyle}>Pet</Text>
                </View>
                <Text style={styles.informationTextStyle}>
                  {selectedPet ? selectedPet.name : ''}
                </Text>
              </View>
              <View style={{ marginBottom: 16 }}>
                <View style={styles.labelContainer}>
                  <Text style={styles.labelStyle}>Local</Text>
                </View>
                <Text style={styles.informationTextStyle}>
                  {userSelectedPetshop
                    ? userSelectedPetshop.petshopInfo?.name
                    : ''}
                </Text>
              </View>
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
                  placeholder='Sem observações adicionadas'
                  defaultValue={scheduledServices[0].notes}
                  multiline={true}
                  numberOfLines={5}
                  textAlignVertical={isIOS ? null : 'top'}
                  maxLength={512}
                  editable={false}
                />
              </View>
              <View style={{ marginBottom: 16 }}>
                <View style={styles.labelContainer}>
                  <Text style={styles.labelStyle}>
                    {scheduledServices.length > 1 ? 'Horários' : 'Horário'}
                  </Text>
                </View>
                {renderScheduledPeriods()}
              </View>
              <View style={{ marginBottom: 16 }}>
                <View style={styles.labelContainer}>
                  <Text style={styles.labelStyle}>Leva e traz</Text>
                </View>
                <Text style={styles.informationTextStyle}>
                  {hasDelivery ? (
                    <>
                      Sim -{' '}
                      {credits ? (
                        <>Crédito utilizado possui leva e traz.</>
                      ) : (
                        <>
                          {fullBundleInfo.serviceAmount
                            ? `${fullBundleInfo.serviceAmount}x`
                            : ''}{' '}
                          {renderPrice(scheduledServices[0].deliveryValue)}
                        </>
                      )}
                      {'\n\n'}
                      {deliveryAddress}
                    </>
                  ) : (
                    'Não'
                  )}
                </Text>
              </View>
              <View style={{ marginBottom: 16 }}>
                <View style={styles.labelContainer}>
                  <Text style={styles.labelStyle}>Status do pagamento</Text>
                </View>
                <Text style={styles.informationTextStyle}>
                  {credits ? (
                    <>Foi utilizado crédito de compras anteriores.</>
                  ) : (
                    <>
                      {payThroughApp
                        ? 'Aguardando pagamento via Pix.'
                        : 'Aguardando pagamento diretamente ao petshop.'}
                    </>
                  )}

                  {'\n'}
                </Text>
                {payThroughApp && !credits && renderPixCode()}
              </View>
              <View style={styles.totalValueContainer}>
                <Text style={styles.totalValueTextStyle}>Valor Total:</Text>
                <Text style={styles.totalValueTextStyle}>
                  {totalPurchaseValue === 0 && credits
                    ? 'Uso de Créditos'
                    : renderPrice(totalPurchaseValue)}
                </Text>
              </View>
              <View style={{ marginBottom: 18 }}>
                <RoundedPrimaryButton
                  onPress={() => router.push('/services/schedule')}
                  buttonText={'Novo Agendamento'}
                />
              </View>
              <RoundedPrimaryInvertedButton
                onPress={() => router.push('/')}
                buttonText={'Menu'}
              />
            </>
          )}
        </ScrollView>
      </View>
    </>
  )
}
