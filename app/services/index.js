import { StyleSheet, View, ScrollView } from 'react-native'
import { Stack, useRouter } from 'expo-router'

import { LinearGradient } from 'expo-linear-gradient'

import Colors from '../../src/themes/colors'
import Images from '../../src/themes/images'

import CustomHeader from '../../src/components/CustomHeader'
import CardButtonIconAndText from '../../src/components/Cards/CardButtonIconAndText'
import ArrowBackSubHeader from '../../src/components/ArrowBackSubHeader'

const styles = StyleSheet.create({
  pageContainer: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center'
  },
  scrollViewContainerStyle: {
    paddingVertical: 24,
    paddingHorizontal: 32
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
  }
})

export default function Services () {
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
      icon: Images.paperIconBlue,
      title: 'Histórico de Serviços',
      onPress: () => router.push('/services/history')
    },
    {
      icon: Images.storeIconBlue,
      title: 'Meus Petshops',
      onPress: () => router.push('/services/petshops')
    }
  ]

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
        <ScrollView contentContainerStyle={styles.scrollViewContainerStyle}>
          <View style={{ marginBottom: 36 }}>
            <ArrowBackSubHeader
              goBack={() => router.back()}
              titleText={'Serviços'}
            />
          </View>
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
        </ScrollView>
      </LinearGradient>
    </>
  )
}
