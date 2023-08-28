import { StyleSheet, View, Text, TouchableOpacity } from 'react-native'

import Colors from '../../themes/colors'

const styles = StyleSheet.create({
  inputLabelContainer: {
    // marginBottom: 8
  },
  inputLabelStyle: {
    fontSize: 16,
    color: Colors.lightBlack
  }
})

export default function RadioInput ({
  isSelected,
  setSelected,
  label,
  labelTextStyle
}) {
  return (
    <TouchableOpacity
      style={{ flexDirection: 'row', alignItems: 'center' }}
      onPress={setSelected}
    >
      <View
        style={{
          backgroundColor: Colors.white,
          borderWidth: 1,
          borderColor: Colors.orange,
          borderRadius: 12,
          height: 22,
          width: 22,
          marginRight: 8,
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {isSelected && (
          <View
            style={{
              width: 16,
              height: 16,
              borderRadius: 10,
              backgroundColor: Colors.orange
            }}
          />
        )}
      </View>
      <View style={styles.inputLabelContainer}>
        <Text style={[styles.inputLabelStyle, labelTextStyle]}>{label}</Text>
      </View>
    </TouchableOpacity>
  )
}
