import { convertDateToString } from './dateAndTimeHelpers'

export const groupPeriodsByField = (periods, field) => {
  function groupBy (arr, prop) {
    const map = new Map(Array.from(arr, obj => [obj[prop], []]))
    arr.forEach(obj => map.get(obj[prop]).push(obj))
    return Array.from(map.values())
  }

  const groupedPeriods = groupBy(periods, field)
  return groupedPeriods
}

// Returns the petshop stored in the userData (redux)
export const getPetshop = (userData, petshopId) => {
  return userData?.user?.petshops?.find(
    petshop => petshop.petshopInfo.id === petshopId
  )
}

// Returns the pet name in the desired petshop
export const getPetNameInPetshop = (petId, petshop) => {
  return petshop?.pets?.find(pet => pet.id === petId)?.name
}

// Returns the title of the scheduled service, to be displayed in the InformationsCard component
export const getScheduledTitle = (day, startTime, endTime) => {
  const dateDay = new Date(day)
  const formattedDay = convertDateToString(dateDay, 'DD/MM/YYYY')
  if (startTime) {
    return `${formattedDay}: ${startTime} - ${endTime}`
  } else {
    return `${formattedDay}`
  }
}

// Returns the petshop address in a string format to be displayed for user.
export const getPetshopAddressString = addressObject => {
  if (addressObject) {
    const address = addressObject
    let fullAddress = `${address.street}, ${address.streetNumber}, `
    if (address.complement && address.complement !== '') {
      fullAddress += `${address.complement}, `
    }
    fullAddress += `${address.city}, ${address.uf}`
    return fullAddress
  } else {
    return 'Endereço não cadastrado, portanto não será possível contratar o leva e traz.\n\nSe desejar, contate o petshop para habilitar este serviço.'
  }
}

export const getBillingStatus = status => {
  switch (status) {
    case 'created':
      return 'Criado'
    case 'paid':
      return 'Pago'
    case 'cancelled':
      return 'Cancelado'
    case 'refunded':
      return 'Reembolsado'
    default:
      return 'Pendente'
  }
}
