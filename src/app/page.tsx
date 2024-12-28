"use client";

import { useState } from "react";
import axios from "axios";
import ThemeInput from "@/components/ThemaInput";

export default function Home() {
  const [logs, setLogs] = useState<string[]>([]);

  const handleThemeSubmit = async (theme: string) => {
    const response = await axios.post("/api/ai-loop", { theme });
    setLogs((prevLogs) => [...prevLogs, ...response.data.logs]);
  };

  return (
    <>
      <div className="p-8 space-y-4">
        <h1 className="text-2xl font-bold">AI タスクシステム</h1>
        <ThemeInput onSubmit={handleThemeSubmit} />
        <div className="space-y-2">
          {logs.map((log, index) => (
            <div key={index} className="p-2 border rounded bg-gray-100">
              {log}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
