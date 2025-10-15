import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle } from "lucide-react"

export function AdmissionsDisclaimer() {
  return (
    <Card className="border-yellow-500/30 bg-yellow-500/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400">
          <AlertTriangle className="h-5 w-5" />
          Important Disclaimer
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-yellow-700 dark:text-yellow-300">
          CampusAxis provides peer-to-peer support and resources for educational purposes only. 
          We are not affiliated with COMSATS University admission processes. All official admission 
          procedures should be followed as per the university's official website. We do not guarantee 
          admission or provide false/misleading guidance.
        </p>
        <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-3">
          For official admission information, please visit the COMSATS University official website.
        </p>
      </CardContent>
    </Card>
  )
}