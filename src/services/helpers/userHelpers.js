export const isEmailValid = email => {
  const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/
  return reg.test(email)
}

export const normalizeCPF = value => {
  if (!value) return ''

  return value
    .replace(/[\D]/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1-$2')
    .replace(/(-\d{2})(\d)/, '$1')
}

export const clearCpfFormatation = cpf => {
  return cpf.replace(/[^\d]+/g, '')
}

export const cpfValidator = cpf => {
  cpf = cpf.replace(/[^\d]+/g, '')

  if (cpf === '') return false
  if (cpf.length > 11) return false

  const items = [...new Set(cpf)]
  if (items.length === 1) return false

  const calcDV = length => {
    let sum = 0
    for (let i = 1; i <= length; i++)
      sum += parseInt(cpf.substring(i - 1, i)) * (length + 2 - i)
    let mod = (sum * 10) % 11
    return mod === 10 || mod === 11 ? 0 : mod
  }

  const fstDigit = calcDV(9)
  if (fstDigit !== parseInt(cpf.substring(9, 10))) return false

  const sndDigit = calcDV(10)
  if (sndDigit !== parseInt(cpf.substring(10, 11))) return false

  return true
}
