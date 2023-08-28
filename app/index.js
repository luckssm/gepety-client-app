import { useEffect, useState, useCallback } from 'react'
import { StyleSheet, View, ScrollView, RefreshControl } from 'react-native'
import { Stack, useRouter } from 'expo-router'
import { useSelector, useDispatch } from 'react-redux'

import { LinearGradient } from 'expo-linear-gradient'

import Colors from '../src/themes/colors'
import Images from '../src/themes/images'
import { openWhatsappSupport } from '../src/services/helpers/generalHelpers'

import {
  getLastReqTime,
  selectUserInformations,
  setLastUserReqTime,
  setUserInformations
} from '../src/redux/slices/userReducer'
import { logOut } from '../src/redux/slices/authReducer'
import { clearUser } from '../src/redux/slices/userReducer'
import API from '../src/services/api'

import CustomHeader from '../src/components/CustomHeader'
import CardButtonIconAndText from '../src/components/Cards/CardButtonIconAndText'
import HorizontalCardButtonIconAndText from '../src/components/HorizontalCardButtonIconAndText'
import SimpleModal from '../src/components/Modals/SimpleModal'
import Skeleton from '../src/components/Skeleton'

const styles = StyleSheet.create({
  pageContainer: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center'
  },
  scrollViewContainerStyle: {
    padding: 32
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
  supportCardButtonContainerStyle: {
    width: '100%',
    marginBottom: 18
  }
})

export default function Home () {
  const dispatch = useDispatch()
  const router = useRouter()

  const cardItems = [
    {
      icon: Images.editCalendarIconBlue,
      title: 'Agendar Serviço',
      onPress: () => router.push('/services/schedule')
    },
    {
      icon: Images.calendarIconBlue,
      title: 'Próximos Atendimentos',
      onPress: () => router.push('/services/appointments')
    },
    {
      icon: Images.servicesIconBlue,
      title: 'Serviços',
      onPress: () => router.push('/services')
    },
    {
      icon: Images.paymentIconBlue,
      title: 'Pagamentos',
      onPress: () => router.push('/payments')
    },
    {
      icon: Images.blueProfile,
      title: 'Meus Dados',
      onPress: () => router.push('/account')
    },
    {
      icon: Images.pawIconBlue,
      title: 'Meus Pets',
      onPress: () => router.push('/pets')
    }
  ]

  const userData = useSelector(selectUserInformations)
  const lastUserReqTime = useSelector(getLastReqTime)

  const [isUserDataLoading, setIsUserDataLoading] = useState(false)

  const getSelf = async () =>
    API.getSelfInformations()
      .then(res => {
        dispatch(setUserInformations(res.data))
        const fetchedTime = new Date()
        dispatch(setLastUserReqTime(fetchedTime.getTime()))
      })
      .finally(() => setIsUserDataLoading(false))

  useEffect(() => {
    //  TODO: make page auto reload when going back
    const lastFetched = new Date(lastUserReqTime)
    const now = new Date()
    if (now.getTime() - lastFetched.getTime() > 180000) {
      setIsUserDataLoading(true)
      getSelf()
    }
  }, [])

  const [refreshing, setRefreshing] = useState(false)
  const onRefresh = useCallback(() => {
    setRefreshing(true)
    setIsUserDataLoading(true)
    getSelf()
    setRefreshing(false)
  }, [])

  const [showWhatsappModal, setShowWhatsappModal] = useState(false)
  const [showExitModal, setShowExitModal] = useState(false)

  const logUserOut = () => {
    dispatch(logOut())
    dispatch(clearUser())
    router.push('/login')
  }

  const renderSkeleton = () => {
    return (
      <View
        style={[
          styles.cardsContainer,
          { width: '100%', height: '100%', padding: 32 }
        ]}
      >
        {cardItems.map((cardItem, index) => {
          return (
            <View
              key={index}
              style={[
                styles.singleCardContainer,
                index % 2 === 0 && { paddingRight: 12 },
                index % 2 === 1 && { paddingLeft: 12 }
              ]}
            >
              <Skeleton
                style={{
                  width: '100%',
                  height: 125,
                  borderRadius: 12
                }}
              />
            </View>
          )
        })}
        <Skeleton
          style={{
            width: '100%',
            height: 54,
            borderRadius: 12,
            marginBottom: 24
          }}
        />
        <Skeleton
          style={{
            width: '100%',
            height: 54,
            borderRadius: 12,
            marginBottom: 24
          }}
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
      <LinearGradient
        colors={[Colors.lightBlue, Colors.mediumBlue]}
        style={styles.pageContainer}
      >
        {isUserDataLoading ? (
          renderSkeleton()
        ) : (
          <ScrollView
            contentContainerStyle={styles.scrollViewContainerStyle}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            {/* {renderSkeleton()} */}
            <View style={styles.cardsContainer}>
              {cardItems.map((cardItem, index) => {
                return (
                  <View
                    key={index}
                    style={[
                      styles.singleCardContainer,
                      index % 2 === 0 && { paddingRight: 12 },
                      index % 2 === 1 && { paddingLeft: 12 }
                    ]}
                  >
                    <CardButtonIconAndText
                      icon={cardItem.icon}
                      cardText={cardItem.title}
                      onPress={cardItem.onPress}
                    />
                  </View>
                )
              })}
            </View>
            <View style={styles.supportCardButtonContainerStyle}>
              <HorizontalCardButtonIconAndText
                icon={Images.supportIconBlack}
                cardText={'Suporte'}
                style={{ backgroundColor: Colors.lightOrange }}
                onPress={() => setShowWhatsappModal(true)}
              />
            </View>
            <HorizontalCardButtonIconAndText
              icon={Images.exitIconBlack}
              cardText={'Sair'}
              style={{ backgroundColor: Colors.lightGray }}
              onPress={() => setShowExitModal(true)}
            />
          </ScrollView>
        )}

        <SimpleModal
          isVisible={showWhatsappModal}
          setIsVisible={setShowWhatsappModal}
          title={'Contatar suporte via Whatsapp'}
          bodyText={
            'Clique no botão abaixo para contatar o suporte via Whatsapp para questões técnicas (erros do aplicativo).\n\nPara problemas relacionados a algum serviço, contate o petshop responsável.\n\nNosso horário de atendimento é das 09h às 12h e das 14h às 18h.'
          }
          firstButtonText={'Cancelar'}
          firstButtonAction={() => setShowWhatsappModal(false)}
          secondButtonText={'Suporte'}
          secondButtonAction={openWhatsappSupport}
          closeModalAction={() => setShowWhatsappModal(false)}
        />
        <SimpleModal
          isVisible={showExitModal}
          setIsVisible={setShowExitModal}
          title={'Deseja sair do aplicativo?'}
          bodyText={
            'Clique no botão abaixo para sair do aplicativo.\n\nQuando quiser acessar, será necessário realizar o login novamente.'
          }
          firstButtonText={'Sair'}
          firstButtonAction={() => logUserOut()}
          secondButtonText={'Continuar no App'}
          secondButtonAction={() => setShowExitModal(false)}
          closeModalAction={() => setShowExitModal(false)}
        />
      </LinearGradient>
    </>
  )
}
