import { useState } from 'react'
import {
  View,
  TextInput,
  Image,
  StyleSheet,
  TouchableOpacity
} from 'react-native'
import Colors from '../../themes/colors'
import Images from '../../themes/images'

const styles = StyleSheet.create({
  inputContainer: {
    borderWidth: 2,
    borderColor: Colors.darkBlue,
    borderRadius: 30,
    paddingVertical: 8,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center'
  },
  inputIcon: {
    marginHorizontal: 16
  },
  inputStyle: {
    fontSize: 18,
    color: Colors.darkBlue,
    width: '100%',
    flex: 1,
    paddingRight: 8
  },
  visibilityButtonStyle: {
    marginLeft: 'auto',
    marginRight: 16
  },
  visibilityIconStyle: {
    width: 28,
    height: 28
  }
})

export default function RoundedInput ({
  containerExtraStyle,
  inputExtraStyle,
  placeholder,
  icon,
  isPassword,
  defaultValue,
  onChangeText,
  multiline,
  numberOfLines,
  textAlignVertical,
  maxLength,
  keyboardType,
  editable = true
}) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <View style={[styles.inputContainer, containerExtraStyle]}>
      {icon && <View style={styles.inputIcon}>{icon}</View>}
      <TextInput
        keyboardType={keyboardType}
        style={[styles.inputStyle, inputExtraStyle]}
        placeholder={placeholder}
        placeholderTextColor={Colors.mediumGray}
        secureTextEntry={isPassword && !showPassword}
        onChangeText={text => onChangeText(text)}
        defaultValue={defaultValue}
        multiline={multiline}
        numberOfLines={numberOfLines}
        textAlignVertical={textAlignVertical}
        maxLength={maxLength}
        editable={editable}
      ></TextInput>
      {isPassword && (
        <TouchableOpacity
          style={styles.visibilityButtonStyle}
          onPress={() => setShowPassword(!showPassword)}
        >
          {showPassword ? (
            <Image
              style={styles.visibilityIconStyle}
              source={Images.visibilityIcon}
            />
          ) : (
            <Image
              style={styles.visibilityIconStyle}
              source={Images.visibilityOffIcon}
            />
          )}
        </TouchableOpacity>
      )}
    </View>
  )
}
