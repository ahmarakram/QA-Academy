import { AISettings } from './store';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export async function callAI(
  settings: AISettings,
  messages: ChatMessage[],
  systemPrompt?: string
): Promise<string> {
  if (!settings.apiKey) {
    throw new Error('No API key configured. Please add your API key in the Settings panel.');
  }

  if (settings.provider === 'anthropic') {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': settings.apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: settings.model || 'claude-sonnet-4-6',
        max_tokens: 1024,
        system: systemPrompt || 'You are an expert QA tutor helping software testers learn testing skills.',
        messages,
      }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error((err as { error?: { message?: string } })?.error?.message || `API error ${res.status}`);
    }
    const data = await res.json() as { content: Array<{ text: string }> };
    return data.content[0]?.text || '';
  }

  if (settings.provider === 'openai') {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${settings.apiKey}`,
      },
      body: JSON.stringify({
        model: settings.model || 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt || 'You are an expert QA tutor.' },
          ...messages,
        ],
        max_tokens: 1024,
      }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error((err as { error?: { message?: string } })?.error?.message || `API error ${res.status}`);
    }
    const data = await res.json() as { choices: Array<{ message: { content: string } }> };
    return data.choices[0]?.message?.content || '';
  }

  if (settings.provider === 'gemini') {
    const model = settings.model || 'gemini-2.0-flash';
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${settings.apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemPrompt || 'You are an expert QA tutor.' }] },
          contents: messages.map((m) => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.content }] })),
        }),
      }
    );
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(JSON.stringify((err as Record<string, unknown>)?.error) || `API error ${res.status}`);
    }
    const data = await res.json() as { candidates: Array<{ content: { parts: Array<{ text: string }> } }> };
    return data.candidates[0]?.content?.parts[0]?.text || '';
  }

  throw new Error('Unsupported provider');
}

export const QA_TUTOR_SYSTEM_PROMPT = `You are an expert QA tutor with 15+ years of experience in software testing, automation, AI quality engineering, and QA leadership.

Your role is to:
- Explain QA concepts clearly at the student's level
- Review test cases and provide structured feedback
- Review Playwright/Cypress automation code
- Generate test cases from requirements
- Analyze bug reports and root cause analysis
- Answer questions about manual testing, API testing, AI testing, LLM testing, RAG testing, agentic AI testing, MCP testing, performance, security, accessibility, and DevOps
- Provide industry-relevant advice

Response style:
- Be concise but thorough
- Use examples from real-world scenarios
- Use markdown formatting with headers, bullet points, and code blocks
- Adapt complexity to the student's experience level
- Always encourage and motivate the student`;
