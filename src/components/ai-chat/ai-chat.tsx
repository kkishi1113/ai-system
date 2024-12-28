"use client";

import { useState, useCallback } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { MessageSquare } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { ChatForm } from "./chat-form";
import { ChatResponse } from "./chat-response";
import { ErrorDisplay } from "./error-display";
import { LoadingIndicator } from "./loading-indicator";
import { ChatContext } from "./chat-context";
import axios from "axios";

export function AiChat() {
  const [response, setResponse] = useState<string[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [context, setContext] = useState<any>(null);

  const handleChatSubmit = useCallback(async (prompt: string) => {
    setResponse(null);
    setError(null);
    setIsLoading(true);

    try {
      console.log("🍎context", context);
      const res = await axios.post("/api/ai-loop", {
        prompt: prompt,
        previousContext: context,
      });
      setResponse(res.data.logs);
      setContext(res.data.context);
      console.log("🍎res", res.data.context);
    } catch (err: any) {
      setError(err.message || "エラーが発生しました。");
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-background transition-colors duration-300 flex">
      <div className="container mx-auto p-4 max-w-4xl flex-grow">
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
            <ThemeToggle />
          </CardHeader>
          <CardContent className="space-y-6">
            <ChatForm onSubmit={handleChatSubmit} isLoading={isLoading} />
            {isLoading && <LoadingIndicator />}
            {error && <ErrorDisplay error={error} />}
            {response && <ChatResponse response={response} />}
          </CardContent>
        </Card>
      </div>
      <ChatContext context={context} />
    </div>
  );
}
