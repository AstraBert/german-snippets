import {QdrantClient} from '@qdrant/js-client-rest';
import { embedText } from './openai-utils';

const client = new QdrantClient({url: 'http://127.0.0.1:6333'});

export async function searchGermanSnippets(inputText: string, limit: number): Promise<string[]> {
    const embedding = await embedText(inputText)
    const result = await client.search(
        "germanSnippets", {
            vector: embedding,
            limit: limit,
        }
    )
    const resStr: string[] = []
    for (const r of result) {
        if (r.payload != null) {
            if ("title" in r.payload && "explanation" in r.payload) {
                resStr.push(`<strong>${r.payload.title}</strong>\n<br>\n<p>${r.payload.explanation}</p>`)
            }
        }
    }
    return resStr
}