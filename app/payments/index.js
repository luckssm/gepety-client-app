import { useEffect, useState } from 'react'
import { StyleSheet, View, ScrollView, Text, Image } from 'react-native'
import { Stack, useRouter } from 'expo-router'
import { useSelector, useDispatch } from 'react-redux'
import * as Clipboard from 'expo-clipboard'

import Colors from '../../src/themes/colors'
import Images from '../../src/themes/images'

import API from '../../src/services/api/index'
import { openWhatsapp } from '../../src/services/helpers/generalHelpers'
import { selectUserInformations } from '../../src/redux/slices/userReducer'
import {
  getPetshop,
  getPetNameInPetshop,
  getScheduledTitle
} from '../../src/services/helpers/servicesHelpers'
import { centsToText } from '../../src/services/helpers/money'

import CustomHeader from '../../src/components/CustomHeader'
import ArrowBackSubHeader from '../../src/components/ArrowBackSubHeader'
import Skeleton from '../../src/components/Skeleton'
import RoundedPrimaryButton from '../../src/components/Buttons/RoundedPrimaryButton'
import InformationsCard from '../../src/components/Cards/InformationsCard'
import CheckboxInput from '../../src/components/Inputs/CheckboxInput'
import RoundedSecondaryButton from '../../src/components/Buttons/RoundedSecondaryButton'
import SimpleModal from '../../src/components/Modals/SimpleModal'

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
  addItemsCardContainer: {
    marginBottom: 32
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

export default function Payments () {
  const router = useRouter()
  const userData = useSelector(selectUserInformations)

  // Flags if the API call to get the scheduled services list is running
  const [
    isServicesBillingListLoading,
    setIsServicesBillingListLoading
  ] = useState(false)

  // The list of the services billing, already transformed to fit InformationsCard component
  const [servicesBillingList, setServicesBillingList] = useState([])

  // Controls the previous services filter
  const [showPendingBillingsFilter, setShowPendingBillingsFilter] = useState(
    true
  )

  // Controls the next services filter
  const [showPaidBillingsFilter, setShowPaidBillingsFilter] = useState(true)

  // Controls if the modal with the loading information when creating a pix code will be showed
  const [showPixGenerationModal, setShowPixGenerationModal] = useState(false)

  // Copies pix code to clipboard and shows a success toast
  const copyPixCodeToClipboard = async pixCode => {
    await Clipboard.setStringAsync(pixCode)
    toast.hideAll()
    toast.show('Código copiado!', {
      type: 'success'
    })
  }

  // Gets the service billing list from API
  const getServiceBillings = async () =>
    API.getServiceBillingList()
      .then(res => {
        if (res.data) {
          const transformedServices = transformServicesBillingListObject(
            res.data
          )
          setServicesBillingList(transformedServices)
        }
      })
      .finally(() => setIsServicesBillingListLoading(false))

  // Gets the pix code from the backend (creates an order in an external payment gateway)
  const getPixCode = async scheduledClientServiceId => {
    return API.getScheduledBillingPixCode({
      scheduledClientServiceId
    })
      .then(res => {
        setIsServicesBillingListLoading(true)
        getServiceBillings()
      })
      .finally(() => setShowPixGenerationModal(false))
  }

  // Transforms a scheduled service into a object we can use to display information in the InformationsCard component
  const transformServicesBillingListObject = servicesBillingList => {
    let transformedArray = []
    servicesBillingList.forEach(serviceBilling => {
      const petshop = getPetshop(userData, serviceBilling.petshopId)
      const petshopName = petshop?.petshopInfo?.name
      const petshopNumber = petshop?.petshopInfo?.phoneNumber
      const petName = getPetNameInPetshop(serviceBilling.petId, petshop)

      transformedArray.push({
        id: serviceBilling.id,
        title:
          serviceBilling.titleType === 'creation'
            ? `${
                serviceBilling.serviceName
              } - Pix gerado em ${getScheduledTitle(serviceBilling.createdAt)}`
            : `Serviço agendado para ${getScheduledTitle(
                serviceBilling.createdAt,
                serviceBilling.startTime,
                serviceBilling.endTime
              )}`,
        selectedDay: serviceBilling.selectedDay,
        itemsList: [
          { label: 'Pet', content: petName ? petName : 'Nome não encontrado.' },
          {
            label: 'Serviço',
            content: (
              <Text>
                {serviceBilling.serviceName}
                {serviceBilling.deliveryValue !== null && (
                  <Text style={{ fontWeight: '600' }}> com leva e traz</Text>
                )}
                .
              </Text>
            )
          },
          serviceBilling.clientServiceBundle && {
            label: 'Pacote',
            content: `${serviceBilling.clientServiceBundle?.serviceAmount} serviços`,
            showOnlyWhenExpanded: true
          },
          {
            label: 'Observações do Serviço',
            content: serviceBilling.notes
              ? serviceBilling.notes
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
              serviceBilling.totalValue ? serviceBilling.totalValue : 0
            )
          },
          {
            label: 'Pagamento',
            content: serviceBilling.paymentStatus
              ? serviceBilling.paymentStatus
              : 'Pendente.'
          },
          serviceBilling.status === 'created' &&
            serviceBilling.pixCode && {
              label: 'Código Pix',
              content: (
                <>
                  <Text
                    style={[styles.informationTextStyle, { marginBottom: 8 }]}
                    selectable={true}
                  >
                    {serviceBilling.pixCode}
                  </Text>
                  <RoundedSecondaryButton
                    onPress={() =>
                      copyPixCodeToClipboard(serviceBilling.pixCode)
                    }
                    style={{ paddingHorizontal: 18, paddingVertical: 6 }}
                    buttonText={'Copiar Pix'}
                  />
                </>
              )
            }
        ],
        actionButtonText: serviceBilling.pixCode ? '' : 'Gerar Código Pix',
        actionButtonOnPress: () => {
          setShowPixGenerationModal(true)
          getPixCode(serviceBilling.id)
        }
      })
    })

    return transformedArray
  }

  // Gets the services billing list from API when page is loaded
  useEffect(() => {
    setIsServicesBillingListLoading(true)
    getServiceBillings()
  }, [])

  // Calculates if there is any scheduled services
  const hasServicesBillingList = servicesBillingList.length > 0

  // Checks if the service billing should be showed depending on the selected filter
  const checkIfShouldShowServiceBilling = serviceBilling => {
    if (showPendingBillingsFilter && showPaidBillingsFilter) {
      return true
    }

    const serviceBillingStatus = serviceBilling.status
    if (showPendingBillingsFilter && serviceBillingStatus !== 'paid') {
      return true
    }

    if (showPaidBillingsFilter && serviceBillingStatus === 'paid') {
      return true
    }

    return false
  }

  // Gets the amount of services in the specified filter (previous or next)
  const getServiceBillingAmountInFilter = filter => {
    if (filter === 'pending') {
      const filteredServices = servicesBillingList.filter(
        serviceBilling => serviceBilling.status !== 'paid'
      )
      return filteredServices.length
    } else {
      const filteredServices = servicesBillingList.filter(
        serviceBilling => serviceBilling.status === 'paid'
      )
      return filteredServices.length
    }
  }

  // The amount of services to be showed in the filters labels
  const pendingServicesBillingListAmount = getServiceBillingAmountInFilter(
    'pending'
  )
  const paidServicesBillingListAmount = getServiceBillingAmountInFilter('paid')

  // checks if there is any service billing to show based on the selected filters
  const hasServicesBillingListToShow = () => {
    const previousServicesShowedAmount = showPendingBillingsFilter
      ? pendingServicesBillingListAmount
      : 0
    const nextServicesShowedAmount = showPaidBillingsFilter
      ? paidServicesBillingListAmount
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

  // Renders all the info cards of the client's created billings or services scheduled but without created billings yet
  const renderServicesBillingListCards = () => {
    return servicesBillingList.map((serviceBilling, index) => {
      const showServiceBilling = checkIfShouldShowServiceBilling(serviceBilling)
      return (
        showServiceBilling && (
          <View key={index} style={{ marginBottom: 16 }}>
            <InformationsCard
              titleText={serviceBilling.title}
              itemsList={serviceBilling.itemsList}
              actionButtonText={serviceBilling.actionButtonText}
              actionButtonOnPress={serviceBilling.actionButtonOnPress}
              hasExpansion={true}
              isPrimaryButtonAction={true}
              style={{
                backgroundColor: serviceBilling.paymentStatus
                  ? Colors.successSecondary
                  : Colors.warning
              }}
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
            height: 100,
            borderRadius: 16,
            marginBottom: 24
          }}
        />
      </>
    )
  }

  const renderPixGenerationModal = () => {
    return (
      <SimpleModal
        isVisible={showPixGenerationModal}
        isModalLoading={true}
        modalLoadingTitleText={'Gerando o código Pix'}
        modalLoadingBodyText={
          'Por favor aguarde enquanto geramos o código Pix.\n\nQuando finalizarmos, a página será recarregada e o código aparecerá no topo da lista\n\n Isso pode demorar alguns segundos...'
        }
      />
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
              titleText={'Pagamentos'}
            />
          </View>
          {isServicesBillingListLoading ? (
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
                  Clique em um pagamento para expandir e ver os detalhes.
                </Text>
              </View>
              <View style={styles.divisionLineStyle} />

              {hasServicesBillingList ? (
                <>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginBottom: 12,
                      flexWrap: 'wrap'
                    }}
                  >
                    <View style={{ marginBottom: 12 }}>
                      <CheckboxInput
                        isSelected={showPendingBillingsFilter}
                        setSelected={() =>
                          setShowPendingBillingsFilter(
                            !showPendingBillingsFilter
                          )
                        }
                        label={`Pendentes (${pendingServicesBillingListAmount})`}
                        labelTextStyle={{ color: Colors.darkBlue }}
                        colorLabel={Colors.warning}
                      />
                    </View>
                    <View style={{ marginBottom: 12 }}>
                      <CheckboxInput
                        isSelected={showPaidBillingsFilter}
                        setSelected={() =>
                          setShowPaidBillingsFilter(!showPaidBillingsFilter)
                        }
                        label={`Realizados (${paidServicesBillingListAmount})`}
                        labelTextStyle={{ color: Colors.darkBlue }}
                        colorLabel={Colors.successSecondary}
                      />
                    </View>
                  </View>
                  {!hasServicesBillingListToShow() && (
                    <>
                      <Text style={styles.emptyItemsTextStyle}>
                        Sem serviços para serem exibidos com os filtros
                        selecionados.
                      </Text>
                    </>
                  )}
                  {renderServicesBillingListCards()}
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
        {showPixGenerationModal && renderPixGenerationModal()}
      </View>
    </>
  )
}
