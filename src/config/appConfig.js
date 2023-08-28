/* global __DEV__ */
// Simple React Native specific changes

const { version } = require('../../package.json')
const env = __DEV__ ? 'development' : 'production'
console.info(`Version ${version} - ${env} (${process.env.REACT_APP_ENV})`)

const AppConfig = {
  // font scaling override - RN default is on
  allowTextFontScaling: true,
  supportPhoneNumber: '+5516936183738',
  maxNumberOfScheduleWeeks: 8
}

if (__DEV__) {
  // AppConfig.apiUri = 'http://localhost:9000/api/v2'
  AppConfig.apiUri = 'https://micro-gateway-dev-g3qtboiega-ul.a.run.app/api/v1'
} else {
  AppConfig.apiUri = 'https://micro-gateway-g3qtboiega-ul.a.run.app/api/v1'
}

export default AppConfig
