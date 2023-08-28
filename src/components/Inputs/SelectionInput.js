import { useEffect, useState } from 'react'
import {
  StyleSheet,
  View,
  Text,
  Platform,
  TouchableOpacity,
  Image
} from 'react-native'
import { Picker } from '@react-native-picker/picker'

import Colors from '../../themes/colors'
import Images from '../../themes/images'

import BasicModal from '../Modals/BasicModal'

const styles = StyleSheet.create({
  selectionInputStyle: {
    backgroundColor: Colors.white,
    borderRadius: 24,
    paddingHorizontal: 8,
    borderColor: Colors.orange,
    borderWidth: 1,
    shadowColor: Colors.mainShadow,
    shadowOffset: { width: -1, height: 1 },
    shadowOpacity: 0.2,
    elevation: 4,
    shadowRadius: 4
  },
  inputLabelContainer: {
    marginBottom: 8
  },
  inputLabelStyle: {
    fontSize: 18,
    color: Colors.darkBlue
  },
  iosSelectionInputStyle: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  iosInputTextStyle: {
    fontSize: 16,
    color: Colors.lightBlack
  },
  dropdownIconStyle: {
    height: 16,
    width: 16
  },
  iosModalPickerButtonStyle: {
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    shadowColor: Colors.mainShadow,
    shadowOffset: { width: -1, height: 1 },
    shadowOpacity: 0.2,
    elevation: 4,
    shadowRadius: 4,
    backgroundColor: Colors.success
  },
  iosModalPickerButtonTextStyle: {
    color: Colors.lightBlack,
    textAlign: 'center'
  }
})

export default function SelectionInput ({
  enabled = true,
  selectionItems = [],
  selectLabelText,
  selectedItem,
  setSelectedItem,
  inputLabel,
  hideDropdown
}) {
  // In iOS, the @react-native-picker/picker library uses the native picker, which is something like a roll. The problem is that this picker
  // is displayed in our input, which makes it look terrible. Because of this, we had to make a picker only for iOS. This is how it works:
  // We have the input, just like the android one. The difference is that when we click on it, we open a modal and inside this modal, we
  // use the native iOS picker. For Android, we are just using the native picker.
  const isIOS = Platform.OS === 'ios'
  const [showModal, setShowModal] = useState(false)
  const [selectedItemIosLabel, setSelectedItemIosLabel] = useState(
    selectLabelText
  )

  // Used only for our custom iOS picker, because we need to get the item here to show in our own input component
  const getSelectedItem = () => {
    return selectionItems.find(item => item.value === selectedItem)
  }

  // Used only for our custom iOS picker. Sets the current selected item label inside the input.
  // We also check for selectLabelText changes to update it if needed
  useEffect(() => {
    const selectedItem = getSelectedItem()
    if (selectedItem) {
      setSelectedItemIosLabel(selectedItem.label)
    } else {
      setSelectedItemIosLabel(selectLabelText)
    }
  }, [selectedItem, selectLabelText])

  // Renders the picker options
  const renderPickerItems = () => {
    return selectionItems.map((item, index) => {
      return <Picker.Item key={index} label={item.label} value={item.value} />
    })
  }

  // Renders a native picker
  const renderPicker = () => {
    return (
      <Picker
        selectedValue={selectedItem}
        dropdownIconColor={hideDropdown ? Colors.white : Colors.orange}
        enabled={enabled}
        onValueChange={itemValue => setSelectedItem(itemValue)}
      >
        <Picker.Item label={selectLabelText} value='' />
        {renderPickerItems()}
      </Picker>
    )
  }

  // Used only for Android. Allows us to customize our selection input.
  const renderPickerContainer = () => {
    return <View style={styles.selectionInputStyle}>{renderPicker()}</View>
  }

  // Used only for our custom iOS picker. Renders our custom dropdown icon.
  const DropdownIcon = () => {
    return (
      <Image
        style={styles.dropdownIconStyle}
        source={Images.dropdownIconOrange}
      />
    )
  }

  // Used only for our custom iOS picker. Renders the custom select input. When clicked, shows the modal with the native picker.
  const renderIosInput = () => {
    return (
      <TouchableOpacity
        onPress={() => setShowModal(true)}
        disabled={!enabled}
        style={[styles.selectionInputStyle, styles.iosSelectionInputStyle]}
      >
        <Text style={styles.iosInputTextStyle}>{selectedItemIosLabel}</Text>
        {!hideDropdown && <DropdownIcon />}
      </TouchableOpacity>
    )
  }

  // Used only for our custom iOS picker. Renders the modal with the native picker.
  const renderIosModalPicker = () => {
    return (
      <BasicModal
        isVisible={showModal}
        closeModalAction={() => setShowModal(false)}
      >
        <View style={{ width: '100%' }}>
          {renderPicker()}
          <View>
            <TouchableOpacity
              style={styles.iosModalPickerButtonStyle}
              onPress={() => setShowModal(false)}
            >
              <Text style={styles.iosModalPickerButtonTextStyle}>
                Confirmar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </BasicModal>
    )
  }

  return (
    <View>
      {inputLabel && (
        <View style={styles.inputLabelContainer}>
          <Text style={styles.inputLabelStyle}>{inputLabel}</Text>
        </View>
      )}
      {isIOS ? renderIosInput() : renderPickerContainer()}
      {showModal && renderIosModalPicker()}
    </View>
  )
}
