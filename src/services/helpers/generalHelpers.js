import { Linking, Platform } from 'react-native'
import AppConfig from '../../config/appConfig'

export const openWhatsapp = ({ text = '', phone, phoneCountryCode }) => {
  const fullPhone = phoneCountryCode ? `${phoneCountryCode}${phone}` : phone
  return Linking.openURL(
    `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}${
      phone ? `&phone=${fullPhone}` : ''
    }
    `
  )
}

export const openWhatsappSupport = () => {
  // TODO: If needed, add support text
  // const supportText = ''
  return openWhatsapp({ phone: AppConfig.supportPhoneNumber })
}

// Returns a string with lower case and without accents
export const getCleanString = string => {
  return string
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

// Returns whether a substring is contained in a string
export const stringHasSubstring = (string, substring) => {
  return getCleanString(string).includes(getCleanString(substring))
}

// Opens maps option
export const openMaps = query => {
  const platform = Platform.OS

  const getMapsURL = platform => {
    /* if we're on iOS, open in Apple Maps */
    if (platform === 'ios') {
      return `maps://?daddr=${query}`
    } else if (platform === 'android') {
      return `geo://?q=${query}`
    }
  }

  Linking.openURL(getMapsURL(platform))
}

// Opens waze app
export const openWaze = query => {
  const platform = Platform.OS

  const getWazeURL = platform => {
    if (platform === 'android' || platform === 'ios') {
      return `waze://?q=${query}`
    }
  }

  Linking.openURL(getWazeURL(platform))
}
