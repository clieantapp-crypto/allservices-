"use client"

import type React from "react"

import Image from "next/image"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { serviceProviders } from "@/lib/service-providers"
import { PaymentForm } from "@/components/payment-form"
import { SiteHeader } from "./ui/header"

export default function RechargePage() {
  const [serviceType, setServiceType] = useState("telecom")
  const [provider, setProvider] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [amount, setAmount] = useState("")
  const [confirmAmount, setConfirmAmount] = useState("")
  const [showPayment, setShowPayment] = useState(false)
  const [selectedViolations, setSelectedViolations] = useState([])

  const filteredProviders = serviceProviders.filter((provider) => provider.type === serviceType)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (amount !== confirmAmount) {
      alert("المبالغ غير متطابقة")
      return
    }

    // Process payment
    alert(`تمت عملية الدفع بنجاح: ${amount} ريال عماني`)
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
            backgroundImage: "url(/bg.jpg",
            backgroundRepeat: "repeat",
            backgroundSize: "200px",
          }}
        >
          <Card className="max-w-md mx-auto bg-white/95 backdrop-blur-sm shadow-xl rounded-2xl border-gray-200 overflow-hidden">
            <CardContent className="p-8">
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <Label htmlFor="service-provider-type" className="text-gray-600">
                    اختار مزود الخدمة
                  </Label>
                  <Select value={serviceType} onValueChange={setServiceType}>
                    <SelectTrigger id="service-provider-type" className="bg-white rounded-lg">
                      <SelectValue placeholder="اختر..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="telecom">الاتصالات</SelectItem>
                      <SelectItem value="electricity">الكهرباء</SelectItem>
                      <SelectItem value="entertainment">وسائل الترفيه</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="service-provider" className="text-gray-600">
                    مزود الخدمة
                  </Label>
                  <Select value={provider} onValueChange={setProvider}>
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
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone-number" className="text-gray-600">
                    {serviceType === "electricity" ? "رقم العداد / رقم الحساب" : "ادخل رقم الهاتف الذي تريد تعبئته"}
                  </Label>
                  <Input
                    id="phone-number"
                    type="text"
                    className="bg-white rounded-lg"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    dir="ltr"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount" className="text-gray-600">
                    المبلغ (ريال عماني)
                  </Label>
                  <Input
                    id="amount"
                    type="number"
                    className="bg-white rounded-lg"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    dir="ltr"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-amount" className="text-gray-600">
                    إعادة إدخال المبلغ
                  </Label>
                  <Input
                    id="confirm-amount"
                    type="number"
                    className="bg-white rounded-lg"
                    value={confirmAmount}
                    onChange={(e) => setConfirmAmount(e.target.value)}
                    dir="ltr"
                  />
                </div>

                <div className="pt-4">
                  <Button
                    type="button"
                    onClick={() => setShowPayment(true)}
                    className="w-full bg-[#9aca3f] hover:bg-[#006e33] text-white font-bold text-lg py-6 rounded-lg"
                  >
                    مبلغ الدفع
                  </Button>
                </div>
              </form>
            </CardContent>
            <div className="w-full h-20 relative mt-4">
              <Image src="/placeholder.svg?height=80&width=448" alt="طرق الدفع المتاحة" fill className="object-cover" />
            </div>
          </Card>
        </div>

        {/* Service Information */}
        <div className="py-12 px-4 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-8 text-[#9aca3f]">خدمات إعادة الشحن في عمان</h2>

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
              totalAmount={Number.parseFloat(amount) || 0}
              violations={[
                {
                  id: "1",
                  type: "تجاوز السرعة",
                  date: "2024-01-15",
                  location: "شارع السلطان قابوس",
                  amount: Number.parseFloat(amount) || 0,
                  plateNumber: phoneNumber,
                  status: "unpaid",
                },
              ]}
              onSuccess={() => {
                setShowPayment(false)
                alert("تم الدفع بنجاح!")
              }}
              onCancel={() => setShowPayment(false)}
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

function ServiceCard({ title, description, icon }:any) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md text-center">
      <div className="w-16 h-16 mx-auto mb-4 relative">
        <Image src={icon || "/placeholder.svg"} alt={title} fill className="object-contain" />
      </div>
      <h3 className="text-xl font-bold mb-2 text-[#9aca3f]">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}
