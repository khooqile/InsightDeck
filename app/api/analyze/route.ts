import { NextResponse } from "next/server";

/* 
  ORIGINAL IMPORTS (kept here as comments so you can restore later)
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import OpenAI from "openai";
const pdf = require("pdf-parse");
*/

const MOCK_DASHBOARD_DATA = {
  summary:
    "The company reported strong quarterly results, driven by record-breaking revenue and optimistic future guidance. Management expressed confidence in sustained growth momentum. Cost efficiency initiatives further improved margins across core business units.",
  overall_sentiment: "bullish",
  score: 85,
  topics: [
    {
      topic: "Revenue",
      sentiment: "Positive",
      summary:
        "Revenue grew 15% year-over-year, reflecting strong customer demand and improved pricing strategy.",
    },
    {
      topic: "Future Guidance",
      sentiment: "Positive",
      summary:
        "Management raised full-year revenue guidance and expects continued market expansion.",
    },
    {
      topic: "Costs & Margins",
      sentiment: "Positive",
      summary:
        "Operating margins expanded due to disciplined cost controls and improved supply chain efficiency.",
    },
  ],
  quotes: {
    bullish: [
      "We achieved record revenue growth this quarter, exceeding all internal targets.",
      "Our forward guidance reflects confidence in maintaining double-digit growth through next year.",
    ],
    bearish: [
      "Some segments remain exposed to macroeconomic volatility.",
      "Inflationary pressures could pose short-term challenges in cost management.",
    ],
  },
};

export async function POST(request: Request) {
  try {
    // 1) Minimal check: ensure a file is present, otherwise return an error the frontend understands.
    //    This mirrors your original intent to stop after getting the file data.
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    if (!file) {
      return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
    }

    // START BYPASS: immediately return mock data so frontend never hits Supabase/OpenAI/pdf-parse.
    return NextResponse.json(MOCK_DASHBOARD_DATA, { status: 200 });
    // END BYPASS

    /* ---------------- ORIGINAL ANALYSIS LOGIC (COMMENTED OUT) ----------------
    // const cookieStore = cookies();
    // const supabase = createServerClient(
    //   process.env.NEXT_PUBLIC_SUPABASE_URL!,
    //   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    //   { cookies: () => cookieStore }
    // );
    //
    // const {
    //   data: { session },
    // } = await supabase.auth.getSession();
    // if (!session) {
    //   return NextResponse.json({ error: "Not authorized." }, { status: 401 });
    // }
    // const userId = session.user.id;
    //
    // const fileBuffer = Buffer.from(await file.arrayBuffer());
    // const pdfData = await pdf(fileBuffer);
    // const rawText = pdfData.text;
    //
    // // Craft prompt and call OpenAI
    // const prompt = `... ${rawText.substring(0, 16000)} ...`;
    // const openai = new OpenAI();
    // const aiResponse = await openai.chat.completions.create({...});
    // const jsonResponse = JSON.parse(aiResponse.choices[0].message.content || "{}");
    //
    // const { data: newAnalysis, error: dbError } = await supabase
    //   .from("analyses")
    //   .insert({
    //     user_id: userId,
    //     file_name: file.name,
    //     dashboard_data: jsonResponse,
    //   })
    //   .select("id")
    //   .single();
    //
    // return NextResponse.json({ id: newAnalysis.id });
    ----------------------------------------------------------------------- */
  } catch (err) {
    // Keep the error message minimal user-facing, but log the full error in server console.
    console.error("[/api/analyze] unexpected error:", err);
    return NextResponse.json(
      { error: "An internal server error occurred." },
      { status: 500 }
    );
  }
}
