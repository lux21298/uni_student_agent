import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle } from "lucide-react"

export function SetupCard() {
  return (
    <Card className="border-green-200 bg-green-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-800">
          <CheckCircle className="h-5 w-5" />
          Ready to Use!
        </CardTitle>
        <CardDescription className="text-green-700">
          This demo uses mock data - no API keys or setup required
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Alert>
          <AlertDescription>
            This agent demonstrates the power of accessing private student data that's not available through public
            APIs. Perfect for university demonstrations!
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  )
}
