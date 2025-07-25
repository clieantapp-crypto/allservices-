// Card type patterns
const CARD_PATTERNS: Record<string, RegExp> = {
  visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
  mastercard: /^5[1-5][0-9]{14}$|^2(?:2(?:2[1-9]|[3-9][0-9])|[3-6][0-9][0-9]|7(?:[01][0-9]|20))[0-9]{12}$/,
  amex: /^3[47][0-9]{13}$/,
  discover: /^6(?:011|5[0-9]{2})[0-9]{12}$/,
  diners: /^3[0689][0-9]{11}$/,
  jcb: /^(?:2131|1800|35[0-9]{3})[0-9]{11}$/,
}

export interface CardValidationResult {
  isValid: boolean
  cardType: string | null
  errors: string[]
}

export interface CardInfo {
  type: string
  name: string
  cvvLength: number
  lengths: number[]
}

export const CARD_TYPES: Record<string, CardInfo> = {
  visa: {
    type: "visa",
    name: "Visa",
    cvvLength: 3,
    lengths: [13, 16, 19],
  },
  mastercard: {
    type: "mastercard",
    name: "Mastercard",
    cvvLength: 3,
    lengths: [16],
  },
  amex: {
    type: "amex",
    name: "American Express",
    cvvLength: 4,
    lengths: [15],
  },
  discover: {
    type: "discover",
    name: "Discover",
    cvvLength: 3,
    lengths: [16],
  },
  diners: {
    type: "diners",
    name: "Diners Club",
    cvvLength: 3,
    lengths: [14],
  },
  jcb: {
    type: "jcb",
    name: "JCB",
    cvvLength: 3,
    lengths: [16],
  },
}

// Luhn algorithm implementation
export function luhnCheck(cardNumber: string): boolean {
  const digits = cardNumber.replace(/\D/g, "").split("").map(Number)
  let sum = 0
  let isEven = false

  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = digits[i]

    if (isEven) {
      digit *= 2
      if (digit > 9) {
        digit -= 9
      }
    }

    sum += digit
    isEven = !isEven
  }

  return sum % 10 === 0
}

// Detect card type
export function detectCardType(cardNumber: string): string | null {
  const cleanNumber = cardNumber.replace(/\D/g, "")

  for (const [type, pattern] of Object.entries(CARD_PATTERNS)) {
    if (pattern.test(cleanNumber)) {
      return type
    }
  }

  return null
}

// Validate card number
export function validateCardNumber(cardNumber: string): {
  isValid: boolean
  error: string | null
  cardType: string | null
} {
  const cleanNumber = cardNumber.replace(/\D/g, "")

  if (!cleanNumber) {
    return { isValid: false, error: "رقم البطاقة مطلوب", cardType: null }
  }

  const cardType = detectCardType(cleanNumber)

  if (!cardType) {
    return { isValid: false, error: "نوع البطاقة غير مدعوم", cardType: null }
  }

  const cardInfo = CARD_TYPES[cardType]
  if (!cardInfo.lengths.includes(cleanNumber.length)) {
    return { isValid: false, error: `رقم بطاقة ${cardInfo.name} غير صحيح`, cardType }
  }

  if (!luhnCheck(cleanNumber)) {
    return { isValid: false, error: "رقم البطاقة غير صحيح", cardType }
  }

  return { isValid: true, error: null, cardType }
}

// Validate expiry date
export function validateExpiryDate(expiryDate: string): { isValid: boolean; error: string | null } {
  if (!/^\d{2}\s\/\s\d{2}$/.test(expiryDate)) {
    return { isValid: false, error: "التنسيق يجب أن يكون MM / YY" }
  }

  const [monthStr, yearStr] = expiryDate.split(" / ")
  const month = Number.parseInt(monthStr, 10)
  const year = Number.parseInt(`20${yearStr}`, 10)

  if (month < 1 || month > 12) {
    return { isValid: false, error: "الشهر غير صحيح" }
  }

  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth() + 1

  if (year < currentYear || (year === currentYear && month < currentMonth)) {
    return { isValid: false, error: "البطاقة منتهية الصلاحية" }
  }

  return { isValid: true, error: null }
}

// Validate CVV
export function validateCVV(cvv: string, cardType: string | null): { isValid: boolean; error: string | null } {
  if (!cvv) {
    return { isValid: false, error: "CVV مطلوب" }
  }

  if (!/^\d+$/.test(cvv)) {
    return { isValid: false, error: "CVV يجب أن يحتوي على أرقام فقط" }
  }

  if (cardType) {
    const cardInfo = CARD_TYPES[cardType]
    if (cardInfo && cvv.length !== cardInfo.cvvLength) {
      return { isValid: false, error: `CVV يجب أن يكون ${cardInfo.cvvLength} أرقام` }
    }
  } else if (cvv.length < 3 || cvv.length > 4) {
    return { isValid: false, error: "CVV يجب أن يكون 3-4 أرقام" }
  }

  return { isValid: true, error: null }
}

// Format card number for display
export function formatCardNumber(value: string): string {
  const cleanValue = value.replace(/\D/g, "")
  const cardType = detectCardType(cleanValue)

  if (cardType === "amex") {
    return cleanValue.replace(/(\d{4})(\d{6})(\d{5})/, "$1 $2 $3").trim()
  }

  return cleanValue.replace(/(\d{4})/g, "$1 ").trim()
}

// Format expiry date
export function formatExpiryDate(value: string): string {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{2})(\d)/, "$1 / $2")
    .slice(0, 7)
}
