import { StyleSheet, View, ScrollView, Text } from 'react-native'
import { Stack, useRouter } from 'expo-router'

import { LinearGradient } from 'expo-linear-gradient'

import Colors from '../../../src/themes/colors'

import ArrowBackSubHeader from '../../../src/components/ArrowBackSubHeader'

const styles = StyleSheet.create({
  pageContainer: {
    padding: 32,
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center'
  },
  scrollViewContainerStyle: {
    paddingVertical: 24,
    paddingHorizontal: 32,
    width: '100%'
  },
  headerStyle: {
    fontSize: 20,
    color: Colors.darkBlue,
    marginBottom: 16
  },
  paragraphStyle: {
    fontSize: 16,
    color: Colors.lightBlack,
    marginBottom: 12,
    textAlign: 'justify'
  }
})

export default function TermsConditions () {
  const router = useRouter()

  const goBack = () => {
    router.back()
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
        <ScrollView
          contentContainerStyle={styles.modalScrollViewContainerStyle}
        >
          <View style={{ marginBottom: 32, marginTop: 32 }}>
            <ArrowBackSubHeader
              goBack={goBack}
              titleText={'Políticas de Privacidade'}
            />
          </View>
          <Text style={styles.paragraphStyle}>
            Esta política detalha as informações utilizadas pelos aplicativos
            Gepety a fim de proporcionar uma boa experiência aos nossos usuários
            e uma evolução constante na qualidade de nossos serviços.
          </Text>
          <Text style={styles.headerStyle}>Quais informações coletamos?</Text>
          <Text style={styles.paragraphStyle}>
            Para fornecer nossos serviços, precisamos coletar informações tanto
            de pessoas jurídicas quanto de pessoas físicas, dependendo do escopo
            do aplicativo utilizado. Essas informações são recolhidas no momento
            do cadastro de cada usuário.
          </Text>
          <Text style={styles.headerStyle}>Como usamos essas informações?</Text>
          <Text style={styles.paragraphStyle}>
            Usamos as informações coletadas para:
          </Text>
          <Text style={[styles.paragraphStyle, { marginLeft: 12 }]}>
            {'\u2B24'} Realizar o controle dos usuários cadastrados;
          </Text>
          <Text style={[styles.paragraphStyle, { marginLeft: 12 }]}>
            {'\u2B24'} Aprimorar a qualidade dos serviços oferecidos;
          </Text>
          <Text style={[styles.paragraphStyle, { marginLeft: 12 }]}>
            {'\u2B24'} Comunicação com usuários (e-mails de recuperação de
            senha, confirmações de pagamento, eventuais comunicações de
            marketing, informações sobre atualizações dos nossos termos e
            políticas e respostas a solicitações de suporte);
          </Text>
          <Text style={styles.headerStyle}>
            Como essas informações são compartilhadas?
          </Text>
          <Text style={styles.paragraphStyle}>
            Todas as informações coletadas são mantidas internamente. Não
            negociamos nem repassamos as informações coletadas para terceiros.
            Entretanto, utilizamos serviços externos para nos auxiliar com a
            correção de problemas que podem ocorrer com nossos próprios
            serviços.
          </Text>
          <Text style={styles.paragraphStyle}>
            Podemos também utilizar plataformas de análise de tráfego como
            Google Analytics para nos auxiliar a entender o fluxo e interação de
            nossos usuários com nossas plataformas a fim de melhorar o
            desempenho de nossos serviços. É importante ressaltar que todos
            esses dados recolhidos são genéricos e não de um único usuário.
          </Text>
          <Text style={styles.headerStyle}>
            Como excluir essas informações dos aplicativos?
          </Text>
          <Text style={styles.paragraphStyle}>
            Quando cadastra e insere seus dados nas nossas plataformas,
            entendemos que o usuário está de acordo com nossos termos e que
            concordou com o recolhimento dessas informações.
          </Text>
          <Text style={styles.paragraphStyle}>
            Mas caso tenha mudado de ideia e deseje excluir suas informações,
            basta entrar em contato conosco através do e-mail
            contato@gepety.com.br. É importante ressaltar que ao excluir suas
            informações, o acesso de um usuário ao aplicativo fica
            impossibilitado, sendo disponível novamente somente após a
            realização de um novo cadastro.
          </Text>
          <Text style={styles.headerStyle}>Sobre os cookies</Text>
          <Text style={styles.paragraphStyle}>
            Os cookies são utilizados para melhorar a experiência de nossos
            usuários durante o uso dos nossos aplicativos. Se preferir, o
            usuário pode utilizar a navegação anônima de seu navegador para que
            os cookies não sejam armazenados no seu computador de maneira
            permanente, porém suas informações de navegação ainda assim serão
            coletadas.
          </Text>
          <Text style={styles.headerStyle}>
            Sobre futuras mudanças nessa política
          </Text>
          <Text style={styles.paragraphStyle}>
            Notificaremos nossos usuários sobre eventuais alterações nesta
            política de privacidade e daremos sempre a oportunidade de continuar
            utilizando nossos serviços ou não após a análise da mesma.
          </Text>
        </ScrollView>
      </LinearGradient>
    </>
  )
}
