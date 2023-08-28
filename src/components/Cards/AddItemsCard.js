import { useState } from 'react'
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native'

import Colors from '../../themes/colors'
import Images from '../../themes/images'

import BasicCard from './BasicCard'

const styles = StyleSheet.create({
  cardTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  titleTextStyle: {
    color: Colors.lightBlack,
    fontSize: 18
  },
  cardIconStyle: {
    width: 28,
    height: 28
  },
  cardBodyContainer: {
    paddingHorizontal: 16
  },
  cardItemStyle: {
    flexDirection: 'row'
  },
  cancelIconStyle: {
    width: 24,
    height: 24
  },
  cancelIconButtonStyle: {
    marginLeft: 8,
    marginTop: -2
  },
  removeItemConfirmationButton: {
    backgroundColor: Colors.danger,
    borderRadius: 12,
    padding: 4
  },
  removeItemConfirmationButtonText: {
    color: Colors.white,
    fontSize: 12,
    textAlign: 'center'
  }
})

export default function AddItemsCard ({
  style,
  titleText,
  isAddIcon,
  itemsList = [],
  iconButtonAction,
  iconButtonActionEnabled,
  removeItem,
  removeItemDisabled,
  emptyItemsListMessage
}) {
  // Variable to control the confirmation Button exhibition, which will allow the item to be removed when pressed again
  const [removeItemIndexFlag, setRemoveItemIndexFlag] = useState(null)

  // Variable that controls the last hide remove item confirmation timeout, so that we can clear it if a user clicks on other remove button
  // before the confirmation was hidden by the setTimeout function
  const [
    lastHideRemoveItemConfirmationTimeout,
    setLastRemoveItemConfirmationTimeout
  ] = useState(null)

  // 3 seconds after clicked, the remove item flag will be hidden if nothing else is clicked
  const hideRemoveItemConfirmation = () => {
    // This is to clear our timeout function, so that it does not hide a confirmation in less time than expected when the user
    // clicked more than one remove button before the confirmation was hidden (which means the older clicks would hide the newest confirmations).
    if (lastHideRemoveItemConfirmationTimeout) {
      clearTimeout(lastHideRemoveItemConfirmationTimeout)
    }

    const timeout = setTimeout(() => {
      setRemoveItemIndexFlag(null)
      setLastRemoveItemConfirmationTimeout(null)
    }, 3000)

    setLastRemoveItemConfirmationTimeout(timeout)
  }

  const CardIcon = () => {
    return isAddIcon ? (
      <Image source={Images.addCardIconBlue} style={styles.cardIconStyle} />
    ) : (
      <Image source={Images.changeCardIconBlue} style={styles.cardIconStyle} />
    )
  }

  const CancelIcon = () => {
    return (
      <Image source={Images.deleteIconDanger} style={styles.cancelIconStyle} />
    )
  }

  // Will be showed when an item was clicked to be removed. When clicked again while showing this, will remove the item
  const RemoveItemConfirmationButton = () => {
    return (
      <View style={styles.removeItemConfirmationButton}>
        <Text style={styles.removeItemConfirmationButtonText}>
          Aperte p/ {'\n'}remover
        </Text>
      </View>
    )
  }

  const renderCardItems = () => {
    return itemsList.map((item, index) => {
      return (
        <View
          key={index}
          style={[
            styles.cardItemStyle,
            index !== itemsList.length - 1 && { marginBottom: 16 }
          ]}
        >
          <Text style={{ maxWidth: '80%' }}>{item.name}</Text>
          {!removeItemDisabled && (
            <TouchableOpacity
              style={styles.cancelIconButtonStyle}
              onPress={() => {
                if (removeItemIndexFlag === index) {
                  removeItem(item)
                  setRemoveItemIndexFlag(null)
                } else {
                  setRemoveItemIndexFlag(index)
                  hideRemoveItemConfirmation()
                }
              }}
            >
              {removeItemIndexFlag === index ? (
                RemoveItemConfirmationButton()
              ) : (
                <CancelIcon />
              )}
            </TouchableOpacity>
          )}
        </View>
      )
    })
  }

  return (
    <BasicCard style={style}>
      <View style={styles.cardTitleContainer}>
        <Text style={styles.titleTextStyle}>{titleText}</Text>
        {iconButtonActionEnabled && (
          <TouchableOpacity onPress={iconButtonAction}>
            <CardIcon />
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.cardBodyContainer}>
        {itemsList.length === 0 ? (
          <Text>{emptyItemsListMessage}</Text>
        ) : (
          renderCardItems()
        )}
      </View>
    </BasicCard>
  )
}
