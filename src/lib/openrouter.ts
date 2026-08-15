import { AgentInsight, AnalysisResult, PersonaType, StockQuote } from '@/types';

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

interface OpenRouterMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

async function callOpenRouter(
  messages: OpenRouterMessage[],
  apiKey: string
): Promise<string> {
  const response = await fetch(OPENROUTER_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'HTTP-Referer': 'https://ai-hedge-fund.app',
      'X-Title': 'AI Hedge Fund',
    },
    body: JSON.stringify({
      model: 'google/gemma-2-9b-it',
      messages,
      temperature: 0.7,
      max_tokens: 1000,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenRouter API error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || '';
}

function getPersonaInstructions(persona: PersonaType): string {
  const personas = {
    conservative: 'You are a CONSERVATIVE investor. Prioritize capital preservation, stable dividends, and low-risk investments. Be skeptical of high-growth claims and require strong fundamentals.',
    aggressive: 'You are an AGGRESSIVE growth investor. Seek high returns, momentum plays, and growth stocks. Accept higher volatility for potentially higher rewards.',
    balanced: 'You are a BALANCED investor. Seek a mix of growth and value. Consider both fundamentals and market trends. Moderate risk tolerance.',
  };
  return personas[persona];
}

export async function analyzeWithAgents(
  quote: StockQuote,
  persona: PersonaType,
  apiKey: string
): Promise<AgentInsight[]> {
  const personaInstructions = getPersonaInstructions(persona);

  const fundamentals = `
Company: ${quote.companyName} (${quote.symbol})
Current Price: $${quote.currentPrice}
Market Cap: $${(quote.marketCap / 1e9).toFixed(2)}B
P/E Ratio: ${quote.peRatio.toFixed(2)}
EPS: $${quote.eps.toFixed(2)}
52-Week Range: $${quote.week52Low} - $${quote.week52High}
Trend: ${quote.quantitative.trend}
RSI(14): ${quote.quantitative.rsi14}
Volatility: ${quote.quantitative.volatility}
Risk Level: ${quote.quantitative.riskLevel}
`;

  const agents: Array<{ type: AgentInsight['agent']; name: string; systemPrompt: string }> = [
    {
      type: 'value',
      name: 'Warren Buffett AI',
      systemPrompt: `${personaInstructions}
You are a VALUE INVESTOR inspired by Warren Buffett. Focus on intrinsic value, moat, competitive advantage, and long-term fundamentals.`
    },
    {
      type: 'growth',
      name: 'Growth Hunter AI',
      systemPrompt: `${personaInstructions}
You are a GROWTH INVESTOR. Focus on revenue growth, expansion potential, market trends, and innovation.`
    },
    {
      type: 'quant',
      name: 'Quant Analyst AI',
      systemPrompt: `${personaInstructions}
You are a QUANTITATIVE ANALYST. Focus on technical indicators, price patterns, momentum, and statistical analysis.`
    },
    {
      type: 'sentiment',
      name: 'Sentiment Scanner AI',
      systemPrompt: `${personaInstructions}
You are a SENTIMENT ANALYST. Focus on market sentiment, news, social media trends, and investor psychology.`
    },
  ];

  const insights: AgentInsight[] = [];

  for (const agent of agents) {
    try {
      const messages: OpenRouterMessage[] = [
        { role: 'system', content: agent.systemPrompt },
        { role: 'user', content: `Analyze ${quote.symbol} and provide your investment recommendation.

FUNDAMENTALS:
${fundamentals}

Respond in JSON format:
{
  "decision": "BUY" or "SELL" or "HOLD",
  "confidence": 0-100,
  "reasoning": "Your detailed reasoning in 2-3 sentences"
}` },
      ];

      const response = await callOpenRouter(messages, apiKey);

      // Parse JSON from response
      let jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        insights.push({
          agent: agent.type,
          name: agent.name,
          decision: parsed.decision || 'HOLD',
          confidence: parsed.confidence || 50,
          reasoning: parsed.reasoning || 'Unable to generate reasoning',
        });
      } else {
        // Fallback if no JSON found
        insights.push({
          agent: agent.type,
          name: agent.name,
          decision: 'HOLD',
          confidence: 50,
          reasoning: response.slice(0, 200),
        });
      }
    } catch (error) {
      console.error(`Error with ${agent.name}:`, error);
      insights.push({
        agent: agent.type,
        name: agent.name,
        decision: 'HOLD',
        confidence: 50,
        reasoning: 'Unable to analyze at this time',
      });
    }
  }

  return insights;
}

export async function generateFinalDecision(
  quote: StockQuote,
  agents: AgentInsight[],
  persona: PersonaType,
  apiKey: string
): Promise<AnalysisResult['finalDecision']> {
  const personaInstructions = getPersonaInstructions(persona);

  try {
    const messages: OpenRouterMessage[] = [
      { role: 'system', content: `${personaInstructions}
You are the PORTFOLIO MANAGER. Synthesize all AI agent insights and provide a FINAL INVESTMENT DECISION.
Be decisive and clear. Provide a concise summary that combines all perspectives.` },
      { role: 'user', content: `Based on the following AI agent analyses, provide a FINAL INVESTMENT DECISION for ${quote.symbol}.

STOCK INFO:
- Price: $${quote.currentPrice}
- Trend: ${quote.quantitative.trend}
- RSI: ${quote.quantitative.rsi14}
- Risk: ${quote.quantitative.riskLevel}

AGENT INSIGHTS:
${agents.map(a => `${a.name}: ${a.decision} (${a.confidence}% confidence) - ${a.reasoning}`).join('\n')}

Respond in JSON format:
{
  "decision": "BUY" or "SELL" or "HOLD",
  "confidence": 0-100,
  "riskLevel": "Low" or "Medium" or "High",
  "summary": "A concise 2-3 sentence summary of why"
}` },
    ];

    const response = await callOpenRouter(messages, apiKey);

    let jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (error) {
    console.error('Error generating final decision:', error);
  }

  // Fallback calculation
  const buyCount = agents.filter(a => a.decision === 'BUY').length;
  const avgConfidence = agents.reduce((a, b) => a + b.confidence, 0) / agents.length;

  return {
    decision: buyCount > agents.length / 2 ? 'BUY' : buyCount < agents.length / 2 ? 'SELL' : 'HOLD',
    confidence: Math.round(avgConfidence),
    riskLevel: quote.quantitative.riskLevel,
    summary: 'Based on aggregated AI agent consensus.',
  };
}
