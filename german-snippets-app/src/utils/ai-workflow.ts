import { createWorkflow, workflowEvent } from "@llamaindex/workflow-core";
import { searchGermanSnippets } from "./qdrant-search";
import { generateTranslation } from "./openai-utils";

const userInputEvent = workflowEvent<{
  text: string;
  limit: number;
}>();
const retrievalEvent = workflowEvent<{
  retrieved: string[];
}>();
const finalResponseEvent = workflowEvent<{results: string[]}>();

const workflow = createWorkflow();

workflow.handle([userInputEvent], async (context, { data }) => {
    const { sendEvent } = context;
    const { text, limit } = data;
    const retrievedData = await searchGermanSnippets(text, limit)
    sendEvent(retrievalEvent.with({retrieved: retrievedData}))
})
workflow.handle([retrievalEvent], async (context, { data }) => {
    const { sendEvent } = context;
    const { retrieved } = data
    const results: string[] = []
    for (const r of retrieved) {
        const translatedR = await generateTranslation(r)
        results.push(translatedR)
    }
    sendEvent(finalResponseEvent.with({results: results}))
})

export async function runWorkflow(text: string, limit: number): Promise<{
    results: string[];
}> {
    const { stream, sendEvent } = workflow.createContext();

        sendEvent(
        userInputEvent.with({
            text: text,
            limit: limit
        }),
        );

        const result = await stream.until(finalResponseEvent).toArray();
        return result[result.length - 1].data as {results: string[]};
}