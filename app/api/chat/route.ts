import { createRouteHandlerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';
// import type { Database } from '@/types/supabase'; // optional if you have generated Supabase types

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Use Edge runtime for fast streaming (switch to 'nodejs' if using Node-only libraries)
export const runtime = 'edge';

export async function POST(request: Request) {
  try {
    // 1️⃣ Parse incoming request body
    const { question, analysis_id } = await request.json();

    if (!question || !analysis_id) {
      return NextResponse.json({ error: 'Missing question or analysis_id.' }, { status: 400 });
    }

    // 2️⃣ Initialize Supabase client and verify session
    const supabase = createRouteHandlerClient({ cookies });
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Not authorized.' }, { status: 401 });
    }

    // 3️⃣ Generate embedding for the user’s question
    const embeddingResponse = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: question,
    });

    const query_embedding = embeddingResponse.data[0].embedding;

    // 4️⃣ Retrieve top-matching document chunks via the SQL function
    const { data: chunks, error } = await supabase.rpc('match_documents', {
      query_embedding,
      analysis_id,
      match_count: 5, // get top 5 most relevant chunks
    });

    if (error) {
      console.error('Error matching documents:', error);
      return NextResponse.json({ error: 'Error matching documents.' }, { status: 500 });
    }

    if (!chunks || chunks.length === 0) {
      return NextResponse.json({
        answer: "I could not find any relevant information in the document.",
      });
    }

    // 5️⃣ Build the contextual prompt
    const context = chunks.map((c: any) => c.content).join('\n\n---\n\n');
    const prompt = `
You are a helpful AI assistant. Use the following context from an uploaded document to answer the user’s question.
If the answer is not found in the context, reply: "I could not find that information in the document."

Context:
"""
${context}
"""

Question: "${question}"
`;

    // 6️⃣ Stream response from OpenAI
    const aiResponse = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      stream: true,
      messages: [
        { role: 'system', content: 'You are a helpful AI assistant.' },
        { role: 'user', content: prompt },
      ],
    });

    // 7️⃣ Stream back to client
    const stream = OpenAIStream(aiResponse);
    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error('Internal server error:', error);
    return NextResponse.json({ error: 'An internal server error occurred.' }, { status: 500 });
  }
}
