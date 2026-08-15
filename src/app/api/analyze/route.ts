import { NextRequest, NextResponse } from 'next/server';
import { fetchQuoteData } from '@/lib/yahoo-finance';
import { analyzeWithAgents, generateFinalDecision } from '@/lib/openrouter';
import { AnalysisResult, PersonaType } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { ticker, persona = 'balanced' } = body;

    // LOGIC PIVOT: Prioritaskan API Key dari Client (BYOK). 
    // Jika user tidak input, baru fallback ke environment variable server.
    // Tambahkan .trim() untuk mencegah error karena spasi yang tidak disengaja
    const clientApiKey = body.apiKey?.trim();
    const serverApiKey = process.env.OPENROUTER_API_KEY?.trim();
    
    const apiKey = clientApiKey || serverApiKey;

    if (!ticker) {
      return NextResponse.json({ error: 'Ticker is required' }, { status: 400 });
    }

    if (!apiKey) {
      return NextResponse.json({
        error: 'OpenRouter API key required. Please enter your key in Settings or add OPENROUTER_API_KEY to server .env file.'
      }, { status: 401 }); // Ubah status ke 401 Unauthorized
    }

    // Fetch stock data from Yahoo Finance
    const quote = await fetchQuoteData(ticker);

    if (!quote) {
      return NextResponse.json({ error: 'Stock not found' }, { status: 404 });
    }

    // Get insights from AI agents
    const agents = await analyzeWithAgents(quote, persona as PersonaType, apiKey);

    // Generate final decision
    const finalDecision = await generateFinalDecision(quote, agents, persona as PersonaType, apiKey);

    const result: AnalysisResult = {
      symbol: ticker.toUpperCase(),
      quote,
      agents,
      finalDecision,
      timestamp: new Date(),
    };

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Analysis API error:', error);
    
    // Menangkap pesan error spesifik dari OpenRouter agar terlihat di frontend
    if (error.message?.includes('OpenRouter API error: 401')) {
      return NextResponse.json({ 
        error: 'Invalid API Key. Please check your OpenRouter key or server .env configuration.' 
      }, { status: 401 });
    }

    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 });
  }
}