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
              titleText={'Termos e Condições'}
            />
          </View>
          <Text style={styles.paragraphStyle}>
            Este Contrato de Licença de Usuário Final (“EULA” ou “CLUF”) é um
            acordo legal entre o licenciado (pessoa física ou jurídica) (o
            “LICENCIADO”) e a GEPETY DESENVOLVIMENTO DE PROGRAMAS DE COMPUTADOR
            LTDA, pessoa jurídica de direito privado, inscrita no CNPJ sob n.
            49.498.851/0001-03, com sede na AVENIDA 29, 401, APTO 51, localizado
            no Cidade Jardim, CEP 13501-104, Rio Claro, SP - Brasil, (a
            “LICENCIANTE”) para uso do programa de computador denominado GEPETY,
            disponibilizado neste ato pela LICENCIANTE (o “SOFTWARE”) por meio
            do site “gepety.com.br” ou plataformas de aplicativos (“Site”), pelo
            determinado pelo LICENCIADO no ato do licenciamento do SOFTWARE,
            compreendendo o programa de computador e podendo incluir os meios
            físicos associados, bem como quaisquer materiais impressos e
            qualquer documentação online ou eletrônica. Ao utilizar o SOFTWARE,
            mesmo que parcialmente ou a título de teste, o LICENCIADO estará
            vinculado aos termos deste EULA, concordando com suas disposições,
            principalmente com relação ao CONSENTIMENTO PARA o ACESSO, COLETA,
            USO, ARMAZENAMENTO, TRATAMENTO E TÉCNICAS DE PROTEÇÃO ÀS INFORMAÇÕES
            do LICENCIADO pela LICENCIANTE, necessárias para a integral execução
            das funcionalidades ofertadas pelo SOFTWARE. Em caso de discordância
            com os termos aqui apresentados, a utilização do SOFTWARE deve ser
            imediatamente interrompida pelo LICENCIADO.
          </Text>
          <Text style={styles.headerStyle}>1 - Objeto</Text>
          <Text style={styles.paragraphStyle}>
            O presente contrato tem por objeto a prestação, pela GEPETY, da
            concessão de licença de uso do presente aplicativo de sua
            propriedade e titularidade exclusiva, oferecido por meio de site ou
            aplicativo em dispositivos móveis, destinados a prover ferramentas a
            fim de facilitar a atividade de serviços voltados às necessidades e
            bem-estar de animais, ora LICENCIADO.
          </Text>
          <Text style={styles.paragraphStyle}>
            O LICENCIADO terá permissões e restrições de uso do aplicativo,
            conforme plano escolhido pelo seu prestador de serviço. Para a
            utilização do aplicativo, o LICENCIADO será o único responsável por
            providenciar e manter as perfeitas condições de uso e instalação,
            sendo obrigatório o uso de internet da sua preferência, um navegador
            apropriado, celular ou qualquer dispositivo que conecte à www (world
            wide web) ou às plataformas de aplicativos.
          </Text>
          <Text style={styles.paragraphStyle}>
            O LICENCIADO deverá cadastrar uma senha e um username para login no
            aplicativo, independente do plano contratado, devendo manter TOTAL
            sigilo sobre tais dados. Em razão do caráter personalíssimo desta
            contratação, o LICENCIADO, desde já, concorda em não repassar os
            seus dados de acesso ao aplicativo para qualquer usuário, sob pena
            de suspensão da prestação de serviço e aplicação de penalidade.
          </Text>
          <Text style={styles.headerStyle}>
            2 - Das Características da plataforma
          </Text>
          <Text style={styles.paragraphStyle}>
            O LICENCIADO tem um limite definido pelo plano do prestador de
            serviço, para utilização de fotos e arquivos em formatos jpeg ou
            pdf, sendo que o conteúdo das imagens é de sua INTEIRA
            RESPONSABILIDADE.
          </Text>
          <Text style={styles.paragraphStyle}>
            A GEPETY poderá a seu exclusivo critério desenvolver novas
            funcionalidades para os aplicativos, podendo cobrar ou não do
            LICENCIADO um valor adicional por cada uma das funcionalidades, caso
            este deseje utilizá-las.
          </Text>
          <Text style={styles.headerStyle}>
            3 - Das Obrigações do Licenciante
          </Text>
          <Text style={styles.paragraphStyle}>
            A GEPETY obriga-se a cumprir as seguintes obrigações relacionadas ao
            presente termo:
          </Text>
          <Text style={styles.paragraphStyle}>
            a) manter o aplicativo em boas condições de uso;{'\n'}
            b) comunicar, sempre que possível, ao LICENCIADO sobre manutenções
            nos servidores que coloquem o serviço temporariamente indisponível;
            {'\n'}
            c) manter sigilo absoluto sobre as informações constantes no
            aplicativo fornecida pelo LICENCIADO, tanto dos dados do seu
            cadastramento quanto da utilização do aplicativo, exceto em caso de
            exigências jurídicas/legais;{'\n'}
            d) não violar os direitos autorais e de propriedade intelectual de
            terceiros;
          </Text>
          <Text style={styles.paragraphStyle}>
            A GEPETY não poderá ser responsabilizada por falhas na prestação de
            serviços do aplicativo ocasionados por caso fortuito ou força maior,
            como causas que estejam fora do seu controle, incluindo ataques
            externos e/ou eventos, ainda que previsíveis, relacionados a
            tecnologia, produto ou serviços utilizados pela GEPETY.
          </Text>
          <Text style={styles.paragraphStyle}>
            A GEPETY não tem nenhuma responsabilidade quanto à prestação de
            serviço realizada entre o prestador de serviços contratado e o
            LICENCIADO, sendo somente uma intermediária técnica no que diz
            respeito ao software provido, não tendo obrigação de fiscalizar ou
            de controlar os conteúdos armazenados no aplicativo. Ainda, não
            poderá ser responsabilizada por quaisquer veiculações de materiais e
            informações do LICENCIADO, inclusive de cunho ilegal, imoral ou
            antiético, por ventura realizadas pelo LICENCIADO, cabendo a este
            responder pessoalmente por eventuais reclamações de terceiros ou
            demandas judiciais, isentando a GEPETY de qualquer responsabilidade.
          </Text>
          <Text style={styles.headerStyle}>
            4 - Das Obrigações do Licenciado
          </Text>
          <Text style={styles.paragraphStyle}>
            O LICENCIADO obriga-se a cumprir as seguintes obrigações
            relacionadas ao presente termo:
          </Text>
          <Text style={styles.paragraphStyle}>
            a) obter por meios próprios o acesso a Internet para uso do
            aplicativo, bem como utilizá-lo exclusivamente para a finalidade que
            foi criado e conforme delimitado na cláusula 1 do presente termo;
            {'\n'}
            b) efetuar o pagamento do serviço durante a vigência deste termo;
            {'\n'}
            c) responsabilizar-se pela segurança e guarda dos dados inseridos no
            aplicativo, pelo sigilo das informações cadastradas para login, a
            fim de evitar invasões de terceiros, não cabendo qualquer tipo de
            ressarcimento ou indenização, por parte da GEPETY ao LICENCIADO na
            ocorrência das referidas hipóteses;{'\n'}
            d) não compartilhar seus dados pessoais de acesso com ninguém;{'\n'}
            e) não violar quaisquer direitos de terceiros e especialmente
            aqueles referentes à propriedade intelectual e direitos autorais da
            GEPETY, e;{'\n'}
            f) responder pessoalmente por eventuais perdas e danos a que der
            causa, seja por culpa ou dolo, sempre isentando a GEPETY de qualquer
            responsabilidade neste sentido.{'\n'}
            g) tratar com respeito e educação todos os colaboradores da GEPETY,
            independente da situação. Em caso de descumprimento deste item, o
            LICENCIADO será comunicado da infração. Em caso de repetição da
            infração, a GEPETY reserva-se o direito de rescindir unilateralmente
            e imediatamente este contrato, sem prejuízo por parte desta.
          </Text>
          <Text style={styles.headerStyle}>
            5 - Da Remuneração e Forma de Pagamento
          </Text>
          <Text style={styles.paragraphStyle}>
            O LICENCIADO deverá seguir as disposições desta cláusula para
            pagamento e utilização do serviço de licença de uso do aplicativo:
          </Text>
          <Text style={styles.paragraphStyle}>
            A GEPETY reserva-se o direito de cobrar uma taxa previamente
            acordada com o prestador de serviço por cada transação do LICENCIADO
            ao prestador de serviço contratado.
          </Text>
          <Text style={styles.paragraphStyle}>
            A GEPETY não se responsabiliza, porém, pelo valor cobrado pelo
            serviço, nem por eventual pedido de reembolso do mesmo, sendo isso
            de inteira responsabilidade do prestador de serviço contratado pelo
            LICENCIADO.
          </Text>
          <Text style={styles.paragraphStyle}>
            O LICENCIADO deverá seguir as disposições desta cláusula para
            realização do pagamento dos serviços aos prestadores contratados:
          </Text>
          <Text style={styles.paragraphStyle}>
            a) autorizar que o pagamento do serviço seja realizado pela GEPETY,
            via cartão de crédito, boleto ou pix, conforme dados fornecidos pelo
            LICENCIADO no momento da compra, de acordo com o valor do serviço
            ofertado pelo prestador de serviços;
          </Text>
          <Text style={styles.headerStyle}>
            6 - Da Falta de Pagamento e Cancelamento
          </Text>
          <Text style={styles.paragraphStyle}>
            Em caso de não pagamento de um serviço contratado junto a um
            prestador, a responsabilidade é inteiramente do LICENCIADO para com
            o próprio prestador.
          </Text>
          <Text style={styles.paragraphStyle}>
            O LICENCIADO poderá utilizar os serviços e funcionalidades do
            aplicativo da GEPETY, respeitadas as obrigações contratuais contidas
            neste documento, podendo se preferir cancelar através do próprio
            aplicativo ou site da GEPETY ou entrando em contato com a equipe de
            suporte. Em decorrência do pedido de cancelamento do contrato, a
            GEPETY fica isenta de responsabilidade pela perda dos dados dos
            clientes do LICENCIADO, quando este não efetuar a exportação para
            outra plataforma.
          </Text>
          <Text style={styles.paragraphStyle}>
            O LICENCIADO que optou por cancelar o serviço e posteriormente
            deseje retornar ao uso do aplicativo, terá seus dados salvos no seu
            login pelo período de 90 (noventa) dias.
          </Text>
          <Text style={styles.paragraphStyle}>
            A GEPETY se mantém no direito de rescindir unilateralmente o
            presente contrato, sem necessidade de explicação prévia ao
            LICENCIADO, mas se comprometendo à comunicação com antecedência de
            30 (trinta) dias.
          </Text>
          <Text style={styles.headerStyle}>
            7 - Da Propriedade Intelectual e Licença de Uso
          </Text>
          <Text style={styles.paragraphStyle}>
            O LICENCIADO não adquire, pelo presente instrumento ou pela
            utilização do SOFTWARE, nenhum direito de propriedade intelectual ou
            outros direitos exclusivos, incluindo patentes, desenhos, marcas,
            direitos autorais ou quaisquer direitos sobre informações
            confidenciais ou segredos de negócio, bem como todo o conteúdo
            disponibilizado no Site, incluindo, mas não se limitando a textos,
            gráficos, imagens, logotipos, ícones, fotografias, conteúdo
            editorial, notificações, softwares e qualquer outro material, sobre
            ou relacionados ao SOFTWARE ou nenhuma parte dele. O LICENCIADO
            também não adquire nenhum direito sobre ou relacionado ao SOFTWARE
            ou qualquer componente dele, além dos direitos expressamente
            licenciados ao LICENCIADO sob o presente EULA/CLUF ou em qualquer
            outro contrato mutuamente acordado por escrito entre o LICENCIADO e
            a LICENCIANTE. Quaisquer direitos não expressamente concedidos sob o
            presente instrumento são reservados.
          </Text>
          <Text style={styles.paragraphStyle}>
            Sujeito aos termos e condições aqui estabelecidos, este EULA/CLUF
            concede ao LICENCIADO uma licença revogável, não exclusiva e
            intransferível para uso do SOFTWARE. Em nenhuma hipótese o
            LICENCIADO terá acesso ao código fonte do SOFTWARE ora licenciado,
            por este se tratar de propriedade intelectual da LICENCIANTE.
          </Text>
        </ScrollView>
      </LinearGradient>
    </>
  )
}
