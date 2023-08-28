import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator
} from 'react-native'
import Colors from '../../themes/colors'

import BasicModal from './BasicModal'

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '100%'
  },
  titleContainer: {
    marginBottom: 24
  },
  titleTextStyle: {
    fontSize: 20,
    color: Colors.darkBlue,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  bodyContainer: {
    marginBottom: 24
  },
  bodyTextStyle: {
    color: Colors.darkBlue,
    textAlign: 'center'
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%'
  },
  buttonStyle: {
    borderRadius: 24,
    width: '45%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    shadowColor: Colors.mainShadow,
    shadowOffset: { width: -1, height: 1 },
    shadowOpacity: 0.2,
    elevation: 4,
    shadowRadius: 4
  },
  firstButtonStyle: {
    backgroundColor: Colors.danger
  },
  secondButtonStyle: {
    backgroundColor: Colors.success
  },
  firstButtonTextStyle: {
    color: Colors.white,
    textAlign: 'center'
  },
  secondButtonTextStyle: {
    color: Colors.lightBlack,
    textAlign: 'center'
  }
})

export default function SimpleModal ({
  isVisible,
  title,
  bodyText,
  bodyContent,
  firstButtonText,
  secondButtonText,
  firstButtonAction,
  secondButtonAction,
  closeModalAction,
  isModalLoading,
  modalLoadingTitleText,
  modalLoadingBodyText
}) {
  const renderModalLoadingContent = () => {
    return (
      <>
        <View style={styles.titleContainer}>
          <Text style={styles.titleTextStyle}>{modalLoadingTitleText}</Text>
        </View>
        <View style={styles.bodyContainer}>
          <Text style={styles.bodyTextStyle}>{modalLoadingBodyText}</Text>
          <View style={{ marginTop: 16 }}>
            <ActivityIndicator size='large' color={Colors.darkBlue} />
          </View>
        </View>
      </>
    )
  }

  const renderModalContent = () => {
    return (
      <>
        <View style={styles.titleContainer}>
          <Text style={styles.titleTextStyle}>{title}</Text>
        </View>
        <View style={styles.bodyContainer}>
          {bodyContent ? (
            bodyContent
          ) : (
            <Text style={styles.bodyTextStyle}>{bodyText}</Text>
          )}
        </View>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={[styles.buttonStyle, styles.firstButtonStyle]}
            onPress={firstButtonAction}
          >
            <Text style={styles.firstButtonTextStyle}>{firstButtonText}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.buttonStyle, styles.secondButtonStyle]}
            onPress={secondButtonAction}
          >
            <Text style={styles.secondButtonTextStyle}>{secondButtonText}</Text>
          </TouchableOpacity>
        </View>
      </>
    )
  }

  return (
    <BasicModal
      isVisible={isVisible}
      closeModalAction={isModalLoading ? () => {} : closeModalAction}
    >
      <View style={styles.container}>
        {isModalLoading ? renderModalLoadingContent() : renderModalContent()}
      </View>
    </BasicModal>
  )
}
