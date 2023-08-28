import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native'
import Colors from '../../themes/colors'

const styles = StyleSheet.create({
  cardStyle: {
    backgroundColor: Colors.white,
    height: 125,
    width: '100%',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.mainShadow,
    shadowOffset: { width: -1, height: 1 },
    shadowOpacity: 0.2,
    elevation: 6,
    shadowRadius: 4
  },
  cardIconStyle: {
    width: 42,
    height: 42
  },
  cardTextStyle: {
    color: Colors.darkBlue,
    textAlign: 'center'
  }
})

export default function CardButtonIconAndText ({
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
      <View style={{ marginBottom: 8 }}>
        <CardIcon />
      </View>
      <View>
        <Text style={styles.cardTextStyle}>{cardText}</Text>
      </View>
    </TouchableOpacity>
  )
}
