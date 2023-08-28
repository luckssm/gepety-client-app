import {
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native'
import Colors from '../../themes/colors'

const styles = StyleSheet.create({
  buttonStyle: {
    backgroundColor: Colors.orange,
    borderRadius: 25,
    padding: 12,
    // width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.mainShadow,
    shadowOffset: { width: -1, height: 1 },
    shadowOpacity: 0.2,
    elevation: 2,
    shadowRadius: 4
  },
  buttonTextStyle: {
    fontSize: 16,
    color: Colors.lightBlack
  }
})

export default function RoundedSecondaryButton ({
  style,
  buttonText,
  onPress,
  isLoading,
  disabled
}) {
  return (
    <TouchableOpacity
      style={[styles.buttonStyle, style]}
      onPress={() => !disabled && !isLoading && onPress()}
    >
      {isLoading ? (
        <ActivityIndicator size='small' color={Colors.white} />
      ) : (
        <Text style={styles.buttonTextStyle}>{buttonText}</Text>
      )}
    </TouchableOpacity>
  )
}
