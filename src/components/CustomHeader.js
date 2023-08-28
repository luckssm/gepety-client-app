import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native'
import { useRouter } from 'expo-router'
import Colors from '../themes/colors'
import Images from '../themes/images'

const styles = StyleSheet.create({
  headerContainer: {
    height: 92,
    backgroundColor: Colors.lightOrange,
    padding: 16,
    paddingTop: 32,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  headerContainerShadow: {
    shadowColor: Colors.mainShadow,
    shadowOffset: { width: -2, height: 2 },
    shadowOpacity: 0.2,
    elevation: 20
  },
  appLogo: {
    width: undefined,
    height: 30,
    aspectRatio: 3.35
  },
  homeIconContainer: {
    alignItems: 'center',
    marginTop: 8,
    marginRight: 8
  },
  homeIconStyle: {
    width: 24,
    height: 24
  },
  homeIconText: {
    fontSize: 12,
    color: Colors.darkBlue,
    textAlign: 'center'
  }
})

export default function CustomHeader () {
  const router = useRouter()

  const renderAppIcon = () => {
    return <Image style={styles.appLogo} source={Images.appLogo} />
  }

  const renderHomeIcon = () => {
    return <Image style={styles.homeIconStyle} source={Images.homeIconBlue} />
  }

  return (
    <>
      <View style={[styles.headerContainer, styles.headerContainerShadow]}>
        <View style={{ alignSelf: 'flex-end' }}>{renderAppIcon()}</View>
        <TouchableOpacity
          style={styles.homeIconContainer}
          onPress={() => router.push('/')}
        >
          {renderHomeIcon()}
          <Text style={styles.homeIconText}>Início</Text>
        </TouchableOpacity>
      </View>
    </>
  )
}
