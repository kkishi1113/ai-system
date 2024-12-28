import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
export function ChatContext({ context }: { context: any }) {
  return (
    <>
      {context && (
        <div className="w-64 bg-secondary/10 p-4 overflow-y-auto">
          <Card>
            <CardHeader>
              <CardTitle>会話コンテキスト</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p>
                  <strong>テーマ:</strong> {context.prompt}
                </p>
                <p>
                  <strong>反復回数:</strong> {context.iteration}
                </p>
                <details>
                  <summary>会話履歴</summary>
                  <div className="mt-2 space-y-1 text-xs">
                    {context.history?.map((item: string, index: number) => (
                      <div
                        key={index}
                        className="border-b border-border/30 pb-1 last:border-b-0"
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </details>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
