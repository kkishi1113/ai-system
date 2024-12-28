import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  const { theme } = await req.json();
  const apiKey = process.env.GEMINI_AI_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "APIキーが設定されていません" },
      { status: 500 }
    );
  }

  // GoogleGenerativeAIインスタンスを作成
  const genAI = new GoogleGenerativeAI(apiKey);

  // モデルを初期化
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const logs: string[] = [];
  let currentInput = theme;
  let thresholdMet = false;
  let iterationCount = 0;
  const MAX_ITERATIONS = 5;

  while (!thresholdMet && iterationCount < MAX_ITERATIONS) {
    try {
      // Step 1: AI-001に送信
      const ai1Result = await model.generateContent(currentInput);
      const ai1Output = ai1Result.response.text();
      logs.push(`AI-001: ${ai1Output}`);

      // Step 2: AI-002に送信して評価
      const ai2Result = await model.generateContent(ai1Output);
      const ai2Output = ai2Result.response.text();
      logs.push(`AI-002: ${ai2Output}`);

      // 評価基準（仮実装）
      thresholdMet = ai2Output.includes("閾値を超えました");

      // 次ループの入力更新
      currentInput = ai2Output;
      iterationCount++;
    } catch (error) {
      logs.push(
        `エラー発生: ${error instanceof Error ? error.message : "不明なエラー"}`
      );
      break;
    }
  }

  return NextResponse.json({ logs });
}
