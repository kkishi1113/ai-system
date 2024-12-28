import { NextResponse } from "next/server";
import axios from "axios";

const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

async function callAI(apiKey: string, input: string): Promise<string> {
  try {
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${apiKey}`,
      {
        contents: [
          {
            parts: [{ text: input }],
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // デバッグ用のログ出力
    console.log("Full API Response:", JSON.stringify(response.data, null, 2));

    // レスポンス構造を安全に確認
    if (
      response.data &&
      response.data.candidates &&
      response.data.candidates[0] &&
      response.data.candidates[0].content &&
      response.data.candidates[0].content.parts &&
      response.data.candidates[0].content.parts[0] &&
      response.data.candidates[0].content.parts[0].text
    ) {
      return response.data.candidates[0].content.parts[0].text;
    }

    // レスポンス構造が期待と異なる場合
    throw new Error("予期せぬAPIレスポンス形式");
  } catch (error) {
    console.error("Gemini AI API呼び出しエラー:", error);
    throw new Error("AIサービスとの通信に失敗しました");
  }
}

export async function POST(req: Request) {
  const { theme } = await req.json();
  const apiKey = process.env.GEMINI_AI_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "APIキーが設定されていません" },
      { status: 500 }
    );
  }

  const logs: string[] = [];
  let currentInput = theme;
  let thresholdMet = false;
  let iterationCount = 0;
  const MAX_ITERATIONS = 5;

  while (!thresholdMet && iterationCount < MAX_ITERATIONS) {
    try {
      // Step 1: AI-001に送信
      const ai1Output = await callAI(apiKey, currentInput);
      logs.push(`AI-001: ${ai1Output}`);

      // Step 2: AI-002に送信して評価
      const ai2Output = await callAI(apiKey, ai1Output);
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
