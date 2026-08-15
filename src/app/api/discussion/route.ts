import { NextResponse } from "next/server";

// Memaksa Next.js agar tidak melakukan caching pada endpoint ini
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { prompt, agents, apiKey: clientApiKey } = body;

    if (!agents || agents.length === 0) {
      return NextResponse.json({ error: "Pilih minimal 1 agent" }, { status: 400 });
    }

    // Prioritaskan .env, jika tidak ada gunakan dari client/frontend
    const apiKey = process.env.OPENROUTER_API_KEY || clientApiKey;

    if (!apiKey) {
      return NextResponse.json({ 
        error: "API Key OpenRouter tidak ditemukan. Pastikan sudah di-set di .env atau pengaturan." 
      }, { status: 401 });
    }

    const responses = await Promise.all(
      agents.map(async (agent: string) => {
        try {
          const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${apiKey}`,
              "Content-Type": "application/json",
              "HTTP-Referer": "https://ai-hedge-fund.app",
              "X-Title": "AI Hedge Fund",
            },
            body: JSON.stringify({
              // MENGGUNAKAN MODEL GRATIS agar tidak error jika credit $0
              model: "google/gemma-2-9b-it", 
              temperature: 0.7,
              max_tokens: 1000,
              messages: [
                {
                  role: "system",
                  content: `You are the legendary investor/analyst ${agent}. You are currently sitting in a high-stakes Hedge Fund Investment Committee meeting with other legendary investors. 
  
  CRITICAL INSTRUCTIONS:
  1. QUANTITATIVE FOCUS: You MUST use specific numbers, percentages, ratios, multiples (PE, PB, Sharpe, etc.), or probabilities in your argument. If you don't have real-time data, provide a realistic estimated quantitative framework.
  2. STRICT PERSONA: Speak exactly like ${agent}.
  3. DISCUSSION VIBE: Acknowledge that you are in a room with others. You can start by aggressively pushing your view, warning the others, or pointing out what "the rest of the room" might be missing.
  4. FORMAT: Keep it to 1-2 punchy, highly technical paragraphs. Do not use generic AI introductions. Act like a hedge fund manager.`
                },
                {
                  role: "user",
                  content: `The committee is now discussing this: ${prompt}`
                }
              ]
            })
          });

          // Menangkap respons teks mentah untuk debugging
          const rawText = await res.text();
          let data;
          
          try {
            data = JSON.parse(rawText);
          } catch (e) {
            console.error(`Failed to parse JSON for ${agent}. Raw response:`, rawText);
            return {
              agentName: agent.replace(" Agent", ""),
              content: `[PARSE ERROR] OpenRouter tidak mengembalikan format JSON yang valid. Respons: ${rawText.substring(0, 50)}...`
            };
          }
          
          // Jika OpenRouter mengembalikan status error (misal 401, 402, 429)
          if (!res.ok || data.error) {
            const errorMessage = data.error?.message || data.error || res.statusText || "Unknown OpenRouter Error";
            console.error(`OpenRouter API Error for ${agent}:`, errorMessage);
            return {
              agentName: agent.replace(" Agent", ""),
              content: `[API ERROR ${res.status}]: ${errorMessage}`
            };
          }
          
          const content = data.choices?.[0]?.message?.content;
          
          if (!content) {
            return {
              agentName: agent.replace(" Agent", ""),
              content: `[EMPTY RESPONSE] OpenRouter merespons, namun message kosong. Raw JSON: ${JSON.stringify(data).substring(0, 100)}`
            };
          }

          return {
            agentName: agent.replace(" Agent", ""),
            content: content
          };

        } catch (fetchError: any) {
          console.error(`Fetch Error for ${agent}:`, fetchError);
          return {
            agentName: agent.replace(" Agent", ""),
            content: `[FETCH ERROR] Gagal menghubungi OpenRouter: ${fetchError.message}`
          };
        }
      })
    );

    return NextResponse.json({ responses });
  } catch (error: any) {
    console.error("Discussion API General Error:", error);
    return NextResponse.json({ error: `Internal Server Error: ${error.message}` }, { status: 500 });
  }
}