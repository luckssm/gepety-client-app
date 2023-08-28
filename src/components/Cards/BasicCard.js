import { StyleSheet, View } from 'react-native'
import Colors from '../../themes/colors'

const styles = StyleSheet.create({
  cardStyle: {
    backgroundColor: Colors.white,
    width: '100%',
    borderRadius: 10,
    padding: 12,
    // alignItems: 'center',
    // justifyContent: 'center',
    shadowColor: Colors.mainShadow,
    shadowOffset: { width: -1, height: 1 },
    shadowOpacity: 0.2,
    elevation: 4,
    shadowRadius: 4
  }
})

export default function BasicCard ({ children, style }) {
  return <View style={[styles.cardStyle, style]}>{children}</View>
}
