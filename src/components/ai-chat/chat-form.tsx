"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Loader2, Send } from "lucide-react";
import { Textarea } from "../ui/textarea";

interface ChatFormProps {
  onSubmit: (prompt: string) => Promise<void>;
  isLoading: boolean;
}

export function ChatForm({ onSubmit, isLoading }: ChatFormProps) {
  const [prompt, setPrompt] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      onSubmit(prompt);
      setPrompt("");
    }
  };

  return (
    <TooltipProvider>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
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
              disabled={isLoading || !prompt.trim()}
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
    </TooltipProvider>
  );
}
