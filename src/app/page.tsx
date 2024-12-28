"use client";

import { useState } from "react";
import axios from "axios";
import { Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { aaa } from "../../res";

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
      setResponse(res.data.logs); // Markdownをそのまま設定
      console.log(
        res.data.logs.map((r) => r.replace(/`/g, "\\`").replace(/"/g, "`"))
      );
    } catch (err) {
      setError(err.response?.data?.error || "何らかのエラーが発生しました。");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 space-y-4">
      <h1 className="text-2xl font-bold">Gemini AI 会話ログ</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          placeholder="テーマを入力してください"
          className="border rounded p-2 w-full"
          disabled={isLoading}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded"
          disabled={isLoading}
        >
          送信
        </button>
      </form>

      {isLoading && (
        <div className="p-4 border rounded bg-yellow-100 flex items-center">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          <span>Processing...</span>
        </div>
      )}

      {response && (
        <div>
          <h2 className="text-lg font-semibold">AIからの応答:</h2>
          {response.map((text, index) => (
            <div key={index} className="p-4 border rounded bg-gray-100 mb-4">
              <ReactMarkdown
                className="prose"
                rehypePlugins={[rehypeRaw]}
                remarkPlugins={[remarkGfm]}
              >
                {text}
              </ReactMarkdown>
            </div>
          ))}
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
