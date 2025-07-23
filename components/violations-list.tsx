import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Violation {
  id: string
  type: string
  date: string
  location: string
  amount: number
  plateNumber: string
  status: "unpaid" | "paid"
}

interface ViolationsListProps {
  violations: Violation[]
}

export function ViolationsList({ violations }: ViolationsListProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">المخالفات المسجلة ({violations.length})</h3>

      {violations.map((violation) => (
        <Card key={violation.id} className="border border-gray-200">
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800 mb-1">{violation.type}</h4>
                <p className="text-sm text-gray-600 mb-1">
                  <span className="font-medium">التاريخ:</span> {violation.date}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  <span className="font-medium">الموقع:</span> {violation.location}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">رقم اللوحة:</span> {violation.plateNumber}
                </p>
              </div>

              <div className="text-left">
                <div className="text-lg font-bold text-gray-800 mb-2">{violation.amount} د.ك</div>
                <Badge
                  variant={violation.status === "paid" ? "secondary" : "destructive"}
                  className={violation.status === "paid" ? "bg-green-100 text-green-800" : ""}
                >
                  {violation.status === "paid" ? "مدفوعة" : "غير مدفوعة"}
                </Badge>
              </div>
            </div>

            <div className="text-xs text-gray-500 pt-2 border-t">رقم المخالفة: {violation.id}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
