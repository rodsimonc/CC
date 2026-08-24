const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export type Lawyer = {
  slug: string;
  full_name: string;
  bar_number?: string;
  bar_status?: string;
  practice_areas: string[];
  headline?: string;
  bio?: string;
  photo_url?: string | null;
  city?: string;
  email?: string | null;
  phone?: string | null;
};

export type Recommendation = {
  slug: string;
  full_name: string;
  headline: string;
  reason: string;
};

export type ChatResponse = {
  answer: string;
  recommendations: Recommendation[];
  booking_cta: { lawyer_slug: string; href: string; label?: string } | null;
  area: string | null;
  urgency: string;
};

async function safeJson<T>(res: Response): Promise<T> {
  const ct = res.headers.get("content-type") ?? "";
  if (!res.ok) {
    const detail = ct.includes("json") ? await res.json() : await res.text();
    throw new Error(typeof detail === "string" ? detail : detail.detail ?? "Error de red");
  }
  return res.json() as Promise<T>;
}

export const apiClient = {
  async listLawyers(area?: string): Promise<{ items: Lawyer[] }> {
    const url = new URL("/api/v1/lawyers", BASE);
    if (area) url.searchParams.set("area", area);
    const res = await fetch(url, { next: { revalidate: 300 } });
    return safeJson(res);
  },

  async getLawyer(slug: string): Promise<Lawyer> {
    const res = await fetch(`${BASE}/api/v1/lawyers/${slug}`, { next: { revalidate: 300 } });
    return safeJson(res);
  },

  async chat(session_id: string, question: string): Promise<ChatResponse> {
    const res = await fetch(`${BASE}/api/v1/chat`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ session_id, question }),
    });
    return safeJson(res);
  },
};
