export interface Question {
  id: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  moduleId: number;
}

export const quizBank: Question[] = [
  // Module 1 — Fundamentals
  {
    id: 'q1-1',
    moduleId: 1,
    level: 'beginner',
    question: 'What does SDLC stand for?',
    options: ['Software Development Life Cycle', 'System Design & Launch Cycle', 'Software Delivery & Launch Checklist', 'System Development Launch Checklist'],
    correct: 0,
    explanation: 'SDLC stands for Software Development Life Cycle — the structured process for planning, creating, testing, and delivering software.',
  },
  {
    id: 'q1-2',
    moduleId: 1,
    level: 'beginner',
    question: 'Which phase comes AFTER unit testing in a typical STLC?',
    options: ['Requirement Analysis', 'Integration Testing', 'Test Planning', 'Test Closure'],
    correct: 1,
    explanation: 'Integration Testing follows Unit Testing. Individual units are combined and tested as a group to expose integration defects.',
  },
  {
    id: 'q1-3',
    moduleId: 1,
    level: 'beginner',
    question: 'What is the difference between a Bug and a Defect?',
    options: ['They are identical terms', 'A bug is found in production; a defect is found during testing', 'A defect is a variance from expected behavior; a bug is an informal term for the same', 'Bugs are critical; defects are minor'],
    correct: 2,
    explanation: 'Both terms are often used interchangeably. "Defect" is the formal term for any variance from requirements; "bug" is an informal/colloquial term for the same concept.',
  },
  {
    id: 'q1-4',
    moduleId: 1,
    level: 'intermediate',
    question: 'What is Verification in software testing?',
    options: ['Testing the actual product with real users', 'Checking that the right product is being built (requirements review)', 'Confirming the product works in production', 'Ensuring the product meets end-user expectations'],
    correct: 1,
    explanation: 'Verification asks "Are we building the product right?" — it is a static process reviewing documents, design, and code without executing the program.',
  },
  {
    id: 'q1-5',
    moduleId: 1,
    level: 'expert',
    question: 'In a risk-based test strategy, what determines the order of test execution?',
    options: ['Alphabetical order of features', 'The probability and impact of failure for each component', 'The size of each feature', 'The availability of test environments'],
    correct: 1,
    explanation: 'Risk-based testing prioritizes test execution based on the likelihood of failure (probability) multiplied by the severity of that failure (impact), ensuring the highest-risk areas are tested first.',
  },
  // Module 4 — API Testing
  {
    id: 'q4-1',
    moduleId: 4,
    level: 'beginner',
    question: 'What HTTP status code indicates a successful GET request?',
    options: ['201', '400', '200', '404'],
    correct: 2,
    explanation: '200 OK is the standard response for a successful HTTP GET request. 201 is for successful creation (POST), 400 is a bad request, and 404 means the resource was not found.',
  },
  {
    id: 'q4-2',
    moduleId: 4,
    level: 'intermediate',
    question: 'When testing a REST API, what does a 401 response code mean?',
    options: ['Resource not found', 'Server error', 'Unauthorized — authentication required', 'Forbidden — you lack permission'],
    correct: 2,
    explanation: '401 Unauthorized means authentication is required and has failed or not been provided. Unlike 403 (Forbidden) which means you are authenticated but do not have permission.',
  },
  {
    id: 'q4-3',
    moduleId: 4,
    level: 'advanced',
    question: 'What is the key difference between OAuth 2.0 and API Key authentication?',
    options: ['OAuth is faster', 'OAuth provides delegated access with scopes; API keys are simple shared secrets', 'API keys are more secure', 'OAuth only works for mobile apps'],
    correct: 1,
    explanation: 'OAuth 2.0 provides delegated authorization with fine-grained scopes and token expiry. API keys are simple static credentials with no built-in scope granularity or expiry, making OAuth more secure for production systems.',
  },
  // Module 9 — AI Testing
  {
    id: 'q9-1',
    moduleId: 9,
    level: 'intermediate',
    question: 'What is "hallucination" in the context of LLM testing?',
    options: ['The model running too slowly', 'The model generating confident but factually incorrect output', 'The model refusing to answer a question', 'The model using too many tokens'],
    correct: 1,
    explanation: 'Hallucination refers to when an LLM generates plausible-sounding but factually incorrect or fabricated information. It is a key failure mode to test for in AI systems.',
  },
  {
    id: 'q9-2',
    moduleId: 9,
    level: 'advanced',
    question: 'What is "model drift" and why is it important in AI QA?',
    options: ['The model using too much memory', 'Degradation in model performance over time as real-world data changes', 'A model being deployed to the wrong server', 'An AI model consuming excessive API costs'],
    correct: 1,
    explanation: 'Model drift (data drift / concept drift) occurs when the statistical properties of input data change over time, causing model accuracy to degrade. QA teams must monitor and test for drift continuously.',
  },
  // Module 11 — LLM Testing
  {
    id: 'q11-1',
    moduleId: 11,
    level: 'expert',
    question: 'What is a prompt injection attack in the context of LLM security?',
    options: ['Sending very long prompts to crash the model', 'Embedding malicious instructions in user input to override system prompt instructions', 'Using automated tools to spam an AI endpoint', 'Extracting training data from a model'],
    correct: 1,
    explanation: 'Prompt injection involves embedding adversarial instructions in user-supplied input that cause the LLM to ignore or override its system prompt, potentially executing unauthorized actions or leaking sensitive data.',
  },
  {
    id: 'q11-2',
    moduleId: 11,
    level: 'expert',
    question: 'Which testing approach is MOST effective for finding jailbreak vulnerabilities in an LLM product?',
    options: ['Unit testing the prompt templates', 'Automated fuzzing combined with human red-teaming', 'Load testing the API endpoint', 'Reviewing the model training documentation'],
    correct: 1,
    explanation: 'Jailbreak testing requires both automated fuzzing (to cover volume) and human red-teaming (for creative, context-aware attacks). Either alone is insufficient — the combination finds the most vulnerabilities.',
  },
  // Module 12 — RAG Testing
  {
    id: 'q12-1',
    moduleId: 12,
    level: 'expert',
    question: 'What metric measures whether a RAG system retrieves all relevant documents for a query?',
    options: ['Precision', 'Latency', 'Recall', 'Perplexity'],
    correct: 2,
    explanation: 'Recall measures the proportion of relevant documents that were successfully retrieved. High recall means the retrieval system found most of the relevant context. You also need Precision to ensure retrieved documents are actually relevant.',
  },
  {
    id: 'q12-2',
    moduleId: 12,
    level: 'expert',
    question: 'What is "context window stuffing" and why is it a RAG defect?',
    options: ['Adding too many system prompt instructions', 'Retrieving so many chunks that the context window fills with irrelevant content, degrading answer quality', 'A performance issue from large vector databases', 'Sending duplicate API requests'],
    correct: 1,
    explanation: 'Context window stuffing occurs when the retrieval layer returns too many or poorly ranked chunks, filling the LLM context with noise. This dilutes the relevant information and causes degraded, inaccurate responses.',
  },
  // Module 6 — Playwright
  {
    id: 'q6-1',
    moduleId: 6,
    level: 'intermediate',
    question: 'What is the Page Object Model (POM) pattern in Playwright?',
    options: ['A way to take screenshots of pages', 'An abstraction pattern that encapsulates page-specific selectors and interactions in reusable classes', 'A method for parallel test execution', 'A Playwright reporting plugin'],
    correct: 1,
    explanation: 'POM separates test logic from page interaction details. Each page or component has its own class with locators and methods, making tests maintainable and reducing code duplication.',
  },
  {
    id: 'q6-2',
    moduleId: 6,
    level: 'advanced',
    question: 'In Playwright, what is the difference between `page.waitForSelector()` and using auto-waiting assertions?',
    options: ['There is no difference', 'Auto-waiting assertions like `expect(locator).toBeVisible()` are preferred — they have built-in retry and cleaner failure messages', 'waitForSelector is always faster', 'Auto-waiting only works in headed mode'],
    correct: 1,
    explanation: 'Playwright auto-waits on actionable conditions. Using `expect(locator).toBeVisible()` leverages this built-in retry logic, produces cleaner failure messages, and follows Playwright best practices. Manual `waitForSelector` is verbose and error-prone.',
  },
  // Module 17 — Performance
  {
    id: 'q17-1',
    moduleId: 17,
    level: 'advanced',
    question: 'What is the difference between Load Testing and Stress Testing?',
    options: ['They are the same thing', 'Load testing tests normal expected traffic; stress testing pushes beyond limits to find breaking point', 'Stress testing uses fewer virtual users', 'Load testing only tests APIs'],
    correct: 1,
    explanation: 'Load testing validates system behavior under expected production load. Stress testing increases load beyond normal limits to identify the system breaking point, failure modes, and recovery behavior.',
  },
  // Module 18 — Security
  {
    id: 'q18-1',
    moduleId: 18,
    level: 'advanced',
    question: 'Which OWASP Top 10 vulnerability involves executing malicious scripts in a victim\'s browser?',
    options: ['SQL Injection', 'Broken Access Control', 'Cross-Site Scripting (XSS)', 'Security Misconfiguration'],
    correct: 2,
    explanation: 'XSS (Cross-Site Scripting) allows attackers to inject malicious scripts into web pages viewed by other users, potentially stealing session tokens, credentials, or performing actions on behalf of the victim.',
  },
  // Module 13 — Agentic AI
  {
    id: 'q13-1',
    moduleId: 13,
    level: 'expert',
    question: 'What is a key challenge when testing multi-agent AI systems compared to single-agent systems?',
    options: ['Multi-agent systems are always faster', 'Non-deterministic agent communication and emergent behaviors make failure reproduction difficult', 'Multi-agent systems have no tool usage', 'Single-agent systems are harder to test'],
    correct: 1,
    explanation: 'Multi-agent systems exhibit emergent behaviors from agent interactions that are hard to predict, reproduce, and debug. The non-deterministic nature of agent communication creates complex failure modes not present in single-agent architectures.',
  },
];

export const getQuestionsForModule = (moduleId: number, level: string): Question[] => {
  return quizBank.filter((q) => q.moduleId === moduleId || level === q.level);
};

export const getAllQuestions = (level: string): Question[] => {
  return quizBank.filter((q) => q.level === level);
};
