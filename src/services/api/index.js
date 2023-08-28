import apisauce from 'apisauce'

import ApiError, { showErrorMessage } from './apiError'
import AppConfig from '../../config/appConfig'

/*
Defines a simple wrapper for requests
Basically, when response is NOT `ok`, it will throw the error
This is motivated to centralize error handling on catch (Without needing to check for `ok=true`)
*/
const responseWrapper = config => async response => {
  if (response.ok) {
    return response
  }

  // Else, an error happened!
  showErrorMessage(response, config)

  // If response.status = 401, the token is not valid!
  // User should be logged out, for instance
  if (response.status === 401) {
    if (typeof config.onBadToken === 'function') {
      config.onBadToken()
    }
  }
  throw new ApiError(response)
}

/*
Simple wrapper that receives the `request` object, and binds
the user token on Authorization header
- Must receive `tokenSelector` on configs, which is the handler
  responsible for grabbing the token (Probably from redux)
*/
const bindToken = config => async request => {
  const currentToken = config.tokenSelector()
  if (currentToken) {
    request.headers['Authorization'] = currentToken
  }
}

/*
Handler to actualy initialize API service.
Responsible for receiving config input, setting wrappers, and return a
simple requests interface
*/
export const create = (input = {}) => {
  // Config object
  const config = {
    baseURL: input.baseURL || AppConfig.apiUri,
    tokenSelector: input.tokenSelector || (() => ''),
    onBadToken: input.onBadToken,
    showNegativeToast: input.showNegativeToast
  }

  // Basic api init
  const api = apisauce.create({
    // base URL is read from the "constructor"
    baseURL: config.baseURL,
    // 60 second timeout...
    timeout: 60000
  })

  // local api init for test
  // const localApi = apisauce.create({
  //   // base URL is read from the "constructor"
  //   baseURL: 'http://192.168.0.180:4000/api/v1',
  //   // 60 second timeout...
  //   timeout: 60000
  // })

  // Wrappers
  api.addAsyncRequestTransform(bindToken(config)) // Bind token on Authorization header
  api.addAsyncResponseTransform(responseWrapper(config)) // Error handling wrapper

  //  // Local API for test
  // localApi.addAsyncRequestTransform(bindToken(config)) // Bind token on Authorization header
  // localApi.addAsyncResponseTransform(responseWrapper(config)) // Error handling wrapper

  // Requests

  // ***** Auth requests *****
  apiHandlers.localLogin = body => api.post('/auth/local', body)
  apiHandlers.resetPasswordWithToken = body =>
    api.post('/auth/reset/submit', body)
  apiHandlers.sendChangePasswordEmail = body =>
    api.post('/auth/change/request', body)

  // ***** User information requests *****
  apiHandlers.getSelfInformations = () => api.get('/backend/client')
  apiHandlers.updateCpf = body => api.patch('/backend/client', body)

  // ***** Petshop services requests *****
  // Services
  apiHandlers.getPethopsServicesList = body =>
    api.post('/petshop/service/list/client', body)
  apiHandlers.getPetshopAvailablePeriodsForService = ({ query }) =>
    api.get(`/schedule/available/period/service/petshop?${query}`)
  apiHandlers.scheduleServices = body =>
    api.post('/petshop/schedule/client-service/client', body)
  apiHandlers.getScheduledServicesList = query =>
    api.get(
      `/petshop/schedule/client-service/list/client?${query ? query : ''}`
    )

  // Service Billing
  apiHandlers.getScheduledBillingPixCode = body =>
    api.post('/petshop/service-billing/client', body)
  apiHandlers.getServiceBillingList = () =>
    api.get('/petshop/service-billing/client')

  // Bundles
  apiHandlers.getPetshopBundlesList = petshopId =>
    api.get(`/petshop/bundle/petshop/${petshopId}/list`)
  apiHandlers.getServiceBundle = serviceBundleId =>
    api.get(`/petshop/client-service-bundle/${serviceBundleId}`)
  apiHandlers.getUserCredits = () =>
    api.get(`/petshop/client-service-bundle/credits`)

  // ***** Other Petshop requests *****
  // Configurations
  apiHandlers.getPetshopConfiguration = petshopId =>
    api.get(`/backend/petshop/${petshopId}/configuration/client`)
}

const apiHandlers = {}

export default apiHandlers
