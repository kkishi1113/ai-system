import { Card, CardContent } from "@/components/ui/card";

interface ErrorDisplayProps {
  error: string;
}

export function ErrorDisplay({ error }: ErrorDisplayProps) {
  return (
    <Card className="border-destructive">
      <CardContent className="p-4 text-destructive">
        <h2 className="font-semibold mb-2">エラー</h2>
        <p>{error}</p>
      </CardContent>
    </Card>
  );
}
