// app/page.tsx
"use client";

import { useState } from "react";
import axios from "axios";
import { Loader2 } from "lucide-react";

export default function Home() {
  const [theme, setTheme] = useState("");
  const [response, setResponse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isThinking, setIsThinking] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResponse(null);
    setError(null);
    setIsLoading(true);
    setIsThinking(false);

    try {
      const res = await axios.post("/api/ai-loop", { theme });
      setIsLoading(false);
      setIsThinking(true);
      // Simulate AI thinking process delay
      setTimeout(() => {
        setResponse(JSON.stringify(res.data, null, 2));
        setIsThinking(false);
      }, 2000);
    } catch (err) {
      setIsLoading(false);
      setError(err.response?.data?.error || "何らかのエラーが発生しました。");
    }
  };

  return (
    <div className="p-8 space-y-4">
      <h1 className="text-2xl font-bold">Gemini AI 結果表示システム</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          placeholder="テーマを入力してください"
          className="border rounded p-2 w-full"
          disabled={isLoading || isThinking}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded"
          disabled={isLoading || isThinking}
        >
          送信
        </button>
      </form>

      {isLoading && (
        <div className="p-4 border rounded bg-yellow-100 flex items-center">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          <span>Loading...</span>
        </div>
      )}

      {isThinking && (
        <div className="p-4 border rounded bg-yellow-100 flex items-center">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          <span>Thinking...</span>
        </div>
      )}

      {response && (
        <div className="p-4 border rounded bg-green-100">
          <h2 className="text-lg font-semibold">AIからの応答:</h2>
          <pre className="whitespace-pre-wrap">{response}</pre>
        </div>
      )}

      {error && (
        <div className="p-4 border rounded bg-red-100">
          <h2 className="text-lg font-semibold">エラー:</h2>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}
