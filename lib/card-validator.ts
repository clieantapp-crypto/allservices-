// Card type patterns
const CARD_PATTERNS = {
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
      lengths: [16, 19],
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
  export function validateCardNumber(cardNumber: string): CardValidationResult {
    const errors: string[] = []
    const cleanNumber = cardNumber.replace(/\D/g, "")
  
    if (!cleanNumber) {
      errors.push("رقم البطاقة مطلوب")
      return { isValid: false, cardType: null, errors }
    }
  
    if (cleanNumber.length < 13 || cleanNumber.length > 19) {
      errors.push("رقم البطاقة يجب أن يكون بين 13-19 رقم")
    }
  
    const cardType = detectCardType(cleanNumber)
  
    if (!cardType) {
      errors.push("نوع البطاقة غير مدعوم")
      return { isValid: false, cardType: null, errors }
    }
  
    const cardInfo = CARD_TYPES[cardType]
    if (!cardInfo.lengths.includes(cleanNumber.length)) {
      errors.push(`رقم بطاقة ${cardInfo.name} غير صحيح`)
    }
  
    if (!luhnCheck(cleanNumber)) {
      errors.push("رقم البطاقة غير صحيح")
    }
  
    return {
      isValid: errors.length === 0,
      cardType,
      errors,
    }
  }
  
  // Validate expiry date
  export function validateExpiryDate(month: string, year: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = []
  
    if (!month || !year) {
      errors.push("تاريخ انتهاء الصلاحية مطلوب")
      return { isValid: false, errors }
    }
  
    const currentDate = new Date()
    const currentYear = currentDate.getFullYear()
    const currentMonth = currentDate.getMonth() + 1
  
    const expMonth = Number.parseInt(month, 10)
    const expYear = Number.parseInt(year, 10)
  
    if (expMonth < 1 || expMonth > 12) {
      errors.push("الشهر غير صحيح")
    }
  
    if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
      errors.push("البطاقة منتهية الصلاحية")
    }
  
    if (expYear > currentYear + 20) {
      errors.push("تاريخ انتهاء الصلاحية بعيد جداً")
    }
  
    return { isValid: errors.length === 0, errors }
  }
  
  // Validate CVV
  export function validateCVV(cvv: string, cardType: string | null): { isValid: boolean; errors: string[] } {
    const errors: string[] = []
  
    if (!cvv) {
      errors.push("CVV مطلوب")
      return { isValid: false, errors }
    }
  
    if (!/^\d+$/.test(cvv)) {
      errors.push("CVV يجب أن يحتوي على أرقام فقط")
    }
  
    if (cardType) {
      const cardInfo = CARD_TYPES[cardType]
      if (cardInfo && cvv.length !== cardInfo.cvvLength) {
        errors.push(`CVV يجب أن يكون ${cardInfo.cvvLength} أرقام لبطاقة ${cardInfo.name}`)
      }
    } else {
      if (cvv.length < 3 || cvv.length > 4) {
        errors.push("CVV يجب أن يكون 3-4 أرقام")
      }
    }
  
    return { isValid: errors.length === 0, errors }
  }
  
  // Format card number for display
  export function formatCardNumber(value: string, cardType: string | null = null): string {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
  
    if (cardType === "amex") {
      // American Express: 4-6-5 format
      const matches = v.match(/\d{4,15}/g)
      const match = (matches && matches[0]) || ""
      const parts = []
  
      if (match.length >= 4) parts.push(match.substring(0, 4))
      if (match.length >= 10) parts.push(match.substring(4, 10))
      if (match.length > 10) parts.push(match.substring(10, 15))
  
      return parts.join(" ")
    } else {
      // Other cards: 4-4-4-4 format
      const matches = v.match(/\d{4,16}/g)
      const match = (matches && matches[0]) || ""
      const parts = []
  
      for (let i = 0, len = match.length; i < len; i += 4) {
        parts.push(match.substring(i, i + 4))
      }
  
      return parts.join(" ")
    }
  }
  

  