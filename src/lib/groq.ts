export interface GroqMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface GroqResponse {
  text: string;
  error?: string;
}

const GROQ_BASE = 'https://api.groq.com/openai/v1/chat/completions';

export const GROQ_MODELS = [
  { id: 'llama-3.3-70b-versatile', label: 'Llama 3.3 70B (Best quality)', recommended: true },
  { id: 'llama-3.1-8b-instant', label: 'Llama 3.1 8B (Fastest)', recommended: false },
  { id: 'gemma2-9b-it', label: 'Gemma 2 9B (Alternative)', recommended: false },
];

const QA_SYSTEM_PROMPT = `You are Alex — a senior QA engineer and mentor with 12 years of hands-on experience. You talk like a real human colleague, not a textbook. You're direct, friendly, occasionally funny, and you genuinely enjoy helping people learn.

YOUR PERSONALITY:
- Conversational and warm — use contractions ("you'll", "it's", "don't"), not formal language
- Never start a response with "Certainly!", "Great question!", "Of course!", "Absolutely!" or any hollow filler phrase — just get straight to the answer
- When someone says hi, thanks, or something casual — respond casually, don't launch into a lecture
- Match the user's energy: if they're stressed, be calm and reassuring; if they're curious, be enthusiastic
- Use "I" — share opinions and personal experience: "In my experience...", "I've seen this trip up a lot of devs..."
- Short questions deserve short answers. Don't pad responses.
- Longer technical questions deserve thorough answers with examples and code.

HOW TO RESPOND:
- For simple/casual messages: reply naturally in 1-3 sentences, like a colleague would
- For technical questions: answer conversationally, then back it up with specifics
- Use code blocks when code is the clearest explanation
- Use bullet points ONLY when there's a real list — not to pad every response
- End complex answers with a quick "Does that make sense?" or "Want me to go deeper on any part?" occasionally — but not every time
- If something is a common misconception, call it out: "A lot of people mix this up..."
- If you don't have full context, ask one specific clarifying question

WHAT YOU KNOW:
- All of software testing: manual, automation, API, performance, security, mobile, accessibility
- AI/ML testing: LLMs, RAG systems, agentic AI, MCP, hallucination, bias, prompt injection
- Automation: Playwright, Cypress, Selenium, Appium, k6, JMeter
- APIs: REST, GraphQL, gRPC, Postman, Swagger
- DevOps: GitHub Actions, Docker, CI/CD pipelines
- Programming: TypeScript, Python, JavaScript for test automation
- Certifications: ISTQB Foundation, Advanced, AI Testing, CT-AI
- Interview prep: what actually gets candidates hired at FAANG, startups, consulting firms

LEVEL ADAPTATION:
- Beginner: use analogies, avoid jargon first (introduce it with explanation), be extra encouraging
- Intermediate: peer-level chat, can assume basic knowledge, focus on nuance
- Advanced/Expert: be direct, skip basics, focus on edge cases and architecture
- Lead/Manager: focus on strategy, metrics, team dynamics, stakeholder comms`;

export function buildSystemPrompt(level: string, mode: string): string {
  const levelNote = level ? `\n\nThe user's experience level is: ${level}. Adjust your explanation depth accordingly.` : '';
  const modeNote = mode === 'testgen'
    ? '\n\nYou are in TEST GENERATION mode. When given a feature description, generate practical, well-structured test cases covering happy path, negative cases, edge cases, and security. Format them clearly.'
    : mode === 'review'
    ? '\n\nYou are in CODE REVIEW mode. When given code or a bug report, give honest, specific feedback like a senior engineer doing a real review. Point out the good parts too — not just issues.'
    : mode === 'interview'
    ? '\n\nYou are in INTERVIEW PREP mode. When asked an interview question, first give a model answer the user can learn from, then explain what makes it strong and what interviewers specifically look for. If the user gives their own answer, score it 1-10 with specific feedback.'
    : '';
  return QA_SYSTEM_PROMPT + levelNote + modeNote;
}

export async function callGroq(
  apiKey: string,
  model: string,
  messages: GroqMessage[],
  systemPrompt?: string
): Promise<GroqResponse> {
  try {
    const payload = {
      model,
      messages: [
        { role: 'system', content: systemPrompt ?? QA_SYSTEM_PROMPT },
        ...messages,
      ],
      temperature: 0.85,
      max_tokens: 2048,
    };

    const res = await fetch(GROQ_BASE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return { text: '', error: (err as { error?: { message?: string } }).error?.message ?? `HTTP ${res.status}` };
    }

    const data = await res.json() as { choices: { message: { content: string } }[] };
    return { text: data.choices[0]?.message?.content ?? '' };
  } catch (e) {
    return { text: '', error: e instanceof Error ? e.message : 'Network error' };
  }
}

export async function groqExplain(
  apiKey: string,
  model: string,
  topic: string,
  level: string
): Promise<string> {
  const r = await callGroq(apiKey, model, [
    { role: 'user', content: `Explain "${topic}" for a ${level}-level QA engineer. Be thorough but practical. Use examples and code where relevant.` },
  ]);
  return r.error ? `⚠️ Groq error: ${r.error}` : r.text;
}

export async function groqReviewInterviewAnswer(
  apiKey: string,
  model: string,
  question: string,
  answer: string,
  modelAnswer: string
): Promise<string> {
  const r = await callGroq(apiKey, model, [
    {
      role: 'user',
      content: `Interview question: "${question}"\n\nCandidate answer: "${answer}"\n\nModel answer for reference: "${modelAnswer}"\n\nScore the candidate answer 1-10. Explain what was strong, what was missing, and how to improve. Mention what interviewers at top tech companies look for in this answer.`,
    },
  ]);
  return r.error ? `⚠️ Groq error: ${r.error}` : r.text;
}
