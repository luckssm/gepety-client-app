import { useEffect, useState } from 'react'
import { View, Text, Image, StyleSheet } from 'react-native'
import { Stack, useRouter, useSearchParams, Link } from 'expo-router'
import { useDispatch } from 'react-redux'

import { LinearGradient } from 'expo-linear-gradient'

import Images from '../../src/themes/images'
import Colors from '../../src/themes/colors'
import API from '../../src/services/api'

import { setCredentials } from '../../src/redux/slices/authReducer'

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
    marginBottom: 24
  },
  passwordInputIcon: {
    width: 24,
    height: 24,
    marginLeft: 1,
    marginRight: 2
  },
  explanationTextStyle: {
    fontSize: 18,
    color: Colors.darkBlue,
    textAlign: 'center'
  },
  termsParagraphStyle: {
    textAlign: 'center',
    fontStyle: 'italic',
    color: Colors.lightBlack
  },
  underlineTermsLinkStyle: {
    color: Colors.darkBlue,
    textDecorationLine: 'underline',
    textDecorationColor: Colors.darkBlue
  }
})

export default function CreatePassword () {
  const router = useRouter()
  const dispatch = useDispatch()

  // Gets the token from the url and if it is a first password creation (maybe, if secure, in future this firstCreation could be
  // replaced by getting the auth in the token - at the moment we don't send this info in the token)
  const { token, firstCreation } = useSearchParams()
  const isFirstPasswordCreation = !!firstCreation

  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')

  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    dispatch(setCredentials({ token }))
  }, [])

  const handleChangePassword = async () => {
    if (!password || !passwordConfirmation) {
      toast.hideAll()
      toast.show('Preencha as senhas e tente novamente.', { type: 'error' })
      return
    }
    if (password !== passwordConfirmation) {
      toast.hideAll()
      toast.show(
        'As senhas devem ser iguais. Se estiver com problemas, clique no ícone à direita para exibir as senhas.',
        { type: 'error' }
      )
      return
    }
    if (password.length < 6) {
      toast.hideAll()
      toast.show(
        'Senha muito curta. A senha deve ter no mínimo 6 caracteres.',
        { type: 'error' }
      )
      return
    }

    setIsLoading(true)
    return API.resetPasswordWithToken({
      password
    })
      .then(() => {
        toast.hideAll()
        toast.show(
          'Senha redefinida com sucesso! Faça login com a nova senha para acessar o app.',
          { type: 'success' }
        )
        router.push('/login')
      })
      .catch(err => {
        console.error(err)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  const renderAppIcon = () => {
    return (
      <Image
        style={styles.appLogo}
        source={Images.appLogo}
        resizeMode='cover'
      />
    )
  }

  // Password icon that will be shown inside password input
  const PasswordIcon = () => {
    return <Image style={styles.passwordInputIcon} source={Images.lockIcon} />
  }

  const resolvePasswordCreationText = () => {
    if (isFirstPasswordCreation) {
      return 'Crie uma senha para finalizar seu cadastro:'
    }
    return 'Crie uma nova senha:'
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
        <View style={{ marginBottom: 42 }}>
          <Text style={styles.explanationTextStyle}>
            {resolvePasswordCreationText()}
          </Text>
        </View>
        <View style={styles.inputsContainer}>
          <View style={{ marginBottom: 24 }}>
            <RoundedInput
              icon={<PasswordIcon />}
              placeholder='Senha'
              isPassword={true}
              onChangeText={setPassword}
              defaultValue={password}
            />
          </View>
          <RoundedInput
            icon={<PasswordIcon />}
            placeholder='Confirmar Senha'
            isPassword={true}
            onChangeText={setPasswordConfirmation}
            defaultValue={passwordConfirmation}
          />
        </View>
        <View style={{ marginBottom: 24 }}>
          <Text style={styles.termsParagraphStyle}>
            Ao criar a senha, você concorda com os nossos{' '}
            <Link
              href={{
                pathname: '/terms/conditions'
              }}
            >
              <Text style={styles.underlineTermsLinkStyle}>
                Termos e Condições
              </Text>
            </Link>{' '}
            e nossas{' '}
            <Link
              href={{
                pathname: '/terms/privacy'
              }}
            >
              <Text style={styles.underlineTermsLinkStyle}>
                Políticas de Privacidade
              </Text>
              .
            </Link>
          </Text>
        </View>
        <RoundedPrimaryButton
          buttonText={
            isFirstPasswordCreation ? 'Finalizar Cadastro' : 'Salvar Nova Senha'
          }
          isLoading={isLoading}
          onPress={() => handleChangePassword()}
        />
      </LinearGradient>
    </>
  )
}
