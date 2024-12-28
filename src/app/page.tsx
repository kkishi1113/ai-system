"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import {
  Loader2,
  Send,
  Copy,
  Check,
  Moon,
  Sun,
  MessageSquare,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  oneDark,
  oneLight,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Textarea } from "@/components/ui/textarea";

export default function Home() {
  const [theme, setTheme] = useState("");
  const [response, setResponse] = useState<string[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState<number | null>(null);
  const { theme: colorTheme, setTheme: setColorTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!theme.trim()) return;

    setResponse(null);
    setError(null);
    setIsLoading(true);

    try {
      const res = await axios.post("/api/ai-loop", { theme });
      setResponse(res.data.logs);
      setTheme("");
    } catch (err: any) {
      setError(err.response?.data?.error || "エラーが発生しました。");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text: string, index: number) => {
    await navigator.clipboard.writeText(text);
    setCopied(index);
    setTimeout(() => setCopied(null), 2000);
  };

  if (!mounted) {
    return null; // または、ローディング表示などの静的なコンテンツを返す
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background transition-colors duration-300">
        <div className="container mx-auto p-4 max-w-4xl">
          <Card className="shadow-lg relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 pointer-events-none" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div className="space-y-1">
                <CardTitle className="text-2xl font-bold flex items-center gap-2">
                  <MessageSquare className="h-6 w-6 text-primary" />
                  Gemini AI 会話ログ
                </CardTitle>
                <CardDescription>AIとの対話をシンプルに記録</CardDescription>
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      setColorTheme(colorTheme === "dark" ? "light" : "dark")
                    }
                    className="transition-transform hover:scale-105 active:scale-95"
                  >
                    {colorTheme === "dark" ? (
                      <Sun className="h-5 w-5" />
                    ) : (
                      <Moon className="h-5 w-5" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {colorTheme === "dark" ? "ライトモード" : "ダークモード"}
                  に切り替え
                </TooltipContent>
              </Tooltip>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="flex gap-2">
                <Textarea
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  placeholder="テーマを入力してください"
                  className="flex-1"
                  disabled={isLoading}
                  rows={20}
                  cols={33}
                />
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="submit"
                      disabled={isLoading || !theme.trim()}
                      className="transition-transform hover:scale-105 active:scale-95"
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                      <span className="ml-2 hidden sm:inline">送信</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>会話を開始</TooltipContent>
                </Tooltip>
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
                        "transition-all duration-300 hover:shadow-lg",
                        "border-l-4 border-l-primary/40",
                        index === response.length - 1 &&
                          "animate-in fade-in-0 slide-in-from-bottom-4"
                      )}
                    >
                      <CardContent className="p-4 relative group">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => copyToClipboard(text, index)}
                            >
                              {copied === index ? (
                                <Check className="h-4 w-4 text-green-500" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            {copied === index
                              ? "コピーしました！"
                              : "クリップボードにコピー"}
                          </TooltipContent>
                        </Tooltip>
                        <ReactMarkdown
                          className="prose prose-sm max-w-none dark:prose-invert"
                          rehypePlugins={[rehypeRaw]}
                          remarkPlugins={[remarkGfm]}
                          components={{
                            code({
                              node,
                              inline,
                              className,
                              children,
                              ...props
                            }) {
                              const match = /language-(\w+)/.exec(
                                className || ""
                              );
                              return !inline && match ? (
                                <SyntaxHighlighter
                                  {...props}
                                  style={
                                    colorTheme === "dark" ? oneDark : oneLight
                                  }
                                  language={match[1]}
                                  PreTag="div"
                                >
                                  {String(children).replace(/\n$/, "")}
                                </SyntaxHighlighter>
                              ) : (
                                <code {...props} className={className}>
                                  {children}
                                </code>
                              );
                            },
                          }}
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
      </div>
    </TooltipProvider>
  );
}
