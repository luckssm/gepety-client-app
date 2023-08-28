import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native'
import Colors from '../themes/colors'
import Images from '../themes/images'

const styles = StyleSheet.create({
  subHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center'
    // justifyContent: 'flex-start',
    // width: '100%',
    // marginLeft: 'auto'
    // justifyContent: 'space-between'
  },
  appLogo: {
    height: 24,
    width: 24
  },
  goBackTextStyle: {
    fontSize: 14,
    color: Colors.darkBlue,
    marginTop: -2
  },
  titleTextStyle: {
    fontSize: 22,
    color: Colors.darkBlue,
    textAlign: 'center'
  }
})

export default function ArrowBackSubHeader ({ goBack, titleText }) {
  const ArrowBackIcon = () => {
    return <Image style={styles.appLogo} source={Images.arrowBackIcon} />
  }

  const onArrowClick = () => goBack()

  return (
    <>
      <View style={[styles.subHeaderContainer]}>
        <TouchableOpacity
          onPress={onArrowClick}
          style={{ alignItems: 'center', marginRight: 8, marginBottom: -4 }}
        >
          <ArrowBackIcon />
        </TouchableOpacity>
        <View style={{ width: '80%', justifyContent: 'center' }}>
          <Text style={styles.titleTextStyle}>{titleText}</Text>
        </View>
      </View>
    </>
  )
}
