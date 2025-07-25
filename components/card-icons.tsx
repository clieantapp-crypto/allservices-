import type React from "react"
import { CreditCard } from "lucide-react"

const IconWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="absolute left-3 top-1/2 -translate-y-1/2 h-6 w-8 flex items-center justify-center">{children}</div>
)

const VisaIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 38 12" width="38" height="12">
    <path fill="#1A1F71" d="M25.9.2L22.1 12h2.5l3.8-11.8z" />
    <path
      fill="#1A1F71"
      d="M38 12V.2H35.2l-2.1 7.6L31 .2h-2.5L25.1 12h2.5l1.4-4.4h2.9L33.3 12H38zM19.2.2L15.4 12h2.5l3.8-11.8z"
    />
    <path fill="#F7A600" d="M13.4 12l1.4-4.4h2.9L19.1 12h2.5L18.2.2h-2.5L12.3 12h1.1z" />
    <path fill="#1A1F71" d="M.1 12l3.8-11.8h2.5L2.6 12H.1zm7.2 0l1.4-4.4h2.9L13 12h2.5L12.1.2H9.6L6.3 12h1z" />
  </svg>
)

const MastercardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 38 24" width="38" height="24">
    <circle fill="#EB001B" cx="15" cy="12" r="12" />
    <circle fill="#F79E1B" cx="23" cy="12" r="12" />
    <path fill="#FF5F00" d="M23,12A12,12,0,0,1,15.11,22.8,12,12,0,0,0,23,12Z" />
  </svg>
)

const AmexIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 38 24" width="38" height="24">
    <rect fill="#0077CC" width="38" height="24" rx="3" />
    <path
      fill="#FFFFFF"
      d="M19 9.8h-3.8v4.4h3.8v-1.5H17v-1.4h2V9.8z M23.2 9.8h-2.2l-1 4.4h1.6l.2-.9h1.6l.2.9h1.6l-1-4.4zm-.8 2.9h-1l.3-1.4.3 1.4z M26.2 9.8h-1.5v4.4h3.8v-1.5h-2.3V9.8z M14.8 9.8h-2.2l-1 4.4h1.6l.2-.9h1.6l.2.9h1.6l-1-4.4zm-.8 2.9h-1l.3-1.4.3 1.4z"
    />
  </svg>
)

export const CardBrandIcon = ({ type }: { type: string | null }) => {
  if (!type) {
    return (
      <IconWrapper>
        <CreditCard className="h-5 w-5 text-gray-400" />
      </IconWrapper>
    )
  }

  const icons: Record<string, React.ReactNode> = {
    visa: <VisaIcon />,
    mastercard: <MastercardIcon />,
    amex: <AmexIcon />,
  }

  return <IconWrapper>{icons[type] || <CreditCard className="h-5 w-5 text-gray-400" />}</IconWrapper>
}
