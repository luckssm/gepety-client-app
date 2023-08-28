import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native'

import Colors from '../../themes/colors'

import BasicModal from './BasicModal'

const styles = StyleSheet.create({
  titleContainer: {
    marginBottom: 24
  },
  titleTextStyle: {
    fontSize: 20,
    color: Colors.darkBlue,
    fontWeight: 'bold',
    textAlign: 'center'
  }
})

export default function ItemsListActionModal ({
  isVisible,
  titleText,
  actionItems,
  closeModalAction,
  isModalLoading
}) {
  const renderActionItems = () => {
    return actionItems.map((item, index) => {
      return (
        <View key={index} style={{ width: '100%' }}>
          <TouchableOpacity
            onPress={item.action}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              width: '100%',
              borderWidth: 1,
              borderColor: Colors.lightGray,
              borderRadius: 24,
              padding: 16,
              marginBottom: 16
            }}
          >
            {item.icon}
            <Text style={{ fontSize: 20, color: Colors.lightBlack }}>
              {item.label}
            </Text>
          </TouchableOpacity>
        </View>
      )
    })
  }

  return (
    <BasicModal
      isVisible={isVisible}
      closeModalAction={isModalLoading ? () => {} : closeModalAction}
    >
      <View style={styles.titleContainer}>
        <Text style={styles.titleTextStyle}>{titleText}</Text>
      </View>
      {renderActionItems()}
      <View style={{ marginTop: 16, width: '100%' }}>
        <TouchableOpacity
          style={{
            backgroundColor: Colors.danger,
            borderRadius: 24,
            padding: 12,
            alignItems: 'center'
          }}
          onPress={closeModalAction}
        >
          <Text style={{ color: Colors.white, fontSize: 18 }}> Cancelar </Text>
        </TouchableOpacity>
      </View>
    </BasicModal>
  )
}
