import { groq } from "@ai-sdk/groq";
import { generateText } from "ai";
import { NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const prompt = `
Create a list of three creative, open-ended, and engaging questions as a single string.
Separate each question with '||'. These questions are meant for an anonymous social messaging platform, like Qooh.me, and should appeal to a diverse audience.
Focus on universal, fun, or thought-provoking themes that spark curiosity and friendly conversation. Avoid personal, sensitive, or controversial topics.
Format the output exactly like this example:
'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'
Make the questions intriguing, welcoming, and easy for anyone to respond to.
`;

    const result = await generateText({
      model: groq("moonshotai/kimi-k2-instruct"), // <-- updated model
      prompt,
    });

    return NextResponse.json({ suggestions: result.text });
  } catch (error: any) {
    console.error("Error generating questions with Groq:", error);
    return NextResponse.json(
      { error: error?.message || "Unknown error" },
      { status: 500 }
    );
  }
}
