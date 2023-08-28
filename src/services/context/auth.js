import { useRouter, useSegments } from 'expo-router'
import React from 'react'

const AuthContext = React.createContext(null)

// This hook can be used to access the user info.
export function useAuth () {
  return React.useContext(AuthContext)
}

// This hook will protect the route access based on user authentication.
function useProtectedRoute ({ auth, user }) {
  const segments = useSegments()
  const router = useRouter()

  // TODO: Check if user information will be used here in auth provider
  const hasAuth = auth && auth.currentAuth && auth && auth.currentToken

  React.useEffect(() => {
    const inAuthGroup =
      segments[0] === 'login' ||
      segments[0] === 'password' ||
      segments[0] === 'terms'

    if (
      // If the user is not logged in and the initial segment is not anything in the auth group.
      !hasAuth &&
      !inAuthGroup
    ) {
      // Redirect to the login page.
      router.replace('/login')
    } else if (hasAuth && inAuthGroup) {
      // Redirect away from the login and password pages.
      router.replace('/home')
    }
  }, [hasAuth, segments])
}

export function AuthProvider ({ currentStore, ...props }) {
  let auth = {}
  let user
  if (currentStore) {
    const store = currentStore.getState()
    const storeAuth = store && store.reducer && store.reducer.auth

    const currentToken = storeAuth && storeAuth.token

    auth.currentToken = currentToken

    const currentAuth = storeAuth && storeAuth.auth

    auth.currentAuth = currentAuth
  }
  useProtectedRoute({ auth, user })

  return (
    <AuthContext.Provider
      value={{
        auth,
        user
      }}
    >
      {props.children}
    </AuthContext.Provider>
  )
}
