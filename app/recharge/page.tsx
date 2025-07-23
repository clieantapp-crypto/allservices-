import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SiteHeader } from "@/components/ui/header"

export default function RechargePage() {
  return (
    <div className="bg-white min-h-screen font-sans" dir="rtl">
      <SiteHeader />

      <main>
        {/* Title Banner */}
        <div className="bg-brand-green text-white text-center py-8 px-4">
          <h1 className="text-3xl md:text-4xl font-bold">اعادة شحن الاتصالات و الكهرباء و وسائل الترفيه</h1>
        </div>

        {/* Form Section */}
        <div
          className="py-12 px-4"
          style={{
            backgroundImage: "url(/islamic-pattern.png)",
            backgroundRepeat: "repeat",
            backgroundSize: "auto",
          }}
        >
          <Card className="max-w-md mx-auto bg-white/95 backdrop-blur-sm shadow-xl rounded-2xl border-gray-200 overflow-hidden">
            <CardContent className="p-8">
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="service-provider-type" className="text-gray-600">
                    اختار مزود الخدمة
                  </Label>
                  <Select defaultValue="telecom">
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
                  <Select>
                    <SelectTrigger id="service-provider" className="bg-white rounded-lg">
                      <SelectValue placeholder="حدد أي" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="provider1">مزود 1</SelectItem>
                      <SelectItem value="provider2">مزود 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone-number" className="text-gray-600">
                    ادخل رقم الهاتف الذي تريد تعبئته
                  </Label>
                  <Input id="phone-number" type="text" className="bg-white rounded-lg" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount" className="text-gray-600">
                    المبلغ
                  </Label>
                  <Input id="amount" type="text" className="bg-white rounded-lg" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-amount" className="text-gray-600">
                    إعادة إدخال المبلغ
                  </Label>
                  <Input id="confirm-amount" type="text" className="bg-white rounded-lg" />
                </div>

                <div className="pt-4">
                  <Button
                    type="submit"
                    className="w-full bg-brand-green hover:bg-brand-green-dark text-white font-bold text-lg py-6 rounded-lg"
                  >
                    مبلغ الدفع
                  </Button>
                </div>
              </form>
            </CardContent>
            <div className="w-full h-20 relative mt-4">
              <Image
                src="/placeholder.svg?height=80&width=448"
                alt="Cityscape skyline graphic"
                layout="fill"
                objectFit="cover"
              />
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}
