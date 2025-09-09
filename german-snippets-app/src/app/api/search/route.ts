import { NextResponse } from "next/server";
import { runWorkflow } from "@/utils/ai-workflow";

export async function POST(req: Request) {
  const { query, topK } = await req.json();
  const result = await runWorkflow(query, topK);
  const { results } = result;
  const retData = results.join("\n<br>\n<hr>\n<br>\n");
  return NextResponse.json({ result: retData });
}
