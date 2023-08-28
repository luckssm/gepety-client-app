import { StyleSheet, Image } from 'react-native'

import Images from '../../themes/images'

import { openMaps, openWaze } from '../../services/helpers/generalHelpers'

import ItemsListActionModal from './ItemsListActionModal'

const styles = StyleSheet.create({
  navAppIconStyle: {
    width: 40,
    height: 40,
    marginRight: 12
  }
})

export default function AddressRouteSelectionModal ({
  isVisible,
  closeModalAction,
  isModalLoading,
  address
}) {
  const WazeIcon = () => {
    return <Image source={Images.wazeIcon} style={styles.navAppIconStyle} />
  }

  const MapsIcon = () => {
    return <Image source={Images.mapsIcon} style={styles.navAppIconStyle} />
  }

  const addressNavigationItems = [
    {
      label: 'Waze',
      icon: <WazeIcon />,
      action: () => openWaze(address)
    },
    {
      label: 'Maps',
      icon: <MapsIcon />,
      action: () => openMaps(address)
    }
  ]

  return (
    <ItemsListActionModal
      isVisible={isVisible}
      titleText={'Escolha o aplicativo de rotas:'}
      actionItems={addressNavigationItems}
      isModalLoading={isModalLoading}
      closeModalAction={closeModalAction}
    />
  )
}
