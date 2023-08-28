import { StyleSheet, Text, Image, View, TouchableOpacity } from 'react-native'

import Colors from '../../themes/colors'
import Images from '../../themes/images'

const styles = StyleSheet.create({
  toastContainer: {
    backgroundColor: Colors.toastErrorBackground,
    borderRadius: 25,
    padding: 12,
    minWidth: '80%',
    maxWidth: '80%',
    marginHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  toastMessageStyle: {
    fontSize: 16,
    color: Colors.white,
    textAlign: 'center'
  },
  toastIconStyle: {
    width: 32,
    height: 32
  },
  closeIconStyle: {
    width: 20,
    height: 20
  }
})

export default function CustomErrorToast ({ toastProps }) {
  const hideToast = () => {
    toast.hide(toastProps.id)
  }

  return (
    <View style={styles.toastContainer}>
      <Image style={styles.toastIconStyle} source={Images.errorIconWhite} />
      <View style={{ maxWidth: '80%' }}>
        <Text style={styles.toastMessageStyle}>{toastProps.message}</Text>
      </View>
      <TouchableOpacity onPress={() => hideToast()}>
        <Image style={styles.closeIconStyle} source={Images.closeIconWhite} />
      </TouchableOpacity>
    </View>
  )
}
