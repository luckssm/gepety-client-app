import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native'
import Colors from '../themes/colors'

const styles = StyleSheet.create({
  cardStyle: {
    width: '100%',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: Colors.mainShadow,
    shadowOffset: { width: -1, height: 1 },
    shadowOpacity: 0.2,
    elevation: 2,
    shadowRadius: 4
  },
  cardIconStyle: {
    width: 32,
    height: 32
  },
  cardTextStyle: {
    color: Colors.lightBlack,
    textAlign: 'center'
  }
})

export default function HorizontalCardButtonIconAndText ({
  style,
  icon,
  cardText,
  onPress
}) {
  const CardIcon = () => {
    return <Image source={icon} style={styles.cardIconStyle} />
  }

  return (
    <TouchableOpacity style={[styles.cardStyle, style]} onPress={onPress}>
      <View style={{ marginRight: 12 }}>
        <CardIcon />
      </View>
      <View>
        <Text style={styles.cardTextStyle}>{cardText}</Text>
      </View>
    </TouchableOpacity>
  )
}
