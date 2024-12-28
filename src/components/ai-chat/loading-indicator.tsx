import { Card, CardContent } from "@/components/ui/card"
import { Loader2 } from 'lucide-react'

export function LoadingIndicator() {
  return (
    <Card className="bg-muted/50">
      <CardContent className="flex items-center justify-center p-4">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        <span>応答を生成中...</span>
      </CardContent>
    </Card>
  )
}

