export interface ServiceProvider {
    id: string
    name: string
    type: "telecom" | "electricity" | "entertainment"
    logo?: string
    minAmount?: number
    maxAmount?: number
  }
  
  export const serviceProviders: ServiceProvider[] = [
    // Telecom providers in Oman
      // Electricity providers in Oman
    {
      id: "muscat-electricity",
      name: "شركة الكهرباء العامة",
      type: "electricity",
      logo: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "omantel",
      name: "عمانتل",
      type: "telecom",
      logo: "/placeholder.svg?height=40&width=40",
      minAmount: 1,
      maxAmount: 50,
    },
    {
      id: "ooredoo",
      name: "أوريدو",
      type: "telecom",
      logo: "/placeholder.svg?height=40&width=40",
      minAmount: 1,
      maxAmount: 50,
    },
    {
      id: "renna",
      name: "رنة",
      type: "telecom",
      logo: "/placeholder.svg?height=40&width=40",
      minAmount: 1,
      maxAmount: 30,
    },
    {
      id: "friendi",
      name: "فريندي",
      type: "telecom",
      logo: "/placeholder.svg?height=40&width=40",
      minAmount: 1,
      maxAmount: 30,
    },
  
    // Electricity providers in Oman
    {
      id: "muscat-electricity",
      name: "شركة مسقط لتوزيع الكهرباء",
      type: "electricity",
      logo: "/placeholder.svg?height=40&width=40",
      minAmount: 5,
      maxAmount: 500,
    },
    {
      id: "nama",
      name: "نماء",
      type: "electricity",
      logo: "/placeholder.svg?height=40&width=40",
      minAmount: 5,
      maxAmount: 500,
    },
    {
      id: "mazoon",
      name: "مزون للكهرباء",
      type: "electricity",
      logo: "/placeholder.svg?height=40&width=40",
      minAmount: 5,
      maxAmount: 500,
    },
    {
      id: "majan",
      name: "مجان للكهرباء",
      type: "electricity",
      logo: "/placeholder.svg?height=40&width=40",
      minAmount: 5,
      maxAmount: 500,
    },
  
    // Entertainment providers available in Oman
    {
      id: "netflix",
      name: "نتفلكس",
      type: "entertainment",
      logo: "/placeholder.svg?height=40&width=40",
      minAmount: 8,
      maxAmount: 36,
    },
    {
      id: "shahid",
      name: "شاهد VIP",
      type: "entertainment",
      logo: "/placeholder.svg?height=40&width=40",
      minAmount: 7,
      maxAmount: 25,
    },
    {
      id: "starzplay",
      name: "ستارزبلاي",
      type: "entertainment",
      logo: "/placeholder.svg?height=40&width=40",
      minAmount: 6,
      maxAmount: 24,
    },
    {
      id: "apple",
      name: "بطاقات آبل",
      type: "entertainment",
      logo: "/placeholder.svg?height=40&width=40",
      minAmount: 5,
      maxAmount: 100,
    },
    {
      id: "google-play",
      name: "بطاقات جوجل بلاي",
      type: "entertainment",
      logo: "/placeholder.svg?height=40&width=40",
      minAmount: 5,
      maxAmount: 100,
    },
    {
      id: "pubg",
      name: "شحن لعبة ببجي",
      type: "entertainment",
      logo: "/placeholder.svg?height=40&width=40",
      minAmount: 1,
      maxAmount: 50,
    },
  ]
  