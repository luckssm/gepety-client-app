import {
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native'
import Colors from '../../themes/colors'

const styles = StyleSheet.create({
  buttonStyle: {
    backgroundColor: Colors.darkLighterBlue,
    borderRadius: 25,
    padding: 12,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.mainShadow,
    shadowOffset: { width: -1, height: 1 },
    shadowOpacity: 0.2,
    elevation: 6,
    shadowRadius: 4
  },
  buttonTextStyle: {
    fontSize: 18,
    color: Colors.white
  }
})

export default function RoundedPrimaryButton ({
  style,
  buttonText,
  onPress,
  isLoading,
  buttonTextStyle
}) {
  return (
    <TouchableOpacity
      style={[styles.buttonStyle, style]}
      onPress={() => !isLoading && onPress()}
    >
      {isLoading ? (
        <ActivityIndicator size='small' color={Colors.white} />
      ) : (
        <Text style={[styles.buttonTextStyle, buttonTextStyle]}>
          {buttonText}
        </Text>
      )}
    </TouchableOpacity>
  )
}
