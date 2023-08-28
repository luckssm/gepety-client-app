import { useEffect, useState } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { Stack, useRouter } from 'expo-router'
import { useSelector, useDispatch } from 'react-redux'

import Colors from '../../src/themes/colors'
import Images from '../../src/themes/images'

import { selectUserInformations } from '../../src/redux/slices/userReducer'

import CustomHeader from '../../src/components/CustomHeader'
import ArrowBackSubHeader from '../../src/components/ArrowBackSubHeader'
import CardButtonIconAndText from '../../src/components/Cards/CardButtonIconAndText'
import InformationsCard from '../../src/components/Cards/InformationsCard'
import {
  bodySizeToString,
  furSizeToString
} from '../../src/services/helpers/petHelpers'
import RoundedPrimaryButton from '../../src/components/Buttons/RoundedPrimaryButton'
import { openWhatsapp } from '../../src/services/helpers/generalHelpers'

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
  subtitleTextStyle: {
    fontSize: 18,
    color: Colors.darkBlue,
    textAlign: 'center'
  },
  cardsContainer: {
    marginBottom: 12,
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  singleCardContainer: {
    width: '50%',
    justifyContent: 'center',
    flexDirection: 'row',
    marginBottom: 24
  },
  emptyItemsTextStyle: {
    color: Colors.darkBlue,
    fontSize: 16,
    textAlign: 'center'
  },
  fixedButtonContainer: {
    marginTop: 'auto',
    width: '100%',
    paddingHorizontal: 32,
    paddingBottom: 24
  }
})

export default function Pets () {
  const router = useRouter()
  const userData = useSelector(selectUserInformations)

  // stores the client's petshops
  const petshops = userData?.user?.petshops

  // Calculates if there is any petshop
  const hasPetshops = petshops?.length > 0

  // stores pets petshop
  const [selectedPetshop, setSelectedPetshop] = useState()

  // when the page is rendered it checks the amount of petshops of the client if it is only 1 it is already selected
  useEffect(() => {
    if (petshops?.length === 1) {
      setSelectedPetshop(petshops[0])
    }
  }, [petshops])

  // renders petshops cards
  const renderPetshopCards = () => {
    return petshops?.map((petshop, index) => (
      <View
        key={petshop.clientPetshopInfo.petshopId}
        style={[
          styles.singleCardContainer,
          index % 2 === 0 && { paddingRight: 12 },
          index % 2 === 1 && { paddingLeft: 12 }
        ]}
      >
        <CardButtonIconAndText
          icon={Images.homeIconBlue}
          cardText={petshop.petshopInfo.name}
          onPress={() => setSelectedPetshop(petshop)}
        />
      </View>
    ))
  }

  // defines if the back button goes to the petshops or to the menu
  const goBack = () => {
    return selectedPetshop && petshops?.length > 1
      ? setSelectedPetshop()
      : router.back()
  }

  // renders the client's petshops
  const renderPetshopSelection = () => {
    return hasPetshops ? (
      <>
        <View style={{ marginBottom: 24 }}>
          <Text style={styles.subtitleTextStyle}>Selecione o petshop:</Text>
        </View>
        <View style={styles.cardsContainer}>{renderPetshopCards()}</View>
      </>
    ) : (
      <>
        <View style={{ marginBottom: 24 }}>
          <Text style={styles.emptyItemsTextStyle}>
            Você não tem petshops ou ocorreu um erro ao carregar as informações.
            {'\n'}Tente novamente mais tarde ou contate o seu petshop.
          </Text>
        </View>
      </>
    )
  }

  // renders the client's pets
  const renderPets = () => {
    const pets = selectedPetshop?.pets
    return pets?.map(pet => {
      const petItemList = [
        {
          label: 'Raça',
          content: pet.breed
        },
        {
          label: 'Porte',
          content: bodySizeToString(pet.bodySize)
        },
        {
          label: 'Pelo',
          content: furSizeToString(pet.furSize)
        }
      ]
      return (
        <View key={pet.id} style={{ marginBottom: 16 }}>
          <InformationsCard
            titleText={pet.name}
            itemsList={petItemList}
            titleTextStyle={{
              color: Colors.darkBlue,
              fontSize: 18
            }}
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
        <ScrollView style={styles.scrollViewContainerStyle}>
          <View style={{ marginBottom: 24 }}>
            <ArrowBackSubHeader goBack={goBack} titleText={'Meus Pets'} />
          </View>
          <View style={{ marginBottom: 24 }}>
            {selectedPetshop ? (
              <>
                <Text style={[styles.subtitleTextStyle, { marginBottom: 16 }]}>
                  {selectedPetshop?.petshopInfo?.name}
                </Text>
                {renderPets()}
              </>
            ) : (
              renderPetshopSelection()
            )}
          </View>
        </ScrollView>
        {selectedPetshop && (
          <View style={styles.fixedButtonContainer}>
            <RoundedPrimaryButton
              onPress={() => {
                openWhatsapp({
                  phone: selectedPetshop.petshopInfo?.phoneNumber,
                  phoneCountryCode: '+55'
                })
              }}
              buttonText={'Solicitar Atualização de Dados'}
            />
          </View>
        )}
      </View>
    </>
  )
}
