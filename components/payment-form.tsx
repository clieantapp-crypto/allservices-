"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface EnhancedPaymentFormProps {
  totalAmount: number
  violations: any[]
  onCancel: () => void
  onSuccess: (data: any) => void
}

export function EnhancedPaymentForm({ totalAmount, violations, onCancel, onSuccess }: EnhancedPaymentFormProps) {
  const [cardInfo, setCardInfo] = useState({
    number: "",
    name: "",
    expiry: "",
    cvc: "",
  })
  const [isProcessing, setIsProcessing] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setCardInfo((prev) => ({ ...prev, [id]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)
    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsProcessing(false)
    onSuccess({ ...cardInfo, amount: totalAmount })
  }

  return (
    <Card className="max-w-lg mx-auto bg-white/90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>الدفع الإلكتروني الآمن</CardTitle>
        <CardDescription>
          أدخل تفاصيل بطاقتك لإتمام عملية الدفع. المبلغ الإجمالي:{" "}
          <span className="font-bold text-red-600">{totalAmount} ر.ع</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="number">رقم البطاقة</Label>
            <Input
              id="number"
              placeholder="**** **** **** ****"
              value={cardInfo.number}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">الاسم على البطاقة</Label>
            <Input id="name" placeholder="الاسم الكامل" value={cardInfo.name} onChange={handleInputChange} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiry">تاريخ الانتهاء</Label>
              <Input id="expiry" placeholder="MM/YY" value={cardInfo.expiry} onChange={handleInputChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cvc">CVC</Label>
              <Input id="cvc" placeholder="***" value={cardInfo.cvc} onChange={handleInputChange} required />
            </div>
          </div>
          <CardFooter className="flex justify-end gap-4 p-0 pt-6">
            <Button type="button" variant="ghost" onClick={onCancel}>
              إلغاء
            </Button>
            <Button type="submit" className="bg-[#85a646] hover:bg-green-600" disabled={isProcessing}>
              {isProcessing ? "جاري المعالجة..." : `ادفع ${totalAmount} ر.ع`}
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  )
}
