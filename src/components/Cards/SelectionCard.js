import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native'

import Colors from '../../themes/colors'
import Images from '../../themes/images'

import BasicCard from './BasicCard'

const styles = StyleSheet.create({
  cardStyle: {
    padding: 0
  },
  selectedCardStyle: {
    borderWidth: 1,
    borderColor: Colors.mediumOrange
  },
  cardButtonContainer: {
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12
  },
  cardLabelStyle: {
    fontSize: 16
  },
  selectionIconStyle: {
    width: 18,
    height: 18,
    marginRight: 12
  },
  unselectedRoundedIconStyle: {
    width: 18,
    height: 18,
    borderWidth: 1,
    borderColor: Colors.orange,
    borderRadius: 10,
    marginRight: 12
  }
})

export default function SelectionCard ({
  style,
  isSelected,
  label,
  onPress,
  roundedSelectionIcon
}) {
  const DefaultSelectionIcon = () => {
    return isSelected ? (
      <Image
        source={Images.selectedIconOrange}
        style={styles.selectionIconStyle}
      />
    ) : (
      <Image
        source={Images.emptyRectangleOrange}
        style={styles.selectionIconStyle}
      />
    )
  }

  const RoundedSelectionIcon = () => {
    return isSelected ? (
      <Image
        source={Images.selectedRoundedIconOrange}
        style={styles.selectionIconStyle}
      />
    ) : (
      <View style={styles.unselectedRoundedIconStyle} />
    )
  }

  const renderSelectionIcon = () => {
    if (roundedSelectionIcon) {
      return <RoundedSelectionIcon />
    }
    return <DefaultSelectionIcon />
  }

  return (
    <BasicCard
      style={[styles.cardStyle, style, isSelected && styles.selectedCardStyle]}
    >
      <TouchableOpacity style={styles.cardButtonContainer} onPress={onPress}>
        <View>{renderSelectionIcon()}</View>
        <View>
          <Text style={styles.cardLabelStyle}>{label}</Text>
        </View>
      </TouchableOpacity>
    </BasicCard>
  )
}
