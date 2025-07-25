"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle } from "lucide-react"
import {
  validateCardNumber,
  validateExpiryDate,
  validateCVV,
  formatCardNumber,
  formatExpiryDate,
} from "@/lib/card-validator"
import { CardBrandIcon } from "./card-icons"

interface PaymentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  totalAmount: number
  onSuccess: () => void
}

export function PaymentDialog({ open, onOpenChange, totalAmount, onSuccess }: PaymentDialogProps) {
  const [cardHolder, setCardHolder] = useState("")
  const [cardNumber, setCardNumber] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [cvv, setCvv] = useState("")
  const [cardType, setCardType] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string | null>>({})
  const [isProcessing, setIsProcessing] = useState(false)

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value)
    setCardNumber(formatted)
    const { cardType } = validateCardNumber(formatted)
    setCardType(cardType)
    if (errors.cardNumber) setErrors((prev) => ({ ...prev, cardNumber: null }))
  }

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiryDate(e.target.value)
    setExpiryDate(formatted)
    if (errors.expiryDate) setErrors((prev) => ({ ...prev, expiryDate: null }))
  }

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "")
    setCvv(value)
    if (errors.cvv) setErrors((prev) => ({ ...prev, cvv: null }))
  }

  const validateForm = () => {
    const newErrors: Record<string, string | null> = {}
    if (!cardHolder.trim()) {
      newErrors.cardHolder = "اسم حامل البطاقة مطلوب"
    }

    const cardNumberValidation = validateCardNumber(cardNumber)
    if (!cardNumberValidation.isValid) {
      newErrors.cardNumber = cardNumberValidation.error
    }

    const expiryDateValidation = validateExpiryDate(expiryDate)
    if (!expiryDateValidation.isValid) {
      newErrors.expiryDate = expiryDateValidation.error
    }

    const cvvValidation = validateCVV(cvv, cardType)
    if (!cvvValidation.isValid) {
      newErrors.cvv = cvvValidation.error
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) {
      return
    }
    setIsProcessing(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsProcessing(false)
    onSuccess()
  }

  const ErrorMessage = ({ name }: { name: string }) => {
    const error = errors[name]
    return error ? (
      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
        <AlertCircle size={16} />
        {error}
      </p>
    ) : null
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-2xl">إتمام عملية الدفع</DialogTitle>
          <DialogDescription>
            المبلغ الإجمالي للدفع: <span className="font-bold text-xl text-red-600">{totalAmount.toFixed(2)} ر.ع</span>
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="card-holder">اسم حامل البطاقة</Label>
              <Input
                id="card-holder"
                placeholder="الاسم كما هو على البطاقة"
                value={cardHolder}
                onChange={(e) => {
                  setCardHolder(e.target.value)
                  if (errors.cardHolder) setErrors((prev) => ({ ...prev, cardHolder: null }))
                }}
                required
              />
              <ErrorMessage name="cardHolder" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="card-number">رقم البطاقة</Label>
              <div className="relative">
                <Input
                  id="card-number"
                  type="tel"
                  inputMode="numeric"
                  placeholder="**** **** **** ****"
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  maxLength={cardType === "amex" ? 17 : 19}
                  required
                  className="pr-12"
                />
                <CardBrandIcon type={cardType} />
              </div>
              <ErrorMessage name="cardNumber" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiry-date">تاريخ الانتهاء</Label>
                <Input
                  id="expiry-date"
                  placeholder="MM / YY"
                  value={expiryDate}
                  onChange={handleExpiryDateChange}
                  required
                />
                <ErrorMessage name="expiryDate" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvc">CVV</Label>
                <Input
                  id="cvc"
                  placeholder="***"
                  type="tel"
                  inputMode="numeric"
                  value={cvv}
                  onChange={handleCvvChange}
                  maxLength={cardType === "amex" ? 4 : 3}
                  required
                />
                <ErrorMessage name="cvv" />
              </div>
            </div>
          </div>
          <DialogFooter className="flex-col-reverse sm:flex-row sm:justify-between sm:space-x-2 gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
              إلغاء
            </Button>
            <Button type="submit" className="w-full sm:w-auto bg-[#9aca3f] hover:bg-[#006e33]" disabled={isProcessing}>
              {isProcessing ? "جاري المعالجة..." : `ادفع الآن`}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
