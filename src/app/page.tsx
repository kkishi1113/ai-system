"use client";

import { useState } from "react";
import axios from "axios";
import { Loader2, Send } from "lucide-react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function Home() {
  const [theme, setTheme] = useState("");
  const [response, setResponse] = useState<string[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResponse(null);
    setError(null);
    setIsLoading(true);

    try {
      const res = await axios.post("/api/ai-loop", { theme });
      setResponse(res.data.logs);
      console.log(
        res.data.logs.map((r: string) =>
          r.replace(/`/g, "\\`").replace(/"/g, "`")
        )
      );
    } catch (err: any) {
      setError(err.response?.data?.error || "エラーが発生しました。");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl min-h-screen">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Gemini AI 会話ログ</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              type="text"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              placeholder="テーマを入力してください"
              className="flex-1"
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading || !theme.trim()}>
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              <span className="ml-2 hidden sm:inline">送信</span>
            </Button>
          </form>

          {isLoading && (
            <Card className="bg-muted/50">
              <CardContent className="flex items-center justify-center p-4">
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                <span>応答を生成中...</span>
              </CardContent>
            </Card>
          )}

          {error && (
            <Card className="border-destructive">
              <CardContent className="p-4 text-destructive">
                <h2 className="font-semibold mb-2">エラー</h2>
                <p>{error}</p>
              </CardContent>
            </Card>
          )}

          {response && (
            <div className="space-y-4">
              {response.map((text, index) => (
                <Card
                  key={index}
                  className={cn(
                    "transition-all duration-200",
                    index === response.length - 1 &&
                      "animate-in fade-in-0 slide-in-from-bottom-4"
                  )}
                >
                  <CardContent className="p-4">
                    <ReactMarkdown
                      className="prose prose-sm max-w-none dark:prose-invert"
                      rehypePlugins={[rehypeRaw]}
                      remarkPlugins={[remarkGfm]}
                    >
                      {text}
                    </ReactMarkdown>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
