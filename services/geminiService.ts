import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // In a real app, you might show a graceful error to the user.
  // Here we'll throw an error to make it clear during development.
  console.error("API_KEY is not set. Please set the environment variable.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });
const model = "gemini-2.5-flash";

export const generateInvoiceSummary = async (descriptions: string[]): Promise<string> => {
  if (!API_KEY) return "AI機能は現在利用できません。";

  const prompt = `あなたは日本の建設専門家のアシスタントです。以下の作業項目を請求書用に、プロフェッショナルな一行の要約にまとめてください。要約は簡潔に、日本語でお願いします。

作業項目:
${descriptions.map(d => `- ${d}`).join('\n')}

要約:`;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        temperature: 0.5,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Error generating invoice summary:", error);
    return "AIによる要約の生成に失敗しました。";
  }
};

export const generateInvoiceEmail = async (clientName: string, invoiceTotal: string, dueDate: string): Promise<string> => {
   if (!API_KEY) return "AI機能は現在利用できません。";

  const prompt = `あなたは日本の建設専門家のアシスタントです。以下の情報に基づいて、請求書を送付するための丁寧でプロフェッショナルなメール本文を日本語で作成してください。

- 宛名: ${clientName} ご担当者様
- 金額: ${invoiceTotal}円
- 支払期日: ${dueDate}

メールには以下の要素を含めてください:
1. 丁寧な時候の挨拶
2. 日頃の感謝
3. 請求書を添付した旨の連絡
4. 請求金額と支払期日の明記
5. 結びの言葉

メール本文:`;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        temperature: 0.7,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Error generating invoice email:", error);
    return "AIによるメール文面の作成に失敗しました。";
  }
};
