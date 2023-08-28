import { useEffect, useState } from 'react'
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Dimensions
} from 'react-native'
import Colors from '../../themes/colors'

import BasicModal from './BasicModal'
import SelectionCard from '../Cards/SelectionCard'
import RoundedPrimaryButton from '../Buttons/RoundedPrimaryButton'
import SearchBar from '../SearchBar'

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '100%',
    maxHeight: '80%'
  },
  titleContainer: {
    marginBottom: 24
  },
  titleTextStyle: {
    fontSize: 20,
    color: Colors.darkBlue,
    fontWeight: 'bold'
  },
  selectionCardsContainer: {
    width: '100%',
    marginBottom: 12
  },
  selectionCardsScrollViewContainer: {
    padding: 8
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%'
  },
  searchBarContainer: {
    paddingHorizontal: 8,
    width: '100%',
    marginBottom: 24
  },
  emptyItemsTextStyle: {
    fontSize: 16,
    color: Colors.darkBlue
  }
})

export default function SearchAndSelectListItemsModal ({
  isVisible,
  title,
  itemsList,
  closeModalAction,
  selectedItemsList,
  addItem,
  removeItem,
  searchBarPlaceholder,
  searchFieldName,
  emptyItemsText
}) {
  // Sets the screen height, so that we can set the ScrollView max height and leave the button inside the modal
  const screenHeight = Dimensions.get('window').height
  // I am honestly not sure why the "-300" works. "0.8" is theoretically because we are setting the modal at 80%. "300" could be then the height of
  // the header + searchbar + button, but I am not sure (before -250 worked, but now only 300 and above works. This behavior is not ok).
  // Putting only 0.4 works, but any number between this and 0.8 does not. Maybe we will have to check if this works for other screen sizes as well.
  const scrollViewMaxHeight = screenHeight * 0.8 - 300

  // Variable with the filtered items list, which are set by the search bar
  const [filteredItemsList, setFilteredItemsList] = useState([...itemsList])

  // If itemsList changes, we have to update our filtered items list as well
  useEffect(() => {
    setFilteredItemsList([...itemsList])
  }, [itemsList])

  // TODO: Make something better for cleaning the filtered list. In the way it is now, when a list is already filtered and the user closes
  // the modal, the complete list is re-rendered while the modal is closing, which feels a bit strange for the user.
  const closeModal = () => {
    closeModalAction()
    setFilteredItemsList([...itemsList])
  }

  // Renders a list of selection card items
  const renderSelectionCardItems = () => {
    return filteredItemsList.length > 0 ? (
      filteredItemsList.map((item, index) => {
        const isItemSelected = selectedItemsList.find(
          selectedItem => selectedItem.id === item.id
        )
        return (
          <View key={index} style={{ marginBottom: 22 }}>
            <SelectionCard
              isSelected={isItemSelected}
              label={item.name}
              onPress={
                isItemSelected ? () => removeItem(item) : () => addItem(item)
              }
            />
          </View>
        )
      })
    ) : (
      <View style={{ alignItems: 'center' }}>
        <Text style={styles.emptyItemsTextStyle}>{emptyItemsText}</Text>
      </View>
    )
  }

  return (
    <BasicModal isVisible={isVisible} closeModalAction={closeModal}>
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.titleTextStyle}>{title}</Text>
        </View>
        <View style={styles.searchBarContainer}>
          <SearchBar
            placeholder={searchBarPlaceholder}
            itemsList={itemsList}
            setFilteredItemsList={setFilteredItemsList}
            filterFieldName={searchFieldName}
          />
        </View>
        <View
          style={[
            styles.selectionCardsContainer,
            { maxHeight: scrollViewMaxHeight }
          ]}
        >
          <ScrollView
            contentContainerStyle={styles.selectionCardsScrollViewContainer}
          >
            {renderSelectionCardItems()}
          </ScrollView>
        </View>
        <View style={styles.buttonContainer}>
          <RoundedPrimaryButton buttonText={'Confirmar'} onPress={closeModal} />
        </View>
      </View>
    </BasicModal>
  )
}
