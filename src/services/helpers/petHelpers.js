export const furSizeToString = furSize => {
  if (furSize === 'short') return 'curto'
  if (furSize === 'long') return 'Longo'
}

export const bodySizeToString = bodySize => {
  if (bodySize === 'small') return 'Pequeno'
  if (bodySize === 'medium') return 'Médio'
  if (bodySize === 'large') return 'Grande'
  if (bodySize === 'special') return 'Especial'
  if (bodySize === 'other') return 'Outro'
}
