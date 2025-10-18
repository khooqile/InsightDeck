import { createRouteHandlerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// This is the fix for the pdf-parse error
const pdf = require('pdf-parse');

// Initialize the OpenAI Client
const openai = new OpenAI();

// This is the main function that handles POST requests to /api/analyze
export async function POST(request: Request) {
  // Create a Supabase client that's aware of the user's login cookie
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

  // We will add all the main logic inside this try...catch block
  try {
    // 1. Get the FormData from the request
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 });
    }

    // 2. Get the User's ID (Security Check)
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Not authorized.' }, { status: 401 });
    }
    const userId = session.user.id;

    // 3. Convert File to Raw Text
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const pdfData = await pdf(fileBuffer); // This line is now fixed
    const rawText = pdfData.text;

    if (!rawText) {
      return NextResponse.json(
        { error: 'Could not parse text from PDF.' },
        { status: 500 }
      );
    }

    // 4. Craft the "Dashboard Prompt"
    const prompt = `
    You are an expert financial analyst AI. Your task is to analyze the following earnings call transcript and return a structured JSON object.

    CRITICAL INSTRUCTIONS:
    1.  Respond ONLY with a single, valid JSON object.
    2.  Do not include markdown backticks (like \`\`\`json) or any explanatory text before or after the JSON object.
    3.  Analyze the sentiment for the three *exact* topics provided: "Revenue", "Future Guidance", and "Costs & Margins".

    JSON STRUCTURE AND RULES:
    {
      "summary": "A concise, 3-sentence executive summary of the entire call.",
      "overall_sentiment": "One of: 'Bullish', 'Bearish', 'Neutral'.",
      "score": "A numerical score from 0 (very bearish) to 100 (very bullish) reflecting the overall sentiment.",
      "topics": [
        {
          "topic": "Revenue",
          "sentiment": "One of: 'Positive', 'Negative', 'Neutral'.",
          "summary": "A 1-sentence summary explaining the sentiment for Revenue, citing specific numbers if available."
        },
        {
          "topic": "Future Guidance",
          "sentiment": "One of: 'Positive', 'Negative', 'Neutral'.",
          "summary": "A 1-sentence summary explaining the sentiment for Future Guidance."
        },
        {
          "topic": "Costs & Margins",
          "sentiment": "One of: 'Positive', 'Negative', 'Neutral'.",
          "summary": "A 1-sentence summary explaining the sentiment for Costs & Margins."
        }
      ],
      "quotes": {
        "bullish": [
          "An exact, impactful bullish quote from the text.",
          "Another exact bullish quote."
        ],
        "bearish": [
          "An exact, impactful bearish quote from the text.",
          "Another exact bearish quote."
        ]
      }
    }

    RULES FOR QUOTES:
    - Find at least 2 bullish and 2 bearish quotes if available.
    - The quotes must be *exact* strings from the text.
    - If you find 2, return 1. If you find none, return an empty array [].

    TRANSCRIPT TO ANALYZE:
    """
    ${rawText.substring(0, 16000)}
    """
    `; // Sliced text to ~4k tokens to prevent errors

    // 5. Call OpenAI and get the JSON
    const aiResponse = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // Fast, smart, and cheap
      response_format: { type: 'json_object' }, // Force JSON output
      messages: [
        {
          role: 'system',
          content: 'You are a financial analyst outputting JSON.',
        },
        { role: 'user', content: prompt },
      ],
    });

    const jsonResponse = JSON.parse(
      aiResponse.choices[0].message.content || '{}'
    );

    // 6. Save the AI's JSON to the database
    const { data: newAnalysis, error: dbError } = await supabase
      .from('analyses')
      .insert({
        user_id: userId,
        file_name: file.name,
        dashboard_data: jsonResponse, // Save the entire JSON object
      })
      .select('id') // Ask Supabase to return just the 'id' of the new row
      .single(); // We only expect one row back

    if (dbError) {
      console.error('Database Error:', dbError);
      return NextResponse.json(
        { error: 'Could not save analysis.' },
        { status: 500 }
      );
    }

    // 7. Send the ID back to the frontend
    return NextResponse.json({ id: newAnalysis.id });
  } catch (error) {
    console.error(error);
    // Handle any unexpected errors
    return NextResponse.json(
      { error: 'An internal server error occurred.' },
      { status: 500 }
    );
  }
}