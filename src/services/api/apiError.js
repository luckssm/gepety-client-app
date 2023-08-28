// Returns a default message, give simple response's statusCode
const getStatusCodeMessage = response => {
  const { status } = response
  switch (status) {
    case 400:
      return 'Um erro ocorreu! Se o problema persistir, contate o suporte.'
    case 401:
      return 'Erro com as credenciais! Faça login novamente.'
    case 403:
      return 'Você não está autorizado a acessar essas informações! Se acredita que isto é um erro, por favor, contate o suporte.'
    case 404:
      return 'As informações buscadas não foram encontradas! Se o problema persistir, contate o suporte.'
    case 500:
      return 'Um problema na comunicação com o servidor ocorreu! Se o problema persistir, contate o suporte.'
    case 503:
      return 'Esse serviço encontra-se temporariamente indisponível para manutenção! Se o problema persistir, contate o suporte.'
    default:
      return 'Um erro ocorreu! Se o problema persistir, contate o suporte.'
  }
}

// Extracts custom backend error code, and translate to message if provided
const getCustomErrorCodeMessage = response => {
  const customErrorCode =
    response.data && response.data.error && response.data.error.code
  switch (customErrorCode) {
    case 'PAYMENT-001':
      return 'Nenhum pagamento relacionado à compra foi encontrado!' // Example custom code error
    case 'COUPON-001':
      return 'Cupom não encontrado!'
    default:
      return null
  }
}

// Extracts custom backend error displayMessage if provided
const getDisplayMessage = response => {
  const customErrorData = response.data
  return customErrorData && customErrorData.displayMessage
}

const getConnectivityErrorMessage = response => {
  switch (response.problem) {
    case 'NETWORK_ERROR':
      return 'Erro na conexão! Verifique a sua internet e tente novamente.'
    case 'CONNECTION_ERROR':
      return 'Erro na conexão! Não foi possível se conectar ao servidor. Tente novamente mais tarde.'
    case 'TIMEOUT_ERROR':
      return 'A conexão demorou demais e foi cancelada. Tente novamente.'
    default:
      return 'Erro na conexão! Tente novamente.'
  }
}

/*
Shows error message acoording to the folowing priority
1- Network or unknown error
2- Backend's displayMessage
3- Backend's custom code
4- Default message, given statusCode
*/
export const showErrorMessage = (response, config) => {
  // showErrorMessage depends on showNegativeToast reference
  // If its not provided, no can do
  // if (typeof config.showNegativeToast !== 'function') return

  const resolveMessage = response => {
    if (!response.status) {
      const connectivityMessage = getConnectivityErrorMessage(response)
      return connectivityMessage
    }

    const displayMessage = getDisplayMessage(response)

    if (displayMessage) {
      return displayMessage
    }

    const customErrorMessage = getCustomErrorCodeMessage(response)
    if (customErrorMessage) {
      return customErrorMessage
    }

    const defaultStatusMessage = getStatusCodeMessage(response)
    if (defaultStatusMessage) {
      return defaultStatusMessage
    }
  }

  // If backend sent a `displayMessage`, we use it
  // Else, show default message according to statusCode
  const message = resolveMessage(response)
  // Hides all toasts and then shows the toast. This is so that the toasts don't stack on the screen and it only shows one at a time.
  // Maybe there is a better way to do this.
  toast.hideAll()
  toast.show(message, { type: 'error' })
}

/*
Defines a simple API Error class to be used with Api Sauce
Used to keep semantics of throwing an Error object, but also
allowing more data to be sent along
*/
export default class ApiError extends Error {
  constructor ({ problem, data, status, config, duration }) {
    super(problem)
    this.status = status
    this.statusCode = status
    this.problem = problem
    this.data = data
    this.config = config
    this.duration = duration
    this.displayMessage = data && data.displayMessage
  }
}
