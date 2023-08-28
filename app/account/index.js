import { useEffect, useState } from 'react'
import { StyleSheet, View, ScrollView, Text, Image } from 'react-native'
import { Stack, useRouter } from 'expo-router'
import { useSelector, useDispatch } from 'react-redux'

import Colors from '../../src/themes/colors'
import Images from '../../src/themes/images'

import { openWhatsapp } from '../../src/services/helpers/generalHelpers'
import { selectUserInformations } from '../../src/redux/slices/userReducer'
import { getPetshopAddressString } from '../../src/services/helpers/servicesHelpers'
import { centsToText } from '../../src/services/helpers/money'

import CustomHeader from '../../src/components/CustomHeader'
import ArrowBackSubHeader from '../../src/components/ArrowBackSubHeader'
import InformationsCard from '../../src/components/Cards/InformationsCard'
import ItemsListActionModal from '../../src/components/Modals/ItemsListActionModal'

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
    height: 24,
    width: 24,
    marginRight: 8
  },
  emptyItemsTextStyle: {
    color: Colors.darkBlue,
    fontSize: 16,
    textAlign: 'center'
  },
  informationTextStyle: {
    color: Colors.darkBlue,
    fontSize: 18,
    textAlign: 'center'
  }
})

export default function Petshops () {
  const router = useRouter()
  const userData = useSelector(selectUserInformations)

  // Controls whether the modal to select route calculation apps is displayed
  const [showItemsListActionModal, setShowItemsListActionModal] = useState(
    false
  )

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
      const clientAddress = getPetshopAddressString(petshop.clientAddress)

      const deliveryTime = petshop.clientAddress?.deliveryTime
      const deliveryValue = petshop.clientAddress?.deliveryValue
        ? centsToText(petshop.clientAddress?.deliveryValue)
        : centsToText(0)

      transformedArray.push({
        id: petshop.petshopInfo?.id,
        title: petshopName,
        petshopNumber,
        itemsList: [
          {
            label: 'Meu Endereço',
            content: clientAddress
          },
          {
            label: 'Valor Leva e Traz',
            content: deliveryValue
          },
          {
            label: 'Tempo estimado Leva e Traz',
            content: `${deliveryTime ? deliveryTime : 0} min`
          }
        ],
        actionButtonText: 'Solicitar Atualização de Endereço',
        actionButtonOnPress: () =>
          openWhatsapp({ phone: petshopNumber, phoneCountryCode: '+55' })
      })
    })

    return transformedArray
  }

  // The client's petshop list already transformed in object for informations card
  const petshopList = transformPetshopsObject(userData?.user?.petshops)

  // Calculates if there is any petshop
  const hasPetshops = petshopList.length > 0

  // Transforms client data into a object we can use to display information in the InformationsCard component
  const transformClientDataObject = user => {
    const name = user?.user.name
    const email = user?.user.email
    const phoneNumber = user?.user.phoneNumber
    const additionalPhoneNumber = user?.user.additionalPhoneNumber

    return {
      title: 'Dados',
      itemsList: [
        {
          label: 'Nome',
          content: name
        },
        {
          label: 'Telefone principal',
          content: phoneNumber
        },
        {
          label: 'Telefone adicional',
          content: additionalPhoneNumber
        },
        {
          label: 'E-mail',
          content: email
        }
      ],
      actionButtonText: hasPetshops ? 'Solicitar Atualização de Dados' : null,
      // If there is only one petshop, send message to it, without opening the modal. Otherwise, opens the modal with the petshop list for selection.
      actionButtonOnPress: () => {
        petshopList.length > 1
          ? setShowItemsListActionModal(true)
          : openWhatsapp({
              phone: user.user?.petshops[0]?.petshopInfo?.phoneNumber,
              phoneCountryCode: '+55'
            })
      }
    }
  }

  // The client data already transformed in object for informations card
  const clientData = transformClientDataObject(userData)

  // The array with the petshops' info that will be used for when a client desires to change its personal data.
  // For now, the client can send a message to the desired petshop and request the data change.
  const getPetshopDataChangeObject = petshopList => {
    let petshopDataChange = []
    petshopList.forEach(petshop => {
      petshopDataChange.push({
        label: petshop.title,
        icon: <WhatsappIcon />,
        action: () =>
          openWhatsapp({
            phone: petshop.petshopNumber,
            phoneCountryCode: '+55'
          })
      })
    })
    return petshopDataChange
  }

  const petshopRequestDataChangeItems = getPetshopDataChangeObject(petshopList)

  // Renders all the petshop cards of the client's petshops with the client's delivery time, value and address
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

  // Renders the data of the client
  const renderClientDataCard = () => {
    return (
      <View style={{ marginBottom: 16 }}>
        <InformationsCard
          titleText={clientData.title}
          itemsList={clientData.itemsList}
          actionButtonText={clientData.actionButtonText}
          actionButtonOnPress={clientData.actionButtonOnPress}
          isPrimaryButtonAction={true}
        />
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
        <ScrollView contentContainerStyle={styles.scrollViewContainerStyle}>
          <View style={{ marginBottom: 24 }}>
            <ArrowBackSubHeader
              goBack={() => router.back()}
              titleText={'Meus Dados'}
            />
          </View>
          <View style={{ marginBottom: 24 }}>
            <View style={{ marginBottom: 24 }}>
              <Text style={styles.informationTextStyle}>
                Dados gerais (para todos os petshops):
              </Text>
            </View>
            {renderClientDataCard()}
          </View>
          <View>
            {hasPetshops ? (
              <>
                <View style={{ marginBottom: 24 }}>
                  <Text style={styles.informationTextStyle}>
                    {petshopList.length > 1
                      ? 'Dados do Leva e Traz em cada Petshop:'
                      : 'Dados do Leva e Traz:'}
                  </Text>
                </View>
                {renderPetshopListCards()}
              </>
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
        <ItemsListActionModal
          isVisible={showItemsListActionModal}
          titleText={'Selecione o Petshop para realizar a solicitação:'}
          actionItems={petshopRequestDataChangeItems}
          closeModalAction={() => setShowItemsListActionModal(false)}
        />
      </View>
    </>
  )
}
