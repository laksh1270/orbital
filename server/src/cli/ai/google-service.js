import chalk from "chalk";

const MODEL = "models/gemini-flash-lite-latest";

const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/${MODEL}:generateContent`;

export class AIService {
  constructor() {
    this.apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

    if (!this.apiKey) {
      throw new Error("GOOGLE_GENERATIVE_AI_API_KEY is not set");
    }
  }

  async sendMessage(messages) {
    try {
      const userText = messages
        .filter((m) => m.role === "user")
        .map((m) => m.content)
        .join("\n");

      const res = await fetch(`${ENDPOINT}?key=${this.apiKey}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: userText }],
            },
          ],
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(JSON.stringify(data, null, 2));
      }

      return {
        content:
          data.candidates?.[0]?.content?.parts?.[0]?.text ??
          "No response generated",
      };
    } catch (err) {
      console.error(chalk.red("AI ERROR"));
      throw err;
    }
  }

  async getMessage(messages) {
    const res = await this.sendMessage(messages);
    return res.content;
  }
}
