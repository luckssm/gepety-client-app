import { useEffect } from 'react'
import { Stack } from 'expo-router'
import { Provider } from 'react-redux'
import { store, persistor } from '../src/redux/store'
import { PersistGate } from 'redux-persist/integration/react'
import Toast from 'react-native-toast-notifications'

import { create } from '../src/services/api'
import { AuthProvider } from '../src/services/context/auth'

import CustomSuccessToast from '../src/components/Toasts/CustomSuccessToast'
import CustomErrorToast from '../src/components/Toasts/CustomErrorToast'

export default function Layout () {
  useEffect(() => {
    try {
      this.configureApi(store)
    } catch (_) {}
  }, [])

  // Responsible for initializing API
  configureApi = store => {
    // Selects `token` from redux
    const tokenSelector = () => {
      const currentStoreState = store.getState()
      const currentToken =
        currentStoreState &&
        currentStoreState.reducer &&
        currentStoreState.reducer.auth &&
        currentStoreState.reducer.auth.token
      return currentToken
    }

    // Initializes API
    const Api = create({
      tokenSelector
      // onBadToken: () => store.dispatch(UserTypes.logout()), // Should run logout routine!
    })
  }

  return (
    <>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <AuthProvider currentStore={store}>
            <Stack />
          </AuthProvider>
        </PersistGate>
      </Provider>
      {/* Toast is here so that it can be called in every file of app as "toast" */}
      <Toast
        ref={ref => (global['toast'] = ref)}
        placement='top'
        offset={64}
        renderType={{
          success: toast => <CustomSuccessToast toastProps={toast} />,
          error: toast => <CustomErrorToast toastProps={toast} />
        }}
      />
    </>
  )
}
