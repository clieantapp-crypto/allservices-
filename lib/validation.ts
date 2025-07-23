import { z } from "zod"

// Recharge form validation schema
export const rechargeSchema = z
  .object({
    serviceType: z.string().min(1, "نوع الخدمة مطلوب"),
    provider: z.string().min(1, "مزود الخدمة مطلوب"),
    phoneNumber: z
      .string()
      .min(1, "رقم الهاتف أو العداد مطلوب")
      .refine((val) => {
        // Validate Omani phone numbers or meter numbers
        const phoneRegex = /^[79]\d{7}$/
        const meterRegex = /^\d{8,12}$/
        return phoneRegex.test(val) || meterRegex.test(val)
      }, "رقم الهاتف أو العداد غير صحيح"),
    amount: z.number().min(1, "المبلغ يجب أن يكون أكبر من صفر").max(1000, "المبلغ كبير جداً"),
    confirmAmount: z.number(),
  })
  .refine((data) => data.amount === data.confirmAmount, {
    message: "المبالغ غير متطابقة",
    path: ["confirmAmount"],
  })

// Omani phone number validation
export const validateOmaniPhone = (phone: string): boolean => {
  const cleanPhone = phone.replace(/[\s\-+]/g, "")
  const patterns = [
    /^968[79]\d{7}$/, // With country code
    /^[79]\d{7}$/, // Without country code
  ]
  return patterns.some((pattern) => pattern.test(cleanPhone))
}

// Credit card validation
export const validateCreditCard = (cardNumber: string): boolean => {
  const cleaned = cardNumber.replace(/\s/g, "")

  // Luhn algorithm
  let sum = 0
  let isEven = false

  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = Number.parseInt(cleaned.charAt(i), 10)

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

// CVV validation based on card type
export const validateCVV = (cvv: string, cardNumber: string): boolean => {
  const cleaned = cardNumber.replace(/\s/g, "")

  // American Express cards have 4-digit CVV
  if (cleaned.startsWith("34") || cleaned.startsWith("37")) {
    return /^\d{4}$/.test(cvv)
  }

  // Other cards have 3-digit CVV
  return /^\d{3}$/.test(cvv)
}

// Expiry date validation
export const validateExpiryDate = (month: string, year: string): boolean => {
  const currentDate = new Date()
  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth() + 1

  const expMonth = Number.parseInt(month, 10)
  const expYear = Number.parseInt(year, 10)

  if (expYear < currentYear) return false
  if (expYear === currentYear && expMonth < currentMonth) return false

  return true
}
