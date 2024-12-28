import { NextResponse } from "next/server";
import axios from "axios";

const GEMINI_AI_API =
  process.env.GEMINI_AI_ENDPOINT || "https://actual-ai-api.com/v1/generate";

async function callAI(apiKey: string, input: string): Promise<string> {
  try {
    const response = await axios.post(
      GEMINI_AI_API,
      { input },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data.output;
  } catch (error) {
    console.error("AI API呼び出しエラー:", error);
    throw new Error("AIサービスとの通信に失敗しました");
  }
}

export async function POST(req: Request) {
  const { theme } = await req.json();
  const apiKey = process.env.GEMINI_AI_KEY;

  const logs: string[] = [];
  let currentInput = theme;
  let thresholdMet = false;

  while (!thresholdMet) {
    // Step 1: AI-001に送信
    const ai1Output = await callAI(apiKey as string, currentInput);
    logs.push(`AI-001: ${ai1Output}`);

    // Step 2: AI-002に送信して評価
    const ai2Output = await callAI(apiKey as string, ai1Output);
    logs.push(`AI-002: ${ai2Output}`);

    // 評価基準（仮実装）
    thresholdMet = ai2Output.includes("閾値を超えました");

    // 次ループの入力更新
    currentInput = ai2Output;
  }

  return NextResponse.json({ logs });
}
