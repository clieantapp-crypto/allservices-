"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"

interface OTPDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  phoneNumber: string
  onSuccess: () => void
}

export function OTPDialog({ open, onOpenChange, phoneNumber, onSuccess }: OTPDialogProps) {
  const [otp, setOtp] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [error, setError] = useState("")

  const handleVerify = async () => {
    setIsVerifying(true)
    setError("")
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsVerifying(false)
    if (otp === "123456") {
      onSuccess()
    } else {
      setError("رمز التحقق غير صحيح. الرجاء المحاولة مرة أخرى.")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" dir="rtl" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">التحقق من الدفع</DialogTitle>
          <DialogDescription className="text-center">
            تم إرسال رمز التحقق (OTP) إلى هاتفك{" "}
            <span dir="ltr" className="font-semibold">
              {phoneNumber}
            </span>
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center space-y-4 py-4">
          <InputOTP maxLength={6} value={otp} onChange={setOtp}>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
          <div className="text-sm text-gray-500 text-center">
            لأغراض العرض، أدخل الرمز <span className="font-bold text-gray-700">123456</span> للمتابعة.
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
        <DialogFooter className="sm:justify-center">
          <Button type="button" onClick={handleVerify} disabled={isVerifying || otp.length < 6} className="w-full">
            {isVerifying ? "جاري التحقق..." : "تحقق"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
