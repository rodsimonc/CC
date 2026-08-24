import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  session_id: z.string().min(1).max(80),
  question: z.string().min(1).max(2000),
});

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export async function POST(req: Request) {
  const body = schema.parse(await req.json());
  const upstream = await fetch(`${API}/api/v1/chat`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await upstream.json();
  return NextResponse.json(data, { status: upstream.status });
}
