import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// システムプロンプトの定義
const SYSTEM_PROMPT_AI_001 = `
あなたは創造的で分析的な最初のAIアシスタントです。
以下のルールに従って応答してください：
1. 与えられたテーマについて深く、革新的な視点を提供すること
2. 回答は具体的で、実践的な洞察を含むこと
3. 日本語で明確かつ簡潔に応答すること
4. 可能な限り、具体的な例や実践的なアドバイスを提供すること
5. 回答は1000文字以内で完結すること
6. 回答はMarkdown形式で出力すること
7. 必ず完全なソースコードを出力すること
`;

const SYSTEM_PROMPT_AI_002 = `
あなたは批判的で建設的な第二のAIアシスタントです。
以下のルールに従って応答してください：
1. 最初のAIアシスタントの回答を徹底的に分析すること
2. 回答の長所と改善点を明確に指摘すること
3. より深い洞察や代替アプローチを提案すること
4. 日本語で論理的かつ建設的なフィードバックを提供すること
5. 最終的な回答が高品質であるかを厳密に評価すること
`;

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
  let currentInput = `${SYSTEM_PROMPT_AI_001}\n\nテーマ: ${theme}`;
  let thresholdMet = false;
  let iterationCount = 0;
  const MAX_ITERATIONS = 2;

  while (!thresholdMet && iterationCount < MAX_ITERATIONS) {
    try {
      // Step 1: AI-001に送信
      const ai1Result = await model.generateContent(currentInput);
      const ai1Output = ai1Result.response.text();
      const ai1Log = `AI-001: ${ai1Output}`;
      logs.push(ai1Log);

      // Step 2: AI-002に送信して評価
      const ai2Input = `${SYSTEM_PROMPT_AI_002}\n\n前回の回答: ${ai1Output}`;
      const ai2Result = await model.generateContent(ai2Input);
      const ai2Output = ai2Result.response.text();
      const ai2Log = `AI-002: ${ai2Output}`;
      logs.push(ai2Log);

      // 評価基準（仮実装）
      thresholdMet = ai2Output.includes("最終的な回答として承認");

      // 次ループの入力更新
      currentInput = `${SYSTEM_PROMPT_AI_001}\n\n前回の分析を踏まえて: ${ai2Output}`;
      iterationCount++;
    } catch (error) {
      const errorLog = `エラー発生: ${
        error instanceof Error ? error.message : "不明なエラー"
      }`;
      logs.push(errorLog);
      break;
    }
  }

  return NextResponse.json({ logs });
}
