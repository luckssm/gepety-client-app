import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native'

import Colors from '../../themes/colors'
import Images from '../../themes/images'

const styles = StyleSheet.create({
  inputLabelContainer: {
    // marginBottom: 8
  },
  inputLabelStyle: {
    fontSize: 16,
    color: Colors.lightBlack
  },
  checkboxIconStyle: {
    width: 22,
    height: 22,
    marginRight: 8
  },
  colorLabelStyle: {
    height: 18,
    width: 18,
    borderRadius: 12,
    marginLeft: 4,
    borderWidth: 1,
    borderColor: Colors.lightGray
  }
})

export default function CheckboxInput ({
  isSelected,
  setSelected,
  label,
  labelTextStyle,
  colorLabel
}) {
  const UnselectedCheckbox = () => {
    return (
      <Image
        source={Images.emptyRectangleOrange}
        style={styles.checkboxIconStyle}
      />
    )
  }

  const SelectedCheckbox = () => {
    return (
      <Image
        source={Images.selectedIconOrange}
        style={styles.checkboxIconStyle}
      />
    )
  }

  return (
    <TouchableOpacity
      style={{ flexDirection: 'row', alignItems: 'center' }}
      onPress={setSelected}
    >
      {isSelected ? <SelectedCheckbox /> : <UnselectedCheckbox />}
      <View style={styles.inputLabelContainer}>
        <Text style={[styles.inputLabelStyle, labelTextStyle]}>{label}</Text>
      </View>
      {colorLabel && (
        <View
          style={[styles.colorLabelStyle, { backgroundColor: colorLabel }]}
        />
      )}
    </TouchableOpacity>
  )
}
