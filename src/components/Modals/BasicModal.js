import { StyleSheet, View } from 'react-native'
import RNModal from 'react-native-modal'
import Colors from '../../themes/colors'

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: Colors.white,
    borderRadius: 25,
    padding: 16,
    alignItems: 'center',
    maxHeight: '90%'
  }
})

export default function BasicModal ({ isVisible, children, closeModalAction }) {
  return (
    <RNModal
      isVisible={isVisible}
      animationInTiming={800}
      animationOutTiming={800}
      backdropTransitionInTiming={600}
      backdropTransitionOutTiming={0}
      onBackdropPress={closeModalAction}
      //  hideModalContentWhileAnimating={true} // if the backdrop flickers on close, try setting this back to true
    >
      <View style={styles.modalContainer}>{children}</View>
    </RNModal>
  )
}
