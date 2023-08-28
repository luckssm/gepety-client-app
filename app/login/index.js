import { useState } from 'react'
import { View, Text, Image, StyleSheet } from 'react-native'
import { Stack, Link, useRouter } from 'expo-router'

import { LinearGradient } from 'expo-linear-gradient'

import Images from '../../src/themes/images'
import Colors from '../../src/themes/colors'
import API from '../../src/services/api'
import { isEmailValid } from '../../src/services/helpers/userHelpers'

import { useDispatch } from 'react-redux'
import { setCredentials } from '../../src/redux/slices/authReducer'
import { setUserInformations } from '../../src/redux/slices/userReducer'

import RoundedInput from '../../src/components/Inputs/RoundedInput'
import RoundedPrimaryButton from '../../src/components/Buttons/RoundedPrimaryButton'

const styles = StyleSheet.create({
  pageContainer: {
    padding: 32,
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  appLogoContainer: {
    width: '100%',
    height: undefined,
    marginBottom: 82
  },
  appLogo: {
    width: '100%',
    height: undefined,
    aspectRatio: 3.35
  },
  inputsContainer: {
    width: '100%',
    marginBottom: 26
  },
  profileInputIcon: {
    width: 26,
    height: 26
  },
  passwordInputIcon: {
    width: 24,
    height: 24,
    marginLeft: 1,
    marginRight: 2
  },
  forgotPasswordContainer: {
    marginBottom: 48,
    borderBottomWidth: 1,
    borderColor: Colors.darkBlue
  },
  forgotPasswordTextStyle: {
    color: Colors.darkBlue
  }
})

export default function Login () {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const dispatch = useDispatch()
  const router = useRouter()

  const renderAppIcon = () => {
    return (
      <Image
        style={styles.appLogo}
        source={Images.appLogo}
        resizeMode='cover'
      />
    )
  }

  // Profile icon that will be shown inside e-mail input
  const ProfileIcon = () => {
    return (
      <Image style={styles.profileInputIcon} source={Images.orangeProfile} />
    )
  }

  // Password icon that will be shown inside password input
  const PasswordIcon = () => {
    return <Image style={styles.passwordInputIcon} source={Images.lockIcon} />
  }

  const handleLogin = async () => {
    if (!email || !password) {
      toast.hideAll()
      toast.show(
        'Campos obrigatórios. Preencha todos os campos e tente novamente.',
        { type: 'error' }
      )
      return
    }

    if (!isEmailValid(email)) {
      toast.hideAll()
      toast.show('E-mail inválido. Digite um e-mail correto.', {
        type: 'error'
      })
      return
    }

    setIsLoading(true)
    return API.localLogin({
      email,
      password
    })
      .then(res => {
        const auth = res.data.auth

        if (auth !== 10) {
          toast.show(
            'Você não é um cliente! Se você for um petshop ou um colaborador, acesse o nosso aplicativo web.',
            { type: 'error' }
          )
          return
        }

        dispatch(setCredentials({ token: res.headers.authorization, auth }))

        return API.getSelfInformations().then(res => {
          dispatch(setUserInformations(res.data))
          router.push('/')
        })
      })
      .catch(err => {
        console.error(err)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  return (
    <>
      <Stack.Screen
        options={{
          header: () => {}
        }}
      />
      <LinearGradient
        colors={[Colors.lightBlue, Colors.mediumBlue]}
        style={styles.pageContainer}
      >
        <View style={styles.appLogoContainer}>{renderAppIcon()}</View>
        <View style={styles.inputsContainer}>
          <View style={{ marginBottom: 24 }}>
            <RoundedInput
              icon={<ProfileIcon />}
              placeholder='E-mail'
              onChangeText={setEmail}
              defaultValue={email}
            />
          </View>
          <RoundedInput
            icon={<PasswordIcon />}
            placeholder='Senha'
            isPassword={true}
            onChangeText={setPassword}
            defaultValue={password}
          />
        </View>
        <View style={styles.forgotPasswordContainer}>
          <Link
            href={{
              pathname: '/password/send-password'
            }}
          >
            <Text style={styles.forgotPasswordTextStyle}>Esqueci a senha</Text>
          </Link>
        </View>
        <RoundedPrimaryButton
          buttonText={'Entrar'}
          onPress={() => handleLogin()}
          isLoading={isLoading}
        />
      </LinearGradient>
    </>
  )
}
