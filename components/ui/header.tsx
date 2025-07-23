import Image from "next/image"
import { Phone, Mail, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"

export function SiteHeader() {
  return (
    <header>
      {/* Top bar */}
      <div className="bg-[#374151] text-white p-2">
        <div className="container mx-auto flex justify-between items-center text-sm">
          <div className="flex items-center gap-4">
            <a href="#" className="flex items-center gap-2 hover:text-brand-green-light">
              <div className=" bg-[#9aca3f] p-1.5 rounded-md">
                <Phone size={16} />
              </div>
              <span>24727272</span>
            </a>
            <a href="#" className="flex items-center gap-2 hover:text-brand-green-light">
              <div className=" bg-[#9aca3f] p-1.5 rounded-md">
                <Mail size={16} />
              </div>
              <span>اتصل بنا</span>
            </a>
          </div>
          <a href="#" className="hover:text-brand-green-light">
            [ English ]
          </a>
        </div>
      </div>

      {/* Main navigation */}
      <div className="bg-white shadow-md">
        <div className="container mx-auto flex justify-between items-center p-2">
          <img src="/bg-im.png" alt="OIFC Logo" width={65} height={60} className="object-contain" />
          <Button variant="ghost" size="icon" className="border rounded-md">
            <Menu size={24} className="text-gray-600" />
          </Button>
        </div>
      </div>
    </header>
  )
}
