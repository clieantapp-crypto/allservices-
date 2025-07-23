"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { SiteHeader } from "@/components/ui/header"
import { useState } from "react"
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
    location: "شارع الخليج العربي",
    amount: 50,
    plateNumber: "12345",
    status: "unpaid",
  },
  {
    id: "V002",
    type: "عدم ربط حزام الأمان",
    date: "2024-01-10",
    location: "طريق الملك فهد",
    amount: 30,
    plateNumber: "12345",
    status: "unpaid",
  },
  {
    id: "V003",
    type: "استخدام الهاتف أثناء القيادة",
    date: "2024-01-08",
    location: "شارع أحمد الجابر",
    amount: 75,
    plateNumber: "12345",
    status: "unpaid",
  },
  {
    id: "V004",
    type: "عدم التوقف عند الإشارة الحمراء",
    date: "2024-01-05",
    location: "تقاطع السالمية",
    amount: 100,
    plateNumber: "12345",
    status: "unpaid",
  },
  {
    id: "V005",
    type: "الوقوف في مكان ممنوع",
    date: "2024-01-03",
    location: "مجمع الأفنيوز",
    amount: 25,
    plateNumber: "12345",
    status: "unpaid",
  },
  {
    id: "V006",
    type: "عدم إعطاء الأولوية للمشاة",
    date: "2023-12-28",
    location: "شارع سالم المبارك",
    amount: 40,
    plateNumber: "12345",
    status: "paid",
  },
]

export default function ROPFinePage() {
  const [violations, setViolations] = useState<Violation[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showViolations, setShowViolations] = useState(false)
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const randomViolations = getRandomViolations()
    setViolations(randomViolations)
    setShowViolations(true)
    setIsLoading(false)
    window.location.href="/violations"
  }

  const handleReset = () => {
    setShowViolations(false)
    setViolations([])
    setFormData({
      registrationType: "personal",
      civilId: "",
      expiryDate: "",
      specificVehicle: false,
    })
  }

  const totalAmount = violations.filter((v) => v.status === "unpaid").reduce((sum, v) => sum + v.amount, 0)

  return (
    <div className="bg-white min-h-screen font-sans" dir="rtl">
      <SiteHeader />
      <main>
        {/* Title Banner */}
        <div className="bg-[#9aca3f] text-white text-center py-8">
          <h1 className="text-4xl font-bold">دفع المخالفات</h1>
        </div>

        {/* Form Section */}
        <div
          className="py-12 px-4"
          style={{
            backgroundImage: "url(/bg.jpg)",
            backgroundRepeat: "repeat",
            backgroundSize: "auto",
          }}
        >
          <Card className="max-w-md mx-auto bg-white/40 backdrop-blur-sm shadow-xl rounded-2xl border-gray-200">
            <CardContent className="p-8">
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="text-center">
                  <h2 className="text-xl font-semibold text-gray-700">اختر نوع التسجيل</h2>
                </div>

                <div className="flex justify-center gap-8">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Checkbox
                      id="personal"
                      defaultChecked
                      className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <Label htmlFor="personal" className="text-lg font-medium text-gray-700">
                      شخصي
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Checkbox id="commercial" />
                    <Label htmlFor="commercial" className="text-lg font-medium text-gray-700">
                      تجاري
                    </Label>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="civil-id" className="text-gray-600">
                    رقم المدني
                  </Label>
                  <Input id="civil-id" type="tel" required className="bg-white rounded-lg" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expiry-date" className="text-gray-600">
                    تاريخ الانتهاء
                  </Label>
                  <Input id="expiry-date" type="text" placeholder="dd-MM-yyyy" className="bg-white rounded-lg" />
                </div>

                <div className="flex items-center space-x-2 space-x-reverse pt-2">
                  <Checkbox id="specific-vehicle" />
                  <Label htmlFor="specific-vehicle" className="text-gray-700">
                    الإستفسار عن مركبة معينة
                  </Label>
                </div>

                <div className="space-y-3 pt-4">
                <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-[#374151] hover:bg-gray-600 text-white font-bold text-lg py-6 rounded-lg disabled:opacity-50"
                    >
                      {isLoading ? "جاري البحث..." : "الإستفسار"}
                    </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full bg-gray-100 hover:bg-gray-200 text-brand-green font-bold text-lg py-6 rounded-lg"
                  >
                    إلغاء
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
