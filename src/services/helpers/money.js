/** This function transforms a number into a string, preventing scientific notation.
@example
- (1000000000000000000000).toString() --> '1e+21'
- (0.000000000000001).toString() --> '1e-15'
- numberToString(1000000000000000000000) --> '1000000000000000000000'
- numberToString(0.000000000000001) --> '0'
@argument { number } num
*/
function numberToString (num) {
  return num?.toLocaleString('fullwide', { useGrouping: false })
}

/** This function transforms a number into a string with precision of 2,
preventing scientific notation.
@example
- (1000000000000000000000).toFixed(2) --> '1e+21'
- numberToFixed2(1000000000000000000000.123) --> '1000000000000000000000.00' (because of float precision)
@argument { number } num
*/
function numberToFixed2 (num) {
  const numText = num.toFixed(2)
  const dotIndex = numText.indexOf('.')
  if (dotIndex === numText.length - 3) return numText
  else return numberToString(num) + '.00'
}

/**
This function takes a string like 'R$ 23,00' and transforms it into the number 23
@example
- 'R$123,00' --> 123
- 'R$ 32,20' --> 32.2
- '123,00' --> 123
- 542.3 --> 542.3
@argument { string | number } string
*/
function extractReaisFromMoneyString (string) {
  if (typeof string === 'number') return string
  const dottedString = string.replace(/,/g, '.')
  if (string.startsWith('R$'))
    return Number(dottedString.substr(2, dottedString.length - 2).trim())
  return Number(dottedString.trim())
}

/**
This function takes a string like 'R$ 23,00' and transforms it into the number 2300
@example
- 'R$123,00' --> 12300
- 'R$ 32,20' --> 3220
- '123,00' --> 12300
- 542.3 --> 54230
@argument { string | number } string
*/
function extractCentsFromMoneyString (string) {
  if (typeof string === 'number') return string
  const dottedString = string
    .replace('.', '')
    .replace(/,/g, '')
    .trim()
  const formatedString = string.startsWith('R$')
    ? dottedString.substr(2, dottedString.length - 2).trim()
    : dottedString
  const dotIndex = dottedString.indexOf('.')
  if (dotIndex === -1) return Number(formatedString)
  return Number(formatedString.substr(0, dotIndex + 2).replace('.', ''))
}

/** This is a function to transform the money measured in cents to a money string.
(e.g. 390 --> 'R$ 3,90') This exists because the backend stores all money values
in cents.
@argument { number } money
*/
export function centsToText (money) {
  return reaisToText(centsToReais(money))
}

/** This is a function to transform the money measured in reais to a money string.
(e.g. 3333.90 --> 'R$ 3.333,90')
@argument { number } money
*/
export function reaisToText (money) {
  return (
    'R$ ' +
    numberToFixed2(money)
      .replace('.', ',')
      .replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  )
}

/** This is a function to transform the money measured in cents to money measured
in reais (e.g. 390 --> 3.90). This exists because the backend stores all money values
in cents.
@argument { number } money
*/
export function centsToReais (money) {
  // This weird operation is to make sure there is no float error.
  // Example: 18.9 / 100 = 0.18899999999999997
  if (isCentsPrecisionTooLarge(money))
    console.error('CENTS PRECISION ERROR ', money)
  const moneyArray = numberToString(money)
    .padStart(3, 0)
    .split('')
  moneyArray.splice(moneyArray.length - 2, 0, '.') // inserts the dot
  return Number(moneyArray.join(''))
}

/** This is a function to transform the money measured in reais to money measured
in cents (e.g. 3.90 --> 390). This exists because the backend stores all money values
in cents.
@argument { number } money
*/
export function reaisToCents (money) {
  // This weird operation is to make sure there is no float error.
  // Example: 18.9 * 100 = 1889.9999999999998
  if (isReaisPrecisionTooLarge(money))
    console.error('REAIS PRECISION ERROR ', money)
  return Number(money.toFixed(2).replace('.', ''))
}

/** This is a function to make sure the money value in reais does not have a
decimal precision larger than 2.
@examle
- 12.92 --> OK
- 12.920 --> OK
- 12.921 --> ERROR
@argument { number } money
*/
export function isReaisPrecisionTooLarge (money) {
  if ((numberToString(money).split('.')[1] || '').length > 2) return true
  return false
}

/** This is a function to make sure the money value in cents is an integer.
@examle
- 12 --> OK
- 12.000 --> OK
- 12.1 --> ERROR
@argument { number } money
*/
export function isCentsPrecisionTooLarge (money) {
  if (Math.floor(money) !== money) return true
  return false
}

/** Simple conversion between text to cents.
Note: if no argument is given, or an empty string is passed, will return NaN
@argument { string } money
*/
export function textToCents (money) {
  const cents = extractCentsFromMoneyString(money || 'NaN')
  if (isNaN(cents)) return NaN // Not sure if should throw an error...
  if (isCentsPrecisionTooLarge(cents)) {
    console.error(
      `Text cents precision is too large. Original text was '${money}'`
    )
  }
  return cents
}

/** Simple conversion between text to reais
Note: if no argument is given, or an empty string is passed, will return NaN
@argument { string } money
*/
export function textToReais (money) {
  const reais = extractReaisFromMoneyString(money || 'NaN')
  if (isNaN(reais)) return NaN // Not sure if should throw an error...
  if (isReaisPrecisionTooLarge(reais)) {
    console.error(
      `Text reais precision is too large. Original text was '${money}'`
    )
  }
  return reais
}
