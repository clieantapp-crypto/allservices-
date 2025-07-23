"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { CreditCard, Shield, ArrowRight, CheckCircle } from "lucide-react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

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

// Payment form validation schema
const paymentSchema = z.object({
  cardNumber: z
    .string()
    .min(1, "رقم البطاقة مطلوب")
    .regex(/^\d{4}\s\d{4}\s\d{4}\s\d{4}$/, "رقم البطاقة غير صحيح"),
  expiryMonth: z.string().min(1, "الشهر مطلوب"),
  expiryYear: z.string().min(1, "السنة مطلوبة"),
  cvv: z
    .string()
    .min(3, "CVV يجب أن يكون 3-4 أرقام")
    .max(4, "CVV يجب أن يكون 3-4 أرقام")
    .regex(/^\d+$/, "CVV يجب أن يحتوي على أرقام فقط"),
  cardholderName: z.string().min(2, "اسم حامل البطاقة مطلوب").max(50, "الاسم طويل جداً"),
  email: z.string().min(1, "البريد الإلكتروني مطلوب").email("البريد الإلكتروني غير صحيح"),
  phone: z
    .string()
    .min(1, "رقم الهاتف مطلوب")
    .regex(/^(\+968|968)?\s?[79]\d{7}$/, "رقم الهاتف غير صحيح (مثال: +968 91234567)"),
})

type PaymentFormData = z.infer<typeof paymentSchema>

 function PaymentForm({ totalAmount, violations, onSuccess, onCancel }: PaymentFormProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentComplete, setPaymentComplete] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    trigger,
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    mode: "onChange",
  })

  const cardNumber = watch("cardNumber")

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }

    if (parts.length) {
      return parts.join(" ")
    } else {
      return v
    }
  }

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value)
    if (formatted.length <= 19) {
      setValue("cardNumber", formatted)
      trigger("cardNumber")
    }
  }

  const onSubmit = async (data: PaymentFormData) => {
    setIsProcessing(true)

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 3000))

    setIsProcessing(false)
    setPaymentComplete(true)

    // Auto redirect after success
    setTimeout(() => {
      onSuccess()
    }, 2000)
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
              <p className="text-green-600 text-sm">عدد المخالفات: {violations.length}</p>
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
            دفع المخالفات
          </CardTitle>
          <p className="text-gray-600">ادفع بأمان باستخدام بطاقتك الائتمانية</p>
        </CardHeader>

        <CardContent className="p-8">
          {/* Payment Summary */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="font-semibold text-gray-800 mb-3">ملخص الدفع</h3>
            <div className="space-y-2">
              {violations.map((violation) => (
                <div key={violation.id} className="flex justify-between text-sm">
                  <span className="text-gray-600">{violation.type}</span>
                  <span className="font-medium">{violation.amount} ر.ع</span>
                </div>
              ))}
            </div>
            <Separator className="my-3" />
            <div className="flex justify-between font-bold text-lg">
              <span>المجموع الكلي:</span>
              <span className="text-red-600">{totalAmount} ر.ع</span>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Card Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                معلومات البطاقة
              </h3>

              <div className="space-y-2">
                <Label htmlFor="cardNumber" className="text-gray-700">
                  رقم البطاقة
                </Label>
                <Input
                  id="cardNumber"
                  type="tel"
                  {...register("cardNumber")}
                  onChange={handleCardNumberChange}
                  placeholder="#### #### #### ####"
                  className={`bg-white text-left ${errors.cardNumber ? "border-red-500" : ""}`}
                  dir="ltr"
                />
                {errors.cardNumber && <p className="text-red-500 text-sm">{errors.cardNumber.message}</p>}
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiryMonth" className="text-gray-700">
                    الشهر
                  </Label>
                  <Select
                    value={watch("expiryMonth")}
                    onValueChange={(value) => {
                      setValue("expiryMonth", value)
                      trigger("expiryMonth")
                    }}
                  >
                    <SelectTrigger>
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
                  {errors.expiryMonth && <p className="text-red-500 text-sm">{errors.expiryMonth.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expiryYear" className="text-gray-700">
                    السنة
                  </Label>
                  <Select
                    value={watch("expiryYear")}
                    onValueChange={(value) => {
                      setValue("expiryYear", value)
                      trigger("expiryYear")
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="السنة" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 10 }, (_, i) => (
                        <SelectItem key={2024 + i} value={String(2024 + i)}>
                          {2024 + i}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.expiryYear && <p className="text-red-500 text-sm">{errors.expiryYear.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cvv" className="text-gray-700">
                    CVV
                  </Label>
                  <Input
                    id="cvv"
                    type="tel"
                    {...register("cvv")}
                    placeholder="***"
                    className={`bg-white text-left ${errors.cvv ? "border-red-500" : ""}`}
                    dir="ltr"
                    required
                    maxLength={3}
                  />
                  {errors.cvv && <p className="text-red-500 text-sm">{errors.cvv.message}</p>}
                </div>
              </div>

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
                  required
                />
                {errors.cardholderName && <p className="text-red-500 text-sm">{errors.cardholderName.message}</p>}
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-800">معلومات الاتصال</h3>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-gray-700">
                  رقم الهاتف
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  {...register("phone")}
                  placeholder="+968 9123 4567"
                  className={`bg-white text-left ${errors.phone ? "border-red-500" : ""}`}
                  dir="ltr"
                  required
                />
                {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
              </div>
            </div>

            {/* Security Notice */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-semibold mb-1">دفع آمن ومحمي</p>
                  <p>جميع معلومات الدفع محمية بتشفير SSL 256-bit. لن يتم حفظ معلومات بطاقتك على خوادمنا.</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                disabled={isProcessing}
                className="flex-1 bg-[#00843D] hover:bg-[#006e33] text-white font-bold py-4 text-lg disabled:opacity-50"
              >
                {isProcessing ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    جاري المعالجة...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    دفع {totalAmount} ر.ع
                    <ArrowRight className="w-4 h-4" />
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
    </div>
  )
}
