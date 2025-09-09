import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

const Translation = z.object({
  english_text: z.string(),
  translation_tips: z.string(),
});

export async function embedText(text: string): Promise<number[]> {
  const embedding = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
    encoding_format: "float",
    dimensions: 768,
  });
  return embedding.data[0].embedding;
}

export async function generateTranslation(text: string) {
  const completion = await openai.chat.completions.parse({
    model: "gpt-4.1",
    messages: [
      {
        role: "system",
        content:
          "Please translate the following text from German to English, providing also translation tips.",
      },
      { role: "user", content: text },
    ],
    response_format: zodResponseFormat(Translation, "translation"),
  });

  const translation = completion.choices[0].message.parsed;
  return `<h3><German Explanation</h3>${text}</p>\n<br>\n<h3>English Translation</h3>\n<br>\n<p>${translation?.english_text}</p>\n<br>\n<h3>Translation Tips</h3><p>${translation?.translation_tips}</p>`;
}
