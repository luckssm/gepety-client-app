import { useEffect, useState } from 'react'
import { StyleSheet, View, ScrollView, Text, Image } from 'react-native'
import { Stack, useRouter } from 'expo-router'
import { useSelector, useDispatch } from 'react-redux'

import Colors from '../../../src/themes/colors'
import Images from '../../../src/themes/images'

import { openWhatsapp } from '../../../src/services/helpers/generalHelpers'
import { selectUserInformations } from '../../../src/redux/slices/userReducer'
import { getPetshopAddressString } from '../../../src/services/helpers/servicesHelpers'

import CustomHeader from '../../../src/components/CustomHeader'
import ArrowBackSubHeader from '../../../src/components/ArrowBackSubHeader'
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
  },
  emptyItemsTextStyle: {
    color: Colors.darkBlue,
    fontSize: 16,
    textAlign: 'center'
  }
})

export default function Petshops () {
  const router = useRouter()
  const userData = useSelector(selectUserInformations)

  // Controls whether the modal to select route calculation apps is displayed
  const [showRouteSelectionModal, setShowRouteSelectionModal] = useState(false)

  // The address selected by the client to calculate the route
  const [selectedRouteAddress, setSelectedRouteAddress] = useState('')

  const WhatsappIcon = ({ style }) => {
    return (
      <Image
        source={Images.whatsappIconGreen}
        style={[styles.whatsappIconStyle, style]}
      />
    )
  }

  // Transforms a petshop into a object we can use to display information in the InformationsCard component
  const transformPetshopsObject = petshopsArray => {
    let transformedArray = []
    petshopsArray.forEach(petshop => {
      const petshopName = petshop?.petshopInfo?.name
      const petshopNumber = petshop?.petshopInfo?.phoneNumber
      const petshopAddress = getPetshopAddressString(
        petshop.petshopInfo?.address
      )

      transformedArray.push({
        id: petshop.petshopInfo?.id,
        title: petshopName,
        itemsList: [
          {
            label: 'Contato',
            actionText: `${petshopNumber}`,
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
          }
        ],
        actionButtonText: 'Agendar Serviço',
        // TODO: Add petshop id as a parameter to the schedule screen
        actionButtonOnPress: () => router.push('/services/schedule')
      })
    })

    return transformedArray
  }

  // The client's petshop list already transformed in object for informations card
  const petshopList = transformPetshopsObject(userData?.user?.petshops)

  // Calculates if there is any petshop
  const hasPetshops = petshopList.length > 0

  // Renders all the petshop cards of the client's petshops
  const renderPetshopListCards = () => {
    return petshopList.map((petshop, index) => {
      return (
        <View key={index} style={{ marginBottom: 16 }}>
          <InformationsCard
            titleText={petshop.title}
            itemsList={petshop.itemsList}
            actionButtonText={petshop.actionButtonText}
            actionButtonOnPress={petshop.actionButtonOnPress}
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
          <View style={{ marginBottom: 24 }}>
            <ArrowBackSubHeader
              goBack={() => router.back()}
              titleText={'Meus Petshops'}
            />
          </View>
          <View>
            {hasPetshops ? (
              <>{renderPetshopListCards()}</>
            ) : (
              <>
                <View style={{ marginBottom: 24 }}>
                  <Text style={styles.emptyItemsTextStyle}>
                    Você não tem petshops ou ocorreu um erro ao carregar as
                    informações.{'\n'}Tente novamente mais tarde ou contate o
                    seu petshop.
                  </Text>
                </View>
              </>
            )}
          </View>
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
