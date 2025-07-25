import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Violation {
  id: string
  type: string
  date: string
  location: string
  amount: number
  status: "unpaid" | "paid"
}

interface ViolationsListProps {
  violations: Violation[]
}

export function ViolationsList({ violations }: ViolationsListProps) {
  return (
    <div>
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>نوع المخالفة</TableHead>
              <TableHead>المبلغ (ر.ع)</TableHead>
              <TableHead>التاريخ</TableHead>
              <TableHead>الموقع</TableHead>
              <TableHead>الحالة</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {violations.map((v) => (
              <TableRow key={v.id}>
                <TableCell className="font-medium">{v.type}</TableCell>
                <TableCell>{v.amount.toFixed(2)}</TableCell>
                <TableCell>{v.date}</TableCell>
                <TableCell>{v.location}</TableCell>
                <TableCell>
                  <Badge
                    variant={v.status === "paid" ? "default" : "destructive"}
                    className={v.status === "paid" ? "bg-green-600 text-white" : ""}
                  >
                    {v.status === "paid" ? "مدفوعة" : "غير مدفوعة"}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="md:hidden space-y-4">
        {violations.map((v) => (
          <Card key={v.id} className="bg-white/80">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{v.type}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between border-b pb-1">
                <span className="font-semibold text-gray-600">المبلغ:</span>
                <span className="font-bold">{v.amount.toFixed(2)} ر.ع</span>
              </div>
              <div className="flex justify-between border-b pb-1">
                <span className="font-semibold text-gray-600">التاريخ:</span>
                <span>{v.date}</span>
              </div>
              <div className="flex justify-between border-b pb-1">
                <span className="font-semibold text-gray-600">الموقع:</span>
                <span className="text-left">{v.location}</span>
              </div>
              <div className="flex justify-between items-center pt-1">
                <span className="font-semibold text-gray-600">الحالة:</span>
                <Badge
                  variant={v.status === "paid" ? "default" : "destructive"}
                  className={v.status === "paid" ? "bg-green-600 text-white" : ""}
                >
                  {v.status === "paid" ? "مدفوعة" : "غير مدفوعة"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
