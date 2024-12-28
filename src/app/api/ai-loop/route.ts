import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// システムプロンプトの定義
const SYSTEM_PROMPT_AI_001 = `
あなたは創造的で分析的な最初のAIアシスタントかつ優秀なITエンジニアです。
以下のルールに従って応答してください：
1. 与えられたテーマと会話の履歴を考慮すること
2. 回答は具体的で、実践的な洞察を含むこと
3. 日本語で明確かつ簡潔に応答すること
4. 前回の会話コンテキストを踏まえて回答すること
5. 回答は1000文字以内で完結すること
6. 回答はMarkdown形式で出力すること
7. 必ず完全なソースコードを出力すること
`;

const SYSTEM_PROMPT_AI_002 = `
あなたは批判的で建設的なのAIアシスタントかつ優秀なITエンジニアです。
以下のルールに従って応答してください：
1. 会話の全履歴を徹底的に分析すること
2. 回答の長所と改善点を明確に指摘すること
3. これまでの会話コンテキストを考慮し、より深い洞察を提供すること
4. 日本語で論理的かつ建設的なフィードバックを提供すること
5. 回答は1000文字以内で完結すること
6. 最終的な回答が高品質であるかを厳密に0点から100点の数値で評価すること
`;

// コンテキスト管理のためのインターフェース
interface ConversationContext {
  prompt: string;
  history: string[];
  iteration: number;
}

export async function POST(req: Request) {
  const { prompt, previousContext } = await req.json();
  const apiKey = process.env.GEMINI_AI_KEY;

  console.log("🍎", prompt, previousContext);
  if (!apiKey) {
    return NextResponse.json(
      { error: "APIキーが設定されていません" },
      { status: 500 }
    );
  }

  // GoogleGenerativeAIインスタンスを作成
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  // 前回のコンテキストを引き継ぐ
  const context: ConversationContext = {
    prompt: prompt,
    history: previousContext?.history || [],
    // iteration: (previousContext?.iteration || 0) + 1,
    iteration: 0,
  };

  const logs: string[] = [];
  let thresholdMet = false;
  const MAX_ITERATIONS = 3;

  while (!thresholdMet && context.iteration < MAX_ITERATIONS) {
    try {
      // AI-001の入力準備（前回の履歴を含める）
      const ai1Input = `
        ${SYSTEM_PROMPT_AI_001}

        会話の履歴: ${context.history.join("\n")}
        現在のテーマ: ${context.prompt}
        反復回数: ${context.iteration}

        回答してください：
      `;

      // Step 1: AI-001に送信
      const ai1Result = await model.generateContent(ai1Input);
      const ai1Output = ai1Result.response.text();
      const ai1Log = `AI-001: ${ai1Output}`;
      logs.push(ai1Log);

      // コンテキストを更新
      context.history.push(ai1Log);

      // AI-002の入力準備
      const ai2Input = `
        ${SYSTEM_PROMPT_AI_002}

        会話の完全な履歴: ${context.history.join("\n")}
        現在のテーマ: ${context.prompt}
        反復回数: ${context.iteration}

        以下の回答を評価してください：
        ${ai1Output}
      `;

      // Step 2: AI-002に送信して評価
      const ai2Result = await model.generateContent(ai2Input);
      const ai2Output = ai2Result.response.text();
      const ai2Log = `AI-002: ${ai2Output}`;
      logs.push(ai2Log);

      // コンテキストを更新
      context.history.push(ai2Log);
      context.iteration++;

      // 評価基準
      thresholdMet = ai2Output.includes("最終的な回答として承認");
    } catch (error) {
      const errorLog = `エラー発生: ${
        error instanceof Error ? error.message : "不明なエラー"
      }`;
      logs.push(errorLog);
      break;
    }
  }

  return NextResponse.json({
    logs,
    context: {
      prompt: context.prompt,
      iteration: context.iteration,
      history: context.history.slice(-10), // 最新の10件のみ保持
    },
  });
}
