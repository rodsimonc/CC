import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  session_id: z.string().min(1).max(80),
  question: z.string().min(1).max(2000),
  history: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1).max(4000),
      }),
    )
    .max(30)
    .optional(),
});

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = schema.parse(await req.json());
  } catch (err) {
    return NextResponse.json(
      { error: "validation", detail: String(err) },
      { status: 400 },
    );
  }

  const target = `${API}/api/v1/chat`;
  try {
    const upstream = await fetch(target, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!upstream.ok) {
      const text = await upstream.text();
      return NextResponse.json(
        {
          error: "upstream",
          status: upstream.status,
          target,
          detail: text.slice(0, 500),
        },
        { status: 502 },
      );
    }
    const data = await upstream.json();
    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    // Falla de red: DNS, ECONNREFUSED, timeout. Muy útil para diagnosticar
    // cuando NEXT_PUBLIC_API_URL no está seteada en producción.
    return NextResponse.json(
      {
        error: "network",
        target,
        detail: err instanceof Error ? err.message : String(err),
      },
      { status: 502 },
    );
  }
}

// Endpoint GET para diagnosticar desde el navegador o curl sin body.
export async function GET() {
  return NextResponse.json({
    api_url: API,
    hint: "POST /api/chat con { session_id, question, history? } para conversar.",
  });
}
