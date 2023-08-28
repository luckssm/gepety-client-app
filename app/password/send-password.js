import { useState } from 'react'
import {
  View,
  Text,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  Platform
} from 'react-native'
import { Stack, useRouter } from 'expo-router'
import { useDispatch } from 'react-redux'

import { LinearGradient } from 'expo-linear-gradient'

import Images from '../../src/themes/images'
import Colors from '../../src/themes/colors'
import API from '../../src/services/api'
import { isEmailValid } from '../../src/services/helpers/userHelpers'

import RoundedInput from '../../src/components/Inputs/RoundedInput'
import RoundedPrimaryButton from '../../src/components/Buttons/RoundedPrimaryButton'
import ArrowBackSubHeader from '../../src/components/ArrowBackSubHeader'

const styles = StyleSheet.create({
  pageContainer: {
    padding: 32,
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center'
  },
  appLogoContainer: {
    width: '100%',
    height: undefined,
    marginBottom: 48
  },
  appLogo: {
    width: '100%',
    height: undefined,
    aspectRatio: 3.35
  },
  inputsContainer: {
    width: '100%',
    marginBottom: 36
  },
  profileInputIcon: {
    width: 26,
    height: 26
  },
  explanationTextStyle: {
    fontSize: 18,
    color: Colors.darkBlue,
    textAlign: 'center'
  },
  explanationTextBoldStyle: {
    fontWeight: 'bold'
  }
})

export default function SendPassword () {
  const router = useRouter()
  const dispatch = useDispatch()
  const isIOS = Platform.OS === 'ios'

  const [isLoading, setIsLoading] = useState(false)
  const [recoveryEmailSent, setRecoveryEmailSent] = useState(false)

  const [email, setEmail] = useState('')

  const goBack = () => {
    router.push('/login')
  }

  const handleChangePasswordEmailRequest = async () => {
    if (!email) {
      toast.hideAll()
      toast.show('Preencha o e-mail antes de continuar!', { type: 'error' })
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
    return API.sendChangePasswordEmail({
      email
    })
      .then(() => {
        toast.hideAll()
        toast.show('E-mail com instruções enviado com sucesso!', {
          type: 'success'
        })
        setRecoveryEmailSent(true)
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

  // Profile icon that will be shown inside e-mail input
  const ProfileIcon = () => {
    return (
      <Image style={styles.profileInputIcon} source={Images.orangeProfile} />
    )
  }

  // Rendered for user to insert e-mail and request a recovery password token
  const renderRequestPasswordContent = () => {
    return (
      <>
        <View style={{ marginBottom: 36 }}>
          <ArrowBackSubHeader goBack={goBack} titleText={'Esqueci a Senha'} />
        </View>
        <View style={{ marginBottom: 24 }}>
          <Text style={styles.explanationTextStyle}>
            Esqueceu a sua senha?
            <Text style={styles.explanationTextBoldStyle}> Tudo bem! </Text>
            Digite seu
            <Text style={styles.explanationTextBoldStyle}>
              {' '}
              e-mail cadastrado{' '}
            </Text>
            que iremos
            <Text style={styles.explanationTextBoldStyle}>
              {' '}
              enviar instruções{' '}
            </Text>
            para criar uma nova:
          </Text>
        </View>
        {isIOS ? (
          <KeyboardAvoidingView behavior='padding'>
            <View style={styles.inputsContainer}>
              <RoundedInput
                icon={<ProfileIcon />}
                placeholder='E-mail'
                onChangeText={setEmail}
                defaultValue={email}
              />
            </View>
          </KeyboardAvoidingView>
        ) : (
          <View style={styles.inputsContainer}>
            <RoundedInput
              icon={<ProfileIcon />}
              placeholder='E-mail'
              onChangeText={setEmail}
              defaultValue={email}
            />
          </View>
        )}

        <RoundedPrimaryButton
          buttonText={'Redefinir Senha'}
          isLoading={isLoading}
          onPress={() => handleChangePasswordEmailRequest()}
        />
      </>
    )
  }

  // Rendered when password request was already sent to user e-mail
  const renderPasswordRequestSentContent = () => {
    return (
      <>
        <View style={{ marginBottom: 42 }}>
          <Text style={styles.explanationTextStyle}>
            E-mail enviado com sucesso!{'\n'}
            <Text style={styles.explanationTextBoldStyle}>
              {' '}
              Aguarde alguns instantes{' '}
            </Text>
            e confira sua caixa de mensagens. {'\n\n'}Se não receber nenhum
            e-mail dentro de 5 minutos, verifique sua
            <Text style={styles.explanationTextBoldStyle}>
              {' '}
              caixa de spam!{' '}
            </Text>
          </Text>
        </View>
        <RoundedPrimaryButton buttonText={'Voltar'} onPress={() => goBack()} />
      </>
    )
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
        {recoveryEmailSent
          ? renderPasswordRequestSentContent()
          : renderRequestPasswordContent()}
      </LinearGradient>
    </>
  )
}
