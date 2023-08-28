import { useEffect, useState } from 'react'
import { StyleSheet, View, ScrollView, Text } from 'react-native'
import { Stack, useRouter } from 'expo-router'
import { useSelector, useDispatch } from 'react-redux'

import Colors from '../../../src/themes/colors'

import { selectUserInformations } from '../../../src/redux/slices/userReducer'
import { setServiceCheckoutInformation } from '../../../src/redux/slices/servicesReducer'
import API from '../../../src/services/api/index'
import { openWhatsapp } from '../../../src/services/helpers/generalHelpers'

import CustomHeader from '../../../src/components/CustomHeader'
import ArrowBackSubHeader from '../../../src/components/ArrowBackSubHeader'
import AddItemsCard from '../../../src/components/Cards/AddItemsCard'
import SelectionInput from '../../../src/components/Inputs/SelectionInput'
import RoundedSecondaryButton from '../../../src/components/Buttons/RoundedSecondaryButton'
import SearchAndSelectListItemsModal from '../../../src/components/Modals/SearchAndSelectListItemsModal'
import Skeleton from '../../../src/components/Skeleton'
import SelectServicePeriod from '../../../src/components/SelectServicePeriod'
import RoundedPrimaryButton from '../../../src/components/Buttons/RoundedPrimaryButton'
import SelectionCard from '../../../src/components/Cards/SelectionCard'
import SimpleModal from '../../../src/components/Modals/SimpleModal'

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
  }
})

export default function Schedule () {
  const router = useRouter()
  const dispatch = useDispatch()

  // Controls the loading of services list request
  const [isServicesLoading, setIsServicesLoading] = useState(false)

  // Controls the loading of credits request
  const [isCreditsLoading, setIsCreditsLoading] = useState(false)

  // Controls the loading of available periods for a service request
  const [isAvailablePeriodsLoading, setIsAvailablePeriodsLoading] = useState(
    false
  )

  const userData = useSelector(selectUserInformations)

  // The petshops of the user
  const userPetshops = userData && userData.user && userData.user.petshops

  // Stores services from all the user's petshops
  const [allPetshopsServicesList, setAllPetshopsServicesList] = useState([])

  // When the page is rendered, gets all the services from the user's petshops
  useEffect(() => {
    setIsServicesLoading(true)
    let userPetshopIds = []
    userPetshops &&
      userPetshops.forEach(petshop => {
        userPetshopIds.push(petshop.petshopInfo.id)
      })
    const getPetshopsServices = async () =>
      API.getPethopsServicesList({ petshopIds: userPetshopIds })
        .then(res => {
          setAllPetshopsServicesList(res.data)
        })
        .finally(() => setIsServicesLoading(false))
    getPetshopsServices()
  }, [])

  // Stores the user credits
  const [credits, setCredits] = useState([])

  // Variable to easily check if there is any credit available for the client
  const hasCredits = credits && credits.length > 0

  // Stores the selected credit index (in credits array)
  const [selectedCredit, setSelectedCredit] = useState(null)

  // Stores whether client chose to use credits option or not
  const [useCreditsOption, setUseCreditsOption] = useState(null)

  // When the page is rendered, gets all the credits from the user's petshops
  useEffect(() => {
    const getCredits = async () =>
      API.getUserCredits()
        .then(res => {
          setCredits(res.data)
        })
        .finally(() => setIsCreditsLoading(false))
    setIsCreditsLoading(true)
    getCredits()
  }, [])

  // Stores the services list of the petshop selected by the user
  const [
    selectedPetshopServicesList,
    setSelectedPetshopServicesList
  ] = useState([])

  // Filters the services of the petshop selectd by the user
  const filterSelectedPetshopServicesList = () => {
    const filteredServicesList = allPetshopsServicesList.filter(
      petshopService => petshopService.petshopId === selectedPetshop
    )
    setSelectedPetshopServicesList(filteredServicesList)
  }

  // Variable responsible for showing the services selection modal
  const [showServicesModal, setShowServicesModal] = useState(false)

  // Variable that has all the services selected by the user
  const [selectedServices, setSelectedServices] = useState([])

  // Adds a service to the selectedServices list
  const addSelectedService = serviceToAdd => {
    let selectedServicesTemp = [...selectedServices]
    selectedServicesTemp.push(serviceToAdd)
    setSelectedServices(selectedServicesTemp)
  }

  // Removes the selected service from the selectedServices list
  const removeSelectedService = serviceToRemove => {
    let selectedServicesTemp = [
      ...selectedServices.filter(
        selectedService => selectedService.id !== serviceToRemove.id
      )
    ]
    setSelectedServices(selectedServicesTemp)
  }

  // Creates petshop list based on the userData petshops
  const createPetshopList = () => {
    let createdPetshopList = []
    userPetshops &&
      userPetshops.forEach(userPetshop => {
        createdPetshopList.push({
          label: userPetshop.petshopInfo.name,
          value: userPetshop.petshopInfo.id
        })
      })

    return createdPetshopList
  }

  const petshopList = createPetshopList()

  const userHasOnlyOnePetshop = petshopList.length === 1

  // Variable for selected petshop inside selection input. If has only one petshop, it comes selected by default.
  const [selectedPetshop, setSelectedPetshop] = useState(
    userHasOnlyOnePetshop ? petshopList[0].value : ''
  )

  // Variable for selected pet inside selection input
  const [selectedPet, setSelectedPet] = useState('')

  // Variable for pet list. Depends on the petshop, because each petshop has its own pet list
  const [petList, setPetList] = useState([])

  // Creates the pet list based on the selected petshop
  const createPetList = petshopId => {
    let createdPetList = []
    const selectedPetshopObject =
      userPetshops &&
      userPetshops.find(
        userPetshop =>
          userPetshop.petshopInfo.id ===
          (petshopId ? petshopId : selectedPetshop)
      )

    selectedPetshopObject &&
      selectedPetshopObject.pets?.forEach(pet => {
        createdPetList.push({
          label: pet.name,
          value: pet.id,
          bodySize: pet.bodySize,
          furSize: pet.furSize
        })
      })

    return createdPetList
  }

  const [availablePeriods, setAvailablePeriods] = useState([])

  // When we have available periods to be shown, we update this variable to true, so that the period selection component is displayed
  const [showServicePeriodSelection, setShowServicePeriodSelection] = useState(
    false
  )

  // Handles if all needed variables were selected and added so that we can get the available periods of a service
  const handleShowServicePeriodSelection = () => {
    if (!selectedPetshop) {
      toast.hideAll()
      toast.show('Selecione o Petshop para continuar!', { type: 'error' })
      return
    }

    if (!selectedPet) {
      toast.hideAll()
      toast.show('Selecione o Pet para continuar!', { type: 'error' })
      return
    }

    if (!selectedServices || selectedServices.length === 0) {
      toast.hideAll()
      toast.show('Adicione um serviço para continuar!', { type: 'error' })
      return
    }

    setShowServicePeriodSelection(true)
  }

  // When we are supposed to display the ServicePeriodSelection component, we set the query parameters and make an API call
  useEffect(() => {
    if (showServicePeriodSelection) {
      setIsAvailablePeriodsLoading(true)
      const selectedPetInfo = petList.find(pet => pet.value === selectedPet)
      const petBodySize = selectedPetInfo.bodySize
      const petFurSize = selectedPetInfo.furSize

      const queryString = `serviceId=${encodeURIComponent(
        selectedServices[0].id
      )}&petshopId=${encodeURIComponent(
        selectedPetshop
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
  }, [showServicePeriodSelection])

  // Stores the period selected by the user, allowing the user to proceed to the next step of the schedule
  const [selectedPeriod, setSelectedPeriod] = useState({})

  // Returns the credit bundle selected by the client, if there is any
  const getSelectedCreditBundleId = () => {
    let selectedBundleId
    if (useCreditsOption) {
      if (selectedCredit === 0 || (selectedCredit && selectedCredit !== '')) {
        selectedBundleId = credits[selectedCredit].id
      } else {
        selectedBundleId = credits[0].id
      }
    }
    return selectedBundleId
  }

  // Returns the selected petshop phone number
  const getSelectedPetshopPhoneNumber = () => {
    const petshop = getPetshopById(selectedPetshop)
    return petshop?.petshopInfo?.phoneNumber
  }

  // Controls if the unavailable schedule modal is shown. It is shown when a petshop does not allow client to schedule through app
  const [
    showScheduleUnavailableModal,
    setShowScheduleUnavailableModal
  ] = useState(false)

  // Every time a selected petshop is updated, sets an updated pet list.
  useEffect(() => {
    // Checks if the petshop allows client to schedule through app
    if (selectedPetshop) {
      const petshop = getPetshopById(selectedPetshop)
      const canScheduleThroughApp =
        petshop?.clientPetshopInfo?.canScheduleThroughApp
      if (!canScheduleThroughApp) {
        setShowScheduleUnavailableModal(true)
      }
    }

    const updatedPetList = createPetList()
    setPetList(updatedPetList)

    // If the pet list has only one pet, it comes selected by default.
    if (updatedPetList.length === 1) {
      setSelectedPet(updatedPetList[0].value)
    } else {
      // If it is not a credits option, we refresh the selected pet. Otherwise, we want to keep the selected pet from the credit
      if (!useCreditsOption) {
        setSelectedPet('')
      }
    }

    filterSelectedPetshopServicesList()
    setSelectedServices([])

    // Hides the period selection, because we will have to get the available periods data from the backend again
    setShowServicePeriodSelection(false)
    setSelectedPeriod({})
  }, [selectedPetshop])

  // If the selected pet or the selected services list is changed  we need to reset the periods info
  useEffect(() => {
    // Hides the period selection, because we will have to get the available periods data from the backend again
    setShowServicePeriodSelection(false)
    setSelectedPeriod({})
  }, [selectedPet, selectedServices])

  const goToCheckoutScreen = () => {
    dispatch(
      setServiceCheckoutInformation({
        petshopId: selectedPetshop,
        selectedPet: selectedPet,
        selectedPetFullInfo: petList.find(pet => pet.value === selectedPet),
        petList,
        selectedPeriod,
        selectedServices,
        petshopList,
        clientServiceBundleId: getSelectedCreditBundleId(),
        credits:
          useCreditsOption &&
          credits.length > 0 &&
          (selectedCredit === 0 || (selectedCredit && selectedCredit !== '')
            ? credits[selectedCredit]
            : credits[0])
      })
    )

    router.push('/services/schedule/checkout')
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

  // Returns a client petshop with the provided id
  const getPetshopById = petshopId => {
    return (
      userPetshops &&
      userPetshops.find(userPetshop => userPetshop.petshopInfo.id === petshopId)
    )
  }

  // Used mainly for credit selection
  const getCurrentSelectedPetshopName = petshopId => {
    let selectedPetshopFullInfo

    if (petshopId) {
      selectedPetshopFullInfo = getPetshopById(petshopId)
    } else {
      selectedPetshopFullInfo = getPetshopById(selectedPetshop)
    }

    return selectedPetshopFullInfo?.petshopInfo?.name
  }

  // Used mainly for credit selection
  const getCurrentSelectedPetName = (petshopId, petId) => {
    let selectedPetFullInfo
    // If we have the petshop and pet id, we use it to create our list and get the information
    if (petshopId && petId) {
      const createdPetList = createPetList(petshopId)
      selectedPetFullInfo = createdPetList.find(pet => pet.value === petId)
    } else {
      // If we don't have the ids, we use the already selected
      selectedPetFullInfo = petList.find(pet => pet.value === selectedPet)
    }
    return selectedPetFullInfo?.label
  }

  // Returns the string to be showed to client at a credit selection, with the services, pet and petshop information
  const getCreditServiceStringInformation = (
    services,
    serviceAmount,
    petName,
    petshopName,
    fullString
  ) => {
    const servicesNameString = services[0]?.serviceName
    // If in the future we have more than one service, this may be useful
    // services.map((service, index)=> {
    //   servicesNameString += `${service.serviceName}${index < services.length - 1 ? ', ' : ''}`
    // })
    const remainingServicesAmount = serviceAmount - services.length
    let serviceAmountString =
      remainingServicesAmount > 1
        ? `${remainingServicesAmount} serviços de ${servicesNameString}${
            fullString ? ' comprados e não agendados' : ''
          }`
        : `1 serviço de ${servicesNameString}${
            fullString ? ' comprado e não agendado' : ''
          }`

    return (serviceAmountString += ` para ${petName} no Petshop ${petshopName}`)
  }

  // Sets a list with the credit info for the client to choose from if there is more than one credit option
  const setCreditSelectionList = () => {
    const selectionCreditOptions = credits.map((credit, index) => {
      return {
        value: index,
        label: getCreditServiceStringInformation(
          credit.scheduledClientServices,
          credit.serviceAmount,
          getCurrentSelectedPetName(),
          getCurrentSelectedPetshopName()
        )
      }
    })
    return selectionCreditOptions
  }

  // The list of credits for the client to choose from if there is more than one credit option
  const creditSelectionList = setCreditSelectionList()

  // Sets the information of the selected pet, petshop and services, if a credit was selected.
  const setCreditServiceOptions = () => {
    let creditInfo
    if (selectedCredit && selectedCredit !== '') {
      creditInfo = credits[selectedCredit]
    } else {
      creditInfo = credits[0]
    }
    setSelectedPetshop(creditInfo.petshopId)
    setSelectedPet(creditInfo.petId)
    setSelectedServices([
      {
        id: creditInfo.scheduledClientServices[0].serviceId,
        name: creditInfo.scheduledClientServices[0]?.serviceName
      }
    ])
  }

  // When a credit is selected or the option to use credit is selected, we set the credit options or clear them if it was deselected
  useEffect(() => {
    if (useCreditsOption) {
      setCreditServiceOptions()
    } else {
      setSelectedPetshop('')
      setSelectedPet('')
      setSelectedServices([])
    }
  }, [useCreditsOption, selectedCredit])

  // Renders the credit option section, allowing client to select to use credit or make a new purchase
  const renderCreditsSection = () => {
    return (
      <View style={{ marginBottom: 12 }}>
        <View style={{ marginBottom: 24 }}>
          <Text
            style={{
              color: Colors.darkBlue,
              fontSize: 16,
              textAlign: 'center'
            }}
          >
            {credits.length > 1
              ? 'Você possui créditos em dois ou mais serviços. Como deseja prosseguir?'
              : `Você tem ${getCreditServiceStringInformation(
                  credits[0].scheduledClientServices,
                  credits[0].serviceAmount,
                  getCurrentSelectedPetName(
                    credits[0].petshopId,
                    credits[0].petId
                  ),
                  getCurrentSelectedPetshopName(credits[0].petshopId),
                  true
                )}. Como deseja prosseguir?`}
          </Text>
        </View>
        <View>
          <View style={{ marginBottom: 12 }}>
            <SelectionCard
              isSelected={useCreditsOption === true}
              label={'Utilizar meus créditos'}
              onPress={() => {
                setUseCreditsOption(true)
              }}
              roundedSelectionIcon={true}
            />
          </View>
          <View style={{ marginBottom: 12 }}>
            <SelectionCard
              isSelected={useCreditsOption === false}
              label={'Realizar uma nova compra'}
              onPress={() => setUseCreditsOption(false)}
              roundedSelectionIcon={true}
            />
          </View>
        </View>
      </View>
    )
  }

  // Renders the petshop, pet and service selection. If a credit is used, some selection fields will be disabled.
  const renderPetshopPetAndServiceSelection = isSelectionOff => {
    return (
      <>
        <View style={{ marginBottom: 16 }}>
          <SelectionInput
            inputLabel={'Petshop'}
            selectionItems={petshopList}
            selectLabelText={'Selecionar Petshop'}
            selectedItem={selectedPetshop}
            setSelectedItem={setSelectedPetshop}
            enabled={!isSelectionOff}
            hideDropdown={isSelectionOff}
          />
        </View>
        <View style={{ marginBottom: 24 }}>
          <SelectionInput
            inputLabel={'Pet'}
            selectionItems={petList}
            selectLabelText={
              selectedPetshop !== ''
                ? 'Selecionar Pet'
                : 'Selecione primeiro o Petshop'
            }
            selectedItem={selectedPet}
            setSelectedItem={setSelectedPet}
            enabled={isSelectionOff ? false : selectedPetshop !== ''}
            hideDropdown={isSelectionOff}
          />
        </View>
        <View style={styles.addItemsCardContainer}>
          <AddItemsCard
            titleText={'Serviços'}
            itemsList={selectedServices}
            isAddIcon={selectedServices.length === 0}
            iconButtonAction={() => setShowServicesModal(true)}
            iconButtonActionEnabled={isSelectionOff ? false : selectedPetshop}
            removeItemDisabled={isSelectionOff}
            removeItem={removeSelectedService}
            emptyItemsListMessage={
              selectedPetshop
                ? 'Sem serviços adicionados.'
                : 'Selecione primeiro o Petshop para poder adicionar serviços.'
            }
          />
        </View>
        <View style={{ marginBottom: 32 }}>
          <RoundedSecondaryButton
            buttonText={'Consultar horários livres'}
            isLoading={isAvailablePeriodsLoading}
            onPress={() => handleShowServicePeriodSelection()}
          />
        </View>
        {showServicePeriodSelection && !isAvailablePeriodsLoading && (
          <SelectServicePeriod
            availablePeriods={availablePeriods}
            selectedPeriod={selectedPeriod}
            setSelectedPeriod={setSelectedPeriod}
          />
        )}
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
          <View style={{ marginBottom: 36 }}>
            <ArrowBackSubHeader
              goBack={() => router.back()}
              titleText={'Agendar Serviço'}
            />
          </View>
          {isServicesLoading || isCreditsLoading ? (
            renderSkeleton()
          ) : (
            // TODO: Improve all this render logic. There are too many checks. See in future how we can simplify it.
            <>
              {hasCredits && renderCreditsSection()}
              {(!hasCredits || (hasCredits && useCreditsOption === false)) &&
                renderPetshopPetAndServiceSelection()}
              {hasCredits && useCreditsOption && credits.length > 1 ? (
                <>
                  <View style={{ marginBottom: 24 }}>
                    <SelectionInput
                      inputLabel={'Crédito'}
                      selectionItems={creditSelectionList}
                      selectLabelText={'Selecionar Serviço em Crédito'}
                      selectedItem={selectedCredit}
                      setSelectedItem={setSelectedCredit}
                    />
                  </View>
                </>
              ) : (
                <></>
              )}
              {useCreditsOption &&
                (credits.length > 1
                  ? selectedCredit !== null && selectedCredit !== ''
                  : credits) &&
                renderPetshopPetAndServiceSelection(true)}
            </>
          )}
        </ScrollView>
        {selectedPeriod.periodStart && (
          <View
            style={{ paddingHorizontal: 32, marginBottom: 12, marginTop: 8 }}
          >
            <RoundedPrimaryButton
              onPress={() => goToCheckoutScreen()}
              buttonText={'Continuar para agendamento'}
            />
          </View>
        )}
        <SimpleModal
          isVisible={showScheduleUnavailableModal}
          setIsVisible={setShowScheduleUnavailableModal}
          title={'Seu petshop ainda não permite agendamentos!'}
          bodyText={
            'Seu petshop ainda não finalizou as configurações para que você possa realizar agendamentos!\n\nSe preferir, entre em contato com ele clicando no botão abaixo:'
          }
          firstButtonText={'Voltar'}
          firstButtonAction={() => {
            setSelectedPetshop('')
            setShowScheduleUnavailableModal(false)
          }}
          secondButtonText={'Contatar Petshop'}
          secondButtonAction={() =>
            openWhatsapp({
              phone: getSelectedPetshopPhoneNumber(),
              phoneCountryCode: '+55'
            })
          }
          closeModalAction={() => {
            setSelectedPetshop('')
            setShowScheduleUnavailableModal(false)
          }}
        />
        <SearchAndSelectListItemsModal
          isVisible={showServicesModal}
          closeModalAction={() => setShowServicesModal(false)}
          title={'Selecione um ou mais serviços'}
          itemsList={selectedPetshopServicesList}
          selectedItemsList={selectedServices}
          addItem={addSelectedService}
          removeItem={removeSelectedService}
          searchBarPlaceholder={'Buscar Serviço'}
          searchFieldName={'name'}
          emptyItemsText={'Nenhum serviço encontrado.'}
        />
      </View>
    </>
  )
}
