import { useState } from 'react'
import {
  View,
  TextInput,
  Image,
  StyleSheet,
  TouchableOpacity
} from 'react-native'

import Colors from '../themes/colors'
import Images from '../themes/images'
import { stringHasSubstring } from '../services/helpers/generalHelpers'

const styles = StyleSheet.create({
  inputContainer: {
    borderWidth: 1,
    borderColor: Colors.mediumOrange,
    borderRadius: 30,
    paddingVertical: 8,
    paddingHorizontal: 16,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center'
  },
  inputIcon: {
    marginHorizontal: 16
  },
  inputStyle: {
    fontSize: 16,
    color: Colors.darkBlue,
    width: '80%'
  },
  visibilityButtonStyle: {
    marginLeft: 'auto',
    marginRight: 16
  },
  searchIconStyle: {
    width: 26,
    height: 26
  }
})

export default function SearchBar ({
  style,
  placeholder,
  icon,
  defaultValue,
  itemsList,
  filteredItemsList,
  setFilteredItemsList,
  filterFieldName,
  onChangeText
}) {
  // Filters a list of items based on the field name received by filterFieldName props
  const filterItemsList = input => {
    const filteredList = itemsList.filter(item =>
      stringHasSubstring(item[filterFieldName], input)
    )
    setFilteredItemsList(filteredList)
  }

  const SearchIcon = () => {
    return (
      <Image source={Images.searchIconBlue} style={styles.searchIconStyle} />
    )
  }

  return (
    <View style={styles.inputContainer}>
      <View style={{ marginRight: 12 }}>
        <SearchIcon />
      </View>
      <TextInput
        style={[styles.inputStyle, style]}
        placeholder={placeholder}
        placeholderTextColor={Colors.mediumGray}
        onChangeText={text => filterItemsList(text)}
        defaultValue={defaultValue}
      ></TextInput>
    </View>
  )
}
