"use client";

import { useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  oneDark,
  oneLight,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import { useTheme } from "next-themes";

interface ChatResponseProps {
  response: string[];
}

export function ChatResponse({ response }: ChatResponseProps) {
  const [copied, setCopied] = useState<number | null>(null);
  const { theme: colorTheme } = useTheme();

  const copyToClipboard = useCallback(async (text: string, index: number) => {
    await navigator.clipboard.writeText(text);
    setCopied(index);
    setTimeout(() => setCopied(null), 2000);
  }, []);

  return (
    <TooltipProvider>
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
                  code({ inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || "");
                    return !inline && match ? (
                      <SyntaxHighlighter
                        {...props}
                        style={colorTheme === "dark" ? oneDark : oneLight}
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
    </TooltipProvider>
  );
}
