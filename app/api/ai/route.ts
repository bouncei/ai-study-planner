import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY || "");

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      messages,
      modelName = "gemini-2.0-flash",
      temperature = 0.7,
      max_tokens = 500,
    } = body;

    const geminiModel = genAI.getGenerativeModel({ model: modelName });

    // Convert OpenAI message format to Gemini format
    const prompt = messages
      .map((msg: any) => {
        if (msg.role === "system") {
          return `System: ${msg.content}\n`;
        }
        return `${msg.role === "user" ? "Human" : "Assistant"}: ${
          msg.content
        }\n`;
      })
      .join("\n");

    const result = await geminiModel.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature,
        maxOutputTokens: max_tokens,
      },
    });

    const response = await result.response;
    const text = response.text();

    return NextResponse.json({
      choices: [
        {
          message: {
            content: text,
          },
        },
      ],
    });
  } catch (error) {
    console.error("Error in AI request:", error);
    return NextResponse.json(
      { error: "Failed to process AI request" },
      { status: 500 }
    );
  }
}
